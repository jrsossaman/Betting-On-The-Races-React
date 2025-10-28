const deleteUser = async (username) => {
  try {
    const getResponse = await fetch(
      "https://unit-4-project-app-24d5eea30b23.herokuapp.com/get/all?teamId=2"
    );
    if (!getResponse.ok) throw new Error("Failed to fetch records");

    const records = await getResponse.json();
    const record = records.find(
      (r) =>
        r.body &&
        Array.isArray(r.body.users) &&
        r.body.users.some((u) => u.username === username)
    );

    if (!record) throw new Error("User not found");

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