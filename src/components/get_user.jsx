const getUser = async (username, password) => {
  try {
    const response = await fetch(
      "https://unit-4-project-app-24d5eea30b23.herokuapp.com/get/all?teamId=2"
    );
    if (!response.ok) throw new Error("Failed to fetch records");

    const data = await response.json();
    const records = Array.isArray(data.response) ? data.response : [];

    for (const record of records) {
      const users = Array.isArray(record.data_json?.users) ? record.data_json.users : [];
      const user = users.find(u => u.username === username && u.password === password);
      if (user) return user;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export default getUser;
