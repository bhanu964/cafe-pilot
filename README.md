# ☕ Cafe Pilot

> **Autonomous AI Cafe Operations & Natural Language Order Assistant**  
> *Deterministic Pricing Governance • Sub-Second LLM Inference • Real-Time Operational Telemetry*

[![React 19](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite)](https://vitejs.dev/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://temporary-fleet-mauve-g7nn0jf.vercel.app)
[![Groq LPU](https://img.shields.io/badge/Inference-Groq%20LPU%20%7C%20xAI-F55036?logo=fastapi)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Security: Server-Side](https://img.shields.io/badge/Security-Server--Side%20Key%20Isolation-success)](#security--architecture)

---

### 🌐 Live Deployment
- **Live Application URL**: [https://temporary-fleet-mauve-g7nn0jf.vercel.app](https://temporary-fleet-mauve-g7nn0jf.vercel.app)
- **One-Click Vercel Deploy**: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bhanu964/cafe-pilot)

---

## 🌟 Overview

**Cafe Pilot** is a dark-themed, enterprise-ready cafe operations dashboard and autonomous order assistant. It bridges conversational AI with deterministic operational constraints:

- **AI Order Interpretation**: Translates free-form customer speech and natural language (e.g., *"two cold coffees and one cheese sandwich, extra hot"*) into structured orders.
- **Application-Controlled Deterministic Pricing**: **Zero price hallucinations.** The LLM only parses intent and quantities; all prices, stock values, tax logic, and order totals are strictly governed by the application's canonical catalog.
- **Operations Intelligence**: Analyzes live sales velocity, inventory depletion rates, rush hour staffing, and supplier reordering schedules grounded in real cafe telemetry.
- **Resilient Fallback Engine**: If upstream AI endpoints encounter latency, rate limits, or outages, the application automatically falls back to an offline rule-based parser without breaking checkout.

---

## 🚀 Key Features

### 🎙️ 1. Natural Language AI Order Assistant
- **Conversational Parsing**: Handles complex orders with natural language conjunctions, quantities, and variations.
- **Special Request Extraction**: Captures notes (e.g., *"extra ice"*, *"oat milk substitution"*) while parsing menu lines.
- **Sanitized Catalog Enforcement**: Matches items against canonical items in `src/data/menuDetailed.js`. Any unlisted item is flagged safely without crashing checkout.
- **Real-Time Synchronized State**: Confirmed orders automatically update today's ledger, total revenue, average order value, and active order counts across the dashboard.

### 📊 2. AI Operations Director
- **Real-Time Grounded Insights**: Feeds current sales figures, low-stock warnings, and recent tickets into the context window.
- **Executive Reporting**: Formats operational advice into readable sections, comparison tables, and prioritized action steps using custom Markdown typography without raw formatting artifacts.
- **Quick-Prompt Telemetry Chips**: One-click operational inquiries for rush staffing, high-margin combo discovery, and inventory reorders.

### 📦 3. Smart Inventory Management
- **Depletion Tracking**: Live stock counts, units, minimum thresholds, and supplier information.
- **End-of-Day (EOD) Predictions**: Predicts closing inventory levels based on current velocity to avert stockouts before morning rush.
- **Valuation Governance**: Real-time asset valuation calculated strictly with application unit costs.

### ✨ 4. Atmospheric Playground & Gallery
- **Immersive Visuals**: High-resolution atmospheric cafe photography, artisanal team showcases, and featured beverages with animated cards.
- **Interactive Showcase**: Modal gallery with keyboard navigation and dark-mode aesthetics.

---

## 🏗️ Architecture & Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                 Client Single Page Application              │
│       (React 19 + Lucide React + FormattedMessage)          │
└──────────────────────────────┬──────────────────────────────┘
                               │
               HTTP /api/ai/*  │  (Zero secret exposure)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Vite Node.js Server Gateway                 │
│                 (vite.config.js Middleware)                 │
│                                                             │
│   • Isolates GROQ_API_KEY / GROK_API_KEY on the server       │
│   • Validates incoming payloads                             │
│   • Enforces 12s timeout & abort controller                 │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
     LLM Call  │                              │ Fallback on Error / No Key
               ▼                              ▼
┌──────────────────────────────┐  ┌───────────────────────────┐
│     High-Speed Cloud LLM     │  │   Local Heuristic Engine  │
│  • Groq LPU (gpt-oss-120b)   │  │   • Regex Token Segmenter │
│  • Sub-second response       │  │   • In-Memory Telemetry   │
└──────────────┬───────────────┘  └───────────┬───────────────┘
               │                              │
               └──────────────┬───────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│         Deterministic Application Price & Stock Core         │
│                                                             │
│   • Enforces Official Menu Catalog (menuDetailed.js)        │
│   • Total = Σ(catalog_price × quantity)                     │
│   • Model CANNOT invent, hallucinate, or alter prices       │
└─────────────────────────────────────────────────────────────┘
```

> 📖 **Deep Dive**: See [`ARCHITECTURE.md`](ARCHITECTURE.md) for sequence diagrams, security threat modeling, and state machine specifications.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Modern CSS Variables, Lucide React Icons |
| **Server / Gateway** | Node.js (v22+), Vite 8 Server Middleware Plugin |
| **AI Inference** | GroqCloud LPUs (`openai/gpt-oss-120b`) / xAI (`grok-2-latest`) |
| **Data Engine** | Deterministic in-memory reactive data store |
| **Linting & Code Quality** | Oxlint, Strict ES Modules |

---

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/bhanu964/cafe-pilot.git
cd cafe-pilot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Server Environment
Copy the template and add your API key:
```bash
cp .env.example .env
```

Edit `.env`:
```env
# GroqCloud (Recommended for sub-second responses)
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b
```

> **Note**: If no API key is configured, Cafe Pilot runs seamlessly in **Local Fallback Mode**, ensuring uninterrupted functionality for local testing and demos.

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite dev server with embedded server-side AI API gateway |
| `npm run build` | Builds optimized production bundle in `dist/` |
| `npm run preview` | Previews the production build with full middleware support |
| `npm run lint` | Runs ultra-fast Oxlint checks across the codebase |

---

## 🔌 API Endpoints

All API endpoints run strictly server-side:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/ai/health` | Returns AI gateway status, configured provider, and active model. **Does not leak credentials.** |
| `POST` | `/api/ai/parse-order` | Parses natural language input against the cafe menu into structured item/quantity arrays. |
| `POST` | `/api/ai/operations` | Generates executive recommendations grounded in live telemetry data. |

---

## 🗺️ Project Structure

```
cafe-pilot/
├── public/                 # Static web assets
├── server/
│   └── grokService.js      # Server-side Groq/xAI LLM interface & prompt engineering
├── src/
│   ├── assets/             # Photography & SVGs
│   ├── components/         # React UI modules
│   │   ├── AIAssistant.jsx        # Operations intelligence chat
│   │   ├── AIOrderAssistant.jsx   # Natural language order assistant
│   │   ├── FormattedMessage.jsx   # Clean Markdown renderer (no raw stars/hashes)
│   │   ├── Dashboard.jsx          # Real-time metrics & charts
│   │   ├── Inventory.jsx          # Stock management & EOD predictions
│   │   ├── Orders.jsx             # Daily order ledger
│   │   └── Playground.jsx         # Immersive cafe experience
│   ├── data/               # Authoritative pricing & catalog state
│   │   ├── menuDetailed.js        # Canonical menu items & keyword map
│   │   ├── inventory.js           # Stock levels, thresholds & unit costs
│   │   └── ordersStore.js         # Reactive order store & analytics
│   ├── services/
│   │   └── aiService.js           # Client orchestration & fallback logic
│   ├── App.jsx             # Main router & layout shell
│   └── App.css             # Dark theme design system
├── .env.example            # Environment configuration template
├── ARCHITECTURE.md         # In-depth architectural & security specification
├── PLAN.md                 # Product roadmap & feature planning
├── CONTRIBUTING.md         # Contribution guide
├── LICENSE                 # MIT License
└── vite.config.js          # Vite config with server API middleware
```

---

## 🔒 Security & Privacy

- **Zero Client Key Exposure**: API tokens (`gsk_...` / `xai-...`) reside only in server memory. Client requests hit local `/api/ai/*` proxies.
- **Strict Price Quarantine**: The model output is strictly parsed as `(name, quantity)`. Pricing is joined against `menuDetailed.js` in client-verified memory. Even if an LLM is prompted to return `$0.01` or `$999.00`, the application overrides and computes the canonical price.
- **Fail-Safe Operation**: Complete isolation from third-party vendor downtime via deterministic fallback handlers.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
