import React, { useState, useEffect } from 'react';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/leaderboard')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setLeaderboard(data);
        setLoading(false);
      })
      // eslint-disable-next-line no-unused-vars
      .catch(error => {
        setError("Could not load the leaderboard.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <div className="mb-4">
        <h1 className="display-5 fw-bolder">Leaderboard</h1>
        <p className="text-white">Top security researchers on the platform.</p>
      </div>

      <div className="card text-white">
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th scope="col" style={{width: '10%'}}>Rank</th>
                <th scope="col">Hacker</th>
                <th scope="col">Reports</th>
                <th scope="col">Reputation</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map(hacker => (
                <tr key={hacker.rank}>
                  <td className="fw-bold fs-5">{hacker.rank}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <img 
                        src={`https://placehold.co/40x40/1F2937/34D399?text=${hacker.username.charAt(0).toUpperCase()}`} 
                        alt="" 
                        width="40" 
                        height="40" 
                        className="rounded-circle me-3" 
                      />
                      <span className="fw-bold">{hacker.username}</span>
                    </div>
                  </td>
                  <td>{hacker.reports}</td>
                  <td className="fw-bold" style={{color: 'var(--accent-green)'}}>{hacker.reputation.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}