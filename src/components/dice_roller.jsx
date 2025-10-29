const diceRoller = async (driver1, driver2, teamId = 2) => {
    const driver1Bonus = driver1.driveBonus || 0;
    const driver2Bonus = driver2.driveBonus || 0;
    
    const driver1Roll = Math.floor(Math.random() * 20 + 1) + driver1Bonus;
    const driver2Roll = Math.floor(Math.random() * 20 + 1) + driver2Bonus;

    console.log(`${driver1.name} rolled ${driver1Roll} vs ${driver2.name} rolled ${driver2Roll}`);

    let winner, loser;

    if (driver1Roll > driver2Roll) {
        winner = { ...driver1, status: true };
        loser = { ...driver2, status: false };
    } else if (driver2Roll > driver1Roll) {
        winner = { ...driver2, status: true };
        loser = { ...driver1, status: false };
    } else {
        
        return null;
    }

    
    await fetch(`/update/data/teamId=${teamId}&recordId=${winner.number}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: { drivers: [{ number: winner.number, status: true }] } }),
    });

   
    await fetch(`/update/data/teamId=${teamId}&recordId=${loser.number}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: { drivers: [{ number: loser.number, status: false }] } }),
    });

    return winner;
};

export default diceRoller;
