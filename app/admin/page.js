'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Link as LinkIcon, ExternalLink, Calendar, MousePointer2 } from 'lucide-react';

export default function AdminPage() {
    const [links, setLinks] = useState([]);
    const [selectedLink, setSelectedLink] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch all links on mount
    useEffect(() => {
        fetch('/api/admin/links')
            .then(res => res.json())
            .then(data => {
                setLinks(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    // Fetch analytics when a link is selected
    useEffect(() => {
        if (!selectedLink) return;

        fetch(`/api/analytics/${selectedLink.short_code}`)
            .then(res => res.json())
            .then(data => setAnalytics(data))
            .catch(err => console.error(err));
    }, [selectedLink]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex overflow-hidden font-sans">
            {/* Sidebar: List of Links */}
            <aside className="w-80 border-r border-slate-800 flex flex-col bg-slate-900/50 backdrop-blur-xl">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 flex items-center gap-2">
                        <BarChart3 className="text-purple-500" /> Vibe Admin
                    </h1>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 p-2 space-y-1">
                    {loading ? (
                        <div className="p-4 text-center text-slate-500 animate-pulse">Loading links...</div>
                    ) : links.length === 0 ? (
                        <div className="p-4 text-center text-slate-500">No links created yet.</div>
                    ) : (
                        links.map(link => (
                            <button
                                key={link.id}
                                onClick={() => { setSelectedLink(link); setAnalytics(null); }}
                                className={`w-full text-left p-4 rounded-xl transition-all duration-200 border border-transparent ${selectedLink?.id === link.id
                                        ? 'bg-purple-500/10 border-purple-500/50 shadow-lg shadow-purple-500/10'
                                        : 'hover:bg-slate-800/50 hover:border-slate-700'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-mono text-purple-400 font-medium">/{link.short_code}</span>
                                    <span className="text-xs text-slate-500">{new Date(link.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="text-xs text-slate-400 truncate w-full opacity-70">
                                    {link.original_url}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </aside>

            {/* Main Content: Details */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                    {selectedLink ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={selectedLink.id}
                            className="max-w-4xl mx-auto space-y-8"
                        >
                            {/* Header */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-3xl font-bold text-white">/{selectedLink.short_code}</h2>
                                    <a
                                        href={selectedLink.original_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4 text-slate-400" />
                                    </a>
                                </div>
                                <p className="text-slate-400 break-all">{selectedLink.original_url}</p>
                            </div>

                            {/* Grid Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                                    <div className="flex items-center gap-3 mb-2 text-slate-400">
                                        <MousePointer2 className="w-5 h-5 text-purple-400" />
                                        <span className="text-sm font-medium">Total Clicks</span>
                                    </div>
                                    <div className="text-4xl font-bold text-white">
                                        {analytics ? analytics.clickCount : '...'}
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                                    <div className="flex items-center gap-3 mb-2 text-slate-400">
                                        <Calendar className="w-5 h-5 text-blue-400" />
                                        <span className="text-sm font-medium">Created</span>
                                    </div>
                                    <div className="text-xl font-bold text-white">
                                        {new Date(selectedLink.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {/* Logs Table */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-200">Recent Activity</h3>
                                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                                            <tr>
                                                <th className="px-6 py-4">Time</th>
                                                <th className="px-6 py-4">IP Address</th>
                                                <th className="px-6 py-4">Browser / Device</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {analytics && analytics.logs.length > 0 ? (
                                                analytics.logs.map((log, i) => (
                                                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                                                        <td className="px-6 py-4 font-mono text-slate-400">
                                                            {new Date(log.accessed_at).toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 font-mono text-purple-300">
                                                            {log.ip_address || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-300">
                                                            {log.browser}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                                                        {analytics ? 'No clicks recorded yet.' : 'Loading activity...'}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center">
                                <LinkIcon className="w-8 h-8 opacity-50" />
                            </div>
                            <p className="text-lg">Select a link from the sidebar to view details</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
