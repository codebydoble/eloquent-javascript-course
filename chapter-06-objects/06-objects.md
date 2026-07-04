# Chapter 6 Exercises

**1. A Vector Type**
Write a class `Vec` that represents a vector in two-dimensional space. It takes `x` and `y` parameters (numbers) that it saves to properties.

Provide the methods `plus` and `minus` that take another vector as a parameter and return a new vector that adds or subtracts the `x` and `y` values of the two vectors.

Add a `length` property that computes the length of the vector (the distance from the origin).

```javascript
let v1 = new Vec(1, 2);
let v2 = new Vec(2, 3);
console.log(v1.plus(v2));
// → Vec{x: 3, y: 5}
console.log(v1.minus(v2));
// → Vec{x: -1, y: -1}
console.log(v1.length);
// → 2.23606797749979
2. Groups
Write a class Group that has the following methods:

add(element): Adds an element to the group.
has(element): Returns true if the element is in the group.
delete(element): Removes the element from the group.
Also add a static method from that takes an iterable object and returns a new group containing the elements of that object.

javascript

Copy
let group = Group.from([10, 20, 30]);
console.log(group.has(10));
// → true
console.log(group.has(15));
// → false
group.add(15);
console.log(group.has(15));
// → true
group.delete(10);
console.log(group.has(10));
// → false
3. A Cellphone
Create a class Cellphone that models a simple cellphone. It should have a call method that takes a number and returns a string like "Calling 123-456-7890...". It should also have a sendText method that takes a number and a message.

Add a batteryLevel property that decreases by 10% every time you make a call or send a text. If the battery level drops below 10%, the phone should throw an error.

javascript

Copy
let phone = new Cellphone();
phone.call("123-456-7890");
console.log(phone.batteryLevel);
// → 90
phone.sendText("123-456-7890", "Hello");
console.log(phone.batteryLevel);
// → 80
4. Extending the Map
Create a class Map that extends the built-in Map class. Add a method merge that takes another map and merges its entries into the current map.

javascript

Copy
let m1 = new Map([["a", 1], ["b", 2]]);
let m2 = new Map([["c", 3], ["d", 4]]);
let m3 = m1.merge(m2);
console.log(m3.get("c"));
// → 3
```
