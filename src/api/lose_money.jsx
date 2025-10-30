const loseMoney = async (username, amount) => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001";
    const response = await fetch(
      `${apiUrl}/api/lose-money/${username}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to subtract money');
    }

    return await response.json();
  } catch (error) {
    console.error('Lose money error:', error);
    throw error;
  }
};

export default loseMoney;


