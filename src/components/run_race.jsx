import React, { useState, useEffect } from "react";
import diceRoller from "./dice_roller";
import { useRaceBetting } from "../context/race_betting_context";
import addMoney from "../api/add_money";
import loseMoney from "../api/lose_money";

function RunRace() {
  const { user, wallet, updateWallet, addRaceResult, drivers } = useRaceBetting();
  const [selectedDriver1, setSelectedDriver1] = useState(null);
  const [selectedDriver2, setSelectedDriver2] = useState(null);
  const [betDriver, setBetDriver] = useState(null);
  const [betAmount, setBetAmount] = useState(0);
  const [raceResult, setRaceResult] = useState(null);
  const [isRacing, setIsRacing] = useState(false);
  const [error, setError] = useState("");
  const [raceMessage, setRaceMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 
  const [addMoneyInput, setAddMoneyInput] = useState("");

  useEffect(() => {
    if (raceMessage) {
      const timer = setTimeout(() => setRaceMessage(""), 8000);
      return () => clearTimeout(timer);
    }
  }, [raceMessage]);

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

  // Add funds: local + API
  const handleAddFunds = async (amount) => {
    try {
      await addMoney(user.username, amount);
      updateWallet(amount);
      setAddMoneyInput("");
    } catch (err) {
      console.error("Failed to add funds:", err);
      setError("Failed to add funds. Try again.");
    }
  };

  const executeRace = async () => {
    if (!validateRace()) return;

    setIsRacing(true);
    setRaceResult(null);
    setRaceMessage("🏁 Race in progress...");
    setError("");

    try {
      // Deduct bet locally + API
      await loseMoney(user.username, betAmount);
      updateWallet(-betAmount);

      const winner = await diceRoller(selectedDriver1, selectedDriver2);

      if (!winner) {
        // Tie: refund bet
        await addMoney(user.username, betAmount);
        updateWallet(betAmount);
        setRaceMessage("🤝 It's a tie! Your bet has been returned.");
        setMessageType("tie");
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
        const userWon = winner.number === betDriver.number;
        let payout = 0;

        if (userWon) {
          payout = betAmount * 2;
          await addMoney(user.username, payout); // only winnings
          updateWallet(payout);
          setRaceMessage(`🎉 ${winner.name} wins! Your bet on ${winner.name} paid off! You won $${payout}!`);
          setMessageType("win");
        } else {
          payout = betAmount; // already deducted
          setRaceMessage(`😞 ${winner.name} wins! Your bet on ${betDriver.name} lost. You lost $${betAmount}.`);
          setMessageType("loss");
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

        addRaceResult({
          driver1: selectedDriver1,
          driver2: selectedDriver2,
          winner,
          loser,
          betDriver,
          betAmount,
          userWon,
          username: user.username,
          timestamp: new Date().toLocaleString(),
        });
      }
    } catch (err) {
      setError(`Race failed: ${err.message}`);
      // Refund bet if something went wrong
      await addMoney(user.username, betAmount);
      updateWallet(betAmount);
      setRaceMessage("");
    } finally {
      setIsRacing(false);
    }
  };

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
                handleAddFunds(parseInt(addMoneyInput));
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
          <button className="message-close-btn" onClick={() => setRaceMessage("")} title="Close message">✕</button>
        </div>
      )}

      {/* Driver Selection */}
      <div className="race-setup">
        <div className="driver-selection">
          <label>Select Driver 1:</label>
          <select 
            value={selectedDriver1?.number || ""} 
            onChange={(e) => setSelectedDriver1(drivers.find(d => d.number === parseInt(e.target.value)))}
            disabled={isRacing}
          >
            <option value="">-- Choose Driver --</option>
            {drivers.map(driver => (
              <option key={driver.number} value={driver.number} disabled={selectedDriver2?.number === driver.number}>
                {driver.name} (#Car {driver.number})
              </option>
            ))}
          </select>
          {selectedDriver1 && <p>Status: {selectedDriver1.status ? "✅ Active" : "❌ Inactive"}</p>}
        </div>

        <div className="vs">VS</div>

        <div className="driver-selection">
          <label>Select Driver 2:</label>
          <select 
            value={selectedDriver2?.number || ""} 
            onChange={(e) => setSelectedDriver2(drivers.find(d => d.number === parseInt(e.target.value)))}
            disabled={isRacing}
          >
            <option value="">-- Choose Driver --</option>
            {drivers.map(driver => (
              <option key={driver.number} value={driver.number} disabled={selectedDriver1?.number === driver.number}>
                {driver.name} (#Car {driver.number})
              </option>
            ))}
          </select>
          {selectedDriver2 && <p>Status: {selectedDriver2.status ? "✅ Active" : "❌ Inactive"}</p>}
        </div>
      </div>

      {/* Betting Selection */}
      <div className="betting-selection">
        <h3>Who do you want to bet on?</h3>
        <div className="bet-options">
          {selectedDriver1 && (
            <button onClick={() => setBetDriver(selectedDriver1)} className={`bet-button ${betDriver?.number === selectedDriver1.number ? 'selected' : ''}`} disabled={isRacing}>
              {selectedDriver1.name}
            </button>
          )}
          {selectedDriver2 && (
            <button onClick={() => setBetDriver(selectedDriver2)} className={`bet-button ${betDriver?.number === selectedDriver2.number ? 'selected' : ''}`} disabled={isRacing}>
              {selectedDriver2.name}
            </button>
          )}
        </div>
        {betDriver && <p className="bet-confirmation">✅ Betting on: <strong>{betDriver.name}</strong></p>}
      </div>

      {/* Bet Amount */}
      <div className="bet-section">
        <label>Bet Amount: $</label>
        <input
          type="number"
          value={betAmount === 0 ? '' : betAmount}
          onChange={(e) => setBetAmount(e.target.value === '' ? 0 : Number(e.target.value))}
          disabled={isRacing || !betDriver}
          min="0"
          max={wallet}
          placeholder="0"
        />
      </div>

      {/* Race Controls */}
      <div className="race-controls">
        <button onClick={executeRace} disabled={isRacing || !selectedDriver1 || !selectedDriver2 || betAmount <= 0} className="btn-race">
          {isRacing ? "🏁 Racing..." : "Start Race"}
        </button>
        <button onClick={resetRace} disabled={isRacing} className="btn-reset">Reset</button>
      </div>

      {/* Race Results */}
      {raceResult && (
        <div className="race-results">
          <h3>Race Results</h3>
          <div className="result-details">
            <p><strong>{raceResult.driver1.name}</strong> vs <strong>{raceResult.driver2.name}</strong></p>
            {raceResult.result === "tie" ? (
              <p className="tie">🤝 TIE - No winner</p>
            ) : (
              <>
                <p className="winner">🏆 Winner: <strong>{raceResult.winner.name}</strong></p>
                <p className="loser">Loser: {raceResult.loser.name}</p>
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
