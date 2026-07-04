# Exercises

_Reintentar_
Imagina que tienes una función primitiveMultiply que en el 20 por ciento de los casos multiplica dos números y en el otro 80 por ciento arroja una excepción del tipo MultiplicatorUnitFailure.

1. [x] Escribe una función que envuelva esta función problemática y siga intentando hasta que una llamada tenga éxito, momento en el que devuelva el resultado.

**Note**: Asegúrate de manejar solo las excepciones que estás intentando manejar.

_La caja cerrada con llave_
Considera el siguiente objeto (bastante artificial):

const box = new class {
locked = true;
#content = [];
unlock() { this.locked = false; }
lock() { this.locked = true; }
get content() {
if (this.locked) throw new Error("¡Cerrado con llave!");
return this.#content;
}
};
Es una caja con una cerradura. Hay un array en la caja, pero solo puedes acceder a él cuando la caja está desbloqueada.

2. [x] Escribe una función llamada withBoxUnlocked que reciba como argumento un valor de función, desbloquee la caja, ejecute la función y luego asegure que la caja esté cerrada de nuevo antes de devolverla, independientemente de si la función de argumento devolvió normalmente o lanzó una excepción.

**Note**: Para puntos adicionales, asegúrate de que si llamas a withBoxUnlocked cuando la caja ya está desbloqueada, la caja permanezca desbloqueada.
