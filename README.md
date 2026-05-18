# Placement Pilot

**A custom ReAct multi-agent system that autonomously monitors student placement readiness and fires real-time alerts — built without LangChain, runs fully air-gapped.**


---

## The Problem

University placement cells are broken at scale:

- 1 placement officer cannot personally track 1,000+ students
- Students only discover their skill gaps after failing their first real interview
- Existing AI tools are reactive — they wait to be asked. They never warn anyone

---

## The Solution

Placement Pilot is a proactive multi-agent system that monitors every student continuously, identifies risk before interview season, and alerts the placement team automatically — with zero manual intervention.

**No LangChain. No OpenAI API. Fully air-gapped via local Ollama inference. Zero PII leaves the network. Zero API cost.**

---

## The Three Agents

| Agent | Role |
|---|---|
| **Recon** | Parses resume, reverse-engineers industry requirements, identifies critical skill gaps |
| **Strategy** | Generates a personalized week-by-week action plan to close those gaps |
| **Sentinel** | Autonomous background cron that monitors student risk scores 24/7 and fires real-time alerts to the TPC dashboard via Socket.io |

---

## Architecture

```
React (Vite) ◄──Socket.io──► Node.js / Express
                                    │
                          BullMQ Job Queue (Redis)
                                    │
                          agent.worker.js (dedicated process)
                                    │
                          Custom ReAct Orchestrator
                                    │
                          Ollama — Qwen2.5:3b (local inference)
                                    │
                          Redis Pub/Sub ──► WebSocket ──► Frontend
```

---

## Key Engineering Decisions

**Custom ReAct loop without LangChain** — wrote the full agentic orchestrator from scratch. Intercepts LLM hallucinations, sanitizes malformed JSON, implements max-iteration fallbacks. More control, less overhead, no vendor lock-in.

**Decoupled AI worker process** — AI jobs run in a dedicated `agent.worker.js` process via BullMQ. The main Express server stays non-blocking even under concurrent load. Zero dropped requests.

**Redis Pub/Sub + WebSockets for streaming** — as the agent reasons through a problem, its thought stream publishes to Redis. The Express server pipes it live to the React frontend. The database is touched exactly twice: once to read input, once to save output.

**Sentinel cron — true autonomous behavior** — `sentinel.cron.js` runs completely independent of any user action. It monitors the ecosystem 24/7 and fires Socket.io alerts to the TPC dashboard when a student's risk score crosses a threshold.

**Fully air-gapped** — local Ollama inference (Qwen2.5:3b). No resume, email, or grade ever leaves the university network.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React, Vite, Tailwind CSS, TanStack Query, Socket.io-client |
| Backend | Node.js (ESM), Express, MongoDB, Mongoose |
| Queue | BullMQ, Redis |
| AI Engine | Custom ReAct Orchestrator, Ollama (Qwen2.5:3b) |
| Real-time | Redis Pub/Sub, Socket.io, WebSockets |

---

## Why This Is Production-Grade

Most AI projects make a synchronous API call and crash when 5 people click at once.

This system handles concurrent load via job queues, streams live agent reasoning to the frontend without polling, runs autonomous background processes independent of user sessions, and processes sensitive data entirely on-device.

---

## Local Setup

Requires Redis, MongoDB, and Ollama with `qwen2.5:3b` pulled locally.

```bash
# Terminal 1 — API and WebSocket server
cd server && npm run dev

# Terminal 2 — AI background worker
cd server && npm run worker

# Terminal 3 — Frontend
cd client && npm run dev
```

App runs at `http://localhost:5173`

---

## What I Can Build For You

If you need a custom multi-agent system, an autonomous monitoring pipeline, or a real-time AI backend — [let's talk](mailto:sandeepakash537@gmail.com).
