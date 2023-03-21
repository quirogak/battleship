import { mainObjects } from "./index";

describe("ship test", () => {
  test("can check if a ship is not sunk", () => {
    expect(mainObjects.Ship(4, 0).isSunk()).toBe(false);
  });

  test("can check if a ship is sunk", () => {
    expect(mainObjects.Ship(3, 3).isSunk()).toBe(true);
  });

  test("can increase the number of hits", () => {
    expect(mainObjects.Ship(4, 0).hit()).toBe(1);
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
    expect(mainObjects.Gameboard(10).newBoard().length).toBe(100);
  });

  test("the game board has X both and Y coordinates correct", () => {
    expect(mainObjects.Gameboard(10).newBoard()[10]).toEqual([1, 0]);
    expect(mainObjects.Gameboard(10).newBoard()[22]).toEqual([2, 2]);
  });
});
