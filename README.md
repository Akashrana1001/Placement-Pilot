# 🚀 PlacementPilot: Autonomous Agentic Career Coach

PlacementPilot is a production-grade, AI-driven placement preparation ecosystem designed to bridge the gap between overwhelmed university placement cells (TPCs) and underprepared students. 

Unlike standard "GenAI chatbots," PlacementPilot is a **proactive, multi-agent engine** powered by a custom ReAct orchestrator, background job queues, and real-time telemetry. It runs entirely locally, ensuring 100% data privacy and zero API costs.

---

## ⚠️ The Problem
University placement architectures are fundamentally flawed:
1. **The Scale Problem:** 1 placement officer cannot personalize career trajectories for 1,000+ students.
2. **The Discovery Problem:** Students only realize their technical gaps *after* they fail their first real interview.
3. **The Reactive AI Problem:** Existing AI tools wait for students to ask questions. If a student is slacking, a chatbot won't warn the teacher.

## 💡 The Solution
PlacementPilot solves these problems through an **Autonomous Multi-Agent Architecture**:
- **Recon Agent:** Analyzes resumes, reverse-engineers industry requirements, and finds critical skill gaps.
- **Strategy Agent:** Generates personalized, week-by-week battle plans to fix those gaps before interview season.
- **Sentinel Agent:** An autonomous background cron job that monitors student performance and physically alerts the TPC Dashboard if a student's "Risk Score" drifts into the danger zone.
---
## 🌟 Key Features

### 🎓 For Students
- **Deep Resume Analysis:** Upload your resume and watch the LLM's "Thought Stream" in real-time as it parses your data, queries its skill database, and evaluates your hireability.
- **Actionable Gap Reports:** See exactly what technologies you are missing for your target companies.
- **Personalized Battle Plans:** Get daily/weekly tasks automatically generated to fix your weaknesses.

### 🏛️ For TPC Admins (Teachers)
- **Global Sentinel Dashboard:** Stop manually checking on students. The autonomous Sentinel Agent runs in the background. If a student falls behind, an automated **Socket.io** alert flashes on your dashboard in real-time.
- **Enterprise Queue Management:** View the built-in BullMQ dashboard to see exactly what the AI server is processing, providing full transparency and control over AI workloads.

---

## 🏗️ System Design & Architecture

PlacementPilot was built with **Enterprise / Production-Grade Resiliency** in mind. It uses an asynchronous event-driven architecture to prevent AI workloads from blocking the web server.

### The Tech Stack
* **Frontend:** React, Vite, TailwindCSS, TanStack Query, Socket.io-client, Framer Motion
* **Backend:** Node.js (ESM), Express, MongoDB (Mongoose)
* **Message Broker / Cache:** Redis, BullMQ
* **AI Engine:** Local Ollama (Qwen2.5:3b), Custom Hand-Written ReAct Orchestrator

### 🔄 The Data Flow
1. **Decoupled API:** When a student uploads a resume, the Node API returns immediately. It passes the heavy lifting payload to a **BullMQ Queue**.
2. **Background AI Workers:** A dedicated `agent.worker.js` node consumes jobs from the queue. This ensures the main web server never crashes or blocks, even if 1,000 students upload resumes concurrently.
3. **The Antigravity Shield:** The worker passes data to our custom ReAct LLM Orchestrator. The orchestrator uses extreme defensive programming ("Antigravity Shield") to validate tool parameters, ensuring that even if the small 3B LLM hallucinates malformed JSON, the server gracefully recovers instead of crashing.
4. **Real-time Pub/Sub:** As the background worker reasons through the problem ("Thought Stream," tool calls), it publishes its state to a **Redis Pub/Sub** channel. 
5. **WebSocket Telemetry:** The main Express server subscribes to Redis and pipes the stream directly to the React frontend via **Socket.io**.

---

## 🛡️ Why This is "Production-Grade"

Standard hackathon projects make synchronous API calls to OpenAI and crash when 5 people click a button. **PlacementPilot is built differently:**

1. **Defensive ReAct Loop:** We didn't rely on bloated frameworks like LangChain. We wrote a custom agentic loop that intercepts LLM hallucinations, sanitizes inputs, unwraps execution envelopes, and implements max-iteration fallbacks.
2. **Job Queues (BullMQ):** AI tasks take 10-15 seconds. By tossing them into a BullMQ queue, we guarantee zero dropped requests and provide automatic retry mechanisms on failure.
3. **No Database Blocking:** Instead of polling MongoDB every 2 seconds to check if the AI is done, we use Redis Pub/Sub and WebSockets. The database is only touched twice: once to read the input, and once to save the final answer.
4. **Autonomous Crons:** The `sentinel.cron.js` operates completely independent of user interaction, creating true "Agentic" behavior that monitors the ecosystem 24/7.
5. **Local Inference:** Completely air-gapped processing via Ollama. No PII (resumes, emails, grades) ever leaves the university's network.

---

## 🏁 How to Run Locally

*Requires Redis, MongoDB, and Ollama (with `qwen2.5:3b` pulled) running on your machine.*

You need three terminal windows:

**1. Start the API & WebSocket Server:**
\`\`\`bash
cd server
npm run dev
\`\`\`

**2. Start the AI Background Worker:**
\`\`\`bash
cd server
npm run worker
\`\`\`

**3. Start the Frontend UI:**
\`\`\`bash
cd client
npm run dev
\`\`\`

*The application will be running at `http://localhost:5173`.*
