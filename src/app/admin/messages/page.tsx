'use client';

import { useEffect, useState } from 'react';
import { getContactMessages, updateShopSettings } from '@/lib/firestore';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ContactMessage } from '@/types';
import { format } from 'date-fns';
import { FiMail, FiCheck, FiUser, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const loadMessages = async () => {
    setLoading(true);
    const msgs = await getContactMessages();
    setMessages(msgs);
    setLoading(false);
  };

  useEffect(() => { loadMessages(); }, []);

  const markRead = async (msg: ContactMessage) => {
    if (msg.status !== 'new' || !msg.id) return;
    await updateDoc(doc(db, 'contact', msg.id), { status: 'read' });
    setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, status: 'read' } : m));
  };

  const statusColors: Record<string, string> = {
    new: '#f59e0b',
    read: '#7c3aed',
    replied: '#00ff88',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-gaming font-bold text-2xl text-white">MESSAGES</h1>
        <div className="text-sm text-gray-400 font-gaming">
          {messages.filter((m) => m.status === 'new').length} new
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-neon-green font-gaming animate-pulse">Loading...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16 gaming-card rounded-2xl">
          <FiMail size={50} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-gaming">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`gaming-card rounded-xl p-4 cursor-pointer hover:border-neon-green/30 transition-all ${
                msg.status === 'new' ? 'border-yellow-500/30' : ''
              }`}
              onClick={() => { setSelected(msg); markRead(msg); }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white text-sm">{msg.name}</span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-gaming uppercase"
                      style={{ color: statusColors[msg.status], background: `${statusColors[msg.status]}20` }}
                    >
                      {msg.status}
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs mb-1">{msg.email}</div>
                  <div className="text-gray-300 text-sm font-semibold truncate">{msg.subject}</div>
                  <div className="text-gray-500 text-xs truncate mt-0.5">{msg.message}</div>
                </div>
                <div className="text-xs text-gray-500 flex-shrink-0">
                  {msg.createdAt ? format(msg.createdAt.toDate(), 'dd MMM HH:mm') : 'N/A'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="gaming-card rounded-2xl w-full max-w-lg border border-dark-border overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-neon-green to-neon-blue" />
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <h3 className="font-gaming font-bold text-white">MESSAGE DETAIL</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white">✕</button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <FiUser size={13} className="text-neon-green" />
                  <span className="text-white font-semibold">{selected.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FiMail size={13} className="text-neon-blue" />
                  <a href={`mailto:${selected.email}`} className="text-neon-blue hover:underline">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <FiPhone size={13} className="text-neon-purple" />
                    <a href={`tel:${selected.phone}`} className="text-white">{selected.phone}</a>
                  </div>
                )}
                {selected.subject && (
                  <div className="font-gaming font-bold text-white text-sm">{selected.subject}</div>
                )}
                <div className="p-4 rounded-xl bg-dark-surface border border-dark-border text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>
                <div className="text-xs text-gray-500">
                  {selected.createdAt ? format(selected.createdAt.toDate(), 'dd MMM yyyy HH:mm') : 'N/A'}
                </div>
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message to Zaib Gaming Zone'}`}
                  className="btn-neon inline-flex items-center gap-2 text-xs"
                >
                  <FiMail size={13} /> Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
