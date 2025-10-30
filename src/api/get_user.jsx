const getUser = async (username, password) => {
  try {
    // First, try the local backend API (MongoDB)
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001";
    const response = await fetch(
      `${apiUrl}/api/users/username/${username}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const user = data.data;

      // Verify password matches
      if (user && user.password === password) {
        return user;
      } else {
        console.error("Password mismatch or user not found");
        return null;
      }
    } else if (response.status === 403) {
      // User is suspended
      console.error("Account is suspended. Please contact support.");
      return null;
    } else if (response.status === 404) {
      // User not found
      console.error("User not found");
      return null;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export default getUser;
