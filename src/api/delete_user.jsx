const deleteUser = async (username) => {
  try {
    // Fetch all records
    const getResponse = await fetch(
      "https://unit-4-project-app-24d5eea30b23.herokuapp.com/get/all?teamId=2"
    );
    if (!getResponse.ok) throw new Error("Failed to fetch records");

    const data = await getResponse.json();
    const records = Array.isArray(data.response) ? data.response : [];

    // Find the record containing the user
    const record = records.find((r) =>
      Array.isArray(r.data_json?.users) &&
      r.data_json.users.some((u) => u.username === username)
    );

    if (!record) throw new Error("User not found");

    // Make the delete API call (must use POST)
    const deleteResponse = await fetch(
      "https://unit-4-project-app-24d5eea30b23.herokuapp.com/delete/data",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: record.id, team: 2 }),
      }
    );

    if (!deleteResponse.ok) throw new Error("Failed to delete user");

    return await deleteResponse.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default deleteUser;
