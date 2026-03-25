# GraphMind — Intelligent Business Graph Explorer

<div align="center">

**A real-time, interactive graph visualization platform for SAP Order-to-Cash process data, powered by AI-driven natural language queries.**

[![Built with React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Groq AI](https://img.shields.io/badge/Groq-Llama_3.3_70B-F55036)](https://groq.com)

</div>

---

## Overview

GraphMind transforms raw SAP O2C (Order-to-Cash) business data into an interactive force-directed graph, enabling users to visually explore relationships between customers, sales orders, deliveries, invoices, payments, products, plants, and addresses.

An integrated AI chatbot (powered by Groq's Llama 3.3 70B) allows natural language queries against the dataset — ask questions like *"Which customer has the most sales orders?"* and get grounded, data-backed answers with highlighted nodes on the graph.

## Features

- **Force-Directed Graph** — 598 nodes and 810 edges rendered via `react-force-graph-2d` with zoom, pan, and drag
- **8 Entity Types** — Color-coded nodes: Customer, Sales Order, Delivery, Invoice, Payment, Product, Address, Plant
- **Node Detail Panel** — Click any node to inspect its metadata (amounts, dates, IDs, statuses)
- **AI Chatbot** — Natural language queries grounded in the dataset, with automatic node highlighting
- **Interactive Legend** — Real-time legend mapping colors to entity types
- **Responsive Layout** — Flexbox-based layout with graph + chat side-by-side

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript 5.8 |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| Graph | react-force-graph-2d, d3-force |
| AI | Groq SDK + Llama 3.3 70B |
| Icons | Lucide React |
| Markdown | react-markdown |
| Server | Express (dev server) |

## Architecture

```
src/
├── App.tsx                  # Root layout (graph + chat + detail panel)
├── main.tsx                 # React entry point
├── index.css                # Global styles (Tailwind)
├── components/
│   ├── GraphView.tsx        # Force-directed graph + color logic + legend
│   └── ChatInterface.tsx    # AI chatbot UI with message history
├── data/
│   └── mockData.ts          # 598 nodes & 810 edges (SAP O2C dataset)
└── services/
    └── geminiService.ts     # Groq API integration + data summary builder
```

## Data Model

The dataset represents a complete SAP Order-to-Cash flow:

```
Customer ──PLACED_ORDER──▶ SalesOrder ──CONTAINS_ITEM──▶ Product
    │                          │
    ├──LOCATED_AT──▶ Address   ├──DELIVERED_BY──▶ Delivery ──SHIPS_FROM──▶ Plant
    │                                                │
    │                                    INVOICED_BY──▶ Invoice ──PAID_BY──▶ Payment
    │                                                      │
    │                                          CANCELLED_BY──▶ Invoice
```

| Entity | Count | ID Prefix |
|--------|------:|-----------|
| Customer | 8 | `BP-` |
| Sales Order | 100 | `SO-` |
| Product | 69 | `PROD-` |
| Delivery | 86 | `DEL-` |
| Invoice | 163 | `INV-` |
| Payment | 120 | `PAY-` |
| Plant | 44 | `PLANT-` |
| Address | 8 | `ADDR-` |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A [Groq API key](https://console.groq.com/keys) (free tier available)

### Installation

```bash
git clone https://github.com/sprakhar823/graphmind.git
cd graphmind
npm install
```

### Configuration

Create a `.env` file in the project root:

```env
GROQ_API_KEY=gsk_your_api_key_here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## Example Queries

Try these in the AI chatbot:

| Query | What it does |
|-------|-------------|
| `List all customers` | Returns all 8 business partners |
| `Which customer has the most sales orders?` | Identifies top customer + highlights nodes |
| `How many invoices have been cancelled?` | Counts cancelled billing documents |
| `Show me products ordered by Nguyen-Davis` | Traces Customer → Order → Product edges |
| `What is the total value of all sales orders?` | Aggregates totalNetAmount across orders |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add `GROQ_API_KEY` as an environment variable
4. Deploy — Vercel auto-detects Vite

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add `GROQ_API_KEY` in environment settings

## License

MIT

---

<div align="center">
  <sub>Built with ❤️ using React, Vite, and Groq AI</sub>
</div>
