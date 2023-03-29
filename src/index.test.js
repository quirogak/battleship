import { mainObjects, playerLogic } from "./index";

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

  testGameboard.receiveAttack([4, 8], testShips); // missed attack

  test("can record missed attacks", () => {
    expect(testGameboard.missedAttacks).toStrictEqual([[4, 8]]);
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

  testShips2.coordinates.destroyer = [3, 4]

  testShips2.destroyer.currentCords = [3, 4]

  testShips2.coordinates.destroyer1 = [4, 3]

  testShips2.destroyer1.currentCords = [4, 3]

  testGameboard.receiveAttack([3, 4], testShips2)

  testGameboard.receiveAttack([4, 3], testShips2)

  test("can check if a multiple boat fleet is sunk", () => {
    expect(testGameboard.checkSunk(testShips2)).toBe(true);
  });

  const testShips3 = testGameboard.deployShips();

  testShips3.coordinates.destroyer = [3, 4]

  testShips3.destroyer.currentCords = [3, 4]

  testShips3.coordinates.destroyer1 = [4, 3]

  testShips3.destroyer1.currentCords = [4, 3]

  testGameboard.receiveAttack([3, 4], testShips3) // we only sunk one destroyer

  test("can check if a multiple boat fleet is NOT sunk", () => {
    expect(testGameboard.checkSunk(testShips3)).toBe(false);
  });

});

describe("cpuPlayer tests", () => {

  test("can make a random attack in a player's board", () => {

    const humanPlayer = playerLogic.Player("example")

    const humanBoard = humanPlayer.playerBoard

    const cpuPlayer = playerLogic.cpuPlayer(humanPlayer)

    cpuPlayer.attackPlayer()

    // because there is no player ships coordinates defined on this example, the cpu attack will always be a missedAttack.
    expect(humanBoard.missedAttacks[0]).not.toBe(undefined);
  });


});
