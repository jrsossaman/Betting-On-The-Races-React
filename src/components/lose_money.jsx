const loseMoney = async (username, amount) => {
  try {
    const response = await fetch(`/get/all?teamId=2`);
    if (!response.ok) throw new Error('Failed to fetch team data');
    const data = await response.json();

    const user = data.body.users.find(u => u.username === username);
    if (!user) throw new Error('User not found');

    user.wallet -= amount;
    const updateResponse = await fetch(`/update/data/teamId=2&recordId=${user.username}`, {
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

export default loseMoney;