/**
 * @jest-environment jsdom
 */

import { mainObjects, playerLogic, Game, DOMLogic, GameLoop, globalLogic } from "./index";

describe("ship test", () => {
  test("can check if a ship is not sunk", () => {
    expect(mainObjects.Ship(4, 0).isSunk()).toBe(false);
  });

  test("can check if a ship is sunk", () => {
    expect(mainObjects.Ship(3, 3).isSunk()).toBe(true);
  });

  test("can increase the number of hits", () => {
    const testShip = mainObjects.Ship(4, 0);

    testShip.hit();

    expect(testShip.currentHits()).toBe(1);
  });
});

describe("hit-sunk test", () => {
  const testShip = mainObjects.Ship(4, 3);

  beforeEach(() => testShip.hit()); // makes the length number the same as the hit number

  test("can increase the number of hits and make a ship sunk", () => {
    expect(testShip.isSunk()).toBe(true);
  });
});

describe("receiveAttack tests", () => {
  const testGameboard = mainObjects.Gameboard();

  const testGameboard1 = mainObjects.Gameboard();

  const testShips = testGameboard.deployShips([2, 1]);

  const testShips1 = testGameboard1.deployShips([
    [3, 3],
    [3, 4],
    [3, 5],
  ]);

  // run receiveAttack
  testGameboard.receiveAttack([2, 1], testShips);

  testGameboard1.receiveAttack([3, 4], testShips1);

  testGameboard1.receiveAttack([3, 5], testShips1);

  test("can make a 1-space ship receive an attack", () => {
    expect(testShips.carrier.currentHits()).toBe(1);
  });

  test("can make a 3-spaces ship receive an attack", () => {
    expect(testShips1.carrier.currentHits()).toBe(2);
  });

  testGameboard.receiveAttack([4, 8], testShips);

  test("can record every received attack", () => {
    expect(globalLogic.isTargetInArray(testGameboard.receivedAttacks, [4, 8])).toBe(true);
  });
});

describe("checkSunk tests", () => {
  const testGameboard = mainObjects.Gameboard();
  const testShips = testGameboard.deployShips([
    [7, 2],
    [7, 3],
    [7, 4],
    [7, 5],
  ]);

  testGameboard.receiveAttack([7, 2], testShips);

  testGameboard.receiveAttack([7, 3], testShips);

  testGameboard.receiveAttack([7, 4], testShips);

  testGameboard.receiveAttack([7, 5], testShips);

  test("can check if a one boat fleet is sunk", () => {
    expect(testGameboard.checkSunk(testShips)).toBe(true);
  });

  const testShips2 = testGameboard.deployShips();
  // here we manually set the coordinates after we deploy the ships, to make sure we can do that.
  testShips2.coordinates.destroyer = [3, 4];

  testShips2.destroyer.currentCoords = [3, 4];

  testShips2.coordinates.destroyer1 = [4, 3];

  testShips2.destroyer1.currentCoords = [4, 3];

  testGameboard.receiveAttack([3, 4], testShips2);

  testGameboard.receiveAttack([4, 3], testShips2);

  test("can check if a multiple boat fleet is sunk", () => {
    expect(testGameboard.checkSunk(testShips2)).toBe(true);
  });

  const testShips3 = testGameboard.deployShips([3, 4], [4, 3]);

  testGameboard.receiveAttack([3, 4], testShips3); // we only sunk one destroyer

  test("can check if a multiple boat fleet is NOT sunk", () => {
    expect(testGameboard.checkSunk(testShips3)).toBe(false);
  });
});

describe("cpuPlayer tests", () => {
  test("can make a random attack in a player's board", () => {
    const humanPlayer = playerLogic.Player("example", []);

    const humanBoard = humanPlayer.playerBoard;

    const cpuPlayer = playerLogic.cpuPlayer(humanPlayer, []);

    cpuPlayer.attackPlayer();

    // because there is no player ships coordinates defined on this example, the cpu attack will always be a missedAttack.
    expect(humanBoard.receivedAttacks).not.toBe(undefined);
  });

  test("can't shoot the same coordinate", () => {
    const humanPlayer = playerLogic.Player("example", []);

    const humanBoard = humanPlayer.playerBoard;

    const cpuPlayer = playerLogic.cpuPlayer(humanPlayer, []);

    cpuPlayer.attackPlayer([5, 3]);

    cpuPlayer.attackPlayer([5, 3]);

    // if the cpu can attack the same coordinate twice, the second array element of the human's missedAttacks should be [5, 3] too
    expect(humanBoard.receivedAttacks[1]).not.toBe([5, 3]);
  });
});

const ExampleCoords = [
  [[0, 1], [0, 2], [0, 3], [0, 4],],
  [[2, 1], [3, 1], [4, 1],],
  [[0, 6], [0, 7], [0, 8],],
  [[3, 3], [3, 4],],
  [[6, 3], [6, 2],],
  [[6, 8], [6, 9],],
  [7, 2],
  [9, 2],
  [9, 9],
  [8, 7],
];

describe("Game tests", () => {
  const gameExample = Game.newGame("example", ExampleCoords, ExampleCoords);

  test("The ships coordinates are in place for each ship", () => {
    expect(
      gameExample.Player.playerShips.destroyer3.currentCoords
    ).toStrictEqual([8, 7]);
    expect(gameExample.Player.playerShips.destroyer.currentCoords).toStrictEqual([7, 2]);
    expect(gameExample.Player.playerShips.carrier.currentCoords).toStrictEqual([
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ]);

    expect(
      gameExample.cpuPlayer.cpuShips.battleShip.currentCoords
    ).toStrictEqual([
      [2, 1],
      [3, 1],
      [4, 1],
    ]);
  });
});

describe("DOMLogic tests", () => {

  document.body.innerHTML =
    '<main>' +
    '</main>';

  const mockGrid1 = document.createElement("div");
  const mockGrid2 = document.createElement("div");
  mockGrid1.classList.add("grid-1");
  mockGrid2.classList.add("grid-2");

  const main = document.querySelector("main")

  main.appendChild(mockGrid1)
  main.appendChild(mockGrid2)

  DOMLogic.displayGrid(mockGrid1);
  DOMLogic.displayGrid(mockGrid2);

  test("the grid DOM elements have their coordinates as classes.", () => {
    expect([mockGrid1.childNodes[1].className]).toStrictEqual(["0,1"]);
    expect([mockGrid1.childNodes[2].className]).toStrictEqual(["0,2"]);
    expect([mockGrid1.childNodes[99].className]).toStrictEqual(["9,9"]);
  });

  const newGame = DOMLogic.startGame(mockGrid1, mockGrid2, [[[0, 2], [0, 1]]], [[0, 1]]); // note that mockGrid1 has a two coordinates boat.

  mockGrid2.childNodes[0].click(); // click [0, 0] coordinate.

  test("can click a specific coordinate in the cpu board and run receiveAttack", () => {
    expect(newGame.currentGame.cpuPlayer.cpuShips.carrier.currentHits()).toBe(1);
  });

  mockGrid1.childNodes[1].click(); // click [0, 1] coordinate.

  test("can click a specific coordinate in the cpu board and run receiveAttack, but the ship have multiple coordinates.", () => {
    expect(newGame.currentGame.Player.playerShips.carrier.currentHits()).toBe(1);
  });

  mockGrid2.childNodes[35].click() // 3,5 coordinate doesn't has a ship.
  test("when a coordinate is clicked, and it is a missed attack, there should be a visual indicator.", () => {
    expect(mockGrid2.childNodes[35].textContent).toBe("•");
  });

  mockGrid2.childNodes[1].click() // 0,1 coordinate has a ship

  test("when a coordinate is clicked, and it is a successful attack, there should be a visual indicator.", () => {
    expect(mockGrid2.childNodes[1].textContent).toBe("X");
  });

});

describe("GameLoop tests", () => {

  document.body.innerHTML =
    '<main>' +
    '</main>';

  GameLoop.setupDOM()

  const shownGrid1 = document.getElementsByClassName("shown-grid")[0]

  const coordStyle = window.getComputedStyle(shownGrid1.childNodes[1])

  test("before initializing the game, the player can check it's occupied coordinates visually indicated.", () => {
    expect(coordStyle.getPropertyValue("border-color")).toBe("green");
  });

  const startGame = GameLoop.singlePlayer()

  test("after initializing the game, the previous grid, input and start button should be deleted, so the new grid with event listeners can be generated.", () => {
    const repeatedGrid = document.getElementsByClassName("grid-1")[1] // if there isn't a method that deletes unnecesary elements, there will be two "grid-1".
    expect(repeatedGrid).toBe(undefined)
  });

  const mockGrid2 = document.getElementsByClassName("grid-2")[0]

  mockGrid2.childNodes[0].click() // we attack the cpu, expecting to receive an attack from it.

  test("after the player1 attacks, the cpu can make an attack", () => {
    expect(typeof (startGame.playerObj.playerBoard.receivedAttacks[0])).toBe("object"); // if the cpu attacked the player, the player must have an attack in receivedAttacks
  });

  test("the gameLoop ends when anybody is sunk.", () => { // click every cpuPlayer coord.

    mockGrid2.childNodes[1].click()
    mockGrid2.childNodes[2].click()
    mockGrid2.childNodes[3].click()
    mockGrid2.childNodes[4].click()
    mockGrid2.childNodes[21].click()
    mockGrid2.childNodes[31].click()
    mockGrid2.childNodes[41].click()
    mockGrid2.childNodes[6].click()
    mockGrid2.childNodes[7].click()
    mockGrid2.childNodes[8].click()
    mockGrid2.childNodes[33].click()
    mockGrid2.childNodes[34].click()
    mockGrid2.childNodes[63].click()
    mockGrid2.childNodes[62].click()
    mockGrid2.childNodes[68].click()
    mockGrid2.childNodes[69].click()
    mockGrid2.childNodes[75].click()
    mockGrid2.childNodes[92].click()
    mockGrid2.childNodes[99].click()
    mockGrid2.childNodes[87].click()

    expect(startGame.currentTurn.turnsLogic()).toBe(true);
  });


  test("when the game ends, the grid event listeners are removed.", () => {
    const updatedGrid2 = document.getElementsByClassName("grid-2")[0]

    updatedGrid2.childNodes[38].click()

    expect(updatedGrid2.childNodes[38].textContent).toBe(""); // because there aren't event listeners, no more clicks can be done.
  });

  test("if the cpu makes an 'no-click' attack, it should be displayed in player's grid.", () => {
    const attackedCoord = startGame.playerObj.playerBoard.receivedAttacks[0]
    const DOMCoord = document.getElementsByClassName(attackedCoord)[0]
    expect(DOMCoord.textContent === "X" || DOMCoord.textContent === "•").toBeTruthy()

  });

  test("when a ship is sunk, there should be a visual indicator", () => {
    expect(mockGrid2.childNodes[33].style.borderColor && mockGrid2.childNodes[34].style.borderColor).toBe("red") // 3,3 and 3,4 make an entire ship.
  });

});

describe("Game mechanics tests", () => {

  const newGame = Game.newGame("example", ExampleCoords, ExampleCoords)

  playerLogic.attackCorners([7, 5], newGame.cpuPlayer.receiveAttack)

  test("on a successful attack, the 4 corners of the attacked coordinate should be attacked too.", () => {
    expect(newGame.cpuPlayer.cpuBoard.receivedAttacks[0]).toStrictEqual([8, 6])
    expect(newGame.cpuPlayer.cpuBoard.receivedAttacks[1]).toStrictEqual([8, 4])
    expect(newGame.cpuPlayer.cpuBoard.receivedAttacks[2]).toStrictEqual([6, 6])
    expect(newGame.cpuPlayer.cpuBoard.receivedAttacks[3]).toStrictEqual([6, 4])
  });

  playerLogic.attackCorners([0, 1], newGame.cpuPlayer.receiveAttack)

  test("if there is no corners in one side or more sides, can still attack the remaining corners", () => {
    expect(newGame.cpuPlayer.cpuBoard.receivedAttacks[4]).toStrictEqual([1, 2])
    expect(newGame.cpuPlayer.cpuBoard.receivedAttacks[5]).toStrictEqual([1, 0])
  });

  test("if the player clicks the corners, no attacks should be done later on player's grid.", () => {

    document.body.innerHTML =
      '<main>' +
      '</main>';

    GameLoop.setupDOM()
    const startGame = GameLoop.singlePlayer()
    const mockGrid2 = document.getElementsByClassName("grid-2")[0]

    mockGrid2.childNodes[75].click() // make an attack, the cpu takes his turn and attacks us.
    // 8,6 is a corner of 7,5
    mockGrid2.childNodes[86].click() // if clicking the corner makes an attack, the cpu should attack us here again.

    if (startGame.playerObj.playerBoard.successAttacks.length === 0) // when the random cpu attack is a missed attack
      expect(startGame.playerObj.playerBoard.receivedAttacks).toHaveLength(1)
    else expect(startGame.playerObj.playerBoard.successAttacks).toHaveLength(1)
  });


  playerLogic.attackAround([7, 5], newGame.cpuPlayer.receiveAttack)

  test("on a successful sunk, the 4 sides of each coordinate should be attacked too.", () => {
    expect(newGame.cpuPlayer.cpuBoard.receivedAttacks[6]).toStrictEqual([6, 5])
    expect(newGame.cpuPlayer.cpuBoard.receivedAttacks[7]).toStrictEqual([8, 5])
    expect(newGame.cpuPlayer.cpuBoard.receivedAttacks[8]).toStrictEqual([7, 6])
    expect(newGame.cpuPlayer.cpuBoard.receivedAttacks[9]).toStrictEqual([7, 4])
  });

})

describe("Game setup tests", () => {

  test("can create a random-coords 1x1 ship", () => {
    const randomCoord = GameLoop.genShipCoord(1)
    expect(typeof (randomCoord[0])).toBe("number")
    expect(typeof (randomCoord[1])).toBe("number")
  })

  test("can create a random-coords 2x1 ship", () => {
    const randomCoord = GameLoop.genShipCoord(2)
    expect(typeof (randomCoord[0])).toBe("object")
    expect(typeof (randomCoord[1])).toBe("object")
  })

  test("can create a random-coords battleship", () => {
    const battleShip = GameLoop.genBattleshipCoords()

    expect(battleShip[0][0].length).toBe(4)
    expect(battleShip[2][0].length).toBe(3)
    expect(battleShip[4][0].length).toBe(2)
    expect(battleShip[6].length).toBe(2)
  })


})
