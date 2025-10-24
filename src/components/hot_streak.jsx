const hotStreakBonus = async (driver, teamId = 2) => {
  
  driver.driveBonus += 1;
  await fetch(`/update/data/teamId=${teamId}&recordId=${driver.number}`, {
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
