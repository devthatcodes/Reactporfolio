import React, { useState, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';
import { Check, Copy, Play, Terminal } from 'lucide-react';
import ScrambleText from './ScrambleText';
import { playHover, playClick } from '../utils/soundEngine';

const SNIPPETS = {
  TypeScript: {
    filename: 'gateway.ts',
    code: `import { Aether } from '@aether-ai/sdk';

const aether = new Aether({
  apiKey: process.env.AETHER_API_KEY,
  cache: { semantic: true, threshold: 0.95 },
  fallback: ['anthropic/claude-3-5-sonnet', 'openai/gpt-4o'],
});

const response = await aether.chat.completions.create({
  model: 'openai/gpt-4o',
  messages: [{ role: 'user', content: 'Analyze Q3 latency spikes' }],
  metadata: { env: 'production', team: 'core-infra' },
});

console.log(response.traceId, response.cacheStatus);`,
  },
  Python: {
    filename: 'gateway.py',
    code: `import os
from aether_ai import Aether

client = Aether(
    api_key=os.environ["AETHER_API_KEY"],
    cache={"semantic": True, "threshold": 0.95},
    fallback=["anthropic/claude-3-5-sonnet", "openai/gpt-4o"],
)

response = client.chat.completions.create(
    model="openai/gpt-4o",
    messages=[{"role": "user", "content": "Analyze Q3 latency spikes"}],
    metadata={"env": "production", "team": "core-infra"},
)

print(response.trace_id, response.cache_status)`,
  },
  cURL: {
    filename: 'request.sh',
    code: `curl -X POST https://edge.aether.dev/v1/chat/completions \\
  -H "Authorization: Bearer $AETHER_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-Aether-Cache: semantic;threshold=0.95" \\
  -d '{
    "model": "openai/gpt-4o",
    "fallback": ["anthropic/claude-3-5-sonnet"],
    "messages": [
      { "role": "user", "content": "Analyze Q3 latency spikes" }
    ]
  }'`,
  },
};

export default function SdkSwitcher() {
  const [activeTab, setActiveTab] = useState('TypeScript');
  const [copied, setCopied] = useState(false);
  const [testOutput, setTestOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Left copy column scroll parallax (pure GPU y)
  const leftY = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -25]);

  // Right code terminal scroll parallax (pure GPU y & scale)
  const rightY = useTransform(scrollYProgress, [0, 0.45, 1], [50, 0, -40]);
  const rightScale = useTransform(scrollYProgress, [0, 0.3, 0.85, 1], [0.96, 1, 1, 0.97]);

  const handleCopy = () => {
    playClick();
    navigator.clipboard?.writeText(SNIPPETS[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleRunTest = () => {
    playClick();
    setRunning(true);
    setTestOutput(null);
    setTimeout(() => {
      setRunning(false);
      setTestOutput({
        id: 'chatcmpl_ae_98f2a41c',
        traceId: 'tr_01J9X7K2M4N8P',
        provider: 'edge-semantic-cache',
        cacheStatus: 'HIT (cosine: 0.964)',
        latencyMs: 11,
        tokensSaved: 412,
      });
    }, 450);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 8,
      ry: (px - 0.5) * 8,
    });
  };

  return (
    <section
      id="sdk"
      ref={sectionRef}
      className="relative border-t border-[#27272A]/80 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          style={{ perspective: '1400px' }}
          className="grid items-center gap-12 lg:grid-cols-12"
        >
          {/* Left Copy with Scroll Parallax */}
          <motion.div
            style={{
              y: leftY,
            }}
            className="lg:col-span-5 will-change-transform"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400">
              04 // DROP-IN SDK SANDBOX
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#FAFAFA] sm:text-4xl">
              <ScrambleText
                text="Two lines to full observability."
                scrambleOnMount={false}
              />
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">
              Swap your base URL or drop in the Aether SDK. Works seamlessly with your existing OpenAI, Anthropic, and LangChain workflows with zero vendor lock-in.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-zinc-300">
              {[
                '100% OpenAI-compatible REST & streaming schema',
                'Automatic OpenTelemetry span export to Datadog & Grafana',
                'Sub-10ms edge routing across 32 global PoPs',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400">
                    <Check className="h-3 w-3" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Interactive Code Block with Counter-Parallax */}
          <motion.div
            style={{
              y: rightY,
              scale: rightScale,
            }}
            className="lg:col-span-7 will-change-transform"
          >
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
              style={{
                transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              }}
              className="overflow-hidden rounded-2xl border border-[#27272A] bg-[#090D16]/95 shadow-[0_30px_80px_rgba(0,0,0,0.85)] transition-colors duration-200 hover:border-cyan-400/50"
            >
              {/* Header Bar with Framer Motion layoutId tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#27272A] bg-[#09090B]/80 px-4 py-3">
                <div className="flex items-center gap-1 rounded-lg border border-[#27272A] bg-[#111115] p-1">
                  {Object.keys(SNIPPETS).map((lang) => {
                    const isActive = activeTab === lang;
                    return (
                      <button
                        key={lang}
                        type="button"
                        onMouseEnter={playHover}
                        onClick={() => {
                          playClick();
                          setActiveTab(lang);
                        }}
                        className={`relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isActive
                            ? 'text-[#FAFAFA]'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="sdk-pill"
                            transition={{
                              type: 'spring',
                              stiffness: 380,
                              damping: 30,
                            }}
                            className="absolute inset-0 rounded-md bg-[#27272A]"
                          />
                        )}
                        <span className="relative z-10">{lang}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    data-cursor="[ EXECUTE REQUEST ]"
                    onMouseEnter={playHover}
                    onClick={handleRunTest}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 font-mono text-[11px] font-medium text-cyan-300 transition-colors hover:bg-cyan-400/20"
                  >
                    <Play className="h-3 w-3" />
                    <span>{running ? 'Running...' : 'Test Request'}</span>
                  </button>

                  <button
                    type="button"
                    onMouseEnter={playHover}
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#27272A] bg-[#111115] px-3 py-1.5 font-mono text-[11px] text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code Content */}
              <div className="relative overflow-x-auto p-5">
                <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="h-3 w-3" />
                    <span>{SNIPPETS[activeTab].filename}</span>
                  </span>
                  <span className="text-[10px] text-cyan-400/70">
                    3D TERMINAL // Z-SYNCED
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.pre
                    key={activeTab}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="font-mono text-xs leading-relaxed text-zinc-200 sm:text-[13px]"
                  >
                    <code>{SNIPPETS[activeTab].code}</code>
                  </motion.pre>
                </AnimatePresence>
              </div>

              {/* Simulated Telemetry Response Drawer */}
              <AnimatePresence>
                {testOutput && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[#27272A] bg-[#09090B] px-5 py-3.5"
                  >
                    <div className="mb-1.5 flex items-center justify-between font-mono text-[11px]">
                      <span className="text-emerald-400">200 OK • Edge Response</span>
                      <span className="text-zinc-500">{testOutput.latencyMs}ms</span>
                    </div>
                    <pre className="overflow-x-auto font-mono text-[11px] text-cyan-300">
                      {JSON.stringify(testOutput, null, 2)}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
