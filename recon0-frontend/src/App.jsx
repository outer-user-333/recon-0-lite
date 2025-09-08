import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, Zap, Users, BarChart, MessageSquare, Award } from 'lucide-react';

// A simple, reusable Logo component
function Logo() {
  return (
    <Link to="/" className="text-2xl font-bold text-slate-800 tracking-wider">
      RECON<span className="text-blue-500">_0</span>
    </Link>
  );
}

// Header Component Refactored with Tailwind CSS
function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="font-semibold py-2 px-4 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
          >
            Log In
          </Link>
          <Link 
            to="/signup" 
            className="font-semibold py-2 px-4 rounded-lg text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 transition-opacity"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}

const FeatureCard = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="mb-4 inline-block p-3 rounded-full bg-gradient-to-r from-blue-100 to-violet-100">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500">{children}</p>
    </div>
);

const HowItWorksStep = ({ number, title, children }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-violet-200 text-violet-600 font-bold text-xl">
            {number}
        </div>
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">{title}</h3>
            <p className="text-slate-500">{children}</p>
        </div>
    </div>
);

// Main Landing Page Component Refactored with Tailwind CSS
function App() {
  return (
    <div className="bg-slate-200">
      <Header />
      <main>
        {/* Hero Section */}
        <section 
          className="min-h-screen flex items-center justify-center text-center pt-24 pb-12 px-4"
          style={{
            backgroundImage: 'radial-gradient(circle at top, #FFFFFF, #E2E8F0)'
          }}
        >
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-4 leading-tight">
              Next-Gen Bug Bounty Platform
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
              Connect with elite ethical hackers, protect your systems, and build a safer internet through our community-driven platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup" 
                className="font-semibold py-3 px-6 rounded-lg text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 transition-all duration-300 transform hover:scale-105 text-lg"
              >
                Start Hunting
              </Link>
              <Link 
                to="/signup"
                className="font-semibold py-3 px-6 rounded-lg bg-white text-slate-700 shadow-sm border border-slate-300 hover:bg-slate-50 transition-colors text-lg"
              >
                Launch a Program
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-slate-800">Why Choose Recon_0?</h2>
                    <p className="text-slate-500 mt-2 max-w-2xl mx-auto">A comprehensive platform built for effective and collaborative security testing.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard icon={<Target size={28} className="text-blue-600" /> } title="Targeted Programs">
                        Organizations can create detailed bug bounty programs with specific scopes and rewards to attract the right talent.
                    </FeatureCard>
                    <FeatureCard icon={<Zap size={28} className="text-violet-600" />} title="Efficient Reporting">
                        Hackers get a streamlined report submission process, including an AI-powered assistant to enhance report quality.
                    </FeatureCard>
                    <FeatureCard icon={<Users size={28} className="text-blue-600" />} title="Community Leaderboard">
                        Compete with other hackers, earn points for valid reports, and climb the ranks to become a top security researcher.
                    </FeatureCard>
                    <FeatureCard icon={<BarChart size={28} className="text-violet-600" />} title="Actionable Analytics">
                        Organizations receive detailed analytics on submitted reports, helping them track vulnerabilities and response times.
                    </FeatureCard>
                     <FeatureCard icon={<MessageSquare size={28} className="text-blue-600" />} title="Secure Communication">
                        A dedicated real-time chat ensures direct and secure communication between organizations and hackers.
                    </FeatureCard>
                     <FeatureCard icon={<Award size={28} className="text-violet-600" />} title="Achievements & Gamification">
                        Unlock achievements and gain experience points for your contributions, making security research more engaging.
                    </FeatureCard>
                </div>
            </div>
        </section>

         {/* How It Works Section */}
        <section className="py-20 bg-slate-200">
             <div className="container mx-auto px-6">
                 <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-slate-800">Simple, Transparent Process</h2>
                    <p className="text-slate-500 mt-2 max-w-2xl mx-auto">Get started in just a few easy steps, whether you're a hacker or an organization.</p>
                </div>
                <div className="max-w-3xl mx-auto space-y-12">
                    <HowItWorksStep number="1" title="Sign Up & Choose Your Role">
                        Quickly create an account as either a Hacker ready to find bugs or an Organization looking to secure your assets.
                    </HowItWorksStep>
                    <HowItWorksStep number="2" title="Discover or Create Programs">
                        Hackers can browse a list of public and private programs. Organizations can easily launch their own detailed program.
                    </HowItWorksStep>
                    <HowItWorksStep number="3" title="Submit & Triage Reports">
                        Hackers submit detailed vulnerability reports. Organizations review, validate, and triage incoming submissions in a dedicated dashboard.
                    </HowItWorksStep>
                    <HowItWorksStep number="4" title="Collaborate & Get Rewarded">
                        Communicate securely, resolve vulnerabilities, and get rewarded. Organizations strengthen their security, hackers build their reputation.
                    </HowItWorksStep>
                </div>
             </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-slate-800 text-white py-8">
             <div className="container mx-auto px-6 text-center text-slate-400">
                <p>&copy; 2025 Recon_0. A B.Tech Project. All Rights Reserved.</p>
             </div>
        </footer>

      </main>
    </div>
  );
}

export default App;

