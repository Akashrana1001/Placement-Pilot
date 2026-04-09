import { Worker } from 'bullmq';
import mongoose from 'mongoose';
import { createRedisClient } from '../config/redis.js';
import { connectDB } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { ReActOrchestrator } from '../agent/orchestrator.js';
import { ToolRegistry } from '../agent/tools/registry.js';

// Models
import { Resume } from '../models/Resume.js';
import { PrepPlan } from '../models/PrepPlan.js';
import { MockInterview } from '../models/MockInterview.js';

// Tools
import { registerResumeTools } from '../agent/tools/resume.tools.js';
import { registerCompanyTools } from '../agent/tools/company.tools.js';
import { registerPlanTools } from '../agent/tools/plan.tools.js';
import { registerInterviewTools } from '../agent/tools/interview.tools.js';
import { registerMemoryTools } from '../agent/tools/memory.tools.js';
import { registerDBTools } from '../agent/tools/db.tools.js';

// Prompts
import { getReconSystemPrompt } from '../agent/prompts/recon.prompt.js';
import { getStrategySystemPrompt } from '../agent/prompts/strategy.prompt.js';
import { getSentinelSystemPrompt } from '../agent/prompts/sentinel.prompt.js';
import { getArenaSystemPrompt } from '../agent/prompts/arena.prompt.js';

// Alert tools
import { registerAlertTools } from '../agent/tools/alert.tools.js';

connectDB();
const connection = createRedisClient();

const worker = new Worker('agent-jobs', async (job) => {
  const { userId, agentType, input, sessionId } = job.data;
  logger.info(`👷 Worker processing Job ${job.id} | Agent: ${agentType}`);

  // ⭐ FIX: Safely convert String to ObjectId to prevent Mongoose CastErrors
  let userObjectId;
  try {
    userObjectId = new mongoose.Types.ObjectId(userId);
  } catch (e) {
    logger.error(`❌ Invalid userId "${userId}": ${e.message}`);
    throw new Error(`Invalid userId format: ${userId}`);
  }

  // Setup Tools & Config locally — each job gets a fresh registry
  const registry = new ToolRegistry();
  registerMemoryTools(registry);
  registerDBTools(registry);

  let systemPrompt = '';
  if (agentType === 'recon') {
    registerResumeTools(registry);
    registerCompanyTools(registry);
    systemPrompt = getReconSystemPrompt(registry.getToolDescriptions());
  } else if (agentType === 'strategy') {
    registerPlanTools(registry);
    systemPrompt = getStrategySystemPrompt(registry.getToolDescriptions());
  } else if (agentType === 'sentinel') {
    registerAlertTools(registry);
    systemPrompt = getSentinelSystemPrompt(registry.getToolDescriptions());
  } else if (agentType === 'arena') {
    // ⭐ FIX: Added missing arena agent configuration
    registerInterviewTools(registry);
    systemPrompt = getArenaSystemPrompt(registry.getToolDescriptions());
  }

  const orchestrator = new ReActOrchestrator({
    agentType,
    systemPrompt,
    toolRegistry: registry,
    maxIterations: 4,  // Recon: 3 steps + FINAL_ANSWER. No need for 6.
    sessionId,
    userId: userObjectId.toString(),
    jobId: job.id
  });

  const result = await orchestrator.run(input);

  // ⭐ FIX: Guard against orchestrator returning undefined/null
  if (!result || !result.finalAnswer) {
    logger.warn(`⚠️ Orchestrator returned no result for job ${job.id}`);
    return { finalAnswer: null, steps: 0 };
  }

  // ══════════════════════════════════════════════════════════════════
  // ⭐ DATA PERSISTENCE LAYER — Save agent output to Mongoose models
  // ══════════════════════════════════════════════════════════════════
  if (result.finalAnswer) {
    try {
      // Extract JSON from the finalAnswer string
      const jsonMatch = result.finalAnswer.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);

        // ── 1. RECON: Update the LATEST Resume document ──
        // DO NOT upsert — find the specific resume created by the controller
        if (agentType === 'recon') {
          const latestResume = await Resume.findOne({ userId: userObjectId }).sort({ createdAt: -1 });
          if (latestResume) {
            // ⭐ FIX: Map fields to match the Mongoose schema shape exactly
            latestResume.gapReport = {
              strongAreas: Array.isArray(data.strongAreas) ? data.strongAreas : [],
              weakAreas: Array.isArray(data.weakAreas) ? data.weakAreas : [],
              criticalGaps: Array.isArray(data.criticalGaps) ? data.criticalGaps : [],
              recommendations: Array.isArray(data.recommendations) ? data.recommendations : []
            };
            latestResume.companyMatches = Array.isArray(data.companyMatches)
              ? data.companyMatches.map(m => ({
                  companyName: m?.companyName || 'Unknown',
                  matchScore: typeof m?.matchScore === 'number' ? m.matchScore : 0,
                  matchedSkills: Array.isArray(m?.matchedSkills) ? m.matchedSkills : [],
                  missingSkills: Array.isArray(m?.missingSkills) ? m.missingSkills : []
                }))
              : [];
            await latestResume.save();
            logger.info(`💾 Saved Recon Analysis to Resume ${latestResume._id} for User ${userId}`);
          } else {
            logger.warn(`⚠️ No resume document found to update for User ${userId}`);
          }
        }

        // ── 2. STRATEGY: Save to PrepPlan Model ──
        if (agentType === 'strategy') {
          const weeklyPlan = Array.isArray(data.weeklyPlan) ? data.weeklyPlan : [];
          const duration = typeof data.duration === 'number' ? data.duration : 4;
          const totalTasks = weeklyPlan.reduce((acc, w) => acc + (Array.isArray(w?.dailyTasks) ? w.dailyTasks.length : 0), 0);

          await PrepPlan.findOneAndUpdate(
            { userId: userObjectId },
            {
              $set: {
                weeklyPlan,
                duration,
                targetCompanies: Array.isArray(data.targetCompanies) ? data.targetCompanies : ['Top Tier'],
                progress: {
                  tasksCompleted: 0,
                  totalTasks,
                  currentWeek: 1
                }
              }
            },
            { upsert: true, new: true }
          );
          logger.info(`💾 Saved Strategy Plan for User ${userId}`);
        }

        // ── 3. SENTINEL: Log completion ──
        if (agentType === 'sentinel') {
          logger.info(`💾 Sentinel scan completed for User ${userId}`);
        }

        // ── 4. ARENA: Save to MockInterview Model ──
        if (agentType === 'arena') {
          // Verify it's the final summary format, not just an intermediate JSON piece
          if (typeof data.overallScore === 'number') {
            await MockInterview.create({
              userId: userObjectId,
              overallScore: data.overallScore,
              questions: Array.isArray(data.questions) ? data.questions : [],
              strengths: Array.isArray(data.strengths) ? data.strengths : [],
              weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
              recommendation: data.recommendation || ''
            });
            logger.info(`💾 Saved Mock Interview Summary for User ${userId}`);
          }
        }
      } else {
        logger.warn(`⚠️ No JSON found in finalAnswer for job ${job.id}`);
      }
    } catch (e) {
      logger.error(`❌ Data Persistence Error [${agentType}]: ${e.message}`);
    }
  }

  return result;
}, { connection, concurrency: 1 });