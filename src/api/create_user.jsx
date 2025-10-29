const createUser = async (name, username, password, wallet, email, phone) => {
  try {
    const getResponse = await fetch(
      "https://unit-4-project-app-24d5eea30b23.herokuapp.com/get/all?teamId=2"
    );
    if (!getResponse.ok) throw new Error("Failed to fetch existing data");
    const data = await getResponse.json();

    const allUsers = data.body
      ? data.body.flatMap(record => record.data_json?.users || [])
      : [];

    const existingUser = allUsers.find(
      u => u.username === username || u.password === password
    );
    if (existingUser) throw new Error("User already exists");

    const newUser = { name, username, password, wallet, email, phone };

    const response = await fetch(
      "https://unit-4-project-app-24d5eea30b23.herokuapp.com/post/data",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team: 2,
          body: {
            users: [newUser], 
          },
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to create user");
    return await response.json();
  } catch (error) {
    console.error("createUser error:", error);
    throw error;
  }
};

export default createUser;
