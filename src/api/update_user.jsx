const updateUser = async (username, updates) => {
  try {
    const getResponse = await fetch(
      "https://unit-4-project-app-24d5eea30b23.herokuapp.com/get/all?teamId=2"
    );
    if (!getResponse.ok) throw new Error("Failed to fetch records");

    const data = await getResponse.json();
    const records = Array.isArray(data.response) ? data.response : [];

    const record = records.find(
      (r) =>
        Array.isArray(r.data_json?.users) &&
        r.data_json.users.some((u) => u.username === username)
    );

    if (!record) throw new Error("User not found");

    const updatedUsers = record.data_json.users.map((user) =>
      user.username === username
        ? { ...user, ...updates, wallet: user.wallet } // wallet unchanged
        : user
    );

    const updateResponse = await fetch(
      `https://unit-4-project-app-24d5eea30b23.herokuapp.com/update/data?teamId=2&recordId=${record.id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: { users: updatedUsers } }),
      }
    );

    if (!updateResponse.ok) throw new Error("Failed to update user");

    return await updateResponse.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default updateUser;
