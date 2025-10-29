const checkForDuplicates = async (username) => {
  try {
    const response = await fetch(
      "https://unit-4-project-app-24d5eea30b23.herokuapp.com/get/all?teamId=2"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();

    const allUsers = data.response.flatMap(entry => {
      const json = entry.data_json;
      if (!json) return [];
      if (Array.isArray(json.users)) return json.users;
      if (json.body && Array.isArray(json.body.users)) return json.body.users;
      return [];
    });

    return allUsers.some(u => u.username.toLowerCase() === username.toLowerCase());
    
  } catch (error) {
    console.error("❌ checkForDuplicates error:", error);
    throw error;
  }
};

export default checkForDuplicates;
