import React from "react";

const DiceRoller = (driver1, driver2) => {
    var driver1Roll = (Math.floor(Math.random() * 20) + 1) + driver1.driveBonus;
    var driver2Roll = (MMath.floor(Math.random() * 20) + 1) + driver2.driveBonus;
    if (driver1Roll > driver2Roll) {
        driver1.winning = true;
        driver2.winning = false;
    } else if (driver2Roll > driver1Roll) {
        driver2.winning = true;
        driver1.winning = false;
    }
};

export default DiceRoller;
