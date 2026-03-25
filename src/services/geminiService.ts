import Groq from "groq-sdk";
import { mockNodes, mockEdges } from "../data/mockData";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
  dangerouslyAllowBrowser: true,
});

// Build a compact summary that fits within token limits
function buildDataSummary(): string {
  const nodesByType: Record<string, typeof mockNodes> = {};
  for (const node of mockNodes) {
    if (!nodesByType[node.type]) nodesByType[node.type] = [];
    nodesByType[node.type].push(node);
  }

  const edgesByType: Record<string, number> = {};
  for (const edge of mockEdges) {
    edgesByType[edge.type] = (edgesByType[edge.type] || 0) + 1;
  }

  let summary = `Total: ${mockNodes.length} nodes, ${mockEdges.length} edges.\n\n`;

  // Customers (small list, include all)
  const customers = nodesByType['Customer'] || [];
  summary += `CUSTOMERS (${customers.length}):\n`;
  for (const c of customers) {
    const orderCount = mockEdges.filter(e => e.source === c.id && e.type === 'PLACED_ORDER').length;
    summary += `${c.id}: "${c.label}" (${orderCount} orders)\n`;
  }

  // Sales Orders - just IDs and key fields
  const orders = nodesByType['SalesOrder'] || [];
  summary += `\nSALES ORDERS (${orders.length}):\n`;
  for (const o of orders) {
    summary += `${o.id}: cust=${o.metadata.soldToParty}, amt=${o.metadata.totalNetAmount} ${o.metadata.transactionCurrency}\n`;
  }

  // Products - compact
  const products = nodesByType['Product'] || [];
  summary += `\nPRODUCTS (${products.length}):\n`;
  for (const p of products) {
    summary += `${p.id}: "${p.label}"\n`;
  }

  // Plants - compact
  const plants = nodesByType['Plant'] || [];
  summary += `\nPLANTS (${plants.length}):\n`;
  for (const pl of plants) {
    summary += `${pl.id}: "${pl.label}"\n`;
  }

  // Deliveries - just count and customer mapping
  summary += `\nDELIVERIES (${(nodesByType['Delivery'] || []).length})\n`;
  summary += `INVOICES (${(nodesByType['Invoice'] || []).length})\n`;
  summary += `PAYMENTS (${(nodesByType['Payment'] || []).length})\n`;
  summary += `ADDRESSES (${(nodesByType['Address'] || []).length})\n`;

  // Edge counts
  summary += `\nRELATIONSHIP COUNTS:\n`;
  for (const [type, count] of Object.entries(edgesByType)) {
    summary += `${type}: ${count}\n`;
  }

  return summary;
}

const dataSummary = buildDataSummary();

const SYSTEM_INSTRUCTION = `You are GraphMind, an SAP Order-to-Cash data assistant.

SCHEMA: Customer(BP-), SalesOrder(SO-), Delivery(DEL-), Invoice(INV-), Payment(PAY-), Product(PROD-), Address(ADDR-), Plant(PLANT-)
EDGES: Customer-PLACED_ORDER->SalesOrder, Customer-LOCATED_AT->Address, SalesOrder-CONTAINS_ITEM->Product, SalesOrder-DELIVERED_BY->Delivery, Delivery-SHIPS_FROM->Plant, Delivery-INVOICED_BY->Invoice, Invoice-PAID_BY->Payment, Invoice-CANCELLED_BY->Invoice

DATA:
${dataSummary}

RULES:
1. Answer ONLY from the dataset. Decline unrelated queries.
2. Return JSON: {"text": "markdown answer", "highlightedNodes": ["ID1","ID2"]}
3. Use node IDs (e.g. BP-320000083, SO-740556) in highlightedNodes.`;

export async function queryGraph(prompt: string) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2048,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "{}";
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error querying Groq:", error);
    return {
      text: "Sorry, I encountered an error processing your request.",
      highlightedNodes: [],
    };
  }
}
