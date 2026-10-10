# 🗺️ Cafe Pilot: Product Roadmap & Strategic Plan

> **Strategic Vision, Feature Milestones & Engineering Roadmap for Autonomous Cafe Operations**

---

## 🎯 Vision Statement

To build the most reliable, sub-second autonomous operations platform for specialty cafes and quick-service restaurants—unifying voice/text natural language ordering with tamper-proof financial accounting and real-time inventory telemetry.

---

## 📅 Roadmap Overview

```
Phase 1: Foundation (Completed)
  ├── Immersive Dark UI Design System
  ├── Interactive Atmosphere & Showcase Gallery
  └── Core Metric Dashboards & Order Store

Phase 2: Intelligent Core (Current - Completed)
  ├── Server-Side Groq / xAI API Gateway
  ├── Deterministic Natural Language Order Assistant
  ├── Telemetry-Grounded Operations Director
  └── Zero-Dependency Rich Markdown Typography Engine

Phase 3: Production Hardening (Next Milestone)
  ├── SQLite / PostgreSQL Persistent Data Layer
  ├── Kitchen Display System (KDS) Real-Time WebSocket Sync
  └── Multi-Branch Inventory & Automatic Supplier Purchase Orders

Phase 4: Autonomous Hardware & Voice Pipeline (Future)
  ├── Ultra-Low Latency Streaming Voice Ordering (WebRTC)
  ├── Receipt Printer & POS Hardware Gateway (ESC/POS)
  └── Dynamic Menu Pricing Analytics & Margin Optimization
```

---

## 🚀 Detailed Phase Breakdown

### Phase 1: Immersive Interface & Visual System ✅ *(Completed)*
- [x] **Dark-Themed Design Language**: Built high-contrast, psychology-driven color palette with smooth CSS keyframes and glassmorphic panels.
- [x] **Atmospheric Playground**: Showcase featured barista creations, artisan team members, and full-screen image gallery with keyboard navigation.
- [x] **Executive Dashboard**: Real-time sales metrics (Revenue, Ticket Count, Average Order Value, Active Queue).

---

### Phase 2: Groq LPU & Anti-Hallucination Architecture ✅ *(Completed)*
- [x] **Secure Server Gateway**: Node.js connect middleware integrated inside Vite to isolate API credentials.
- [x] **Dual Provider Support**: Seamless detection of GroqCloud (`gsk_...` with `openai/gpt-oss-120b`) and xAI (`xai-...` with `grok-2-latest`).
- [x] **Deterministic Pricing Firewall**: Complete separation of intent classification from catalog pricing (`menuDetailed.js`).
- [x] **Resilient Offline Fallback**: Instant local heuristic parser (`parseOrderLocal`) activated on network timeout or unconfigured credentials.
- [x] **Human-Readable Rich Typography**: Zero-dependency markdown component (`FormattedMessage.jsx`) parsing tables, headers, and lists cleanly without raw Markdown symbols.

---

### Phase 3: Production Hardening & Persistence 🔄 *(Planned)*
- [ ] **Database Persistence**:
  - Migrate in-memory ledger to SQLite (local edge) or Supabase/PostgreSQL (multi-store cloud).
  - Historical sales ledger with date-range reporting and CSV/PDF export.
- [ ] **Kitchen Display System (KDS)**:
  - Real-time station views (Barista Espresso Station, Cold Bar, Bakery Prep).
  - Order status progression: `Received` -> `Preparing` -> `Ready for Pickup` -> `Completed`.
- [ ] **Supplier Automation**:
  - Automated email/webhook triggers to suppliers when stock reaches `minThreshold`.
  - Batch restocking ledger with cost-per-unit variance tracking.

---

### Phase 4: Autonomous Hardware & Voice Streaming 🔮 *(Future Vision)*
- [ ] **Streaming Voice Ordering**:
  - WebRTC audio pipeline streaming spoken orders into Whisper / Groq Audio API.
  - Live conversational clarification for options (e.g., *"Would you like that iced or hot?"*).
- [ ] **Physical POS Integration**:
  - Network receipt printer support via ESC/POS protocol.
  - Payment terminal webhook sync (Stripe Terminal / Square POS).
- [ ] **Predictive Dynamic Sourcing**:
  - Weather-aware sales forecasting (e.g., predicting 40% surge in cold brew on hot days).
  - AI-suggested seasonal recipe specials based on surplus pantry items.

---

## 📊 Success Metrics & KPIs

| Metric | Target | Current Benchmark |
| :--- | :--- | :--- |
| **Inference Latency** | < 500 ms | **~180 - 320 ms** (via Groq LPUs) |
| **Price Accuracy** | 100.0% (Zero Hallucination) | **100.0%** (Enforced by Catalog Core) |
| **Parser Recovery Rate** | 100% (No checkout crashes) | **100%** (via Local Heuristic Fallback) |
| **Bundle Build Time** | < 1.0 s | **~240 - 340 ms** (Vite 8) |
| **Lighthouse Performance** | > 95 | **98+** |

---

## 🛠️ Tech Debt & Code Hygiene Policy
- **Minimal Dependencies**: Resist external libraries when vanilla React/CSS provides cleaner, zero-overhead solutions.
- **Strict Linting**: Automated Oxlint checks on every build to guarantee clean imports and pure functional components.
- **Git Discipline**: Atomic commits, descriptive conventional messages, and branch protection on `main`.
