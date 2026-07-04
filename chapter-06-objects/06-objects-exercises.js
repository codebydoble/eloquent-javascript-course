/**
 * Chapter 6 Objects
 * Author: Yoandy Doble Herrera
 * Date: 01/06/2026
 */
"use strict"
console.log("\n=== Challenge 1 ===")
/**
 * Un tipo de vector
 * Escribe una clase Vec que represente un vector en el espacio bidimensional. Toma los parámetros x e y (números), que debería guardar en propiedades del mismo nombre.
 * Dale a la clase Vec dos métodos en su prototipo, plus y minus, que tomen otro vector como parámetro y devuelvan un nuevo vector que tenga la suma o la diferencia de los valores x e y de los dos vectores (this y el parámetro).Agrega una propiedad getter length al prototipo que calcule la longitud del vector, es decir, la distancia del punto (x, y) desde el origen (0, 0).
 */
class Vec {
  /**
   *
   * @param {Number} x x axis.
   * @param {Number} y y axis.
   */
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  /**
   * Function que toma otro vector como parámetro y devuelve un nuevo vector que tenga la suma de los valores x e y de los dos vectores (this y el parámetro).
   * @param {Number} otherX other x axis.
   * @param {Number} otherY other y axis.
   * @returns {Vec} nuevo vector que tiene la suma de los valores x e y de los dos vectores (this y el parámetro).
   */
  plus(otherX, otherY) {
    return new Vec(this.x + otherX, this.y + otherY)
  }

  /**
   * Function que toma otro vector como parámetro y devuelve un nuevo vector que tenga la resta de los valores x e y de los dos vectores (this y el parámetro).
   * @param {Number} otherX other x axis.
   * @param {Number} otherY other y axis.
   * @returns {Vec} nuevo vector que tiene la suma de los valores x e y de los dos vectores (this y el parámetro).
   */
  minus(otherX, otherY) {
    return new Vec(this.x - otherX, this.y - otherY)
  }
  /**
   * Calcule la longitud del vector, es decir, la distancia del punto (x, y) desde el origen (0, 0).
   * @returns {Number} longitud.
   */
  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }
}

const vector = new Vec(47, 74)
console.log(">>>Vector: ", vector)
console.log(">>>Vector x: ", vector.x)
console.log(">>>Vector y: ", vector.y)
const vectorPlus = vector.plus(12, 35)
console.log(">>>Vector sum: ", vectorPlus)
const vectorMinus = vector.minus(31, 43)
console.log(">>>Vector sum: ", vectorMinus)

console.log("\n=== Challenge 2 ===")

/**
 * El entorno estándar de JavaScript proporciona otra estructura de datos llamada
Set. Al igual que una instancia de Map, un conjunto contiene una colección de
valores. A diferencia de Map, no asocia otros valores con esos, solo realiza un
seguimiento de qué valores forman parte del conjunto. Un valor puede formar
parte de un conjunto solo una vez: agregarlo nuevamente no tiene ningún efecto.
Escribe una clase llamada Group (ya que Set está siendo utilizado). Al igual
que Set, tiene los métodos add, delete y has. Su constructor crea un grupo
vacío, add agrega un valor al grupo (pero solo si aún no es miembro), delete
elimina su argumento del grupo (si era miembro), y has devuelve un valor
booleano que indica si su argumento es miembro del grupo.
Usa el operador ===, o algo equivalente como indexOf, para determinar si
dos valores son iguales.
Dale a la clase un método estático from que tome un objeto iterable como
argumento y cree un grupo que contenga todos los valores producidos al iterar
sobre él.
 */
class Group {
  #group
  #index = 0

  // Ej 2
  /*constructor() {
    this.#group = []
  }*/

  // Ej 3
  /**
   *
   * @param {Array} group serie de elementos únicos.
   */
  constructor(group) {
    this.#group = group
  }
  /**
   * Agrega un valor al grupo (pero solo si aún no es miembro).
   * @param {Number|Boolean|Symbol|BigInt|String|null|undefined|Array|Object} element cualquier valor.
   */
  add(element) {
    const index = this.#group.findIndex((e) => e === element)
    if (index === -1) {
      // It's not a member.
      this.#group.push(element)
    }
  }

  /**
   *  @returns {Group} return item group.
   */
  get group() {
    return this.#group
  }

  /**
   * Elimina su argumento del grupo (si era miembro).
   * @param {Number|Boolean|Symbol|BigInt|String|null|undefined|Array|Object}  element cualquier elemento.
   *
   */
  delete(element) {
    const index = this.#group.findIndex((e) => e === element)
    if (index !== -1) {
      // It's not a member.
      this.#group.splice(index, 1)
    }
  }

  /**
   * Devuelve un valor booleano que indica si su argumento es miembro del grupo.
   * @param {Number|Boolean|Symbol|BigInt|String|null|undefined|Array|Object}   element cualquier elemento.
   * @returns {Boolean} devuelve true si su argumento es miembro del grupo sino devuelve false.
   */
  has(element) {
    return this.#group.some((e) => e === element)
  }

  /**
   * Función que toma un objeto iterable como argumento y crea un grupo que contenga todos los valores producidos al iterar sobre él.
   * @param {Array|Object} iterableObject cualquier objeto iterable.
   * @returns {Group} un grupo que contenga todos los valores producidos al iterar sobre él.
   */
  //Ej 2
  /* static from(iterable = []) {
    let resultGroup = new Group()
    // check array or object
    console.log(">>>ERRORRRRRRRRRRR: ")
    if (Array.isArray(iterable)) {
      // Array
      if (iterable.length === 0) {
        return resultGroup.group
      } else {
        iterable.forEach((element) => {
          resultGroup.add(element)
        })
        return resultGroup.group
      }
    } else if (iterable instanceof Object) {
      // Object
      if (Object.entries(iterable).length === 0) {
        return resultGroup.group
      } else {
        for (const element of Object.values(iterable)) {
          resultGroup.add(element)
        }
        return resultGroup.group
      }
    } else {
      // If not iterable return new group
      return resultGroup.group
    }
  }*/
  // Ej 3
  static from(iterable = []) {
    let resultGroup = new Group([])
    // check array or object
    if (Array.isArray(iterable)) {
      // Array
      if (iterable.length === 0) {
        return new Group(iterable)
      } else {
        iterable.forEach((element) => {
          resultGroup.add(element)
        })
        return resultGroup.group
      }
    } else if (iterable instanceof Object) {
      // Object
      if (Object.entries(iterable).length === 0) {
        return new Group(Object.values(iterable))
      } else {
        for (const element of Object.values(iterable)) {
          resultGroup.add(element)
        }
        return resultGroup.group
      }
    } else {
      // If not iterable return new group
      return resultGroup.group
    }
  }

  /**
   * @returns {Number|Boolean|Symbol|BigInt|String|null|undefined|Array|Object} actual group element.
   */
  next() {
    if (this.#index >= this.#group.length - 1) {
      return { done: true }
    }
    let valueActual = this.#group[this.#index]
    this.#index++
    return { value: valueActual, done: false }
  }
}
const myGroup = new Group([24, 24, true, -24, "@codebydoble", true, undefined, false, 100])
console.log(">>>New group: ", myGroup.group, "\n")
myGroup.add(58)
myGroup.add(-24)
myGroup.add(58)
myGroup.add(-1)
myGroup.add("@codebydoble")
myGroup.add(true)
myGroup.add(undefined)
myGroup.add(true)
myGroup.add(false)
myGroup.add(100)
myGroup.add(null)
myGroup.delete(null)
myGroup.delete(-1)
myGroup.delete(null)
console.log(">>>Group: ", myGroup.group, "\n")
console.log(">>>Yoandy in Group : ", myGroup.has("Yoandy"))
console.log(">>>24 in Group: ", myGroup.has(24))
console.log(">>>false in Group: ", myGroup.has(false))
const fromGroupTwo = Group.from([24, 24, true, -24, "@codebydoble", true, undefined, false, 100])
console.log("from ", fromGroupTwo)
const fromGroupThree = Group.from({ name: "Yoandy", age: 37, school: "UCI" })
console.log("from ", fromGroupThree)
const fromGroupOne = Group.from(12, "String")
console.log("from ", fromGroupOne)
console.log("\n=== Challenge 3 ===")
const groupChallengeThree = new Group([24, -1, true, -24, "@codebydoble", undefined, false, null, 100])
console.log(">>>Group Challenge 3: ", groupChallengeThree)
console.log(">>>Group Challenge 3: ", groupChallengeThree.next())
console.log(">>>Group Challenge 3: ", groupChallengeThree.next())
console.log(">>>Group Challenge 3: ", groupChallengeThree.next())
console.log(">>>Group Challenge 3: ", groupChallengeThree.next())
console.log(">>>Group Challenge 3: ", groupChallengeThree.next())
console.log(">>>Group Challenge 3: ", groupChallengeThree.next())
console.log(">>>Group Challenge 3: ", groupChallengeThree.next())
console.log(">>>Group Challenge 3: ", groupChallengeThree.next())
console.log(">>>Group Challenge 3: ", groupChallengeThree.next())
console.log(">>>Group Challenge 3: ", groupChallengeThree.next())
console.log(">>>Group Challenge 3: ", groupChallengeThree.next())
console.log(">>>Group Challenge 3: ", groupChallengeThree.next())
