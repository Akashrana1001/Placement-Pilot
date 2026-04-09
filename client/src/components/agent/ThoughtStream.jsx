import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAgentStream } from '../../hooks/useAgentStream';
import { GlassCard } from '../common/GlassCard';

export const ThoughtStream = ({ jobId, title = "Agent Live Feed" }) => {
  const { steps, isStreaming, latestStep } = useAgentStream(jobId);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [steps]);

  if (!jobId) {
    return (
      <GlassCard className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-500">
        <BrainCircuit className="w-16 h-16 mb-4 opacity-20" />
        <p>Waiting for agent activation...</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard title={title} icon={BrainCircuit} className="h-full min-h-[400px] flex flex-col relative overflow-hidden">
      {isStreaming && (
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-success font-mono">LIVE</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 font-['JetBrains_Mono'] text-sm">
        {steps.map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-l-2 border-white/10 pl-4 py-2 space-y-2"
          >
            {step.thought && (
              <div>
                <span className="bg-cyber-cyan/20 text-cyber-cyan px-2 py-0.5 rounded text-xs mr-2 border border-cyber-cyan/30">THINK</span>
                <span className="text-gray-300">{step.thought}</span>
              </div>
            )}
            
            {step.action && (
              <div>
                <span className="bg-warning/20 text-warning px-2 py-0.5 rounded text-xs mr-2 border border-warning/30">ACT</span>
                <span className="text-warning">{step.action}</span>
                <ExpandableData data={step.actionInput} />
              </div>
            )}

            {step.observation && (
              <div>
                <span className="bg-success/20 text-success px-2 py-0.5 rounded text-xs mr-2 border border-success/30">OBSERVE</span>
                <span className="text-gray-400">{step.observation.length > 100 ? step.observation.substring(0, 100) + '...' : step.observation}</span>
              </div>
            )}

            {step.isDone && step.finalAnswer && (
              <div className="mt-4 p-4 bg-success/10 border border-success/30 rounded-lg flex items-start gap-3 font-['Inter']">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <span className="text-success font-medium">
                  {typeof step.finalAnswer === 'string' ? step.finalAnswer : "Analysis Complete"}
                </span>
              </div>
            )}
          </motion.div>
        ))}
        
        {isStreaming && !latestStep?.isDone && (
          <div className="pl-4 py-2">
            <span className="animate-pulse text-gray-500 font-['JetBrains_Mono']">Processing...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </GlassCard>
  );
};

const ExpandableData = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  if (!data) return null;
  return (
    <span className="ml-2 text-gray-500 text-xs">
      <button onClick={() => setExpanded(!expanded)} className="hover:text-white flex inline-flex items-center gap-1">
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {expanded ? 'Hide' : 'View Payload'}
      </button>
      {expanded && <pre className="mt-2 p-2 bg-navy-900 rounded overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>}
    </span>
  );
};   