class Driver {
    constructor(number, name, status, driveBonus) {
        this.number = number;
        this.name = name;
        this.status = status;
        this.driveBonus = driveBonus;
    }
}

const getDriver = async (driverName) => {
    fetch('https://unit-4-project-app-24d5eea30b23.herokuapp.com/get/all?teamId=2')
        .then((response) => response.json())
        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].name === driverName) {
                    const driver = new Driver(
                        data[i].number,
                        data[i].name,
                        data[i].status,
                        data[i].driveBonus
                    );
                    return driver;
                }
            }
        });
};
export default getDriver;