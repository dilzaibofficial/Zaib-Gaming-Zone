import { GiGamepad, GiTrophy } from 'react-icons/gi';
import { FiUsers, FiStar } from 'react-icons/fi';

const stats = [
  { icon: GiGamepad, value: '3+',   label: 'Gaming Stations', color: '#818cf8' },
  { icon: FiUsers,   value: '500+', label: 'Happy Gamers',    color: '#6366f1' },
  { icon: GiTrophy,  value: '10+',  label: 'Tournaments Held',color: '#7c3aed' },
  { icon: FiStar,    value: '20+',  label: 'Game Titles',     color: '#a78bfa' },
];

export default function StatsSection() {
  return (
    <section className="py-14 border-y border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}33` }}>
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              <div className="font-gaming font-black text-3xl sm:text-4xl mb-1"
                style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
