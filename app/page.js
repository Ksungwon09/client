const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);
if (!mounted) return null; // 마운트 전에는 로딩 UI 혹은 빈 화면 출력
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Sparkles, Zap } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortCode, setShortCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [origin, setOrigin] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hostname = window.location.hostname;
    if (hostname.includes('igise.site')) {
      setOrigin('https://link.igise.site');
    } else {
      setOrigin(window.location.origin);
    }
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#050511]" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortCode(null);

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error('Failed to shorten URL');
      const data = await res.json();
      setShortCode(data.shortCode);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${origin}/${shortCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050511] font-sans selection:bg-purple-500/30">

      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,27,0)_0%,#050511_100%),linear-gradient(90deg,rgba(50,50,70,0.1)_1px,transparent_1px),linear-gradient(rgba(50,50,70,0.1)_1px,transparent_1px)] bg-[size:40px_40px] perspective-[500px]" />

      {/* Aurora Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] bg-blue-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative z-10 w-full max-w-xl mx-4"
      >
        {/* Main Glass Card */}
        <div className="glass rounded-[2rem] p-1 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)]">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-[1.8rem] p-8 md:p-12 relative overflow-hidden">

            {/* Neon Border Effect */}
            <div className="absolute inset-0 rounded-[1.8rem] border border-blue-500/20 pointer-events-none" />

            {/* Header */}
            <div className="text-center mb-10 space-y-2">
              <motion.h1
                className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#d946ef] via-[#8b5cf6] to-[#3b82f6] drop-shadow-lg tracking-tight"
                animate={{ backgroundPosition: ['0%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              >
                Vibe Link.
              </motion.h1>
              <p className="text-slate-400 text-sm tracking-widest uppercase opacity-70 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Premium URL Shortener
                <Sparkles className="w-4 h-4 text-purple-400" />
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group relative">
                <input
                  type="url"
                  placeholder="Paste your long link here..."
                  className="input-neon w-full h-14 rounded-xl px-5 text-slate-200 placeholder:text-slate-500 outline-none text-lg font-medium tracking-wide"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />

                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-neon w-full h-14 rounded-xl text-white font-bold text-lg tracking-wide shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Shorten It <Zap className="w-5 h-5 group-hover:fill-yellow-400 group-hover:text-yellow-400 transition-all" />
                  </>
                )}
              </button>
            </form>

            <AnimatePresence>
              {error && (
                <motion.div
                  key="error-message"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-center mt-4 text-sm font-medium"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result Selection */}
            <AnimatePresence>
              {shortCode && (
                <motion.div
                  key="result-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 pt-8 border-t border-slate-700/50"
                >
                  <p className="text-center text-green-400 font-medium mb-4 text-sm tracking-wide">
                    Your Vibe Link is ready! 🚀
                  </p>

                  <div className="bg-slate-900/80 rounded-xl p-2 flex items-center gap-2 border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex-1 px-4 py-2 font-mono text-slate-300 truncate">
                      <span className="text-slate-500">{origin}/</span>
                      <span className="text-purple-400 font-bold">{shortCode}</span>
                    </div>

                    <button
                      onClick={copyToClipboard}
                      className={`p-3 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${copied
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <div className="text-center mt-4">
                    <div className="h-1 w-20 bg-gradient-to-r from-transparent via-slate-700 to-transparent mx-auto" />
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-8">
          Created with Vibe Engine v1.0 • <a href="/admin" className="hover:text-purple-500 transition-colors">Admin Access</a>
        </p>
      </motion.div>
    </main>
  );
}
