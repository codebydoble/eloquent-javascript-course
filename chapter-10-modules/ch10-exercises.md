# Chapter 10 Modules

## Un robot modular

Estos son los enlaces que crea el proyecto del Capítulo 7:

- roads
- buildGraph
- roadGraph
- VillageState
- runRobot
- randomPick
- randomRobot
- mailRoute
- routeRobot
- findRoute
- goalOrientedRobot

Si tuvieras que escribir ese proyecto como un programa modular:

1. [x] ¿Qué módulos crearías?
       R/ Crearía 6 módulos:

   - modulo roads.js con roads y roadGraph.
   - módulo graph.js con buildGraph.
   - módulo village.js con class VillageState.
   - módulo run.js con runRobot.
   - módulo random-pick.js con randomPick.
   - módulo robots.js con randomRobot, mailRoute, routeRobot, findRoute, goalOrientedRobot depencia con random-pick.js. Se exporta randomRobot, routeRobot, goalOrientedRobot

2. [x] ¿Qué módulo dependería de qué otro módulo y cómo serían sus interfaces?
       R/ El módulo roads.js dependería de graph.js. El módulo roads.js tendría interfaz roadGraph. El módulo graph.js tendría interfaz buildGraph. El módulo village.js posee depencia con random-pick.js y roads.js. El módulo village.js tendría interfaz VillageState. El módulo random-pick.js no posee dependencias. Su interfaz es randomPick. El módulo robots.js dependería de random-pick.js y roads.js. El módulo robots.js tendría interfaz randomRobot, routeRobot y goalOrientedRobot. El módulo run.js depende de village.js y robots.js. El módulo run.js posee interfaz runRobot.
3. [x] ¿Qué piezas es probable que estén disponibles preescritas en NPM?
       R/ findRoute, randomPick, y buildGraph.
4. [x] ¿Preferirías usar un paquete de NPM o escribirlos tú mismo?
       R/ Si es útil en el proyecto preferiría usar un paquete de NPM. Permite obtener código limpio, probado y sin necesidad de reinventar la rueda.

## Módulo de caminos

1. [x] Escribe un módulo ES, basado en el ejemplo del Capítulo 7, que contenga el array de caminos y exporte la estructura de datos de gráfico que los representa como roadGraph. Debería depender de un módulo ./graph.js, que exporta una función buildGraph que se utiliza para construir el gráfico. Esta función espera un array de arrays de dos elementos (los puntos de inicio y fin de los caminos).

## Dependencias circulares

Una dependencia circular es una situación en la que el módulo A depende de B, y B también, directa o indirectamente, depende de A. Muchos sistemas de módulos simplemente prohíben esto porque, sin importar el orden que elijas para cargar dichos módulos, no puedes asegurarte de que las dependencias de
cada módulo se hayan cargado antes de que se ejecute.
Los módulos CommonJS permiten una forma limitada de dependencias cíclicas. Siempre y cuando los módulos no accedan a la interfaz de cada uno hasta después de que terminen de cargarse, las dependencias cíclicas están bien. La función require proporcionada anteriormente en este capítulo admite este tipo de ciclo de dependencia.

1. [x] ¿Puedes ver cómo maneja los ciclos?
       R/ Cuando llamas a esto con el nombre del módulo de tu dependencia, se asegura de que el módulo esté cargado y devuelve su interfaz. require mantiene una tienda (caché) de módulos ya cargados. Cuando se llama, primero comprueba si el módulo solicitado ha sido cargado y, si no, lo carga. Esto implica leer el código del módulo, envolverlo en una función y llamarlo.
