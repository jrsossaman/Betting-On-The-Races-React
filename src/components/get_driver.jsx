class Driver {
    constructor(number, name, status, driveBonus) {
        this.number = number;
        this.name = name;
        this.status = status;
        this.driveBonus = driveBonus;
    }
}

const getDriver = async () => {
    const response = await fetch('/get/all?teamId=2');
    if (!response.ok) throw new Error('Failed to fetch drivers');

    const data = await response.json();
    const drivers = data.body.drivers.map(d => 
        new Driver(d.number, d.name, d.status, d.driveBonus)
    );

    return drivers;
};

export default getDriver;

