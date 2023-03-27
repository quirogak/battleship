const mainObjects = (() => {
  const Ship = (lengthNumber, hitsNumber) => {
    const checkSunk = (length, hits) => {
      if (length === hits) return true;
      return false;
    };

    let shipHits = hitsNumber;

    const shipLength = lengthNumber;

    const isSunk = () => checkSunk(shipLength, shipHits);

    const hit = () => shipHits++;

    const currentHits = () => shipHits;

    return { isSunk, hit, currentHits };
  };

  const Gameboard = () => {
    const newBoard = (size) => {
      const board = [];

      const recursive = (yPos) => {
        if (yPos === size) return;

        for (let i = 0; i < size; i++) {
          board.push([yPos, i]);
        }

        recursive(yPos + 1);
      };

      recursive(0);

      return board;
    };

    const deployShips = (
      carrierCords,
      battleShipCords,
      battleShip1Cords,
      cruiserCords,
      cruiser1Cords,
      cruiser2Cords,
      destroyerCords,
      destroyer2Cords,
      destroyer3Cords
    ) => {
      const coordinates = {
        carrier: carrierCords,
        battleShip: battleShipCords,
        battleShip1: battleShip1Cords,
        cruiser: cruiserCords,
        cruiser1: cruiser1Cords,
        cruiser2: cruiser2Cords,
        destroyer: destroyerCords,
        destroyer2: destroyer2Cords,
        destroyer3: destroyer3Cords,
      };

      const carrier = Ship(4, 0);

      const battleShip = Ship(3, 0);

      const battleShip1 = Ship(3, 0);

      const cruiser = Ship(2, 0);

      const cruiser1 = Ship(2, 0);

      const cruiser2 = Ship(2, 0);

      const destroyer = Ship(1, 0);

      const destroyer1 = Ship(1, 0);

      const destroyer2 = Ship(1, 0);

      const destroyer3 = Ship(1, 0);

      return {
        carrier,
        battleShip,
        battleShip1,
        cruiser,
        cruiser1,
        cruiser2,
        destroyer,
        destroyer1,
        destroyer2,
        destroyer3,
        coordinates,
      };
    };

    const missedAttacks = [];

    const successAttacks = [];

    const receiveAttack = (targetCords, playerShips) => {
      const isTargetInArray = (arr, target) => {
        let contains = false;

        if (JSON.stringify(arr) === JSON.stringify(target)) contains = true;

        if (arr === undefined) return contains;

        for (let i = 0; i < arr.length; i++) {
          const element = arr[i];

          if (JSON.stringify(element) === JSON.stringify(target))
            contains = true;
        }

        return contains;
      };

      const currentShips = Object.entries(playerShips.coordinates)

      for (let i = 0; i < currentShips.length; i++) {

        let success = false

        const shipCords = currentShips[i][1]

        const shipName = currentShips[i][0]

        if (isTargetInArray(shipCords, targetCords)) {

          success = true

          successAttacks.push(targetCords);

          // if the target cords matches a ship cords.
          if (shipName === "carrier") playerShips.carrier.hit();
          if (shipName === "battleShip") playerShips.battleShip.hit();
          if (shipName === "battleShip1") playerShips.battleShip1.hit();
          if (shipName === "cruiser") playerShips.cruiser.hit();
          if (shipName === "cruiser1") playerShips.cruiser1.hit();
          if (shipName === "cruiser2") playerShips.cruiser2.hit();
          if (shipName === "destroyer") playerShips.destroyer.hit();
          if (shipName === "destroyer1") playerShips.destroyer1.hit();
          if (shipName === "destroyer2") playerShips.destroyer2.hit();
          if (shipName === "destroyer3") playerShips.destroyer3.hit();

        }

        if (success === true) break;
      }

      if (!isTargetInArray(successAttacks, targetCords))
        missedAttacks.push(targetCords); // if the target cords are not inside successAttacks, it is a missed attack.
    };

    return { newBoard, receiveAttack, deployShips, missedAttacks };
  };

  return { Ship, Gameboard };
})();

export { mainObjects };
