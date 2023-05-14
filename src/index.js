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

    if (currentCoord) currentCoord.style.border = `1px solid ${color}`;
  };

  const indicateSunk = (ship, gridNumber) => {
    const { currentCoords } = ship;

    if (typeof currentCoords[0] === "number")
      // when the ship only has one coordinate.
      changeCoordColor(coordToClass(currentCoords), gridNumber, "red");
    else
      for (let i = 0; i < currentCoords.length; i++) {
        changeCoordColor(coordToClass(currentCoords[i]), gridNumber, "red");
      }
  };

  return {
    isTargetInArray,
    changeCoordColor,
    indicateSunk,
    classToArray,
    coordToClass,
  };
})();

const mainObjects = (() => {
  const Ship = (lengthNumber, hitsNumber, coords) => {
    const currentCoords = coords;

    const checkSunk = (length, hits) => {
      if (length === hits) return true;
      return false;
    };

    let shipHits = hitsNumber;

    const shipLength = lengthNumber;

    const isSunk = () => checkSunk(shipLength, shipHits);

    const hit = () => shipHits++;

    const currentHits = () => shipHits;

    return { isSunk, hit, currentHits, currentCoords, shipLength };
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
      receivedAttacks.push(targetCords);

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
            if (playerShips.carrier.isSunk()) return playerShips.carrier;
          }
          if (shipName === "battleShip") {
            playerShips.battleShip.hit();
            if (playerShips.battleShip.isSunk()) return playerShips.battleShip;
          }
          if (shipName === "battleShip1") {
            playerShips.battleShip1.hit();
            if (playerShips.battleShip1.isSunk())
              return playerShips.battleShip1;
          }
          if (shipName === "cruiser") {
            playerShips.cruiser.hit();
            if (playerShips.cruiser.isSunk()) return playerShips.cruiser;
          }
          if (shipName === "cruiser1") {
            playerShips.cruiser1.hit();
            if (playerShips.cruiser1.isSunk()) return playerShips.cruiser1;
          }
          if (shipName === "cruiser2") {
            playerShips.cruiser2.hit();
            if (playerShips.cruiser2.isSunk()) return playerShips.cruiser2;
          }
          if (shipName === "destroyer") {
            playerShips.destroyer.hit();
            if (playerShips.destroyer.isSunk()) return playerShips.destroyer;
          }
          if (shipName === "destroyer1") {
            playerShips.destroyer1.hit();
            if (playerShips.destroyer1.isSunk()) return playerShips.destroyer1;
          }
          if (shipName === "destroyer2") {
            playerShips.destroyer2.hit();
            if (playerShips.destroyer2.isSunk()) return playerShips.destroyer2;
          }
          if (shipName === "destroyer3") {
            playerShips.destroyer3.hit();
            if (playerShips.destroyer3.isSunk()) return playerShips.destroyer3;
          }
        }

        if (success === true) break;
      }
    };

    const checkSunk = (playerShips) => {
      const areAllSunk = (ships) => {
        // either we didn't defined the cords of a ship (undefined), or it is actually sunk, we take that as true.
        if (
          (!ships.carrier.currentCoords || ships.carrier.isSunk()) &&
          (!ships.battleShip.currentCoords || ships.battleShip.isSunk()) &&
          (!ships.battleShip1.currentCoords || ships.battleShip1.isSunk()) &&
          (!ships.cruiser.currentCoords || ships.cruiser.isSunk()) &&
          (!ships.cruiser1.currentCoords || ships.cruiser1.isSunk()) &&
          (!ships.cruiser2.currentCoords || ships.cruiser2.isSunk()) &&
          (!ships.destroyer.currentCoords || ships.destroyer.isSunk()) &&
          (!ships.destroyer1.currentCoords || ships.destroyer1.isSunk()) &&
          (!ships.destroyer2.currentCoords || ships.destroyer2.isSunk()) &&
          (!ships.destroyer3.currentCoords || ships.destroyer3.isSunk())
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
    let index = 0;
    if (target === "cpu") index = 1;

    const currentNode = document.getElementsByClassName(coord)[index];

    if (currentNode) {
      if (wasSuccessful === false) currentNode.textContent = "•";
      else {
        currentNode.textContent = "X";
      }
    }
  };

  const removeNodeListeners = (coord, target) => {
    let index = 0;
    if (target === "cpu") index = 1;

    const coordinate = globalLogic.coordToClass(coord);

    const element = document.getElementsByClassName(coordinate)[index];

    if (element) element.replaceWith(element.cloneNode(true));
  };

  const validateCoord = (coord) => {
    if (coord[0] < 0 || coord[1] < 0 || coord[0] > 9 || coord[1] > 9)
      return false;
    return true;
  };

  const validateCoords = (coords) => {
    const validatedCoords = [];
    for (let i = 0; i < coords.length; i++) {
      if (validateCoord(coords[i])) validatedCoords.push(coords[i]);
    }
    return validatedCoords;
  };

  const returnSides = (nodeCoord) => {
    const coords = [];

    const up = [nodeCoord[0] - 1, nodeCoord[1]];
    const down = [nodeCoord[0] + 1, nodeCoord[1]];
    const right = [nodeCoord[0], nodeCoord[1] + 1];
    const left = [nodeCoord[0], nodeCoord[1] - 1];

    coords.push(up, down, right, left);

    return coords;
  };

  const attackAround = (
    nodeCoords,
    attackFunction,
    ships,
    target,
    successAttacks
  ) => {
    const aroundCoords = [];

    if (typeof nodeCoords[0] === "object") {
      for (let i = 0; i < nodeCoords.length; i++) {
        aroundCoords.push(returnSides(nodeCoords[i]));
      }
    } else {
      aroundCoords.push(returnSides(nodeCoords)); // when the ship has only one coord.
    }

    const flatAroundCoords = validateCoords(aroundCoords.flat());

    for (let i = 0; i < flatAroundCoords.length; i++) {
      if (!globalLogic.isTargetInArray(successAttacks, flatAroundCoords[i])) {
        // avoid modifying successful attacks.
        visualIndicators(flatAroundCoords[i], false, target);
        removeNodeListeners(flatAroundCoords[i], target);
        attackFunction(flatAroundCoords[i], ships);
      }
    }
  };

  const returnCorners = (node) => {
    const corners = [];

    const corner1 = [node[0] + 1, node[1] + 1];
    const corner2 = [node[0] + 1, node[1] + -1];
    const corner3 = [node[0] - 1, node[1] + 1];
    const corner4 = [node[0] - 1, node[1] - 1];

    corners.push(corner1, corner2, corner3, corner4);

    return corners;
  };

  const attackCorners = (nodeCoord, attackFunction, target) => {
    const corners = returnCorners(nodeCoord);

    const validCorners = validateCoords(corners);

    for (let i = 0; i < validCorners.length; i++) {
      visualIndicators(validCorners[i], false, target);
      removeNodeListeners(validCorners[i], target);
      attackFunction(validCorners[i], true);
    }
  };

  const Player = (name, shipsCoords) => {
    const playerName = name;

    const playerCoords = shipsCoords;

    const playerBoard = mainObjects.Gameboard();

    const playerShips = playerBoard.deployShips(...shipsCoords);

    const receiveAttack = (coords) => {
      const receivedAttack = playerBoard.receiveAttack(coords, playerShips);

      if (receivedAttack) {
        // if receivedAttack is a true value, it means that it contains a sunked ship.
        globalLogic.indicateSunk(receivedAttack, 1);
        attackAround(
          receivedAttack.currentCoords,
          playerBoard.receiveAttack,
          playerShips,
          "player",
          playerBoard.successAttacks
        );
      }
    };

    return {
      playerName,
      playerCoords,
      playerBoard,
      playerShips,
      receiveAttack,
    };
  };

  const cpuPlayer = (humanPlayer, shipsCords) => {
    const rivalPlayer = humanPlayer;

    const cpuCoords = shipsCords;

    const cpuBoard = mainObjects.Gameboard();

    const cpuShips = cpuBoard.deployShips(...shipsCords);

    const receiveAttack = (coordinates) => {
      const receivedAttack = cpuBoard.receiveAttack(coordinates, cpuShips);

      if (receivedAttack) {
        // if receivedAttack is a true value, it means that it contains a sunked ship.
        globalLogic.indicateSunk(receivedAttack, 2);
        attackAround(
          receivedAttack.currentCoords,
          cpuBoard.receiveAttack,
          cpuShips,
          "cpu",
          cpuBoard.successAttacks
        );
      }
    };

    const usedCoords = [];

    const attackPlayer = (coords, ignoreCoords) => {
      const randomInt = (max) => Math.floor(Math.random() * max);

      const randomCoords = [randomInt(10), randomInt(10)];

      // call the function again and generate new random coords if the attack has already be done in that coordinate.

      if (
        globalLogic.isTargetInArray(usedCoords, randomCoords) &&
        ignoreCoords !== true
      )
        return attackPlayer();

      const attackLogic = (coordinates) => {
        rivalPlayer.receiveAttack(coordinates);
        usedCoords.push(coordinates);
        const rivalPlayerHits = rivalPlayer.playerBoard.successAttacks;

        if (globalLogic.isTargetInArray(rivalPlayerHits, coordinates)) {
          // check if it was a successful attack or not.
          visualIndicators(coordinates, true, "player");
          attackCorners(coordinates, attackPlayer, "player");
          return coordinates;
        }
        return visualIndicators(coordinates, false, "player");
      };

      if (coords) {
        // when the coords are indicated manually.
        return attackLogic(coords);
      }
      return attackLogic(randomCoords); // when the coords are generated randomly.
    };

    return {
      attackPlayer,
      cpuBoard,
      cpuShips,
      cpuCoords,
      usedCoords,
      receiveAttack,
    };
  };

  return {
    Player,
    cpuPlayer,
    visualIndicators,
    attackCorners,
    attackAround,
    returnCorners,
    returnSides,
    validateCoords,
  };
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

          if (grid1) grid1.appendChild(gridElement);
          if (grid2) grid2.appendChild(gridElement2);
        }

        recursive(yPos + 1);
      };
      recursive(0);
    };

    createGrid(10);
  };

  const genIndicators = (xContainer, yContainer) => {
    const gridIndicatorsX = document.createElement("section");
    const gridIndicatorsY = document.createElement("section");

    gridIndicatorsX.classList.add("X");
    gridIndicatorsY.classList.add("Y");

    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    for (let i = 1; i <= 10; i++) {
      const element = document.createElement("div");
      element.textContent = i;
      gridIndicatorsY.appendChild(element);

      const element2 = document.createElement("div");
      element2.textContent = alphabet[i - 1];
      gridIndicatorsX.appendChild(element2);
    }

    xContainer.appendChild(gridIndicatorsX);
    yContainer.appendChild(gridIndicatorsY);
  };

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
        return true;
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
      attackFunction(nodeCoord);
      return false;
    };

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
          playerLogic.visualIndicators(nodeClass, true, "player");
          playerLogic.attackCorners(nodeCoord, attackPlayer, "player");
        } else {
          missedAttackOnClick(nodeCoord, attackPlayer);
          playerLogic.visualIndicators(nodeClass, false, "player");
        }
      }

      if (parentClass === "grid-2") {
        const cleanCoords = Object.values(player2Coords).filter(
          (coords) => coords !== undefined
        );

        if (attackOnClick(cleanCoords, nodeCoord, attackCpu) === true) {
          playerLogic.visualIndicators(nodeClass, true, "cpu");
          playerLogic.attackCorners(nodeCoord, attackCpu, "cpu");
        } else {
          missedAttackOnClick(nodeCoord, attackCpu);
          playerLogic.visualIndicators(nodeClass, false, "cpu");
        }
      }
    };
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].addEventListener("click", detectAttacks, { once: true });
    }
  };

  const startGame = (
    gridContainer1,
    gridContainer2,
    playerCoords,
    cpuCoords
  ) => {
    const currentGame = Game.newGame("example", playerCoords, cpuCoords);

    if (gridContainer1.className !== "shown-grid") {
      UILogic(gridContainer1.childNodes, currentGame);
    }

    if (gridContainer2.className !== "shown-grid") {
      UILogic(gridContainer2.childNodes, currentGame);
    }

    return { currentGame, gridContainer1, gridContainer2 };
  };

  const genDOMElements = () => {
    const flatCoords = (coordsArr) => {
      const oneDimensionCoords = [];

      for (let i = 0; i < coordsArr.length; i++) {
        const coords = coordsArr[i];

        if (typeof coords[0] === "object") oneDimensionCoords.push(...coords);
        // if the ships have more than one coordinate.
        else oneDimensionCoords.push(coords);
      }
      return oneDimensionCoords;
    };

    const showShips = (currentCoords, gridNumber) => {
      const coords = flatCoords(currentCoords);

      for (let i = 0; i < coords.length; i++) {
        globalLogic.changeCoordColor(
          globalLogic.coordToClass(coords[i]),
          gridNumber,
          "green"
        );
      }
    };

    const deleteElements = (index) => {
      const mainContainer =
        document.getElementsByClassName("main-container")[index];
      if (mainContainer) mainContainer.remove();
    };

    const genGrid = (playerIndex, coords) => {
      const mainContainer = document.createElement("section");
      mainContainer.className = "main-container";

      const main = document.querySelector("main");
      if (main) main.appendChild(mainContainer);

      const gridsContainer = document.createElement("div");
      gridsContainer.className = "grids-container";

      if (mainContainer) mainContainer.appendChild(gridsContainer);

      const name = document.createElement("h3");
      name.textContent = `Player's ${playerIndex} Grid`;
      gridsContainer.appendChild(name);

      const gridWrapper = document.createElement("div");
      gridWrapper.className = "grid-wrapper";

      genIndicators(gridsContainer, gridWrapper); // gen indicators here to put "X" container above the grid.

      gridsContainer.appendChild(gridWrapper);

      const grid = document.createElement("div");
      grid.className = `grid-${playerIndex}`;
      gridWrapper.appendChild(grid);

      if (playerIndex === 1) DOMLogic.displayGrid(grid, null);
      else {
        DOMLogic.displayGrid(null, grid);
      }

      if (coords) {
        grid.className = `shown-grid`;
        showShips(coords, playerIndex);
      }

      return grid;
    };

    const genStartButton = () => {
      const startButton = document.createElement("button");
      startButton.className = "start-button";
      startButton.textContent = "Start Game";
      const buttonContainer =
        document.getElementsByClassName("button-wrapper")[0];
      if (buttonContainer) buttonContainer.appendChild(startButton);
    };

    const genCoordInputs = () => {
      const mainContainer =
        document.getElementsByClassName("main-container")[0];

      const inputTitle = document.createElement("label");
      inputTitle.classList.add(`inputs-container`);
      inputTitle.htmlFor = "select-ships";
      inputTitle.textContent = "Set Initial Coord";
      mainContainer.appendChild(inputTitle);

      const selectElement = document.createElement("select");
      selectElement.classList.add(`select-ships`);
      inputTitle.appendChild(selectElement);

      const inputWrapper = document.createElement("div");
      inputWrapper.classList.add(`input-wrapper`);
      inputTitle.appendChild(inputWrapper);

      const input1 = document.createElement("input");
      input1.classList.add(`coords-input`);
      inputWrapper.appendChild(input1);

      const inputText = document.createElement("p");
      inputText.classList.add(`input-text`);
      inputText.textContent = ",";
      inputWrapper.appendChild(inputText);

      const input2 = document.createElement("input");
      input2.classList.add(`coords-input`);
      inputWrapper.appendChild(input2);

      const submitButton = document.createElement("button");
      submitButton.classList.add(`apply-coords`);
      submitButton.textContent = "Apply";
      inputTitle.appendChild(submitButton);

      const option1 = document.createElement("option");
      option1.value = "carrier";
      option1.textContent = "Carrier";
      selectElement.appendChild(option1);

      const option2 = document.createElement("option");
      option2.value = "battleship1";
      option2.textContent = "Battleship 1";
      selectElement.appendChild(option2);

      const option3 = document.createElement("option");
      option3.value = "battleship2";
      option3.textContent = "Battleship 2";
      selectElement.appendChild(option3);

      const option4 = document.createElement("option");
      option4.value = "cruiser1";
      option4.textContent = "Cruiser 1";
      selectElement.appendChild(option4);

      const option5 = document.createElement("option");
      option5.value = "cruiser2";
      option5.textContent = "Cruiser 2";
      selectElement.appendChild(option5);

      const option6 = document.createElement("option");
      option6.value = "cruiser3";
      option6.textContent = "Cruiser 3";
      selectElement.appendChild(option6);

      const option7 = document.createElement("option");
      option7.value = "destroyer1";
      option7.textContent = "Destroyer 1";
      selectElement.appendChild(option7);

      const option8 = document.createElement("option");
      option8.value = "destroyer2";
      option8.textContent = "Destroyer 2";
      selectElement.appendChild(option8);

      const option9 = document.createElement("option");
      option9.value = "destroyer3";
      option9.textContent = "Destroyer 3";
      selectElement.appendChild(option9);

      const option10 = document.createElement("option");
      option10.value = "destroyer4";
      option10.textContent = "Destroyer 4";
      selectElement.appendChild(option10);
    };

    const genButtonWrapper = () => {
      const buttonWrapper = document.createElement("div");
      buttonWrapper.classList.add("button-wrapper");

      const gridsContainer =
        document.getElementsByClassName("grids-container")[0];

      if (gridsContainer) gridsContainer.appendChild(buttonWrapper);
    };

    const genRandomizeButton = () => {
      const randomButton = document.createElement("button");
      randomButton.className = "random-button";
      randomButton.textContent = "Randomize";
      const buttonContainer =
        document.getElementsByClassName("button-wrapper")[0];
      if (buttonContainer) buttonContainer.appendChild(randomButton);
    };

    const genCustomizeButton = () => {
      const customizeButton = document.createElement("button");
      customizeButton.className = "customize-button";
      customizeButton.textContent = "Customize";
      const buttonContainer =
        document.getElementsByClassName("button-wrapper")[0];
      if (buttonContainer) buttonContainer.appendChild(customizeButton);
    };

    const genButtons = () => {
      genButtonWrapper();
      genRandomizeButton();
      genStartButton();
      genCustomizeButton();
    };

    return { genGrid, deleteElements, genButtons, genCoordInputs };
  };

  const createModal = (winner, cpuWin) => {
    const body = document.querySelector("body");

    const modal = document.createElement("dialog");
    modal.classList.add("modal");
    body.appendChild(modal);

    const modalText = document.createElement("div");
    modal.appendChild(modalText);

    if (!cpuWin) modalText.textContent = `Congratulations ${winner}, you won!`;
    else {
      modalText.textContent = `${winner} won, try again!`;
    }

    const reloadGameButton = document.createElement("button");
    reloadGameButton.textContent = "New Game";

    const reloadPage = () => window.location.reload();

    reloadGameButton.addEventListener("click", reloadPage);
    modal.appendChild(reloadGameButton);

    if (modal) modal.showModal();
  };

  const endGame = () => {
    const player1Grid = document.getElementsByClassName("grid-1")[0];

    const player2Grid = document.getElementsByClassName("grid-2")[0];

    // cloned elements do not carry event listeners.

    if (player1Grid) player1Grid.replaceWith(player1Grid.cloneNode(true));

    if (player2Grid) player2Grid.replaceWith(player2Grid.cloneNode(true));
  };

  const flatCoords = (elements) => {
    if (elements) {
      const multipleCoordShips = elements.filter(
        (el) => typeof el[0] === "object"
      );

      const oneCoordShips = elements.filter((el) => typeof el[0] === "number");

      const flattedCoords = multipleCoordShips.flat().concat(oneCoordShips);

      return flattedCoords;
    }
  };

  const surroundCoords = (nodeCoord) => {
    const getSurruonds = (node) => {
      const currentSurrounds = [
        ...playerLogic.returnCorners(node),
        ...playerLogic.returnSides(node),
        node,
      ];

      return playerLogic.validateCoords(currentSurrounds);
    };

    const coords = [];

    if (typeof nodeCoord[0] !== "object") {
      // one-coord ship
      const surround = getSurruonds(nodeCoord);
      coords.push(...surround);

      const noRepeatString = new Set(coords.map((x) => JSON.stringify(x)));

      const noRepeatCoords = [...noRepeatString].map((x) => JSON.parse(x));
      return noRepeatCoords;
    }

    for (let i = 0; i < nodeCoord.length; i++) {
      const currentCoord = nodeCoord[i];
      const surround = getSurruonds(currentCoord);

      coords.push(...surround);
    }
    const noRepeatString = new Set(coords.map((x) => JSON.stringify(x)));

    const noRepeatCoords = [...noRepeatString].map((x) => JSON.parse(x));

    return noRepeatCoords;
  };

  const genCoords = () => {
    const randomInt = (max) => Math.floor(Math.random() * max);

    const randomOrientation = () => {
      const number = randomInt(2);

      if (number === 0) return "h";
      return "v";
    };

    const genRandomCoords = (orientation, size, previousCoords) => {
      if (previousCoords) {
        const verticalCoords = [previousCoords[0] + 1, previousCoords[1]];
        const horizontalCoords = [previousCoords[0], previousCoords[1] + 1];

        if (orientation === "v") return verticalCoords;

        return horizontalCoords;
      }

      let randomCoords;

      // substract the size depending on the orientation, in order to have space for the next coords of the ship.
      if (orientation === "v")
        randomCoords = [randomInt(10 - size), randomInt(10)];
      else {
        randomCoords = [randomInt(10), randomInt(10 - size)];
      }

      if (size === 1) randomCoords = [randomInt(10), randomInt(10)];

      return randomCoords;
    };

    const genShipCoord = (size, usedCoords) => {
      const shipCoords = [];

      const orientation = randomOrientation();

      const invalidCoords = flatCoords(usedCoords);

      const genInitialCoords = () => {
        const coords = genRandomCoords(orientation, size);

        if (!globalLogic.isTargetInArray(invalidCoords, coords)) {
          // validate that the initial coord is in a valid position
          shipCoords.push(coords);
        } else genInitialCoords(); // if the generated coords are already used, generate new coords.
      };

      for (let i = 0; i < size; i++) {
        const previousCoords = shipCoords[shipCoords.length - 1];
        const coords = genRandomCoords(orientation, size, previousCoords);

        if (previousCoords) {
          shipCoords.push(coords);
        } else genInitialCoords();
      }

      // multiple coordinate ship
      if (shipCoords.length !== 1) {
        let isValid = true;

        for (let index = 0; index < shipCoords.length; index++) {
          const element = shipCoords[index];
          if (globalLogic.isTargetInArray(invalidCoords, element))
            isValid = false; // if one element of the ship has a invalid position, isValid is false.
        }

        if (isValid === false) return genShipCoord(size, invalidCoords); // and when isValid is false, we recursively change the ship position, until it is valid.

        return shipCoords;
      }

      // one coordinate ship.
      return shipCoords[0];
    };

    const genBattleships = () => {
      const usedCoords = [];

      const carrier = genShipCoord(4, usedCoords);
      usedCoords.push(surroundCoords(carrier));

      const battleShip = genShipCoord(3, usedCoords);
      usedCoords.push(surroundCoords(battleShip));

      const battleShip1 = genShipCoord(3, usedCoords);
      usedCoords.push(surroundCoords(battleShip1));

      const cruiser = genShipCoord(2, usedCoords);
      usedCoords.push(surroundCoords(cruiser));

      const cruiser1 = genShipCoord(2, usedCoords);
      usedCoords.push(surroundCoords(cruiser1));

      const cruiser2 = genShipCoord(2, usedCoords);
      usedCoords.push(surroundCoords(cruiser2));

      const destroyer = genShipCoord(1, usedCoords);
      usedCoords.push(surroundCoords(destroyer));

      const destroyer1 = genShipCoord(1, usedCoords);
      usedCoords.push(surroundCoords(destroyer1));

      const destroyer2 = genShipCoord(1, usedCoords);
      usedCoords.push(surroundCoords(destroyer2));

      const destroyer3 = genShipCoord(1, usedCoords);
      usedCoords.push(surroundCoords(destroyer3));

      const coords = [
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
      ];

      return { coords, usedCoords };
    };

    return { genBattleships, genShipCoord, surroundCoords };
  };

  const rotateCoords = (ship) => {
    const checkOrientation = () => {
      if (ship.coords[0][0] + 1 === ship.coords[1][0]) return "v";
      return "h";
    };

    let newArray = [ship.firstCoord];

    let yPos;
    let xPos;

    for (let i = 0; i < ship.coords.length - 1; i++) {
      if (checkOrientation() === "v") {
        yPos = newArray[i][0];
        xPos = newArray[i][1] + 1;
      }
      else {
        yPos = newArray[i][0] + 1;
        xPos = newArray[i][1];
      }
      const newCoord = [yPos, xPos];

      newArray = newArray.concat([newCoord]);
    }
    return newArray;

  };

  const replaceCoords = (shipInfo, coords) => {
    const coordsCopy = [...coords];

    coordsCopy.splice(shipInfo.coordsPosition, 1, shipInfo.coords); // replace the old coords for the rotated coords.

    return coordsCopy;
  };

  const triggerInvalid = (coords) => {
    for (let i = 0; i < coords.length; i++) {
      const classCoord = globalLogic.coordToClass(coords[i]);
      const coordElement = document.getElementsByClassName(classCoord)[0];
      coordElement.classList.add("invalid-rotation");
      setTimeout(() => {
        // because we know exactly when the animation will end, we can set a timeout.
        coordElement.classList.remove("invalid-rotation");
      }, 1000);
    }
  };

  const validateRotation = (shipInfo, usedCoords) => {
    let isValid = true;

    const occupiedCoords = shipInfo.coords;

    const { coordsPosition } = shipInfo;

    const usedCoordsCopy = [...usedCoords];

    usedCoordsCopy[coordsPosition] = []; // we clear the usedCoords of the current ship, so we can validate without them in the loop.

    const flatUsedCoords = flatCoords(usedCoordsCopy);

    if (
      playerLogic.validateCoords(occupiedCoords).length !==
      occupiedCoords.length
    )
      return usedCoords; // check if these coords aren't out of the grid.

    for (let i = 0; i < occupiedCoords.length; i++) {
      if (globalLogic.isTargetInArray(flatUsedCoords, occupiedCoords[i])) {
        isValid = false;
      }
    }

    const coordsSurround = surroundCoords(occupiedCoords);

    if (isValid === true) {
      usedCoordsCopy[coordsPosition] = coordsSurround;
      return usedCoordsCopy;
    }
    return usedCoords;
  };

  const rotateShips = (coords, usedCoords, index, restartGrid, currentDOM) => {
    const cleanCoords = coords.filter((el) => typeof el[0] === "object"); // we filter the one-coordinate ships, because they don't need rotation
    const coordinates = flatCoords(cleanCoords);

    const rotate = (e) => {
      const clickedCoord = e.target.className;

      const getShipCoords = (coord) => {
        // this function searches for the argument coordinate inside of the full coords array, all of this, in order to return the full coords of the clicked coord.
        for (let i = 0; i < cleanCoords.length; i++) {
          const coordsArr = cleanCoords[i];
          const coordsInfo = [coordsArr, i];
          if (globalLogic.isTargetInArray(coordsArr, coord)) return coordsInfo;
        }
      };

      const fullArray = getShipCoords(globalLogic.classToArray(clickedCoord));

      const shipInfo = {
        coords: fullArray[0],
        firstCoord: fullArray[0][0],
        coordsPosition: fullArray[1],
      };

      shipInfo.coords = rotateCoords(shipInfo);

      if (validateRotation(shipInfo, usedCoords) !== usedCoords) {
        // this means that the used coords were changed, so it was a valid rotation.
        currentDOM.deleteElements(0); // delete old grid
        return restartGrid(
          replaceCoords(shipInfo, coords),
          false,
          validateRotation(shipInfo, usedCoords),
          true
        ); // gen new grid with the rotated coord.
      }
      return triggerInvalid(fullArray[0]);
    };

    for (let i = 0; i < coordinates.length; i++) {
      // select every ship-occupied coord
      const elementClass = globalLogic.coordToClass(coordinates[i]);
      const element = document.getElementsByClassName(elementClass)[index];
      if (element) element.addEventListener("click", rotate);
    }

    return { rotateCoords };
  };

  /*
  const dragAndDrop = (elements) => {
    const coordList = flatCoords(elements);

    const dragStart = (e) => {};

    const dragDrop = (e) => {};

    // add event listeners to each element.

    for (let i = 0; i < coordList.length; i++) {
      const elementName = globalLogic.coordToClass(coordList[i]);
      const element = document.getElementsByClassName(elementName)[0];

      if (element) {
        element.draggable = true;
        element.addEventListener("dragstart", dragStart);
        element.addEventListener("drop", dragDrop);
      }
    }
  };
  */

  return {
    startGame,
    displayGrid,
    genDOMElements,
    endGame,
    createModal,
    genCoords,
    rotateShips,
  };
})();

const GameLoop = (() => {
  const genDOM = DOMLogic.genDOMElements();

  const gameTurns = (player1, player2) => {
    const player1Ships = player1.playerShips;

    const player2Ships = player2.cpuShips;

    const turnsLogic = () => {
      let isGameOver = false;
      player2.attackPlayer();

      if (player1.playerBoard.checkSunk(player1Ships)) {
        DOMLogic.endGame();
        DOMLogic.createModal("Player2", true);
        isGameOver = true;
      }

      if (player2.cpuBoard.checkSunk(player2Ships)) {
        DOMLogic.endGame();
        DOMLogic.createModal("Player1");
        isGameOver = true;
      }

      return isGameOver;
    };

    // receive coords, grid containers and start the game.

    const turnLoop = (toAttackGrid) => {
      for (let i = 0; i < toAttackGrid.childNodes.length; i++) {
        const node = toAttackGrid.childNodes[i];
        node.addEventListener(
          "click",
          () => {
            turnsLogic();
          },
          { once: true }
        );
      }
    };

    return { turnLoop };
  };

  const singlePlayer = (coords, sameCoords) => {
    genDOM.deleteElements(0); // clear previous elements

    let newGame;

    if (sameCoords !== true) {
      const cpuCoords = DOMLogic.genCoords().genBattleships().coords; // gen random coords.
      newGame = DOMLogic.startGame(
        genDOM.genGrid(1, coords),
        genDOM.genGrid(2),
        coords,
        cpuCoords
      );
    } else {
      newGame = DOMLogic.startGame(
        genDOM.genGrid(1, coords),
        genDOM.genGrid(2),
        coords,
        coords
      );
    }

    const playerObj = newGame.currentGame.Player;
    const cpuObj = newGame.currentGame.cpuPlayer;
    const currentTurn = gameTurns(playerObj, cpuObj, 0);
    const cpuGrid = newGame.gridContainer2;

    // trigger turns logic
    gameTurns(playerObj, cpuObj).turnLoop(cpuGrid);

    return { playerObj, cpuObj, currentTurn };
  };

  const genInitialElements = (
    coords,
    sameCoords,
    usedCoords,
    customizeOpen
  ) => {
    genDOM.genGrid(1, coords);
    genDOM.genButtons();
    DOMLogic.rotateShips(coords, usedCoords, 0, genInitialElements, genDOM);
    // dragAndDrop(coords);

    const randomizeGrid = (index) => {
      genDOM.deleteElements(index);
      const genRandomCoords = DOMLogic.genCoords().genBattleships();
      const newRandomCoords = genRandomCoords.coords;
      const newUsedCoords = genRandomCoords.usedCoords;
      genInitialElements(newRandomCoords, false, newUsedCoords);
    };

    const startButton = document.getElementsByClassName("start-button")[0];
    const randomizeButton = document.getElementsByClassName("random-button")[0];
    const customizeButton =
      document.getElementsByClassName("customize-button")[0];

    if (randomizeButton)
      randomizeButton.addEventListener("click", () => {
        randomizeGrid(0);
      });

    if (customizeButton) {
      customizeButton.addEventListener(
        "click",
        () => {
          genDOM.genCoordInputs();
        },
        { once: true }
      );
      if (customizeOpen) customizeButton.click();
    }

    if (startButton)
      startButton.addEventListener("click", () => {
        singlePlayer(coords, sameCoords);
      });
  };

  const setupDOM = () => {
    const genRandomCoords = DOMLogic.genCoords().genBattleships();
    const randomCoords = genRandomCoords.coords;
    const { usedCoords } = genRandomCoords;

    genInitialElements(randomCoords, false, usedCoords);
  };

  return {
    singlePlayer,
    setupDOM,
    genInitialElements,
  };
})();

GameLoop.setupDOM();

export { mainObjects, playerLogic, Game, DOMLogic, GameLoop, globalLogic };
