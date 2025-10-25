import React from "react";
import { useRaceBetting } from "../context/race_betting_context";

function DriverStats() {
    const { drivers } = useRaceBetting();

    // Calculate mock stats based on driver number
    const calculateStats = (driver) => {
        const baseScore = driver.number * 10;
        return {
            racesCompleted: baseScore + 5,
            wins: Math.floor(baseScore / 3),
            totalPoints: baseScore * 15,
            winRate: ((Math.floor(baseScore / 3) / (baseScore + 5)) * 100).toFixed(1),
        };
    };

    return (
        <div className="driver-stats-container">
            <div className="stats-header">
                <h2>🏁 Driver Leaderboard</h2>
                <p className="stats-subtitle">All active drivers and their performance stats</p>
            </div>

            <div className="drivers-table">
                <div className="table-header-row">
                    <div className="col rank">Rank</div>
                    <div className="col car-info">Car & Driver</div>
                    <div className="col stat">Races</div>
                    <div className="col stat">Wins</div>
                    <div className="col stat">Points</div>
                    <div className="col stat">Win Rate</div>
                    <div className="col status">Status</div>
                </div>

                <div className="drivers-list">
                    {drivers.map((driver, idx) => {
                        const stats = calculateStats(driver);
                        return (
                            <div key={driver.number} className="driver-row">
                                <div className="col rank">
                                    {idx === 0 && '🥇'}
                                    {idx === 1 && '🥈'}
                                    {idx === 2 && '🥉'}
                                    {idx > 2 && `#${idx + 1}`}
                                </div>
                                <div className="col car-info">
                                    <span className="car-number">#{driver.number}</span>
                                    <span className="driver-name">{driver.name}</span>
                                </div>
                                <div className="col stat">{stats.racesCompleted}</div>
                                <div className="col stat">{stats.wins}</div>
                                <div className="col stat">{stats.totalPoints}</div>
                                <div className="col stat">{stats.winRate}%</div>
                                <div className="col status">
                                    {driver.status ? (
                                        <span className="badge-active">🟢 Active</span>
                                    ) : (
                                        <span className="badge-inactive">🔴 Inactive</span>
                                    )}
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
