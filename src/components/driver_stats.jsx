import React, { useState } from "react";
import { useRaceBetting } from "../context/race_betting_context";

function DriverStats() {
    const { drivers } = useRaceBetting();
    const [selectedDriverNum, setSelectedDriverNum] = useState(drivers.length > 0 ? drivers[0].number : null);
    
    const selectedDriver = drivers.find(d => d.number === selectedDriverNum);

    // Calculate mock stats based on driver number (for demonstration)
    const calculateStats = (driver) => {
        const baseScore = driver.number * 10;
        return {
            racesCompleted: baseScore + 5,
            wins: Math.floor(baseScore / 3),
            podiums: Math.floor(baseScore / 2),
            avgFinishPosition: (baseScore / 10),
            totalPoints: baseScore * 15,
            consistency: Math.floor(Math.random() * 25 + 75), // 75-100%
            topSpeed: Math.floor(Math.random() * 30 + 180), // 180-210 mph
        };
    };

    const stats = selectedDriver ? calculateStats(selectedDriver) : null;

    return (
        <div className="driver-stats-container">
            <div className="stats-header">
                <h2>🏁 Driver Stats & Leaderboard</h2>
                <p className="stats-subtitle">View detailed driver performance metrics</p>
            </div>

            <div className="stats-grid">
                {/* Driver Selector */}
                <div className="driver-selector-card">
                    <h3>👤 Select Driver</h3>
                    <select
                        value={selectedDriverNum}
                        onChange={(e) => setSelectedDriverNum(parseInt(e.target.value))}
                        className="driver-selector"
                    >
                        {drivers.map(driver => (
                            <option key={driver.number} value={driver.number}>
                                Car #{driver.number} - {driver.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Driver Highlight Card */}
                {selectedDriver && (
                    <div className="driver-highlight">
                        <div className="driver-card-header">
                            <div className="car-number-badge">#{selectedDriver.number}</div>
                            <div className="driver-names">
                                <h3>{selectedDriver.name}</h3>
                                <p className="status-badge">
                                    {selectedDriver.status ? "🟢 Active" : "🔴 Inactive"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Performance Metrics */}
            {selectedDriver && stats && (
                <div className="performance-section">
                    <h3 className="section-title">📊 Performance Metrics</h3>
                    <div className="metrics-grid">
                        {/* Races Completed */}
                        <div className="metric-card">
                            <div className="metric-icon">🏎️</div>
                            <div className="metric-content">
                                <h4>Races Completed</h4>
                                <p className="metric-value">{stats.racesCompleted}</p>
                            </div>
                        </div>

                        {/* Wins */}
                        <div className="metric-card trophy">
                            <div className="metric-icon">🏆</div>
                            <div className="metric-content">
                                <h4>Wins</h4>
                                <p className="metric-value">{stats.wins}</p>
                            </div>
                        </div>

                        {/* Podium Finishes */}
                        <div className="metric-card podium">
                            <div className="metric-icon">🥇</div>
                            <div className="metric-content">
                                <h4>Podium Finishes</h4>
                                <p className="metric-value">{stats.podiums}</p>
                            </div>
                        </div>

                        {/* Average Finish */}
                        <div className="metric-card">
                            <div className="metric-icon">📈</div>
                            <div className="metric-content">
                                <h4>Avg. Finish Position</h4>
                                <p className="metric-value">{stats.avgFinishPosition.toFixed(1)}</p>
                            </div>
                        </div>

                        {/* Total Points */}
                        <div className="metric-card points">
                            <div className="metric-icon">⭐</div>
                            <div className="metric-content">
                                <h4>Total Points</h4>
                                <p className="metric-value">{stats.totalPoints}</p>
                            </div>
                        </div>

                        {/* Win Rate */}
                        <div className="metric-card">
                            <div className="metric-icon">📊</div>
                            <div className="metric-content">
                                <h4>Win Rate</h4>
                                <p className="metric-value">{((stats.wins / stats.racesCompleted) * 100).toFixed(1)}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Advanced Stats */}
            {selectedDriver && stats && (
                <div className="advanced-stats-section">
                    <h3 className="section-title">⚙️ Advanced Stats</h3>
                    <div className="advanced-grid">
                        <div className="advanced-stat">
                            <label>Consistency Rating</label>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${stats.consistency}%` }}>
                                    {stats.consistency}%
                                </div>
                            </div>
                        </div>
                        <div className="advanced-stat">
                            <label>Top Speed (mph)</label>
                            <div className="speed-display">
                                {stats.topSpeed}
                                <span className="unit">mph</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Drivers Leaderboard */}
            <div className="leaderboard-section">
                <h3 className="section-title">🏁 Top Drivers</h3>
                <div className="leaderboard">
                    {drivers.map((driver, idx) => {
                        const driverStats = calculateStats(driver);
                        return (
                            <div 
                                key={driver.number} 
                                className={`leaderboard-row ${selectedDriverNum === driver.number ? 'active' : ''}`}
                                onClick={() => setSelectedDriverNum(driver.number)}
                            >
                                <div className="rank">
                                    {idx === 0 && '🥇'}
                                    {idx === 1 && '🥈'}
                                    {idx === 2 && '🥉'}
                                    {idx > 2 && `#${idx + 1}`}
                                </div>
                                <div className="driver-info-row">
                                    <span className="car-num">Car #{driver.number}</span>
                                    <span className="driver-name">{driver.name}</span>
                                </div>
                                <div className="stats-info">
                                    <span className="stat wins">W: {driverStats.wins}</span>
                                    <span className="stat points">Pts: {driverStats.totalPoints}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default DriverStats;
