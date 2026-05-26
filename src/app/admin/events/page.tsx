'use client';

import { useEffect, useState } from 'react';
import { subscribeEvents, addEvent, updateEvent, deleteEvent } from '@/lib/firestore';
import type { Event, EventRule, EventPrize } from '@/types';
import { Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { FiPlus, FiTrash2, FiEdit2, FiX } from 'react-icons/fi';
import { GiTrophy } from 'react-icons/gi';
import CloudinaryUpload from '@/components/CloudinaryUpload';

const emptyEvent = {
  title: '',
  game: '',
  description: '',
  dateStr: '',
  time: '',
  entryFee: 0,
  maxParticipants: 16,
  rules: [] as EventRule[],
  prizes: [] as EventPrize[],
  status: 'upcoming' as Event['status'],
  imageUrl: '',
  consoleType: '',
};

function EventForm({ initial, onSave, onCancel }: {
  initial?: Partial<typeof emptyEvent>;
  onSave: (data: typeof emptyEvent) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...emptyEvent, ...initial });
  const [saving, setSaving] = useState(false);
  const [newRule, setNewRule] = useState('');
  const [newPrize, setNewPrize] = useState({ position: '', prize: '' });

  const addRule = () => {
    if (!newRule.trim()) return;
    setForm({ ...form, rules: [...form.rules, { id: uuidv4(), rule: newRule.trim() }] });
    setNewRule('');
  };

  const addPrize = () => {
    if (!newPrize.position || !newPrize.prize) return;
    setForm({ ...form, prizes: [...form.prizes, newPrize] });
    setNewPrize({ position: '', prize: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="gaming-card rounded-2xl p-6 border border-neon-purple/30 space-y-4">
      <h3 className="font-gaming font-bold text-white text-lg">
        {initial ? 'EDIT EVENT' : 'NEW EVENT'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400 font-gaming mb-1 block">Title *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-neon text-sm py-2" placeholder="Tournament name" required />
        </div>
        <div>
          <label className="text-xs text-gray-400 font-gaming mb-1 block">Game *</label>
          <input value={form.game} onChange={(e) => setForm({ ...form, game: e.target.value })}
            className="input-neon text-sm py-2" placeholder="e.g. FC 25" required />
        </div>
        <div>
          <label className="text-xs text-gray-400 font-gaming mb-1 block">Date *</label>
          <input type="date" value={form.dateStr} onChange={(e) => setForm({ ...form, dateStr: e.target.value })}
            className="input-neon text-sm py-2" required />
        </div>
        <div>
          <label className="text-xs text-gray-400 font-gaming mb-1 block">Time</label>
          <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="input-neon text-sm py-2" placeholder="e.g. 5:00 PM" />
        </div>
        <div>
          <label className="text-xs text-gray-400 font-gaming mb-1 block">Entry Fee (Rs.)</label>
          <input type="number" value={form.entryFee} onChange={(e) => setForm({ ...form, entryFee: Number(e.target.value) })}
            className="input-neon text-sm py-2" />
        </div>
        <div>
          <label className="text-xs text-gray-400 font-gaming mb-1 block">Max Participants</label>
          <input type="number" value={form.maxParticipants} onChange={(e) => setForm({ ...form, maxParticipants: Number(e.target.value) })}
            className="input-neon text-sm py-2" />
        </div>
        <div>
          <label className="text-xs text-gray-400 font-gaming mb-1 block">Console Type</label>
          <input value={form.consoleType} onChange={(e) => setForm({ ...form, consoleType: e.target.value })}
            className="input-neon text-sm py-2" placeholder="e.g. PS5" />
        </div>
        <div>
          <label className="text-xs text-gray-400 font-gaming mb-1 block">Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Event['status'] })}
            className="input-neon text-sm py-2">
            {['upcoming', 'ongoing', 'completed', 'cancelled'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-400 font-gaming mb-1 block">Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input-neon text-sm resize-none" rows={2} />
      </div>
      <div>
        <label className="text-xs text-gray-400 font-gaming mb-1 block">Event Image (optional)</label>
        <CloudinaryUpload
          folder="zaib-gaming/events"
          label="Upload Event / Tournament Image"
          aspectHint="Recommended: 16:9 or square"
          currentUrl={form.imageUrl}
          onUpload={(result) => setForm({ ...form, imageUrl: result.url })}
          onRemove={() => setForm({ ...form, imageUrl: '' })}
        />
      </div>

      {/* Rules */}
      <div>
        <label className="text-xs text-gray-400 font-gaming mb-2 block">Rules</label>
        <div className="flex gap-2 mb-2">
          <input value={newRule} onChange={(e) => setNewRule(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
            className="input-neon text-xs py-1.5 flex-1" placeholder="Add a rule..." />
          <button type="button" onClick={addRule} className="btn-outline-neon text-xs px-3 py-1.5">
            <FiPlus size={13} />
          </button>
        </div>
        <div className="space-y-1">
          {form.rules.map((rule, i) => (
            <div key={rule.id} className="flex items-center gap-2 text-xs text-gray-300 p-2 rounded-lg bg-dark-surface">
              <span className="text-neon-green">{i + 1}.</span>
              <span className="flex-1">{rule.rule}</span>
              <button type="button" onClick={() => setForm({ ...form, rules: form.rules.filter((r) => r.id !== rule.id) })}>
                <FiX size={11} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Prizes */}
      <div>
        <label className="text-xs text-gray-400 font-gaming mb-2 block">Prizes</label>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input value={newPrize.position} onChange={(e) => setNewPrize({ ...newPrize, position: e.target.value })}
            className="input-neon text-xs py-1.5" placeholder="e.g. 1st Place" />
          <input value={newPrize.prize} onChange={(e) => setNewPrize({ ...newPrize, prize: e.target.value })}
            className="input-neon text-xs py-1.5" placeholder="e.g. Rs. 2000" />
        </div>
        <button type="button" onClick={addPrize} className="btn-outline-neon text-xs px-3 py-1.5 mb-2">
          <FiPlus size={13} className="inline mr-1" /> Add Prize
        </button>
        <div className="space-y-1">
          {form.prizes.map((prize, i) => (
            <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-dark-surface">
              <span className="text-neon-purple font-semibold">{prize.position}</span>
              <span className="text-white">{prize.prize}</span>
              <button type="button" onClick={() => setForm({ ...form, prizes: form.prizes.filter((_, j) => j !== i) })}>
                <FiX size={11} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={saving} className="btn-purple text-xs flex items-center gap-1.5 px-5 py-2">
          {saving ? 'Saving...' : initial ? 'Save Changes' : 'Create Event'}
        </button>
        <button type="button" onClick={onCancel} className="btn-outline-neon text-xs px-4 py-2">Cancel</button>
      </div>
    </form>
  );
}

export default function EventsAdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeEvents(setEvents);
    return () => unsub();
  }, []);

  const handleAdd = async (data: any) => {
    const date = data.dateStr ? Timestamp.fromDate(new Date(data.dateStr)) : Timestamp.now();
    await addEvent({
      title: data.title,
      game: data.game,
      description: data.description,
      date,
      time: data.time,
      entryFee: data.entryFee,
      maxParticipants: data.maxParticipants,
      registeredCount: 0,
      rules: data.rules,
      prizes: data.prizes,
      status: data.status,
      imageUrl: data.imageUrl,
      consoleType: data.consoleType,
    });
    toast.success('Event created!');
    setShowAdd(false);
  };

  const handleEdit = async (id: string, data: any) => {
    const date = data.dateStr ? Timestamp.fromDate(new Date(data.dateStr)) : undefined;
    await updateEvent(id, { ...data, date });
    toast.success('Event updated!');
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await deleteEvent(id);
    toast.success('Event deleted.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-gaming font-bold text-2xl text-white">EVENTS & TOURNAMENTS</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-purple text-xs flex items-center gap-1.5 px-4 py-2">
          <FiPlus size={14} /> Create Event
        </button>
      </div>

      {showAdd && <EventForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />}

      <div className="space-y-4">
        {events.map((ev) => (
          <div key={ev.id} className="gaming-card rounded-xl p-5">
            {editingId === ev.id ? (
              <EventForm
                initial={{
                  ...ev,
                  dateStr: ev.date ? ev.date.toDate().toISOString().split('T')[0] : '',
                }}
                onSave={(data) => handleEdit(ev.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="font-gaming font-bold text-white mb-1">{ev.title}</div>
                  <div className="text-sm text-neon-purple mb-1">{ev.game}</div>
                  <div className="text-xs text-gray-400 flex flex-wrap gap-3">
                    <span>{ev.date ? ev.date.toDate().toDateString() : 'TBD'}</span>
                    <span>·</span>
                    <span>{ev.registeredCount}/{ev.maxParticipants} registered</span>
                    <span>·</span>
                    <span>Rs. {ev.entryFee === 0 ? 'FREE' : ev.entryFee} entry</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded font-gaming uppercase ${
                    ev.status === 'upcoming' ? 'text-neon-green bg-neon-green/20' :
                    ev.status === 'ongoing' ? 'text-neon-blue bg-neon-blue/20' :
                    'text-gray-400 bg-gray-500/20'
                  }`}>
                    {ev.status}
                  </span>
                  <button onClick={() => setEditingId(ev.id)}
                    className="w-8 h-8 rounded-lg bg-dark-surface border border-dark-border flex items-center justify-center text-gray-400 hover:text-neon-blue">
                    <FiEdit2 size={13} />
                  </button>
                  <button onClick={() => handleDelete(ev.id)}
                    className="w-8 h-8 rounded-lg bg-dark-surface border border-dark-border flex items-center justify-center text-gray-400 hover:text-red-400">
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {events.length === 0 && !showAdd && (
          <div className="text-center py-16 gaming-card rounded-2xl">
            <GiTrophy size={50} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-gaming mb-4">No events yet.</p>
            <button onClick={() => setShowAdd(true)} className="btn-purple text-sm">
              Create First Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
