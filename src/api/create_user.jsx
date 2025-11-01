const createUser = async (name, username, password, wallet, email, phone) => {
  try {
    const newUser = { name, username, password, wallet, email, phone };

    console.log("submitting user:", newUser);

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

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    const createdData = await response.json();
    console.log("✅ User created successfully:", createdData);

    return createdData;
  } catch (error) {
    console.error("❌ createUser error:", error);
    throw error;
  }
};

export default createUser;