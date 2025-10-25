const deleteUser = async (username, password) => {
  try {
    const getResponse = await fetch('https://unit-4-project-app-24d5eea30b23.herokuapp.com/post/data/');
    if (!getResponse.ok) throw new Error('Failed to fetch data');
    const existingData = await getResponse.json();

    const updatedUsers = existingData.body.users.filter(
      user => !(user.username === username && user.password === password)
    );

    const response = await fetch('https://unit-4-project-app-24d5eea30b23.herokuapp.com/post/data/', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...existingData,
        body: { ...existingData.body, users: updatedUsers }
      }),
    });

    if (!response.ok) throw new Error('Failed to delete user');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default deleteUser;
