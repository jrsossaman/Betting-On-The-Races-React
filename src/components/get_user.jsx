const getUser = async (username, password) => {
  try {
    const response = await fetch(`https://unit-4-project-app-24d5eea30b23.herokuapp.com/get/all?teamId=2`);
    if (!response.ok) throw new Error("Failed to fetch user");

    const data = await response.json();

    
    const users = data.body?.users || [];

   
    const matchedUser = users.find(
      (u) => u.username === username && u.password === password
    );

    return matchedUser || null;
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
};

export default getUser;
