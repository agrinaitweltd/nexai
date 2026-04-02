import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bot, Send, ImagePlus, X, Leaf, AlertTriangle, CheckCircle2,
  Clock, Lightbulb, CloudRain, TrendingUp, Sprout, Microscope,
  Camera, ChevronRight, RefreshCw, RotateCcw, Copy,
  AlertCircle, Info, Upload
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// ── Types ─────────────────────────────────────────────────────────────────────

type Role = 'user' | 'assistant';

interface Message {
  id: string;
  role: Role;
  text: string;
  imageUrl?: string;
  timestamp: Date;
  structured?: StructuredResponse;
  loading?: boolean;
  error?: string;
}

interface StructuredResponse {
  crop?: string;
  problem?: string;
  confidence?: string;
  action?: string;
  urgency?: 'Low' | 'Medium' | 'High' | 'Critical';
  advice?: string;
  raw?: string;
}

// ── System Prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are NexaAI — a smart agricultural assistant integrated into the NexaAgri platform. You help farmers, exporters, and agri-business users in Africa (especially Uganda and East Africa) make better decisions.

CORE RESPONSIBILITIES:
1. IMAGE ANALYSIS: When given a photo of a crop, leaf, fruit, soil, or livestock — identify the subject, detect diseases/pests/abnormalities, diagnose the problem, and recommend actionable solutions.
2. FARM ADVISORY: Give practical, locally-relevant advice on planting, harvesting, fertilization, and irrigation tailored to East African growing conditions and climate.
3. MARKET INTELLIGENCE: Advise on whether to sell now or wait, which markets to target (local vs export), and flag price opportunities or risks.
4. SIMPLE LANGUAGE: Always use simple, clear language suitable for farmers who may not have advanced education. Avoid heavy scientific jargon.

ALWAYS structure your response EXACTLY in this format (use these exact headings):

**Crop / Item Identified:** [what you see]
**Problem Detected:** [disease, pest, condition, or "None detected — crop appears healthy"]
**Confidence Level:** [e.g., High (92%) / Medium (70%) / Low — needs more info]
**Recommended Action:** [clear, step-by-step advice]
**Urgency Level:** [Low / Medium / High / Critical]
**Additional Advice:** [extra tips, prevention, local resources, or market advice]

If you are not fully certain about an image diagnosis, say: "I am not fully certain, but it may be…" and recommend consulting a local agricultural extension officer for severe cases.

For non-image questions (text only), still use the structured format but adapt the headings to the context. For general farm questions, use "Topic:" instead of "Crop / Item Identified:".

Always be concise, warm, and practical. You are a trusted farm advisor available 24/7.`;

// ── Quick Prompt Templates ────────────────────────────────────────────────────

const QUICK_PROMPTS = [
  { icon: Leaf, label: 'My crop has yellow leaves', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { icon: AlertTriangle, label: 'I see white spots on leaves', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { icon: CloudRain, label: 'When should I water my maize?', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { icon: TrendingUp, label: 'Should I sell my produce now?', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { icon: Sprout, label: 'Best time to plant tomatoes?', color: 'text-green-600 bg-green-50 border-green-200' },
  { icon: Microscope, label: 'My soil looks dry and cracked', color: 'text-amber-600 bg-amber-50 border-amber-200' },
];

// ── Parse AI Response ─────────────────────────────────────────────────────────

function parseStructuredResponse(text: string): StructuredResponse {
  const get = (label: string) => {
    const regex = new RegExp(`\\*\\*${label}:\\*\\*\\s*([^\\n*]+)`, 'i');
    return text.match(regex)?.[1]?.trim() || '';
  };

  const urgency = get('Urgency Level') as StructuredResponse['urgency'];
  return {
    crop: get('Crop \\/ Item Identified') || get('Topic'),
    problem: get('Problem Detected'),
    confidence: get('Confidence Level'),
    action: get('Recommended Action'),
    urgency: ['Low','Medium','High','Critical'].includes(urgency) ? urgency : undefined,
    advice: get('Additional Advice'),
    raw: text,
  };
}

// ── Call OpenAI ───────────────────────────────────────────────────────────────

async function callOpenAI(messages: { role: string; content: any }[], apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 1200,
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response received.';
}

// ── Urgency Badge ─────────────────────────────────────────────────────────────

function UrgencyBadge({ level }: { level?: string }) {
  const map: Record<string, string> = {
    Low:      'bg-green-100 text-green-700 border-green-200',
    Medium:   'bg-yellow-100 text-yellow-700 border-yellow-200',
    High:     'bg-orange-100 text-orange-700 border-orange-200',
    Critical: 'bg-red-100 text-red-700 border-red-200 animate-pulse',
  };
  if (!level) return null;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${map[level] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {level === 'Critical' && <AlertCircle size={10} />}
      {level === 'High' && <AlertTriangle size={10} />}
      {(level === 'Medium' || level === 'Low') && <CheckCircle2 size={10} />}
      {level}
    </span>
  );
}

// ── Structured AI Card ────────────────────────────────────────────────────────

function AIResponseCard({ s }: { s: StructuredResponse }) {
  const rows = [
    { icon: Leaf,         label: 'Identified',  value: s.crop,       color: 'text-emerald-600' },
    { icon: Microscope,   label: 'Problem',     value: s.problem,    color: 'text-orange-600'  },
    { icon: Info,         label: 'Confidence',  value: s.confidence, color: 'text-blue-600'    },
    { icon: CheckCircle2, label: 'Action',      value: s.action,     color: 'text-green-600'   },
    { icon: Lightbulb,    label: 'Extra Advice',value: s.advice,     color: 'text-purple-600'  },
  ];

  return (
    <div className="mt-3 space-y-2.5">
      <div className="flex items-center gap-2 flex-wrap">
        {s.urgency && <UrgencyBadge level={s.urgency} />}
        {s.confidence && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-200 rounded-full px-2.5 py-1">
            {s.confidence}
          </span>
        )}
      </div>
      {rows.map(({ icon: Icon, label, value, color }) =>
        value ? (
          <div key={label} className="flex gap-3 bg-white border border-slate-100 rounded-xl p-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <div className={`mt-0.5 shrink-0 ${color}`}><Icon size={15} /></div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
              <p className="text-[13px] text-slate-800 leading-relaxed">{value}</p>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function AgroAI() {
  const { user } = useApp();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: '',
      timestamp: new Date(),
      structured: {
        crop: 'NexaAI — Your Farm Assistant',
        problem: 'No issues — ready to help!',
        confidence: 'Always available, 24 / 7',
        action: `Upload a photo of your crop, leaf, or livestock — or just ask your question below. I can help with disease diagnosis, pest detection, planting advice, harvest timing, and market decisions.`,
        urgency: 'Low',
        advice: `Tip: For best image results, take photos in good lighting, close to the affected area. I'll give you a full diagnosis and step-by-step advice.`,
      },
    }
  ]);

  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

  const [input, setInput]       = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging]   = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const bottomRef    = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
  };

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text && !imageFile) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      imageUrl: imagePreview || undefined,
      timestamp: new Date(),
    };

    const loadingMsg: Message = {
      id: 'loading-' + Date.now(),
      role: 'assistant',
      text: '',
      timestamp: new Date(),
      loading: true,
    };

    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setInput('');
    setImageFile(null);
    setImagePreview(null);
    if (inputRef.current) { inputRef.current.style.height = 'auto'; }
    setIsLoading(true);

    try {
      // Build OpenAI message content
      const userContent: any[] = [];
      if (imagePreview) {
        userContent.push({ type: 'image_url', image_url: { url: imagePreview, detail: 'high' } });
      }
      if (text) {
        userContent.push({ type: 'text', text });
      } else if (imagePreview) {
        userContent.push({ type: 'text', text: 'Please analyse this image and provide your full assessment in the structured format.' });
      }

      // Build conversation history (last 6 exchanges for context)
      const historyMsgs = messages
        .filter(m => !m.loading && m.id !== 'welcome')
        .slice(-12)
        .map(m => ({
          role: m.role,
          content: m.role === 'user'
            ? (m.imageUrl
                ? [{ type: 'image_url', image_url: { url: m.imageUrl, detail: 'low' } }, { type: 'text', text: m.text || '(image)' }]
                : m.text)
            : (m.structured?.raw || m.text),
        }));

      const aiText = await callOpenAI([...historyMsgs, { role: 'user', content: userContent }], API_KEY);
      const structured = parseStructuredResponse(aiText);

      setMessages(prev => prev.map(m =>
        m.loading ? { ...m, loading: false, text: aiText, structured } : m
      ));
    } catch (err: any) {
      setMessages(prev => prev.map(m =>
        m.loading ? { ...m, loading: false, text: '', error: err.message || 'Something went wrong.' } : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const handleClearChat = () => {
    setMessages([messages[0]]);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 -m-4 md:-m-8">

      {/* Header */}
      <div className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight">NexaAI Farm Assistant</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Powered by GPT-4o Vision
            </p>
          </div>
        </div>
        <button
            onClick={handleClearChat}
            title="Clear chat"
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            <RotateCcw size={15} />
          </button>
      </div>

      {/* Chat Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 md:px-8 py-5 space-y-5"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="fixed inset-0 z-50 bg-emerald-500/10 backdrop-blur-sm border-4 border-dashed border-emerald-400 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <Upload size={48} className="mx-auto text-emerald-500 mb-3" />
              <p className="text-xl font-black text-emerald-600">Drop image here</p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            {msg.role === 'assistant' && (
              <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md shadow-emerald-500/20 mt-1">
                <Bot size={14} className="text-white" />
              </div>
            )}
            {msg.role === 'user' && (
              <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-700 flex items-center justify-center shadow-sm mt-1">
                <span className="text-[11px] font-black text-white">{user?.name?.[0] || 'U'}</span>
              </div>
            )}

            {/* Bubble */}
            <div className={`max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>

              {/* User image preview */}
              {msg.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm mb-1.5">
                  <img src={msg.imageUrl} alt="Uploaded" className="max-w-[260px] max-h-[200px] w-full object-cover" />
                </div>
              )}

              {/* Message body */}
              {(msg.text || msg.loading || msg.error) && (
                <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-slate-900 dark:bg-slate-700 text-white rounded-tr-sm'
                    : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-sm'
                }`}>
                  {msg.loading ? (
                    <div className="flex items-center gap-2 py-1">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Analysing...</span>
                    </div>
                  ) : msg.error ? (
                    <div className="flex items-start gap-2 text-red-500">
                      <AlertCircle size={14} className="mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-widest mb-1">Error</p>
                        <p className="text-sm">{msg.error}</p>
                      </div>
                    </div>
                  ) : msg.role === 'user' ? (
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  ) : null}
                </div>
              )}

              {/* Structured AI Response */}
              {msg.role === 'assistant' && !msg.loading && msg.structured && (
                <div className="w-full">
                  <AIResponseCard s={msg.structured} />
                </div>
              )}

              {/* Timestamp + actions */}
              {!msg.loading && msg.id !== 'welcome' && (
                <div className={`flex items-center gap-2 mt-1 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.role === 'assistant' && (msg.structured?.raw || msg.text) && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.structured?.raw || msg.text)}
                      className="text-[9px] font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest flex items-center gap-1 transition-colors"
                    >
                      {copiedId === msg.id ? <CheckCircle2 size={10} className="text-emerald-500" /> : <Copy size={10} />}
                      {copiedId === msg.id ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts (show only when chat is empty/starting) */}
      {messages.length <= 1 && (
        <div className="shrink-0 px-4 md:px-8 pb-3">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Quick Questions</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                onClick={() => handleQuickPrompt(label)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-bold transition-all active:scale-95 hover:shadow-sm ${color}`}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <div className="shrink-0 px-4 md:px-8 pb-2">
          <div className="relative inline-block">
            <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-xl border-2 border-emerald-400 shadow-md" />
            <button
              onClick={() => { setImageFile(null); setImagePreview(null); }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
            >
              <X size={10} />
            </button>
            <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm rounded-lg px-1.5 py-0.5">
              <span className="text-[9px] font-bold text-white uppercase tracking-wide">Ready</span>
            </div>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="shrink-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 md:px-8 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-end gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload crop / plant image"
            className="shrink-0 w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all active:scale-95"
          >
            <ImagePlus size={18} />
          </button>
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your crops, pests, planting, or upload a photo..."
              rows={1}
              className="w-full resize-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/40 transition-all leading-relaxed pr-4 min-h-[42px] max-h-[140px] overflow-y-auto scrollbar-hide"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !imageFile)}
            className="shrink-0 w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 disabled:shadow-none transition-all active:scale-95 disabled:cursor-not-allowed"
          >
            {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center mt-2">
          Press Enter to send · Shift+Enter for new line · Drag &amp; drop images
        </p>
      </div>

    </div>
  );
}
