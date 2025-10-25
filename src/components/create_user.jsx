const createUser = async (name, username, password, wallet) => {
  try {
    
    const getResponse = await fetch('https://unit-4-project-app-24d5eea30b23.herokuapp.com/post/data/');
    if (!getResponse.ok) throw new Error('Failed to fetch existing data');
    const existingData = await getResponse.json();

    const updatedUsers = [
      ...existingData.body.users,
      { name, username, password, wallet }
    ];

    const response = await fetch('https://unit-4-project-app-24d5eea30b23.herokuapp.com/post/data/', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...existingData,         
        body: { ...existingData.body, users: updatedUsers } 
      }),
    });

    if (!response.ok) throw new Error('Failed to create user');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export default createUser;
