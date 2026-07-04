# Chapter 3: Functions

**Overview**
Functions are the backbone of JavaScript. This chapter covers defining functions, scope, and the concept of closures. You will learn how to create reusable blocks of code and manage variable visibility.

## Key Concepts

- **Function Declarations vs. Expressions**
- **Parameters and Arguments**
- **Scope**: Global vs. Local
- **Closures**: Functions remembering their environment
- **Recursion**: Functions calling themselves

## Exercises

### 1. Min

Define a function `min` that takes two arguments and returns their minimum.

```javascript
console.log(min(0, 10))
// → 0
console.log(min(0, -10))
// → -10
```

### 2. Recursion

We've seen that n % 2 can be used to test if a number is even or odd. Define a recursive function isEven that takes a single numeric argument and returns a Boolean indicating whether the number is even.

isEven(50) → true
isEven(75) → false
isEven(-1) → ?

### 3. Counting Bees

Write a function countBs that takes a string as its only argument and returns a number that indicates how many uppercase "B" characters are in the string. Then, write a function countChar that behaves like countBs, except it takes a second argument that indicates the character to count.

console.log(countChar("kakkerlak", "k"));
// → 4
