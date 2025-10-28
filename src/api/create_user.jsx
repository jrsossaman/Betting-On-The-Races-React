const createUser = async (name, username, password, wallet, email, phone) => {
  try {
    const getResponse = await fetch(
      "https://unit-4-project-app-24d5eea30b23.herokuapp.com/get/all?teamId=2"
    );

    if (!getResponse.ok) throw new Error("Failed to fetch existing users");
    const data = await getResponse.json();

    const allUsers = data.body.flatMap(record => record.users || []);

    const duplicateUser = allUsers.find(
      user => user.username === username || user.password === password
    );

    if (duplicateUser) {
      throw new Error("Account already exists");
    }

    const newUser = { name, username, password, wallet, email, phone };

    const response = await fetch(
      "https://unit-4-project-app-24d5eea30b23.herokuapp.com/post/data",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team: 2,
          body: { users: [newUser] }, 
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to create user");

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("createUser error:", error);
    throw error;
  }
};

export default createUser;

