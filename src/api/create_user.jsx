const createUser = async (name, username, password, wallet, email, phone) => {
  try {
    const newUser = { name, username, password, wallet };
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001";

    const response = await fetch(
      `${apiUrl}/api/users`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create user");
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
