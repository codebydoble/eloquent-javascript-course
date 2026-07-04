# Ejercicios

_Ejercicio 1_: Medición de un robot
Es difícil comparar de manera objetiva los robots solo dejando que resuelvan algunos escenarios. Tal vez un robot simplemente tuvo tareas más fáciles o el tipo de tareas en las que es bueno, mientras que el otro no.

1.  [x] Escribe una función compareRobots que tome dos robots (y su memoria ini-
        cial). Debería generar 100 tareas y permitir que cada uno de los robots resuelva
        cada una de estas tareas. Cuando termine, debería mostrar el número promedio
        de pasos que cada robot dio por tarea.
        Por el bien de la equidad, asegúrate de darle a cada tarea a ambos robots,
        en lugar de generar tareas diferentes por robot.

_Ejercicio 2_: Eficiencia del robot

2. [x] ¿Puedes escribir un robot que termine la tarea de entrega más rápido que goalOrientedRobot? Si observas el comportamiento de ese robot, ¿qué cosas claramente absurdas hace? ¿Cómo podrían mejorarse?
       Si resolviste el ejercicio anterior, es posible que desees utilizar tu función compareRobots para verificar si mejoraste el robot.

_Ejercicio 3_: Grupo persistente

La mayoría de las estructuras de datos proporcionadas en un entorno estándar de JavaScript no son muy adecuadas para un uso persistente. Los Arrays tienen métodos slice y concat, que nos permiten crear fácilmente nuevos arrays sin dañar el antiguo. Pero Set, por ejemplo, no tiene métodos para crear un nuevo conjunto con un elemento añadido o eliminado.

3. [x] Escribe una nueva clase PGroup, similar a la clase Grupo del Capítulo 6, que almacena un conjunto de valores. Al igual que Grupo, tiene métodos add, delete, y has.
       Sin embargo, su método add debería devolver una nueva instancia de PGroup con el miembro dado añadido y dejar la anterior sin cambios. De manera similar, delete crea una nueva instancia sin un miembro dado. La clase debería funcionar para valores de cualquier tipo, no solo para strings. No tiene que ser eficiente cuando se utiliza con grandes cantidades de valores. El constructor no debería ser parte de la interfaz de la clase (aunque definitivamente querrás usarlo internamente). En su lugar, hay una instancia vacía, PGroup.empty, que se puede usar como valor inicial.
       ¿Por qué necesitas solo un valor PGroup.empty, en lugar de tener una función que cree un nuevo mapa vacío cada vez?
