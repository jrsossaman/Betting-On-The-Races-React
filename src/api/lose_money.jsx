const loseMoney = async (username, amount) => {
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

    const updatedUsers = record.body.users.map((user) =>
      user.username === username
        ? { ...user, wallet: Math.max(user.wallet - amount, 0) }
        : user
    );

    const updateResponse = await fetch(
      `https://unit-4-project-app-24d5eea30b23.herokuapp.com/update/data?teamId=2&recordId=${record.id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: { ...record.body, users: updatedUsers } }),
      }
    );

    if (!updateResponse.ok) throw new Error("Failed to subtract money");

    return await updateResponse.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default loseMoney;


