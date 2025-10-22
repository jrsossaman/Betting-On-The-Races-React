const hotStreakBonus = async (driver) => {
  driver.driveBonus += 1;

  await fetch(`https://unit-4-project-app-24d5eea30b23.herokuapp.com/update/data/teamId=2&recordId=${driver.number}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ driveBonus: driver.driveBonus}),
  });

  return driver;
};

export default hotStreakBonus;