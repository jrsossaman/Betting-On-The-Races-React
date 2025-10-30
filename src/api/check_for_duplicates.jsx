const checkForDuplicates = async (username) => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001";
    const response = await fetch(
      `${apiUrl}/api/users`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    const allUsers = data.data || [];

    return allUsers.some(u => u.username.toLowerCase() === username.toLowerCase());
    
  } catch (error) {
    console.error("❌ checkForDuplicates error:", error);
    throw error;
  }
};

export default checkForDuplicates;
