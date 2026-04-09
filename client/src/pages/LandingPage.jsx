import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Rocket, Brain, Shield, Zap, Users, Target, ChevronRight, ArrowRight, Star, Activity } from 'lucide-react';

// ── Animated number counter ─────────────────────────────────────────────────
function Counter({ to, duration = 2 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = to / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [to, duration]);
  return <span>{count.toLocaleString()}</span>;
}

// ── Particle field background ───────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />;
}

// ── Typewriter ──────────────────────────────────────────────────────────────
function Typewriter({ words }) {
  const [idx, setIdx] = useState(0);
  const [char, setChar] = useState(0);
  const [del, setDel] = useState(false);
  const word = words[idx % words.length];
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!del && char === word.length) { setTimeout(() => setDel(true), 1400); return; }
      if (del && char === 0) { setDel(false); setIdx(i => i + 1); return; }
      setChar(c => del ? c - 1 : c + 1);
    }, del ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [char, del, word]);
  return (
    <span className="text-cyber-cyan">
      {word.slice(0, char)}
      <span className="animate-pulse">|</span>
    </span>
  );
}

const FEATURES = [
  { icon: Brain, title: 'ReAct AI Orchestrator', desc: 'Hand-built reasoning loop that thinks step-by-step, calls tools, and delivers accurate gap analysis — no black-box LLM APIs.', color: 'cyan' },
  { icon: Zap, title: 'Sentinel Automation', desc: 'A background cron agent that monitors every student 24/7 and fires real-time alerts to teachers the moment someone falls behind.', color: 'blue' },
  { icon: Target, title: 'Personalized Battle Plans', desc: 'AI-generated week-by-week study roadmaps tailored to your exact skill gaps, target companies, and timeline.', color: 'purple' },
  { icon: Activity, title: 'Mock Interview Arena', desc: 'Instant AI-powered technical, HR, and system design interviews with live scoring and per-question feedback.', color: 'cyan' },
  { icon: Shield, title: '100% Private & Local', desc: 'Runs entirely on your own hardware with Ollama. No resume, grade, or personal data ever leaves your network.', color: 'blue' },
  { icon: Users, title: 'TPC Live Dashboard', desc: 'Real-time teacher dashboard with Socket.io alerts, risk heatmaps, and a BullMQ operations console.', color: 'purple' },
];

const STATS = [
  { value: 1000, suffix: '+', label: 'Students Analyzed' },
  { value: 50,   suffix: 'ms', label: 'Interview Latency' },
  { value: 95,   suffix: '%', label: 'Placement Rate' },
  { value: 3,    suffix: '', label: 'AI Agents' },
];

// ─────────────────────────────────────────────────────────────────────────────
export const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroY   = useTransform(scrollY, [0, 600], [0, -120]);
  const heroOp  = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="min-h-screen bg-[#020817] text-white overflow-x-hidden font-sans">

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/5 backdrop-blur-xl bg-black/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-blue flex items-center justify-center">
            <Rocket className="w-4 h-4 text-black" />
          </div>
          <span className="text-lg font-bold tracking-tight">PlacementPilot</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          {['Features', 'Architecture', 'Demo'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="hover:text-white transition-colors hover:text-cyber-cyan">{item}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/login')}
            className="text-sm px-5 py-2 rounded-lg bg-cyber-cyan text-black font-semibold hover:bg-cyber-cyan/90 transition-all hover:scale-105 active:scale-100"
          >
            Get Started →
          </button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-20">
        <ParticleField />

        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyber-cyan/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-2/3 left-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-purple-600/8 rounded-full blur-[100px] pointer-events-none" />

        <motion.div style={{ y: heroY, opacity: heroOp }} className="relative z-10 max-w-5xl mx-auto">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 text-cyber-cyan text-xs font-mono mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
            AUTONOMOUS AI CAREER COACH — LOCALLY HOSTED
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-gray-500 font-mono mb-4 tracking-widest">[ AI THAT WORKS FOR STUDENTS ]</p>
            <h1 className="font-black leading-[0.9] mb-6 tracking-tight">
              <span className="block text-[clamp(60px,10vw,120px)] text-white">RE-DEFINE</span>
              <span className="block text-[clamp(60px,10vw,120px)] text-white">YOUR</span>
              <span className="block text-[clamp(60px,10vw,120px)]">
                <Typewriter words={['PLACEMENT', 'POTENTIAL', 'FUTURE']} />
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            PlacementPilot is an autonomous multi-agent AI that analyzes your resume, hunts skill gaps, 
            generates a battle plan, and alerts teachers when you fall behind — all running locally with zero data leaks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/login')}
              className="group px-8 py-4 rounded-xl bg-cyber-cyan text-black font-bold text-base hover:bg-cyber-cyan/90 transition-all hover:scale-105 active:scale-100 hover:shadow-[0_0_40px_rgba(0,212,255,0.4)] flex items-center justify-center gap-2"
            >
              Launch the System
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#features"
              className="px-8 py-4 rounded-xl border border-white/10 text-gray-300 font-medium text-base hover:border-cyber-cyan/40 hover:text-white transition-all hover:bg-white/5 flex items-center justify-center gap-2"
            >
              See How It Works
              <ChevronRight className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 text-xs"
        >
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-cyber-cyan/50 animate-pulse" />
          Scroll to explore
        </motion.div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-white/5 bg-gradient-to-r from-transparent via-cyber-cyan/3 to-transparent">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-black text-cyber-cyan mb-1">
                <Counter to={s.value} />{s.suffix}
              </div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-28 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-cyber-cyan text-xs font-mono tracking-widest mb-3">[ SYSTEM CAPABILITIES ]</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-5xl font-black text-white mb-4">Built Different.</motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-gray-400 max-w-xl mx-auto">Not a chatbot. A fully autonomous multi-agent system that runs 24/7 without a single click from the student.</motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-cyber-cyan/30 hover:bg-white/[0.04] transition-all duration-300 cursor-default"
            >
              <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center
                ${f.color === 'cyan' ? 'bg-cyber-cyan/10 text-cyber-cyan'
                  : f.color === 'blue' ? 'bg-blue-500/10 text-blue-400'
                  : 'bg-purple-500/10 text-purple-400'}`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyber-cyan/0 to-cyber-cyan/0 group-hover:from-cyber-cyan/3 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ARCHITECTURE ─────────────────────────────────────────────────── */}
      <section id="architecture" className="py-28 px-6 bg-gradient-to-b from-transparent to-cyber-cyan/3">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-cyber-cyan text-xs font-mono tracking-widest mb-3">[ SYSTEM ARCHITECTURE ]</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-5xl font-black text-white mb-4">Production-Grade Stack.</motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-gray-400 max-w-xl mx-auto">Built with the same architecture patterns used at top-tier startups — not a hackathon toy.</motion.p>
        </div>

        {/* Flow diagram */}
        <div className="max-w-4xl mx-auto">
          {[
            { label: 'React Frontend', desc: 'Real-time Socket.io streams, TanStack Query cache, AnimatePresence transitions' },
            { label: 'Express + Socket.io', desc: 'JWT auth, rate limiting, Redis Pub/Sub bridge to frontend' },
            { label: 'BullMQ + Redis', desc: 'Async job queue prevents server blocking. Retry on failure. Visual dashboard.' },
            { label: 'ReAct Orchestrator', desc: 'Hand-built LLM reasoning loop. Tool registry. Antigravity defensive shield.' },
            { label: 'Local Ollama (Qwen 2.5)', desc: 'Air-gapped inference. Zero API keys. Zero data leaks. Runs on your laptop.' },
            { label: 'MongoDB Atlas', desc: 'Persistent student profiles, gap reports, prep plans, interview history.' },
          ].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 mb-4"
            >
              <div className="flex flex-col items-center pt-1">
                <div className="w-8 h-8 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                {i < 5 && <div className="w-px h-8 bg-gradient-to-b from-cyber-cyan/30 to-transparent mt-1" />}
              </div>
              <div className="flex-1 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-white font-semibold">{item.label}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-cyan/10 text-cyber-cyan font-mono border border-cyber-cyan/20">LAYER {i + 1}</span>
                </div>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section id="demo" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 via-transparent to-blue-600/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-cyan/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <p className="text-cyber-cyan text-xs font-mono tracking-widest mb-4">[ READY TO LAUNCH ]</p>
          <h2 className="text-6xl font-black text-white mb-6 leading-tight">
            Stop Preparing.<br />
            <span className="text-cyber-cyan">Start Winning.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Upload your resume. The AI takes it from there — gaps, plan, mock interviews, Sentinel monitoring. All automated.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/login')}
              className="group px-10 py-5 rounded-xl bg-cyber-cyan text-black font-black text-lg hover:bg-cyber-cyan/90 transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(0,212,255,0.5)] flex items-center justify-center gap-3"
            >
              <Rocket className="w-5 h-5" />
              Launch PlacementPilot
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            {['100% Local & Private', 'No API Keys Needed', 'Open Source'].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-cyber-cyan" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-gray-600 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-cyber-cyan to-cyber-blue flex items-center justify-center">
            <Rocket className="w-3 h-3 text-black" />
          </div>
          <span className="text-white font-semibold">PlacementPilot</span>
        </div>
        <p>Built for the Hackathon · Fully Local · Zero Compromise</p>
      </footer>
    </div>
  );
};
