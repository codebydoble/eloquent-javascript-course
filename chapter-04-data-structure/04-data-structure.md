# Chapter 4: Data Structures: Objects and Arrays

## 1. The Sum of a Range

The `range` function takes two arguments and returns an array containing all the numbers from the first to the second, inclusive.

```javascript
console.log(range(1, 10));
// → [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
Write a function sum that takes an array of numbers and returns their sum.

javascript

Copy
console.log(sum(range(1, 10)));
// → 55
Add an optional third argument to range to indicate the step value. If not provided, the step defaults to 1.

javascript

Copy
console.log(range(1, 10, 2));
// → [1, 3, 5, 7, 9]
2. Reversing an Array
Arrays have a reverse method that changes the array by reversing the order of its elements. Write two functions: reverseArray and reverseArrayInPlace.

The first should take an array and return a new array that has the same elements but in reverse order. The second should take an array as an argument and change that array by reversing its elements.

javascript

Copy
console.log(reverseArray(["A", "B", "C"]));
// → ["C", "B", "A"];

let arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]
3. A List
Arrays are not the only way to build lists. In this exercise, you will build a linked list.

Write a function arrayToList that takes an array as an argument and returns a list structure, and a function listToArray that takes a list and returns an array.

Also add a helper function prepend that takes an element and a list and returns a new list that adds the element to the front of the input list, and nth that takes a list and a number and returns the element at the given position in the list (with zero referring to the first position) or undefined when there is no such element.

javascript

Copy
console.log(arrayToList([10, 20]));
// → {value: 10, rest: {value: 20, rest: null}}

console.log(listToArray(arrayToList([10, 20, 30])));
// → [10, 20, 30]

console.log(prepend(10, prepend(20, null)));
// → {value: 10, rest: {value: 20, rest: null}}

console.log(nth(arrayToList([10, 20, 30]), 1));
// → 20
4. Deep Comparison
Write a function deepEqual that takes two values and returns true only if they are the same value or are objects with the same properties, where the values of the properties are equal when compared with a recursive call to deepEqual.

To find out whether values should be compared directly (using the === operator for that), use the typeof operator. If both values have type object, compare their properties by calling deepEqual on them.

javascript

Copy
let obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, {here: 1, object: 2}));
// → false
console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
// → true
```
