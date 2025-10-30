import React, { useState, useEffect } from "react";
import diceRoller from "./dice_roller";
import { useRaceBetting } from "../context/race_betting_context";

function RunRace() {
    const { user, wallet, updateWallet, addRaceResult, drivers, setUser } = useRaceBetting();
    const [selectedDriver1, setSelectedDriver1] = useState(null);
    const [selectedDriver2, setSelectedDriver2] = useState(null);
    const [betDriver, setBetDriver] = useState(null); // New: track who they're betting on
    const [betAmount, setBetAmount] = useState(0);
    const [raceResult, setRaceResult] = useState(null);
    const [isRacing, setIsRacing] = useState(false);
    const [error, setError] = useState("");
    const [raceMessage, setRaceMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "win", "loss", or "tie"
    const [addMoneyInput, setAddMoneyInput] = useState("");

    // Auto-dismiss race message after 8 seconds
    useEffect(() => {
        if (raceMessage) {
            const timer = setTimeout(() => {
                setRaceMessage("");
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [raceMessage]);

    // Validate inputs before race
    const validateRace = () => {
        setError("");

        if (!selectedDriver1 || !selectedDriver2) {
            setError("Please select two drivers to race.");
            return false;
        }

        if (selectedDriver1.number === selectedDriver2.number) {
            setError("Please select two different drivers.");
            return false;
        }

        if (!betDriver) {
            setError("Please select which driver you want to bet on.");
            return false;
        }

        if (betAmount <= 0) {
            setError("Bet amount must be greater than 0.");
            return false;
        }

        if (betAmount > wallet) {
            setError(`Insufficient funds. You have $${wallet} but bet $${betAmount}.`);
            return false;
        }

        return true;
    };

    // Execute the race
    const executeRace = async () => {
        if (!validateRace()) return;

        setIsRacing(true);
        setRaceResult(null);
        setRaceMessage("🏁 Race in progress...");

        try {
            // Deduct bet from wallet immediately
            updateWallet(-betAmount);

            // Run the dice roller
            const winner = await diceRoller(selectedDriver1, selectedDriver2);

            if (!winner) {
                // Tie case - return bet to user
                setRaceMessage("🤝 It's a tie! Your bet has been returned.");
                setMessageType("tie");
                updateWallet(betAmount);
                setRaceResult({
                    driver1: selectedDriver1,
                    driver2: selectedDriver2,
                    winner: null,
                    betAmount,
                    payout: 0,
                    result: "tie",
                    timestamp: new Date().toLocaleString(),
                });
            } else {
                // Determine if user's bet won or lost
                const userWon = winner.number === betDriver.number;

                let payout = 0;
                if (userWon) {
                    // User wins: return their bet + equal amount as winnings
                    payout = betAmount * 2; // Return bet + equal winnings
                    updateWallet(payout);
                    setMessageType("win");
                    setRaceMessage(
                        `🎉 ${winner.name} wins! Your bet on ${winner.name} paid off! You won $${betAmount}!`
                    );
                } else {
                    // User loses their bet
                    payout = betAmount; // Store the amount lost
                    setMessageType("loss");
                    setRaceMessage(
                        `😞 ${winner.name} wins! Your bet on ${betDriver.name} lost. You lost $${betAmount}.`
                    );
                }

                const loser = selectedDriver1.number === winner.number ? selectedDriver2 : selectedDriver1;

                setRaceResult({
                    driver1: selectedDriver1,
                    driver2: selectedDriver2,
                    winner,
                    loser,
                    betDriver,
                    betAmount,
                    payout,
                    userWon,
                    result: "finished",
                    timestamp: new Date().toLocaleString(),
                });

                // Add to race history locally
                addRaceResult({
                    driver1: selectedDriver1,
                    driver2: selectedDriver2,
                    winner,
                    loser,
                    betDriver,
                    betAmount,
                    userWon,
                    username: user?.username,
                    timestamp: new Date().toLocaleString(),
                });

                // Save race to backend database
                try {
                    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001";
                    const response = await fetch(`${apiUrl}/api/race/record/${user?.username}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            driver1: selectedDriver1.name,
                            driver2: selectedDriver2.name,
                            winner: winner.name,
                            betAmount,
                            userWon,
                        }),
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        // Update the user in context with the fresh data from backend
                        if (result.data) {
                            setUser(result.data);
                        }
                    }
                } catch (saveErr) {
                    console.error('Failed to save race to database:', saveErr);
                    // Don't fail the race if database save fails
                }
            }
        } catch (err) {
            setError(`Race failed: ${err.message}`);
            // Refund bet if race fails
            updateWallet(betAmount);
            setRaceMessage("");
        } finally {
            setIsRacing(false);
        }
    };

    // Reset for next race
    const resetRace = () => {
        setSelectedDriver1(null);
        setSelectedDriver2(null);
        setBetDriver(null);
        setBetAmount(0);
        setRaceResult(null);
        setRaceMessage("");
        setMessageType("");
        setError("");
    };

    return (
        <div className="race-container">
            <h2>🏎️ Race Simulation</h2>
            
            <div className="wallet-display">
                <h3>Your Wallet: ${wallet}</h3>
                <div className="add-funds-section">
                    <input 
                        type="number" 
                        placeholder="Enter amount"
                        value={addMoneyInput}
                        onChange={(e) => setAddMoneyInput(e.target.value)}
                        min="1"
                        className="add-funds-input"
                    />
                    <button 
                        onClick={() => {
                            if (addMoneyInput && parseInt(addMoneyInput) > 0) {
                                updateWallet(parseInt(addMoneyInput));
                                setAddMoneyInput("");
                            }
                        }}
                        className="btn-add-funds"
                    >
                        + Add Funds
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {raceMessage && (
                <div className={`race-message race-message-${messageType}`}>
                    <span>{raceMessage}</span>
                    <button 
                        className="message-close-btn"
                        onClick={() => setRaceMessage("")}
                        title="Close message"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="race-setup">
                <div className="driver-selection">
                    <label>Select Driver 1:</label>
                    <select 
                        value={selectedDriver1?.number || ""} 
                        onChange={(e) => {
                            const driver = drivers.find(d => d.number === parseInt(e.target.value));
                            setSelectedDriver1(driver);
                        }}
                        disabled={isRacing}
                    >
                        <option className="dropdown" value="">-- Choose Driver --</option>
                        {drivers.map(driver => (
                            <option key={driver.number} value={driver.number} disabled={selectedDriver2?.number === driver.number}>
                                {driver.name} (#Car {driver.number})
                            </option>
                        ))}
                    </select>
                    {selectedDriver1 && (
                        <div className="driver-info">
                            <p>Status: {selectedDriver1.status ? "✅ Active" : "❌ Inactive"}</p>
                        </div>
                    )}
                </div>

                <div className="vs">VS</div>

                <div className="driver-selection">
                    <label>Select Driver 2:</label>
                    <select 
                        value={selectedDriver2?.number || ""} 
                        onChange={(e) => {
                            const driver = drivers.find(d => d.number === parseInt(e.target.value));
                            setSelectedDriver2(driver);
                        }}
                        disabled={isRacing}
                    >
                        <option  value="">-- Choose Driver --</option>
                        {drivers.map(driver => (
                            <option key={driver.number} value={driver.number} disabled={selectedDriver1?.number === driver.number}>
                                {driver.name} (#Car {driver.number})
                            </option>
                        ))}
                    </select>
                    {selectedDriver2 && (
                        <div className="driver-info">
                            <p>Status: {selectedDriver2.status ? "✅ Active" : "❌ Inactive"}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="betting-selection">
                <h3>Who do you want to bet on?</h3>
                <div className="bet-options">
                    {selectedDriver1 && (
                        <button 
                            onClick={() => setBetDriver(selectedDriver1)}
                            className={`bet-button ${betDriver?.number === selectedDriver1.number ? 'selected' : ''}`}
                            disabled={isRacing}
                        >
                            {selectedDriver1.name}
                        </button>
                    )}
                    {selectedDriver2 && (
                        <button 
                            onClick={() => setBetDriver(selectedDriver2)}
                            className={`bet-button ${betDriver?.number === selectedDriver2.number ? 'selected' : ''}`}
                            disabled={isRacing}
                        >
                            {selectedDriver2.name}
                        </button>
                    )}
                </div>
                {betDriver && (
                    <p className="bet-confirmation">
                        ✅ Betting on: <strong>{betDriver.name}</strong>
                    </p>
                )}
            </div>

            <div className="bet-section">
                <label>Bet Amount: $</label>
                <input
                    type="number"
                    value={betAmount === 0 ? '' : betAmount}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                            setBetAmount(0);
                        } else {
                            const num = Number(val);
                            if (num >= 0) {
                                setBetAmount(num);
                            }
                        }
                    }}
                    disabled={isRacing || !betDriver}
                    min="0"
                    max={wallet}
                    placeholder="0"
                />
            </div>

            <div className="race-controls">
                <button 
                    onClick={executeRace} 
                    disabled={isRacing || !selectedDriver1 || !selectedDriver2 || betAmount <= 0}
                    className="btn-race"
                >
                    {isRacing ? "🏁 Racing..." : "Start Race"}
                </button>
                <button 
                    onClick={resetRace}
                    disabled={isRacing}
                    className="btn-reset"
                >
                    Reset
                </button>
            </div>

            {raceResult && (
                <div className="race-results">
                    <h3>Race Results</h3>
                    <div className="result-details">
                        <p><strong>{raceResult.driver1.name}</strong> vs <strong>{raceResult.driver2.name}</strong></p>
                        {raceResult.result === "tie" ? (
                            <p className="tie">🤝 TIE - No winner</p>
                        ) : (
                            <>
                                <p className="winner">
                                    🏆 Winner: <strong>{raceResult.winner.name}</strong>
                                </p>
                                <p className="loser">
                                    Loser: {raceResult.loser.name}
                                </p>
                            </>
                        )}
                        <p><strong>Your Bet:</strong> ${raceResult.betAmount}</p>
                        {raceResult.result === "tie" ? (
                            <p className="refund">Refund: ${raceResult.betAmount}</p>
                        ) : (
                            <p className={raceResult.userWon ? "win" : "loss"}>
                                {raceResult.userWon ? "✅ Won" : "❌ Lost"}: ${raceResult.userWon ? raceResult.betAmount : raceResult.payout}
                            </p>
                        )}
                        <p className="timestamp">{raceResult.timestamp}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RunRace;
