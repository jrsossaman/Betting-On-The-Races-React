const diceRoller = async (driver1, driver2, teamId = 2) => {
    
    const driver1Roll = Math.floor(Math.random() * 20 + 1) + driver1.driveBonus;
    const driver2Roll = Math.floor(Math.random() * 20 + 1) + driver2.driveBonus;

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

    
    await fetch(`https://unit-4-project-app-24d5eea30b23.herokuapp.com/update/data/teamId=${teamId}&recordId=${winner.number}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: { drivers: [{ number: winner.number, status: true }] } }),
    });

   
    await fetch(`https://unit-4-project-app-24d5eea30b23.herokuapp.com/update/data/teamId=${teamId}&recordId=${loser.number}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: { drivers: [{ number: loser.number, status: false }] } }),
    });

    return winner;
};

export default diceRoller;
