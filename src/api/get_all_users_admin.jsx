const getAllUsersAdmin = async (teamId = 2) => {
  try {
    const response = await fetch(
      `https://unit-4-project-app-24d5eea30b23.herokuapp.com/get/all?teamId=${teamId}`
    );

    if (!response.ok) throw new Error("Failed to fetch team data");

    const data = await response.json();

    const allUsers = data.body.flatMap(record => record.users || []);

    const nonAdminUsers = allUsers.filter(
      user =>
        user.username.toLowerCase() !== "admin123" &&
        user.name.toLowerCase() !== "admin"
    );

    return nonAdminUsers;
  } catch (error) {
    console.error("Error fetching non-admin users:", error);
    throw error;
  }
};

export default getAllUsersAdmin;
