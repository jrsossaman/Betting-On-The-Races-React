class User {
    constructor(name, username, password, wallet) {
        this.name = name;
        this.username = username;
        this.password = password;
        this.wallet = wallet;
    }
}

const getUser = async (username, password) => {
    const response = await fetch('/get/all?teamId=2');
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
