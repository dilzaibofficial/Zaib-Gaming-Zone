import { FiUser, FiCalendar, FiCheckCircle, FiZap } from 'react-icons/fi';
import { GiGamepad } from 'react-icons/gi';

const steps = [
  { icon: FiUser,        title: 'Create Account',  desc: 'Sign up with Google or email in seconds. Get your unique Zaib Gaming Zone ID.', color: '#818cf8', num: '01' },
  { icon: FiCalendar,    title: 'Pick Your Console', desc: 'Browse PS5 and PS4 stations. See available games and choose your preferred setup.', color: '#6366f1', num: '02' },
  { icon: FiCheckCircle, title: 'Book Your Slot',  desc: 'Choose session duration. Admin confirms your booking after payment.', color: '#7c3aed', num: '03' },
  { icon: GiGamepad,     title: 'Game On!',        desc: 'Show up, play, and enjoy! Track your session history and earn tournament glory.', color: '#a78bfa', num: '04' },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(99,102,241,0.05) 0%, transparent 70%)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-14">
          <div className="section-tag justify-center">
            <FiZap /> How It Works
          </div>
          <h2 className="font-gaming font-bold text-3xl sm:text-4xl text-white mb-4">
            BOOK IN <span className="gradient-text">4 SIMPLE STEPS</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            From sign-up to gaming in minutes. No complicated process — just pure gaming fun.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.num} className="relative gaming-card rounded-2xl p-6 text-center group hover:border-opacity-60 transition-all duration-200">
              <div className="absolute -top-3 left-6 text-xs font-gaming font-bold px-2 py-0.5 rounded"
                style={{ background: step.color, color: '#fff' }}>
                {step.num}
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-3 w-6 h-px z-10"
                  style={{ background: `${step.color}55` }} />
              )}
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200"
                style={{ background: `${step.color}15`, border: `1px solid ${step.color}44` }}>
                <step.icon size={28} style={{ color: step.color }} />
              </div>
              <h3 className="font-gaming font-bold text-white text-sm mb-2 tracking-wide">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
