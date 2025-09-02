import React from 'react';
import { Link } from 'react-router-dom'; // <-- ADD THIS IMPORT

// Header Component
function Header() {
  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark fixed-top" 
      style={{ 
        backgroundColor: 'rgba(17, 24, 39, 0.8)', 
        backdropFilter: 'blur(10px)' 
      }}
    >
      <div className="container">
        <Link to="/" className="navbar-brand fs-4 fw-bold" style={{ fontFamily: 'var(--font-mono)' }}>
          RECON<span style={{ color: 'var(--accent-cyan)' }}>_</span>0
        </Link>
        <div className="ms-auto">
          {/* V-- UPDATE THESE BUTTONS TO BE LINKS --V */}
          <Link to="/login" className="btn btn-ghost me-2">Log In</Link>
          <Link to="/signup" className="btn btn-primary">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}

// Main Landing Page Component
function App() {
  return (
    <>
      <Header />
      <main>
        <section 
          className="d-flex align-items-center justify-content-center text-center vh-100"
          style={{
            // Subtle grid background effect
            backgroundImage: 'linear-gradient(rgba(17, 24, 39, 0.98), rgba(17, 24, 39, 0.98)), url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23374151\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")',
          }}
        >
          <div className="container">
            <h1 className="display-3 fw-bolder mb-3">Next-Gen Bug Bounty Platform</h1>
            <p className="lead text-secondary mb-4 mx-auto" style={{ maxWidth: '700px', color: 'var(--text-muted)' }}>
              Connect with elite ethical hackers, protect your systems, and build a safer internet through our community-driven platform.
            </p>
            <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
              <button type="button" className="btn btn-primary btn-lg px-4 me-sm-3">Start Hunting</button>
              <button type="button" className="btn btn-secondary btn-lg px-4">Launch a Program</button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;