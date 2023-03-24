import { mainObjects } from "./index";

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

describe("gameboard test", () => {
  test("can create a 10x10 game board", () => {
    expect(mainObjects.Gameboard().newBoard(10).length).toBe(100);
  });

  test("the game board has X both and Y coordinates correct", () => {
    expect(mainObjects.Gameboard().newBoard(10)[10]).toEqual([1, 0]);
    expect(mainObjects.Gameboard().newBoard(10)[22]).toEqual([2, 2]);
  });

  describe("receiveAttack tests", () => {
    const testShips = mainObjects.Gameboard().deployShips([3, 3]);

    const testShips2 = mainObjects.Gameboard().deployShips([[3, 3], [3, 4], [3, 5]]);

    // run receiveAttack
    mainObjects.Gameboard().receiveAttack([3, 3], testShips);

    mainObjects.Gameboard().receiveAttack([3, 4], testShips2)

    mainObjects.Gameboard().receiveAttack([3, 5], testShips2)

    test("can make a 1-space ship receive an attack", () => {
      expect(testShips.carrier.currentHits()).toBe(1);
    });

    test("can make a 3-spaces ship receive an attack", () => {
      expect(testShips2.carrier.currentHits()).toBe(2);
    });
  });
});
