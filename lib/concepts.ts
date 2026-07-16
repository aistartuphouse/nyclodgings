// The disciplines the boot camp teaches. Each gets a 3D glyph in the hero
// orbit and a one-line, plain-language definition shown on hover/click.

export type GlyphKind =
  | "torus"
  | "layers"
  | "terminal"
  | "graph"
  | "cube"
  | "knot"
  | "cluster"
  | "gauge"
  | "cylinder"
  | "ring";

export interface Concept {
  term: string;
  definition: string;
  glyph: GlyphKind;
}

export const CONCEPTS: Concept[] = [
  {
    term: "loop engineering",
    definition: "Designing the feedback loops an agent runs in: plan, act, check, repeat.",
    glyph: "torus",
  },
  {
    term: "context engineering",
    definition: "Feeding a model the right information at the right moment, and nothing else.",
    glyph: "layers",
  },
  {
    term: "prompt engineering",
    definition: "Writing instructions a model can actually follow.",
    glyph: "terminal",
  },
  {
    term: "agentic workflows",
    definition: "Chaining model calls and tools into processes that finish real work.",
    glyph: "graph",
  },
  {
    term: "agentic coding",
    definition: "Letting agents write and refactor code under your review.",
    glyph: "cube",
  },
  {
    term: "vibe coding",
    definition: "Building software by describing what you want and steering the output.",
    glyph: "knot",
  },
  {
    term: "multi-agent systems",
    definition: "Several agents splitting one job: planner, worker, critic.",
    glyph: "cluster",
  },
  {
    term: "evals",
    definition: "Measuring whether the system actually got better.",
    glyph: "gauge",
  },
  {
    term: "RAG",
    definition: "Retrieval-augmented generation: grounding answers in your own data.",
    glyph: "cylinder",
  },
  {
    term: "MCP",
    definition: "Model Context Protocol: a standard socket for plugging tools into models.",
    glyph: "ring",
  },
];
