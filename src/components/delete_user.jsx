const deleteUser = async (username, password) => {
    try {
        const response = await fetch(`https://unit-4-project-app-24d5eea30b23.herokuapp.com/delete/user?teamId=2`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) throw new Error('Failed to delete user');

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default deleteUser;

