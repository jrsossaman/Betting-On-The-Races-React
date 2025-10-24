const createUser = async (name, username, password, wallet) => {
  try {
    const response = await fetch(`/update/data/teamId=2`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: {
          users: [
            {
              name,
              username,
              password,
              wallet
            }
          ]
        }
      }),
    });

    if (!response.ok) throw new Error('Failed to create user');

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default createUser;
