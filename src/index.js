const globalLogic = (() => {

  // these functions are used in almost every other module, so i need to have them here in order to invoke them.

  const isTargetInArray = (arr, target) => {
    let contains = false;

    if (JSON.stringify(arr) === JSON.stringify(target)) contains = true;

    if (!arr) return contains;

    if (!target) return contains;

    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];

      if (JSON.stringify(element) === JSON.stringify(target)) contains = true;
    }

    return contains;
  };

  const classToArray = (classCoord) => {
    const arrayCoord = [];

    const x = classCoord.slice(0, 1);
    const y = classCoord.slice(2, 3);

    arrayCoord.push(Number(x));
    arrayCoord.push(Number(y));

    return arrayCoord;
  };

  const coordToClass = (arr) => `${arr.slice(0, 1)},${arr.slice(1, 2)}`;

  const changeCoordColor = (className, gridNumber, color) => {
    const currentCoord =
      document.getElementsByClassName(className)[gridNumber - 1];

    if (currentCoord)
      currentCoord.style.border = `1px solid ${color}`;
  };

  const indicateSunk = (ship, gridNumber) => {

    const currentCoords = ship.currentCords

    if (typeof (currentCoords[0]) === "number")  // when the ship only has one coordinate.
      changeCoordColor(coordToClass(currentCoords), gridNumber, "red")
    else
      for (let i = 0; i < currentCoords.length; i++) {
        changeCoordColor(coordToClass(currentCoords[i]), gridNumber, "red");
      }
  };

  return { isTargetInArray, changeCoordColor, indicateSunk, classToArray, coordToClass }

})();

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

    const receivedAttacks = [];

    const successAttacks = [];

    const receiveAttack = (targetCords, playerShips) => {
      const currentShips = Object.entries(playerShips.coordinates);
      receivedAttacks.push(targetCords)

      for (let i = 0; i < currentShips.length; i++) {
        let success = false;

        const shipCords = currentShips[i][1];

        const shipName = currentShips[i][0];

        if (globalLogic.isTargetInArray(shipCords, targetCords)) {
          success = true;

          successAttacks.push(targetCords);

          // if the target cords matches a ship cords.
          if (shipName === "carrier") {
            playerShips.carrier.hit();
            if (playerShips.carrier.isSunk()) return playerShips.carrier
          }
          if (shipName === "battleShip") {
            playerShips.battleShip.hit();
            if (playerShips.battleShip.isSunk()) return playerShips.battleShip
          }
          if (shipName === "battleShip1") {
            playerShips.battleShip1.hit();
            if (playerShips.battleShip1.isSunk()) return playerShips.battleShip1
          }
          if (shipName === "cruiser") {
            playerShips.cruiser.hit();
            if (playerShips.cruiser.isSunk()) return playerShips.cruiser
          }
          if (shipName === "cruiser1") {
            playerShips.cruiser1.hit();
            if (playerShips.cruiser1.isSunk()) return playerShips.cruiser1
          }
          if (shipName === "cruiser2") {
            playerShips.cruiser2.hit();
            if (playerShips.cruiser2.isSunk()) return playerShips.cruiser2
          }
          if (shipName === "destroyer") {
            playerShips.destroyer.hit();
            if (playerShips.destroyer.isSunk()) return playerShips.destroyer
          }
          if (shipName === "destroyer1") {
            playerShips.destroyer1.hit();
            if (playerShips.destroyer1.isSunk()) return playerShips.destroyer1
          }
          if (shipName === "destroyer2") {
            playerShips.destroyer2.hit();
            if (playerShips.destroyer2.isSunk()) return playerShips.destroyer2
          }
          if (shipName === "destroyer3") {
            playerShips.destroyer3.hit();
            if (playerShips.destroyer3.isSunk()) return playerShips.destroyer3
          }
        }

        if (success === true) break;
      }

    };

    const checkSunk = (playerShips) => {
      const areAllSunk = (ships) => {
        // either we didn't defined the cords of a ship (undefined), or it is actually sunk, we take that as true.
        if (
          (!ships.carrier.currentCords ||
            ships.carrier.isSunk()) &&
          (!ships.battleShip.currentCords ||
            ships.battleShip.isSunk()) &&
          (!ships.battleShip1.currentCords ||
            ships.battleShip1.isSunk()) &&
          (!ships.cruiser.currentCords ||
            ships.cruiser.isSunk()) &&
          (!ships.cruiser1.currentCords ||
            ships.cruiser1.isSunk()) &&
          (!ships.cruiser2.currentCords ||
            ships.cruiser2.isSunk()) &&
          (!ships.destroyer.currentCords ||
            ships.destroyer.isSunk()) &&
          (!ships.destroyer1.currentCords ||
            ships.destroyer1.isSunk()) &&
          (!ships.destroyer2.currentCords ||
            ships.destroyer2.isSunk()) &&
          (!ships.destroyer3.currentCords ||
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
      receivedAttacks,
      successAttacks,
      checkSunk,
    };
  };

  return { Ship, Gameboard };
})();

const playerLogic = (() => {

  const visualIndicators = (coord, wasSuccessful, target) => {

    let index = 0
    if (target === "cpu") index = 1

    const currentNode = document.getElementsByClassName(coord)[index]
    if (currentNode) {
      if (wasSuccessful === false) currentNode.textContent = "•";
      else {
        currentNode.textContent = "X";
      }
    }

  };

  const attackCorners = (nodeCoord, playerObj, targetName) => {

    const corners = []

    const corner1 = [nodeCoord[0] + 1, nodeCoord[1] + 1]
    const corner2 = [nodeCoord[0] + 1, nodeCoord[1] + -1]
    const corner3 = [nodeCoord[0] - 1, nodeCoord[1] + 1]
    const corner4 = [nodeCoord[0] - 1, nodeCoord[1] - 1]

    corners.push(corner1, corner2, corner3, corner4)

    for (let i = 0; i < corners.length; i++) {
      playerObj.receiveAttack(corners[i])
      visualIndicators(corners[i], false, targetName)
    }

  }

  const Player = (name, shipsCoords) => {
    const playerName = name;

    const playerCoords = shipsCoords

    const playerBoard = mainObjects.Gameboard();

    const playerShips = playerBoard.deployShips(...shipsCoords);

    const receiveAttack = (coordinates) => {
      const receivedAttack = playerBoard.receiveAttack(coordinates, playerShips)

      if (receivedAttack)  // if receivedAttack is a true value, it means that it contains a sunked ship.
        globalLogic.indicateSunk(receivedAttack, 1)

    }

    return { playerName, playerCoords, playerBoard, playerShips, receiveAttack };
  };

  const cpuPlayer = (humanPlayer, shipsCords) => {
    const rivalPlayer = humanPlayer;

    const cpuCoords = shipsCords

    const cpuBoard = mainObjects.Gameboard();

    const cpuShips = cpuBoard.deployShips(...shipsCords);

    const receiveAttack = (coordinates) => {
      const receivedAttack = cpuBoard.receiveAttack(coordinates, cpuShips)

      if (receivedAttack)  // if receivedAttack is a true value, it means that it contains a sunked ship.
        globalLogic.indicateSunk(receivedAttack, 2)

    }

    const usedCoords = [];

    const attackPlayer = (coords) => {

      const randomInt = (max) => Math.floor(Math.random() * max);

      const randomCoords = [randomInt(9), randomInt(9)];

      // call the function again and generate new random coords if the attack has already be done in that coordinate.
      if (globalLogic.isTargetInArray(usedCoords, coords)) return attackPlayer();

      if (globalLogic.isTargetInArray(usedCoords, randomCoords)) return attackPlayer();

      if (!coords) {
        // if we set manual empty coords for testing or another purposes.
        usedCoords.push(coords);
        return rivalPlayer.receiveAttack(coords);
      }
      rivalPlayer.receiveAttack(randomCoords); // make the attack
      const rivalPlayerHits = rivalPlayer.playerBoard.successAttacks

      if (globalLogic.isTargetInArray(rivalPlayerHits, randomCoords)) {// check if it was a successful attack or not.
        attackCorners(randomCoords, rivalPlayer, "player")
        return visualIndicators(randomCoords, true, "player")
      }
      return visualIndicators(randomCoords, false, "player")

    };

    return { attackPlayer, cpuBoard, cpuShips, cpuCoords, receiveAttack };
  };

  return { Player, cpuPlayer, visualIndicators, attackCorners };
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

          if (grid1)
            grid1.appendChild(gridElement);
          if (grid2)
            grid2.appendChild(gridElement2);
        }

        recursive(yPos + 1);
      };
      recursive(0);
    };

    createGrid(10);
  };

  const flatCoords = (coordsArr) => {
    const oneDimensionCoords = [];

    for (let i = 0; i < coordsArr.length; i++) {
      const coords = coordsArr[i];

      if (typeof coords[0] === "object")
        oneDimensionCoords.push(
          ...coords
        ); // if the ships have more than one coordinate.
      else oneDimensionCoords.push(coords);
    }
    return oneDimensionCoords;
  };

  const genIndicators = (xContainer, yContainer) => {

    const gridIndicatorsX = document.createElement("section")
    const gridIndicatorsY = document.createElement("section")

    gridIndicatorsX.classList.add("X")
    gridIndicatorsY.classList.add("Y")

    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

    for (let i = 1; i <= 10; i++) {
      const element = document.createElement("div")
      element.textContent = i
      gridIndicatorsY.appendChild(element)

      const element2 = document.createElement("div")
      element2.textContent = alphabet[i - 1]
      gridIndicatorsX.appendChild(element2)
    }

    xContainer.appendChild(gridIndicatorsX)
    yContainer.appendChild(gridIndicatorsY)
  }

  const UILogic = (nodes, gameInfo) => {

    const player1Coords = gameInfo.Player.playerShips.coordinates;

    const player2Coords = gameInfo.cpuPlayer.cpuShips.coordinates;

    const attackPlayer = (coord) => gameInfo.Player.receiveAttack(coord);

    const attackCpu = (coord) => gameInfo.cpuPlayer.receiveAttack(coord);

    const attackOnClick = (shipCoords, nodeCoord, attackFunction) => {
      // if the player has a ship in the clicked coordinate, attack the player to that specific coord.
      let wasSuccessful = false;
      if (globalLogic.isTargetInArray(Object.values(shipCoords), nodeCoord)) {
        // when the nodeCoord is inside of a one-coordinate ship, this conditional is used.
        attackFunction(nodeCoord);
        wasSuccessful = true;
        return true
      }
      // when the nodeCoord is inside of a multiple-coordinate ship.
      for (let i = 0; i < shipCoords.length; i++) {
        // loop through the coords array of each ship, until the nodeCoord is found.
        const currentCoords = shipCoords[i];
        if (globalLogic.isTargetInArray(currentCoords, nodeCoord)) {
          attackFunction(nodeCoord);
          wasSuccessful = true;

          break; // stop looping through the ships coords to optimize time complexity.
        }
      }
      return wasSuccessful;
    };

    // note, the attackOnClick function will always call the attackFunction on a successful attack.
    // that's why we will need the next function.

    const missedAttackOnClick = (nodeCoord, attackFunction) => {
      attackFunction(nodeCoord)
      return false
    }

    const detectAttacks = (e) => {

      const parentClass = e.target.parentElement.className;

      const nodeClass = e.target.className;

      const nodeCoord = globalLogic.classToArray(nodeClass);

      if (parentClass === "grid-1") {
        // if the clicked coordinate is inside of grid-1, we know that it is an attack to player1.

        const cleanCoords = Object.values(player1Coords).filter(
          (coords) => coords !== undefined
        ); // filter undefined coords.

        if (attackOnClick(cleanCoords, nodeCoord, attackPlayer) === true) {
          playerLogic.visualIndicators(nodeClass, true, "player")
          playerLogic.attackCorners(nodeCoord, gameInfo.Player, "player")

        }
        else {
          missedAttackOnClick(nodeCoord, attackPlayer)
          playerLogic.visualIndicators(nodeClass, false, "player")
        }
      }

      if (parentClass === "grid-2") {
        const cleanCoords = Object.values(player2Coords).filter(
          (coords) => coords !== undefined
        );

        if (attackOnClick(cleanCoords, nodeCoord, attackCpu) === true) {
          playerLogic.visualIndicators(nodeClass, true, "cpu")
          playerLogic.attackCorners(nodeCoord, gameInfo.cpuPlayer, "cpu")
        }
        else {
          missedAttackOnClick(nodeCoord, attackCpu)
          playerLogic.visualIndicators(nodeClass, false, "cpu")
        }
      }
    };

    for (let i = 0; i < nodes.length; i++) {
      nodes[i].addEventListener("click", (e) => { detectAttacks(e) }, { once: true });
    };

  }

  const startGame = (
    gridContainer1,
    gridContainer2,
    playerCoords,
    cpuCoords
  ) => {
    const currentGame = Game.newGame("example", playerCoords, cpuCoords);

    if (gridContainer1.className !== "shown-grid") {
      UILogic(
        gridContainer1.childNodes,
        currentGame
      );
    }

    if (gridContainer2.className !== "shown-grid") {
      UILogic(
        gridContainer2.childNodes,
        currentGame
      );
    }

    return { currentGame, gridContainer1, gridContainer2 };
  };

  const genDOMElements = () => {


    const showShips = (currentCoords, gridNumber) => {
      const coords = flatCoords(currentCoords);

      for (let i = 0; i < coords.length; i++) {
        globalLogic.changeCoordColor(globalLogic.coordToClass(coords[i]), gridNumber, "green");
      }
    };

    const deleteElements = () => {
      const gridsContainer = document.getElementsByClassName("grids-container")[0]
      if (gridsContainer) gridsContainer.remove()
    }

    const genGrid = (playerIndex, coords) => {

      const gridsContainer = document.createElement("section")
      gridsContainer.className = "grids-container"

      const main = document.querySelector("main")
      if (main)
        main.appendChild(gridsContainer)

      const name = document.createElement("h3")
      name.textContent = `Player's ${playerIndex} Grid`
      gridsContainer.appendChild(name)

      const gridWrapper = document.createElement("div");
      gridWrapper.className = "grid-wrapper"

      genIndicators(gridsContainer, gridWrapper) // gen indicators here to put "X" container above the grid.

      gridsContainer.appendChild(gridWrapper)

      const grid = document.createElement("div");
      grid.className = `grid-${playerIndex}`;
      gridWrapper.appendChild(grid);

      if (playerIndex === 1)
        DOMLogic.displayGrid(grid, null)

      else {
        DOMLogic.displayGrid(null, grid)
      }

      if (coords) {
        grid.className = `shown-grid`
        showShips(coords, playerIndex)
      }

      return grid;
    };

    const genStartButton = () => {
      const startButton = document.createElement("button")
      startButton.className = "start-button"
      startButton.textContent = "Start Game"
      const gridsContainer = document.getElementsByClassName("grids-container")[0]
      if (gridsContainer)
        gridsContainer.appendChild(startButton)
    }


    return { genGrid, deleteElements, genStartButton }
  };

  const endGame = (winner) => {

    const player1Grid = document.getElementsByClassName("grid-1")[0]

    const player2Grid = document.getElementsByClassName("grid-2")[0]

    // cloned elements do not carry event listeners.

    if (player1Grid)
      player1Grid.replaceWith(player1Grid.cloneNode(true))

    if (player2Grid)
      player2Grid.replaceWith(player2Grid.cloneNode(true))

  }

  return { startGame, displayGrid, genDOMElements, endGame };

})();

const GameLoop = (() => {

  const gameTurns = (player1, player2) => {

    const player1Coords = player1.playerCoords

    const player1Ships = player1.playerShips

    const player2Ships = player2.cpuShips

    let player2AttacksCount = 0

    const turnsLogic = () => {

      let isGameOver = false

      if (player2.cpuBoard.receivedAttacks.length === player2AttacksCount + 1) {
        player2AttacksCount++
        player2.attackPlayer(player1Coords)
      }

      if (player1.playerBoard.checkSunk(player1Ships)) {
        DOMLogic.endGame("player1")
        isGameOver = true
      }

      if (player2.cpuBoard.checkSunk(player2Ships)) {
        DOMLogic.endGame("player2")
        isGameOver = true
      }

      return isGameOver
    }
    return { turnsLogic }
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

  const genDOM = DOMLogic.genDOMElements()

  const singlePlayer = () => {

    genDOM.deleteElements() // clear previous elements

    const newGame = DOMLogic.startGame(
      genDOM.genGrid(1, ExampleCoords),
      genDOM.genGrid(2),
      ExampleCoords,
      ExampleCoords
    );

    const playerObj = newGame.currentGame.Player
    const cpuObj = newGame.currentGame.cpuPlayer
    const currentTurn = gameTurns(playerObj, cpuObj)
    const cpuGrid = newGame.gridContainer2

    // receive coords, grid containers and start the game.

    const turnLoop = (gameTurn, toAttackGrid) => {

      for (let i = 0; i < toAttackGrid.childNodes.length; i++) {
        const node = toAttackGrid.childNodes[i];
        node.addEventListener("click", gameTurn.turnsLogic)
      }
    }

    turnLoop(currentTurn, cpuGrid)

    return { playerObj, cpuObj, currentTurn }

  }

  const setupDOM = () => {

    genDOM.genGrid(1, ExampleCoords)
    genDOM.genStartButton()

    const startButton =
      document.getElementsByClassName("start-button")[0];

    if (startButton)
      startButton.addEventListener("click", singlePlayer)

  }

  return { singlePlayer, setupDOM };

})();

GameLoop.setupDOM()


export { mainObjects, playerLogic, Game, DOMLogic, GameLoop, globalLogic };
