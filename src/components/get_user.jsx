class User {
    constructor(name, username, password, wallet) {
        this.name = name;
        this.username = username;
        this.password = password;
        this.wallet = wallet;
    }
}

const getUser = async (username, password) => {
    const response = await fetch('https://unit-4-project-app-24d5eea30b23.herokuapp.com/get/all?teamId=2');
    if (!response.ok) throw new Error('Failed to fetch users');

    const data = await response.json();

    for (const u of data.body.users) {
        if (u.username === username && u.password === password) {
            return new User(u.name, u.username, u.password, u.wallet);
        }
    }

    return null;
};

export default getUser;
