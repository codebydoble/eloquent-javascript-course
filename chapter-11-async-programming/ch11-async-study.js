let quince = Promise.resolve(15)
quince.then((valor) => console.log(`Obtenido ${valor}`))
// → Get 15

// -> Promise as constructor
function textFile(nombreArchivo) {
  return new Promise((resolve) => {
    // readTextFile(nombreArchivo, (texto) => resolve(texto))
  })
}
textFile("planes.txt").then(console.log)

// -> Promise rejected example
function textFile(filename) {
  return new Promise((resolve, reject) => {
    /* readTextFile(filename, (text, error) => {
      if (error) reject(error)
      else resolve(text)
    })*/
  })
}

/* CARLA */
function joinWifi(networkName, accessCode) {
  return new Promise((resolve, reject) => Promise.then(resolve, reject))
}

function withTimeout(promise, tiempo) {
  return new Promise((resolve, reject) => {
    promise.then(resolve, reject)
    setTimeout(() => reject("Timed out"), tiempo)
  })
}

function crackPasscode(networkID) {
  function nextDigit(code, digit) {
    let newCode = code + digit
    return withTimeout(joinWifi(networkID, newCode), 50)
      .then(() => newCode)
      .catch((failure) => {
        if (failure == "Timed out") {
          return nextDigit(newCode, 0)
        } else if (digit < 9) {
          return nextDigit(code, digit + 1)
        } else {
          throw failure
        }
      })
  }
  return nextDigit("", 0)
}
crackPasscode("HANGAR 2").then(console.log)
// → 555555
