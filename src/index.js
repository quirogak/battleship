const mainObjects = (() => {
  const Ship = (lengthNumber, hitsNumber) => {
    const checkSunk = (length, hits) => {
      if (length === hits) return true;
      return false;
    };

    let shipHits = hitsNumber;

    const shipLength = lengthNumber;

    const isSunk = () => checkSunk(shipLength, shipHits);

    const hit = () => {
      shipHits++;
      return shipHits;
    };

    return { isSunk, hit };
  };

  const Gameboard = (size) => {
    const newBoard = () => {
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

    return { newBoard };
  };

  return { Ship, Gameboard };
})();

export { mainObjects };
