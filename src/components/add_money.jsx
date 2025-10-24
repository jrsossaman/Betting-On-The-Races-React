const addMoney = async (username, amount) => {
  try {
    const response = await fetch(`https://unit-4-project-app-24d5eea30b23.herokuapp.com/get/all?teamId=2`);
    if (!response.ok) throw new Error('Failed to fetch team data');
    const data = await response.json();

    const user = data.body.users.find(u => u.username === username);
    if (!user) throw new Error('User not found');

    user.wallet += amount;
    const updateResponse = await fetch(`https://unit-4-project-app-24d5eea30b23.herokuapp.com/update/data/teamId=2&recordId=${user.username}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: {
          users: [
            {
              username: user.username,
              wallet: user.wallet
            }
          ]
        }
      }),
    });

    if (!updateResponse.ok) throw new Error('Failed to update wallet');

    const result = await updateResponse.json();
    return result;

  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default addMoney;
