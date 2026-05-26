'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, searchUsers } from '@/lib/firestore';
import type { UserProfile } from '@/types';
import { format } from 'date-fns';
import { FiSearch, FiUser, FiPhone, FiMail, FiShield, FiHash } from 'react-icons/fi';
import { GiGamepad } from 'react-icons/gi';

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [searchField, setSearchField] = useState<'email' | 'phone' | 'regNo'>('email');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllUsers().then(setUsers).finally(() => setLoading(false));
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) {
      getAllUsers().then(setUsers);
      return;
    }
    setLoading(true);
    try {
      const results = await searchUsers(searchField, search.trim());
      setUsers(results);
    } finally {
      setLoading(false);
    }
  };

  const roleColors: Record<string, string> = {
    admin: '#7c3aed',
    user: '#00ff88',
    guest: '#f59e0b',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="font-gaming font-bold text-2xl text-white">USER MANAGEMENT</h1>

      {/* Search Bar */}
      <div className="gaming-card rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value as any)}
          className="input-neon text-sm py-2 sm:w-36"
        >
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="regNo">Reg No</option>
        </select>
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={`Search by ${searchField}...`}
            className="input-neon pl-10 text-sm w-full"
          />
        </div>
        <button onClick={handleSearch} className="btn-neon text-xs px-5 py-2">Search</button>
        <button
          onClick={() => { setSearch(''); getAllUsers().then(setUsers); }}
          className="btn-outline-neon text-xs px-4 py-2"
        >
          Reset
        </button>
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="text-center py-10 text-neon-green font-gaming animate-pulse">Loading users...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((u) => (
            <div
              key={u.uid}
              className="gaming-card rounded-xl p-4 cursor-pointer hover:border-neon-green/40 transition-all"
              onClick={() => setSelectedUser(u)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {u.photoURL ? (
                    <img src={u.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <GiGamepad size={18} className="text-neon-green" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-white text-sm truncate">{u.displayName}</span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-gaming uppercase flex-shrink-0"
                      style={{ color: roleColors[u.role], background: `${roleColors[u.role]}20` }}
                    >
                      {u.role}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 flex flex-wrap gap-x-3 gap-y-0.5">
                    <span className="flex items-center gap-1"><FiHash size={10} /> {u.regNo}</span>
                    {u.email && <span className="flex items-center gap-1 truncate"><FiMail size={10} /> {u.email}</span>}
                    {u.phone && <span className="flex items-center gap-1"><FiPhone size={10} /> {u.phone}</span>}
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <div>{u.totalSessions} sessions</div>
                  <div>{u.totalHours}h played</div>
                </div>
              </div>
              {u.isGuest && u.guestPassword && (
                <div className="mt-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs">
                  <span className="text-yellow-400 font-gaming">GUEST</span>
                  <span className="text-gray-400 ml-2">Pass: </span>
                  <span className="text-white font-mono">{u.guestPassword}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {users.length === 0 && !loading && (
        <div className="text-center py-10 text-gray-400 font-gaming">No users found.</div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setSelectedUser(null)}
        >
          <div className="gaming-card rounded-2xl w-full max-w-md border border-dark-border overflow-hidden max-h-[85vh] overflow-y-auto">
            <div className="h-1 bg-gradient-to-r from-neon-green to-neon-blue" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-gaming font-bold text-white">USER PROFILE</h3>
                <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-white">✕</button>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Name', value: selectedUser.displayName, icon: FiUser },
                  { label: 'Email', value: selectedUser.email, icon: FiMail },
                  { label: 'Phone', value: selectedUser.phone, icon: FiPhone },
                  { label: 'Reg No', value: selectedUser.regNo, icon: FiHash },
                  { label: 'Role', value: selectedUser.role.toUpperCase(), icon: FiShield },
                ].map(({ label, value, icon: Icon }) => (
                  value && (
                    <div key={label} className="flex items-center gap-3 p-3 rounded-lg bg-dark-surface">
                      <Icon size={15} className="text-neon-green flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-500 font-gaming">{label}</div>
                        <div className="text-white text-sm font-semibold">{value}</div>
                      </div>
                    </div>
                  )
                ))}

                <div className="grid grid-cols-3 gap-2 mt-4">
                  {[
                    { label: 'Sessions', value: selectedUser.totalSessions },
                    { label: 'Hours', value: `${selectedUser.totalHours}h` },
                    { label: 'Events Won', value: selectedUser.eventsWon },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-2 rounded-lg bg-dark-surface">
                      <div className="font-gaming font-bold text-lg text-neon-green">{s.value}</div>
                      <div className="text-xs text-gray-400">{s.label}</div>
                    </div>
                  ))}
                </div>

                {selectedUser.isGuest && selectedUser.guestPassword && (
                  <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                    <div className="text-yellow-400 font-gaming text-xs mb-1">GUEST CREDENTIALS</div>
                    <div className="text-sm text-white">Reg No: <strong>{selectedUser.regNo}</strong></div>
                    <div className="text-sm text-white">Password: <strong>{selectedUser.guestPassword}</strong></div>
                    <div className="text-xs text-gray-400 mt-1">Share with guest to login and upgrade account.</div>
                  </div>
                )}

                {selectedUser.createdAt && (
                  <div className="text-xs text-gray-500 text-center">
                    Joined: {format(selectedUser.createdAt.toDate(), 'dd MMM yyyy')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
