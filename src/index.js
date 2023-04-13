const isTargetInArray = (arr, target) => {
  let contains = false;

  if (JSON.stringify(arr) === JSON.stringify(target)) contains = true;

  if (arr === undefined) return contains;

  if (target === undefined) return contains;

  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];

    if (JSON.stringify(element) === JSON.stringify(target)) contains = true;
  }

  return contains;
};

const mainObjects = (() => {
  const Ship = (lengthNumber, hitsNumber, coords) => {
    const currentCords = coords;

    const checkSunk = (length, hits) => {
      if (length === hits) return true;
      return false;
    };

    let shipHits = hitsNumber;

    const shipLength = lengthNumber;

    const isSunk = () => checkSunk(shipLength, shipHits);

    const hit = () => shipHits++;

    const currentHits = () => shipHits;

    return { isSunk, hit, currentHits, currentCords, shipLength };
  };

  const Gameboard = () => {
    const deployShips = (
      carrierCords,
      battleShipCords,
      battleShip1Cords,
      cruiserCords,
      cruiser1Cords,
      cruiser2Cords,
      destroyerCords,
      destroyer1Cords,
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
        destroyer1: destroyer1Cords,
        destroyer2: destroyer2Cords,
        destroyer3: destroyer3Cords,
      };

      const carrier = Ship(4, 0, coordinates.carrier);

      const battleShip = Ship(3, 0, coordinates.battleShip);

      const battleShip1 = Ship(3, 0, coordinates.battleShip1);

      const cruiser = Ship(2, 0, coordinates.cruiser);

      const cruiser1 = Ship(2, 0, coordinates.cruiser1);

      const cruiser2 = Ship(2, 0, coordinates.cruiser2);

      const destroyer = Ship(1, 0, coordinates.destroyer);

      const destroyer1 = Ship(1, 0, coordinates.destroyer1);

      const destroyer2 = Ship(1, 0, coordinates.destroyer2);

      const destroyer3 = Ship(1, 0, coordinates.destroyer3);

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
      const currentShips = Object.entries(playerShips.coordinates);

      for (let i = 0; i < currentShips.length; i++) {
        let success = false;

        const shipCords = currentShips[i][1];

        const shipName = currentShips[i][0];

        if (isTargetInArray(shipCords, targetCords)) {
          success = true;

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

    const checkSunk = (playerShips) => {
      const areAllSunk = (ships) => {
        // either we didn't defined the cords of a ship (undefined), or it is actually sunk, we take that as true.
        if (
          (ships.carrier.currentCords === undefined ||
            ships.carrier.isSunk()) &&
          (ships.battleShip.currentCords === undefined ||
            ships.battleShip.isSunk()) &&
          (ships.battleShip1.currentCords === undefined ||
            ships.battleShip1.isSunk()) &&
          (ships.cruiser.currentCords === undefined ||
            ships.cruiser.isSunk()) &&
          (ships.cruiser1.currentCords === undefined ||
            ships.cruiser1.isSunk()) &&
          (ships.cruiser2.currentCords === undefined ||
            ships.cruiser2.isSunk()) &&
          (ships.destroyer.currentCords === undefined ||
            ships.destroyer.isSunk()) &&
          (ships.destroyer1.currentCords === undefined ||
            ships.destroyer1.isSunk()) &&
          (ships.destroyer2.currentCords === undefined ||
            ships.destroyer2.isSunk()) &&
          (ships.destroyer3.currentCords === undefined ||
            ships.destroyer3.isSunk())
        )
          return true;

        return false;
      };

      return areAllSunk(playerShips);
    };

    return {
      receiveAttack,
      deployShips,
      missedAttacks,
      successAttacks,
      checkSunk,
    };
  };

  return { Ship, Gameboard };
})();

const playerLogic = (() => {
  const Player = (name, shipsCords) => {
    const playerName = name;

    const playerBoard = mainObjects.Gameboard();

    const playerShips = playerBoard.deployShips(...shipsCords);

    const receiveAttack = (coordinates) =>
      playerBoard.receiveAttack(coordinates, playerShips);

    return { playerName, playerBoard, playerShips, receiveAttack };
  };

  const cpuPlayer = (humanPlayer, shipsCords) => {
    const rivalPlayer = humanPlayer;

    const cpuBoard = mainObjects.Gameboard();

    const cpuShips = cpuBoard.deployShips(...shipsCords);

    const receiveAttack = (coordinates) =>
      cpuBoard.receiveAttack(coordinates, cpuShips);

    const usedCoords = [];

    const attackPlayer = (coords) => {
      const randomInt = (max) => Math.floor(Math.random() * max);

      const randomCoords = [randomInt(9), randomInt(9)];

      // call the function again and generate new random coords if the attack has already be done in that coordinate.
      if (isTargetInArray(usedCoords, coords)) return attackPlayer();

      if (isTargetInArray(usedCoords, randomCoords)) return attackPlayer();

      if (coords !== undefined) {
        // if we set manual empty coords for testing or another purposes.
        usedCoords.push(coords);
        return rivalPlayer.receiveAttack(coords);
      }

      return rivalPlayer.receiveAttack(randomCoords);
    };

    return { attackPlayer, cpuBoard, cpuShips, receiveAttack };
  };

  return { Player, cpuPlayer };
})();

const Game = (() => {
  const newGame = (playerName, playerCoords, cpuCoords) => {
    const Player = playerLogic.Player(playerName, playerCoords);

    const cpuPlayer = playerLogic.cpuPlayer(Player, cpuCoords);

    return { Player, cpuPlayer };
  };

  return { newGame };
})();

const DOMLogic = (() => {
  const displayGrid = (grid1, grid2) => {
    const createGrid = (size) => {
      const recursive = (yPos) => {
        if (yPos === size) return;

        for (let i = 0; i < size; i++) {
          const gridElement = document.createElement("div");
          gridElement.className = `${yPos},${i}`;

          const gridElement2 = document.createElement("div");
          gridElement2.className = `${yPos},${i}`;

          if (grid1 !== undefined && grid1 !== null) grid1.appendChild(gridElement);
          if (grid2 !== undefined && grid2 !== null) grid2.appendChild(gridElement2);
        }

        recursive(yPos + 1);
      };
      recursive(0);
    };

    createGrid(10);
  };

  const UILogic = (nodes1, nodes2, gameInfo) => {
    const player1Coords = gameInfo.Player.playerShips.coordinates;

    const player2Coords = gameInfo.cpuPlayer.cpuShips.coordinates;

    const attackPlayer = (coord) => gameInfo.Player.receiveAttack(coord);

    const attackCpu = (coord) => gameInfo.cpuPlayer.receiveAttack(coord);

    const attackOnClick = (shipCoords, nodeCoord, attackFunction) => {
      // if the player has a ship in the clicked coordinate, attack the player to that specific coord.
      let wasSuccessful = false
      if (isTargetInArray(Object.values(shipCoords), nodeCoord)) {
        // when the nodeCoord is inside of a one-coordinate ship, this conditional is used.
        attackFunction(nodeCoord);
        wasSuccessful = true
        return wasSuccessful
      }
      // when the nodeCoord is inside of a multiple-coordinate ship.
      for (let i = 0; i < shipCoords.length; i++) {
        // loop through the coords array of each ship, until the nodeCoord is found.
        const currentCoords = shipCoords[i];
        if (isTargetInArray(currentCoords, nodeCoord)) {
          attackFunction(nodeCoord);
          wasSuccessful = true
          break; // stop looping through the ships coords to optimize time complexity.
        }
      }
      return wasSuccessful
    };

    const classToArray = (classCoord) => {
      const arrayCoord = [];

      const x = classCoord.slice(0, 1);

      const y = classCoord.slice(2, 3);

      arrayCoord.push(Number(x));
      arrayCoord.push(Number(y));

      return arrayCoord;
    };

    const visualIndicators = (e, wasSuccessful) => {

      const currentNode = e.target
      if (wasSuccessful === false) currentNode.textContent = "•"
      else {
        currentNode.textContent = "X"
      }

    }

    const detectAttacks = (e) => {
      const parentClass = e.target.parentElement.className;

      const nodeClass = e.target.className;


      const nodeCoord = classToArray(nodeClass);

      if (parentClass === "grid-1") {
        // if the clicked coordinate is inside of grid-1, we know that it is an attack to player1.

        const cleanCoords = Object.values(player1Coords).filter(
          (coords) => coords !== undefined
        ); // filter undefined coords.
        return attackOnClick(cleanCoords, nodeCoord, attackPlayer);
      }

      if (parentClass === "grid-2") {
        const cleanCoords = Object.values(player2Coords).filter(
          (coords) => coords !== undefined
        );
        return attackOnClick(cleanCoords, nodeCoord, attackCpu);
      }
    };

    for (let i = 0; i < nodes1.length; i++) {
      nodes1[i].addEventListener("click", (e) => {
        if (detectAttacks(e) === false) {
          visualIndicators(e, false)
        }
        else {
          visualIndicators(e, true)
        }

      });
      nodes2[i].addEventListener("click", (e) => {
        if (detectAttacks(e) === false) {
          visualIndicators(e, false)
        }
        else {
          visualIndicators(e, true)
        }
      });
    }
  };

  const startGame = (
    gridContainer1,
    gridContainer2,
    playerCoords,
    cpuCoords
  ) => {
    const currentGame = Game.newGame("example", playerCoords, cpuCoords);

    if ((gridContainer1 !== undefined && gridContainer1 !== null) && (gridContainer2 !== undefined && gridContainer2 !== null)) {
      displayGrid(gridContainer1, gridContainer2)
      UILogic(gridContainer1.childNodes, gridContainer2.childNodes, currentGame);
    }

    return { currentGame };
  };



  return { startGame, displayGrid };
})();

const GameLoop = (() => {

  const setupGame = () => {

    const coordToClass = (arr) => `${arr.slice(0, 1)},${arr.slice(1, 2)}`

    const changeCoordColor = (className, gridNumber) => {

      const currentCoord = document.getElementsByClassName(className)[gridNumber - 1]

      if (currentCoord !== undefined) currentCoord.style.border = "2px solid green"

    }

    const flatCoords = (coordsArr) => {

      const oneDimensionCoords = []

      for (let i = 0; i < coordsArr.length; i++) {
        const coords = coordsArr[i];

        if (typeof (coords[0]) === "object") oneDimensionCoords.push(...coords) // if the ships have more than one coordinate.

        else oneDimensionCoords.push(coords)

      }

      return oneDimensionCoords
    }

    const showShips = (currentCoords, gridNumber) => {

      const coords = flatCoords(currentCoords)

      for (let i = 0; i < coords.length; i++) {

        changeCoordColor(coordToClass(coords[i]), gridNumber)

      }

    }

    const ExampleCoords = [
      [[0, 1], [0, 2], [0, 3], [0, 4],],
      [[2, 1], [3, 1], [4, 1],],
      [[0, 6], [0, 7], [0, 8],],
      [[3, 3], [3, 4],],
      [[6, 3], [6, 2],],
      [[6, 8], [6, 9],],
      [7, 5],
      [9, 2],
      [9, 9],
      [8, 7],
    ];

    const playerGrid = document.getElementsByClassName("grid-1")[0]

    DOMLogic.displayGrid(playerGrid)
    showShips(ExampleCoords, 1)
    const gridsContainer = document.getElementsByClassName("grids-container")[0]

    // dinamically generate the cpu grid.

    const genCpuGrid = () => {
      const grid2 = document.createElement("div")
      grid2.className = "grid-2"
      gridsContainer.appendChild(grid2)

      return grid2
    }

    // receive coords, grid containers and start the game.

    const startButton = document.getElementsByClassName("start-button")[0]

    if (startButton !== undefined) startButton.addEventListener("click", () => { DOMLogic.startGame(playerGrid, genCpuGrid(), ExampleCoords, ExampleCoords) })

  }

  return { setupGame }


})();

GameLoop.setupGame()



export { mainObjects, playerLogic, Game, DOMLogic, GameLoop };