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
        carrier: [carrierCords],
        battleShip: [battleShipCords],
        battleShip1: [battleShip1Cords],
        cruiser: [cruiserCords],
        cruiser1: [cruiser1Cords],
        cruiser2: [cruiser2Cords],
        destroyer: [destroyerCords],
        destroyer2: [destroyer2Cords],
        destroyer3: [destroyer3Cords],
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

    const checkedCoordinates = [];

    const receiveAttack = (targetCords, playerShips) => {
      checkedCoordinates.push(targetCords);

      Object.entries(playerShips.coordinates).forEach(([key, value]) => {
        if (JSON.stringify(value) === JSON.stringify([targetCords])) {
          // if the target cords matches a ship cords.
          if (key === "carrier") playerShips.carrier.hit();
          if (key === "battleShip") playerShips.battleShip.hit();
          if (key === "battleShip1") playerShips.battleShip1.hit();
          if (key === "cruiser") playerShips.cruiser.hit();
          if (key === "cruiser1") playerShips.cruiser1.hit();
          if (key === "cruiser2") playerShips.cruiser2.hit();
          if (key === "destroyer") playerShips.destroyer.hit();
          if (key === "destroyer1") playerShips.destroyer1.hit();
          if (key === "destroyer2") playerShips.destroyer2.hit();
          if (key === "destroyer3") playerShips.destroyer3.hit();
        }
      });
    };

    return { newBoard, receiveAttack, deployShips };
  };

  return { Ship, Gameboard };
})();

export { mainObjects };
