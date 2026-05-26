'use client';

import { useEffect, useState } from 'react';
import { subscribeConsoles, addConsole, updateConsole, deleteConsole } from '@/lib/firestore';
import type { Console, ConsoleGame } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiChevronDown, FiChevronUp, FiTag } from 'react-icons/fi';
import { GiGamepad } from 'react-icons/gi';

const PRESET_GENRES = [
  'Fighting', 'Sports', 'Shooter', 'Racing', 'Action',
  'RPG', 'Open World', 'Horror', 'Sandbox', 'Platformer', 'Multiplayer', 'Adventure',
];

interface ConsoleFormData {
  name: string;
  type: Console['type'];
  pricePerHour: number;
  pricePerHalfHour: number;
  description: string;
  order: number;
}

const defaultForm: ConsoleFormData = {
  name: '',
  type: 'PS4',
  pricePerHour: 200,
  pricePerHalfHour: 120,
  description: '',
  order: 1,
};

function ConsoleForm({
  initial,
  onSave,
  onCancel,
  isNew,
}: {
  initial?: Partial<ConsoleFormData>;
  onSave: (data: ConsoleFormData) => Promise<void>;
  onCancel: () => void;
  isNew?: boolean;
}) {
  const [form, setForm] = useState<ConsoleFormData>({ ...defaultForm, ...initial });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error('Console name required'); return; }
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-5 gaming-card rounded-xl border border-neon-green/30">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400 font-gaming mb-1 block">Console Name *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-neon text-sm py-2"
            placeholder="e.g. PS4 Station 1"
            required
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 font-gaming mb-1 block">Type *</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as Console['type'] })}
            className="input-neon text-sm py-2"
          >
            {['PS5', 'PS4', 'VR', 'PC', 'Other'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400 font-gaming mb-1 block">Price/Hour (Rs.)</label>
          <input
            type="number"
            value={form.pricePerHour}
            onChange={(e) => setForm({ ...form, pricePerHour: Number(e.target.value) })}
            className="input-neon text-sm py-2"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 font-gaming mb-1 block">Price/30min (Rs.)</label>
          <input
            type="number"
            value={form.pricePerHalfHour}
            onChange={(e) => setForm({ ...form, pricePerHalfHour: Number(e.target.value) })}
            className="input-neon text-sm py-2"
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-400 font-gaming mb-1 block">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input-neon text-sm py-2 resize-none"
          rows={2}
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="btn-neon text-xs flex items-center gap-1.5 px-4 py-2">
          <FiSave size={13} /> {saving ? 'Saving...' : isNew ? 'Add Console' : 'Save Changes'}
        </button>
        <button type="button" onClick={onCancel} className="btn-outline-neon text-xs px-4 py-2">
          Cancel
        </button>
      </div>
    </form>
  );
}

function GameManager({ con }: { con: Console }) {
  const [showGames, setShowGames] = useState(false);
  const [newGame, setNewGame] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingGenre, setEditingGenre] = useState<string | null>(null);

  const addGame = async () => {
    if (!newGame.trim()) return;
    setSaving(true);
    try {
      const game: ConsoleGame = { id: uuidv4(), name: newGame.trim() };
      if (newGenre) game.genre = newGenre;
      const games = [...(con.games || []), game];
      await updateConsole(con.id, { games });
      setNewGame('');
      setNewGenre('');
      toast.success('Game added!');
    } catch { toast.error('Failed to add game'); } finally { setSaving(false); }
  };

  const removeGame = async (gameId: string) => {
    try {
      const games = (con.games || []).filter((g) => g.id !== gameId);
      await updateConsole(con.id, { games });
      toast.success('Game removed');
    } catch { toast.error('Failed to remove game'); }
  };

  const updateGenre = async (gameId: string, genre: string) => {
    try {
      const games = (con.games || []).map((g) =>
        g.id === gameId ? { ...g, genre } : g
      );
      await updateConsole(con.id, { games });
      setEditingGenre(null);
      toast.success('Tag updated');
    } catch { toast.error('Failed to update tag'); }
  };

  const games = con.games || [];

  return (
    <div className="mt-3">
      <button
        onClick={() => setShowGames(!showGames)}
        className="flex items-center gap-2 text-xs text-gray-400 hover:text-neon-green transition-colors font-gaming"
      >
        {showGames ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
        GAMES ({games.length})
      </button>

      {showGames && (
        <div className="mt-3 space-y-3">
          {/* Add Game Row */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newGame}
              onChange={(e) => setNewGame(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGame())}
              placeholder="Game name..."
              className="input-neon text-xs py-1.5 flex-1"
            />
            <select
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              className="input-neon text-xs py-1.5 w-32"
            >
              <option value="">Tag...</option>
              {PRESET_GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <button onClick={addGame} disabled={saving} className="btn-neon text-xs px-3 py-1.5 flex items-center gap-1">
              <FiPlus size={13} />
            </button>
          </div>

          {/* Games List */}
          {games.length === 0 ? (
            <p className="text-gray-600 text-xs font-gaming text-center py-2">No games added yet</p>
          ) : (
            <div className="space-y-1.5">
              {games.map((game) => (
                <div key={game.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-surface border border-dark-border">
                  <GiGamepad size={13} className="text-neon-green flex-shrink-0" />
                  <span className="text-gray-300 text-xs flex-1 truncate">{game.name}</span>

                  {/* Genre Tag */}
                  {editingGenre === game.id ? (
                    <select
                      defaultValue={game.genre || ''}
                      onChange={(e) => updateGenre(game.id, e.target.value)}
                      onBlur={() => setEditingGenre(null)}
                      autoFocus
                      className="input-neon text-xs py-0.5 w-28"
                    >
                      <option value="">No tag</option>
                      {PRESET_GENRES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  ) : (
                    <button
                      onClick={() => setEditingGenre(game.id)}
                      className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-colors ${
                        game.genre
                          ? 'border-neon-blue/40 text-neon-blue bg-neon-blue/10 hover:bg-neon-blue/20'
                          : 'border-dark-border text-gray-600 hover:text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <FiTag size={9} />
                      {game.genre || 'Tag'}
                    </button>
                  )}

                  <button
                    onClick={() => removeGame(game.id)}
                    className="text-red-400 hover:text-red-300 flex-shrink-0 ml-1"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ConsolesPage() {
  const [consoles, setConsoles] = useState<Console[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeConsoles(setConsoles);
    return () => unsub();
  }, []);

  const handleAdd = async (data: ConsoleFormData) => {
    await addConsole({
      ...data,
      status: 'available',
      games: [],
      timerActive: false,
    });
    toast.success('Console added!');
    setShowAdd(false);
  };

  const handleEdit = async (id: string, data: ConsoleFormData) => {
    await updateConsole(id, data);
    toast.success('Console updated!');
    setEditingId(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    await deleteConsole(id);
    toast.success('Console deleted.');
  };

  const handleStatusToggle = async (con: Console) => {
    const newStatus = con.status === 'maintenance' ? 'available' : 'maintenance';
    await updateConsole(con.id, { status: newStatus });
    toast.success(`Console set to ${newStatus}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-gaming font-bold text-2xl text-white">CONSOLES & GAMES</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-neon text-xs flex items-center gap-1.5 px-4 py-2">
          <FiPlus size={14} />
          Add Console
        </button>
      </div>

      {showAdd && (
        <ConsoleForm
          isNew
          onSave={handleAdd}
          onCancel={() => setShowAdd(false)}
        />
      )}

      <div className="space-y-4">
        {consoles.map((con) => (
          <div key={con.id} className="gaming-card rounded-2xl p-5">
            {editingId === con.id ? (
              <ConsoleForm
                initial={con}
                onSave={(data) => handleEdit(con.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neon-green/15 border border-neon-green/30 flex items-center justify-center">
                      <GiGamepad size={20} className="text-neon-green" />
                    </div>
                    <div>
                      <div className="font-gaming font-bold text-white text-sm">{con.name}</div>
                      <div className="text-gray-400 text-xs flex items-center gap-2 mt-0.5">
                        <span className="text-neon-green">{con.type}</span>
                        <span>·</span>
                        <span>Rs. {con.pricePerHalfHour}/30min</span>
                        <span>·</span>
                        <span>Rs. {con.pricePerHour}/hr</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusToggle(con)}
                      className={`text-xs px-2 py-1 rounded font-gaming uppercase ${
                        con.status === 'maintenance'
                          ? 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/30'
                          : 'text-neon-green bg-neon-green/20 border border-neon-green/30'
                      }`}
                    >
                      {con.status}
                    </button>
                    <button
                      onClick={() => setEditingId(con.id)}
                      className="w-8 h-8 rounded-lg bg-dark-surface border border-dark-border flex items-center justify-center text-gray-400 hover:text-neon-blue transition-all"
                    >
                      <FiEdit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(con.id, con.name)}
                      className="w-8 h-8 rounded-lg bg-dark-surface border border-dark-border flex items-center justify-center text-gray-400 hover:text-red-400 transition-all"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
                {con.description && <p className="text-gray-400 text-xs mt-2">{con.description}</p>}
                <GameManager con={con} />
              </>
            )}
          </div>
        ))}

        {consoles.length === 0 && !showAdd && (
          <div className="text-center py-16 gaming-card rounded-2xl">
            <GiGamepad size={50} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-gaming mb-4">No consoles added yet.</p>
            <button onClick={() => setShowAdd(true)} className="btn-neon text-sm">
              <FiPlus className="inline mr-2" size={15} />
              Add Your First Console
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
