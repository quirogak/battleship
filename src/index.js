
const mainObjects = (() => {

  const Ship = (lengthNumber, hitsNumber) => {

    const checkSunk = (length, hits) => {

      if (length === hits) return true
      return false
    }

    let shipHits = hitsNumber

    const shipLength = lengthNumber

    const isSunk = () => checkSunk(shipLength, shipHits)

    const hit = () => {
      shipHits++
      return shipHits
    }



    return { shipLength, shipHits, isSunk, hit }

  }

  return { Ship }

})();


export { mainObjects }