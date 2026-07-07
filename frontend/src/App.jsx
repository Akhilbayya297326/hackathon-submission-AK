import React, { useState } from 'react';
import { Home, FileText, AlertTriangle, BookOpen, Sparkles } from 'lucide-react';
import ChatBot from './components/ChatBot';
import ReportIssue from './components/ReportIssue';
import TrackComplaints from './components/TrackComplaints';
import Schemes from './components/Schemes'; // Imported the new component

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-slate-50">

      {/* Sticky Top Navigation Bar with Glassmorphism */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm px-8 py-4 flex justify-between items-center border-b border-gray-100 transition-all">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveView('dashboard')}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform duration-300">
            SB
          </div>
          <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
            Smart Bharat
          </h1>
        </div>
        <div className="hidden md:flex gap-8 font-semibold text-gray-500">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`hover:text-blue-600 transition-colors ${activeView === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'pb-1'}`}
          >
            Dashboard
          </button>
          <a href="#" className="hover:text-blue-600 transition-colors pb-1">Services</a>
          <a href="#" className="hover:text-blue-600 transition-colors pb-1">My Profile</a>
        </div>
      </nav>

      {/* Main Dashboard Layout */}
      <main className="max-w-7xl mx-auto mt-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">

        {/* Left Column: Chat Area */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">AI Assistant</h2>
            <Sparkles className="text-amber-400 animate-pulse" size={20} />
          </div>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Your civic companion. Ask me anything about government services, agricultural schemes, or public reporting.
          </p>
          <div className="flex-1 overflow-hidden">
            <ChatBot />
          </div>
        </div>

        {/* Right Column: Dynamic Content Area */}
        <div className="lg:col-span-2 space-y-6">

          {activeView === 'dashboard' ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Enhanced Hero Banner */}
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-3xl shadow-lg border border-blue-400 mb-8 text-white">
                <div className="relative z-10">
                  <h2 className="text-3xl font-extrabold mb-3 tracking-tight">Empowering Citizens.<br />Simplifying Governance.</h2>
                  <p className="text-blue-100 text-lg max-w-md">
                    Leveraging AI to bring transparency, speed, and accessibility to your everyday civic needs.
                  </p>
                </div>
                {/* Decorative background shapes */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-8 w-48 h-48 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
              </div>

              {/* Quick Action Cards with Hover Lift */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <ActionCard
                  icon={<Home className="text-blue-500" size={28} />}
                  title="Popular Services"
                  onClick={() => { }}
                />
                <ActionCard
                  icon={<AlertTriangle className="text-orange-500" size={28} />}
                  title="Report an Issue"
                  onClick={() => setActiveView('report')}
                />
                <ActionCard
                  icon={<FileText className="text-emerald-500" size={28} />}
                  title="Track Complaints"
                  onClick={() => setActiveView('track')}
                />
                <ActionCard
                  icon={<BookOpen className="text-purple-500" size={28} />}
                  title="Schemes for You"
                  onClick={() => setActiveView('schemes')}
                />
              </div>
            </div>
          ) : activeView === 'report' ? (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
              <ReportIssue onBack={() => setActiveView('dashboard')} />
            </div>
          ) : activeView === 'track' ? (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
              <TrackComplaints onBack={() => setActiveView('dashboard')} />
            </div>
          ) : activeView === 'schemes' ? (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
              <Schemes onBack={() => setActiveView('dashboard')} />
            </div>
          ) : null}

        </div>

      </main>
    </div>
  );
}

// Highly polished interactive card component
function ActionCard({ icon, title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:border-blue-100 cursor-pointer transition-all duration-300 flex flex-col items-center text-center gap-4 group"
    >
      <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors duration-300">
        {icon}
      </div>
      <span className="font-bold text-gray-700 group-hover:text-blue-700 transition-colors">{title}</span>
    </div>
  );
}

export default App;