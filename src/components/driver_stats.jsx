import React from "react";
import { useRaceBetting } from "../context/race_betting_context";

function DriverStats() {
    const { drivers, driverStats } = useRaceBetting();

    // Sort drivers by wins, then by total points
    const sortedDrivers = [...drivers].sort((a, b) => {
        const statsA = driverStats[a.number] || { wins: 0, totalPoints: 0 };
        const statsB = driverStats[b.number] || { wins: 0, totalPoints: 0 };
        
        if (statsB.wins !== statsA.wins) {
            return statsB.wins - statsA.wins; // Sort by wins descending
        }
        return statsB.totalPoints - statsA.totalPoints; // Then by points descending
    });

    // Calculate win rate
    const getWinRate = (driverNum) => {
        const stats = driverStats[driverNum] || { racesCompleted: 0, wins: 0 };
        if (stats.racesCompleted === 0) return "0.0";
        return ((stats.wins / stats.racesCompleted) * 100).toFixed(1);
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
                    {sortedDrivers.map((driver, idx) => {
                        const stats = driverStats[driver.number] || { 
                            racesCompleted: 0, 
                            wins: 0, 
                            totalPoints: 0 
                        };
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
                                <div className="col stat">{getWinRate(driver.number)}%</div>
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
