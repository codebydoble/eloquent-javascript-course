# Chapter 5: Higher-order Functions

## 1. Flattening

Use the `reduce` method in combination with the `concat` method to "flatten" an array of arrays into a single array that has all the elements of the original arrays.

```javascript
let arrays = [[1, 2, 3], [4, 5], ];
console.log(flatten(arrays));
// → [1, 2, 3, 4, 5, 6]
2. Mother Language
Write a function groupBy that groups the elements of an array according to a property. The function takes an array and a property name as arguments and returns an object that maps values of that property to arrays of elements.

javascript

Copy
groupBy([
  {name: "Henriette", nationality: "Danish"},
  {name: "John", nationality: "American"},
  {name: "Mary", nationality: "Danish"}
], "nationality");
// → {Danish: [{name: "Henriette", nationality: "Danish"}, {name: "Mary", nationality: "Danish"}],
//    American: [{name: "John", nationality: "American"}]}
3. Ancestry
Use the filter method to create an array of all the ancestors of a person. You will need to traverse the family tree.

javascript

Copy
function ancestor(person, family) {
  // Your code here
}
4. Every and Then Some
Implement the every function that behaves like the array method every. It takes an array and a predicate function and returns true if the predicate returns true for all elements in the array.

Also implement some which returns true if the predicate returns true for at least one element.

javascript

Copy
console.log(every([1, 3, 5], n => n < 10));
// → true
console.log(every([2, 4, 16], n => n < 10));
// → false
console.log(every([], n => n < 10));
// → true

console.log(some([1, 3, 5], n => n > 4));
// → true
console.log(some([1, 3, 5], n => n > 10));
// → false
```
