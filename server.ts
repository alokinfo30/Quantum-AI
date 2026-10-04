import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support base64 image data payload for multimodal vision
  app.use(express.json({ limit: "25mb" }));

  // Initialize Gemini API
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // System persona instructions for 2026 Quantum AI
  const getSystemInstruction = (mode: string = "deep_reasoning") => {
    switch (mode) {
      case "code_architect":
        return `You are Quantum AI: Code & Circuit Architect (v2026.4). 
You specialize in quantum computing algorithms, Qiskit, Cirq, Pennylane, CUDA-Q, high-performance simulation code, and mathematical state derivations. 
When providing code or circuit representations, explain gate depth, unitary transformations, coherence requirements, and provide runnable clean code with explanations.`;

      case "multiverse":
        return `You are Quantum AI: Multiverse Simulator & Counterfactual Engine.
Analyze questions across parallel theoretical realities and divergent timeline trajectories. For every inquiry, evaluate the principal timeline as well as 2 plausible counterfactual branch universes where physical constants, historical discoveries, or quantum decoherence thresholds differ. Speak with scientific rigor and imaginative depth.`;

      case "bio_quantum":
        return `You are Quantum AI: Nano-Bio & Material Quantum Synthesizer.
Specializing in Variational Quantum Eigensolvers (VQE), molecular orbital simulations, room-temperature superconductor lattices, quantum biology (e.g., avian magnetoreception, cryptochrome tunneling), and quantum-assisted enzyme modeling. Provide detailed molecular notations and energy surface calculations.`;

      case "voice_agent":
        return `You are Quantum AI: Holographic Voice Intelligence.
You are in real-time conversational voice mode. Deliver concise, vivid, conversational yet technically brilliant answers. Keep sentences fluid, engaging, and easy to listen to when synthesized via speech. Avoid large code blocks unless explicitly requested; favor intuitive verbal analogies and crisp summaries.`;

      case "deep_reasoning":
      default:
        return `You are Quantum AI (2026 Autonomous Neural Core), an advanced quantum intelligence assistant.
Your capabilities span quantum physics, high-dimensional reasoning, cryptography, and general intelligence.
Format your responses with clarity and precision:
1. Always exhibit deep reasoning, explaining intermediate states, superposition considerations, or probability distributions where relevant.
2. If mathematical derivations or code are relevant, format them with clean Markdown and clear variable definitions.
3. Be helpful, visionary, and technically sound.`;
    }
  };

  // Helper to extract or craft quantum thinking trace
  const generateThinkingTrace = (mode: string, query: string) => {
    const truncatedQuery = query.slice(0, 45).replace(/[\r\n]+/g, ' ');
    const steps = [
      `Initializing Hilbert state vector |ψ⟩ for query: "${truncatedQuery}..."`,
      `Evaluating superposition across 1,024 orthogonal probability branches.`,
      `Applying phase estimation & checking decoherence thresholds (fidelity: 99.98%).`,
      `Eliminating destructive interference channels and converging on optimal eigenstate.`
    ];
    return steps;
  };

  // 1. Core Chat Endpoint (supports text, multimodal image, grounding, personas)
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, mode = "deep_reasoning", enableSearch = false, image } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not set" });
      }

      const systemInstruction = getSystemInstruction(mode);

      // Build contents
      let currentTurnParts: any[] = [];

      if (image && image.data && image.mimeType) {
        currentTurnParts.push({
          inlineData: {
            mimeType: image.mimeType,
            data: image.data,
          }
        });
      }

      currentTurnParts.push({ text: message || "Analyze the attached quantum observation." });

      let contents: any;
      if (history && Array.isArray(history) && history.length > 0) {
        contents = [
          ...history.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: currentTurnParts }
        ];
      } else {
        contents = { parts: currentTurnParts };
      }

      // Model configuration
      const config: any = {
        systemInstruction,
      };

      if (enableSearch) {
        config.tools = [{ googleSearch: {} }];
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config,
      });

      const responseText = response.text || "";

      // Extract search grounding citations if available
      let groundingSources: Array<{ title: string; url: string }> = [];
      const candidates = response.candidates;
      if (candidates && candidates[0]?.groundingMetadata?.groundingChunks) {
        for (const chunk of candidates[0].groundingMetadata.groundingChunks) {
          if (chunk.web?.uri) {
            groundingSources.push({
              title: chunk.web.title || new URL(chunk.web.uri).hostname,
              url: chunk.web.uri,
            });
          }
        }
      }

      // Deduplicate sources
      groundingSources = groundingSources.filter(
        (src, idx, arr) => arr.findIndex(s => s.url === src.url) === idx
      );

      // Synthetic 2026 reasoning trajectory
      const thinkingSteps = generateThinkingTrace(mode, message);

      res.json({
        text: responseText,
        thinking: thinkingSteps,
        groundingSources,
        mode,
      });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to generate AI response", details: error.message });
    }
  });

  // 2. Prompt Enhancer (Superposition Expander)
  app.post("/api/enhance-prompt", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `You are the Quantum AI Prompt Engineering Engine. Transform this brief user prompt into a high-dimensional, sophisticated prompt designed for deep reasoning, mathematical accuracy, and comprehensive analysis in 2026. Only return the enhanced prompt text, nothing else.
Input prompt: "${prompt}"`,
      });

      res.json({ enhancedPrompt: response.text?.trim() || prompt });
    } catch (error: any) {
      console.error("Prompt Enhancement Error:", error);
      res.status(500).json({ error: "Failed to enhance prompt", details: error.message });
    }
  });

  // 3. Multiverse Forking Endpoint (3 parallel timeline branches)
  app.post("/api/fork-multiverse", async (req, res) => {
    try {
      const { context, topic } = req.body;

      const prompt = `Context: "${context || topic}".
As the Quantum Multiverse Engine, formulate 3 distinct divergent probability timelines that explore counterfactual realities, alternative scientific paradigms, or unexpected ramifications.
Provide output in JSON format with an array named "branches", each having:
- "timelineName": Short title e.g. "Timeline Alpha: Topological Dominance"
- "probability": e.g. "42.8%"
- "divergencePoint": The critical event or parameter shift
- "outcome": A concise 2-sentence summary of that timeline.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      let branches = [];
      try {
        const parsed = JSON.parse(response.text || "{}");
        branches = parsed.branches || parsed;
      } catch {
        branches = [
          { timelineName: "Timeline Alpha: Superposition Cascade", probability: "54%", divergencePoint: "Threshold reached via neutral atom arrays", outcome: "Fault-tolerant qubits enabled room-temperature lattice computing." },
          { timelineName: "Timeline Beta: Decoherence Trap", probability: "31%", divergencePoint: "Cosmic muon interference stalled superconducting systems", outcome: "Researchers pivoted toward photonic quantum topological braid systems." },
          { timelineName: "Timeline Gamma: Symbiotic Coherence", probability: "15%", divergencePoint: "Biological quantum tunneling bridged with synthetic processors", outcome: "Hybrid bio-quantum architectures solved molecular folding in milliseconds." }
        ];
      }

      res.json({ branches });
    } catch (error: any) {
      console.error("Multiverse Fork Error:", error);
      res.status(500).json({ error: "Failed to fork multiverse", details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
