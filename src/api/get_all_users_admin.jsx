const getAllUsersAdmin = async (teamId = 2) => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001";
    const response = await fetch(
      `${apiUrl}/api/users?teamId=${teamId}`
    );

    if (!response.ok) throw new Error("Failed to fetch users");

    const data = await response.json();
    const allUsers = data.data || [];

    // Filter out admin users
    const nonAdminUsers = allUsers.filter(user => !user.isAdmin);

    return nonAdminUsers;
  } catch (error) {
    console.error("Error fetching non-admin users:", error);
    throw error;
  }
};

export default getAllUsersAdmin;
