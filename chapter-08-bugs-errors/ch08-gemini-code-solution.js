/**
 * Chapter 8 Bugs and errors - Refactored Expert Solution
 * Standard Eloquent JS compliant
 */
"use strict";

class MultiplicatorUnitFailure extends Error {}

/**
 * Standard simulated primitiveMultiply.
 * Fails with MultiplicatorUnitFailure 80% of the time.
 */
function primitiveMultiply(a, b) {
  if (Math.random() < 0.2) {
    return a * b;
  } else {
    throw new MultiplicatorUnitFailure("Klunk");
  }
}

/**
 * Wraps primitiveMultiply to continuously retry only upon MultiplicatorUnitFailure.
 */
function reliableMultiply(a, b) {
  for (;;) {
    try {
      return primitiveMultiply(a, b);
    } catch (error) {
      if (!(error instanceof MultiplicatorUnitFailure)) {
        throw error; // Let other unexpected errors bubble up
      }
    }
  }
}

// ==========================================
// Exercise 2: The Locked Box
// ==========================================

const box = new class {
  locked = true;
  #content = ["gold", "silver", "gems"];
  
  unlock() { 
    this.locked = false; 
  }
  
  lock() { 
    this.locked = true; 
  }
  
  get content() {
    if (this.locked) throw new Error("¡Cerrado con llave!");
    return this.#content;
  }
};

/**
 * Executes a callback with the box unlocked.
 * Restores the box to its original lock state afterward,
 * while allowing any errors to bubble up correctly.
 */
function withBoxUnlocked(body) {
  const initiallyLocked = box.locked;
  
  if (!initiallyLocked) {
    return body();
  }
  
  box.unlock();
  try {
    return body();
  } finally {
    box.lock();
  }
}

// Verification Tests
try {
  console.log("Reliable Multiply Result:", reliableMultiply(8, 8)); // 64
} catch (e) {
  console.error("Multiply Failed:", e.message);
}

// Running with initially locked box
try {
  withBoxUnlocked(() => {
    box.content.push("ruby");
    console.log("Box Content inside callback:", box.content);
  });
} catch (e) {
  console.error("Callback threw error:", e.message);
}
console.log("Box Locked Status (expected true):", box.locked); // true

// Running with initially unlocked box (must remain unlocked)
box.unlock();
withBoxUnlocked(() => {
  console.log("Box Content while unlocked:", box.content);
});
console.log("Box Locked Status (expected false):", box.locked); // false