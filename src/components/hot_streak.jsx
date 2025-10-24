const hotStreakBonus = async (driver, teamId = 2) => {
  
  driver.driveBonus += 1;
  await fetch(`https://unit-4-project-app-24d5eea30b23.herokuapp.com/update/data/teamId=${teamId}&recordId=${driver.number}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      body: {
        drivers: [
          {
            number: driver.number,
            driveBonus: driver.driveBonus
          }
        ]
      }
    }),
  });

  return driver;
};

export default hotStreakBonus;
