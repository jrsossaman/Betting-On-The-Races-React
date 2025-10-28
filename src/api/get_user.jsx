const getUser = async (username, password) => {
  try {
    const response = await fetch(
      "https://unit-4-project-app-24d5eea30b23.herokuapp.com/get/all?teamId=2"
    );
    if (!response.ok) throw new Error("Failed to fetch records");

    const records = await response.json();

    for (const record of records) {
      if (record.body && Array.isArray(record.body.users)) {
        const user = record.body.users.find(
          (u) => u.username === username && u.password === password
        );
        if (user) return user;
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export default getUser;




