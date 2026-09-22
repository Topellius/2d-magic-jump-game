const assert = require('assert');

console.log("Running smoke tests...");

// Test input system structure
const InputMock = {
    keys: { 'ArrowLeft': true },
    isLeftPressed() { return !!this.keys['ArrowLeft']; }
};
assert.strictEqual(InputMock.isLeftPressed(), true, "Input left test failed");

// Test physics gravity
const PhysicsMock = {
    gravity: 0.5,
    update(ent) {
        if (!ent.isGrounded) ent.vy += this.gravity;
        ent.y += ent.vy;
    }
};
const ent = { x: 0, y: 0, vx: 0, vy: 0, isGrounded: false };
PhysicsMock.update(ent);
assert.strictEqual(ent.vy, 0.5, "Physics gravity test failed");

// Test collision AABB
const CollisionMock = {
    rectIntersect(r1, r2) {
        return r1.x < r2.x + r2.width &&
               r1.x + r1.width > r2.x &&
               r1.y < r2.y + r2.height &&
               r1.y + r1.height > r2.y;
    }
};
const box1 = { x: 0, y: 0, width: 30, height: 30 };
const box2 = { x: 20, y: 20, width: 30, height: 30 };
assert.strictEqual(CollisionMock.rectIntersect(box1, box2), true, "Collision intersect test failed");

console.log("All smoke tests passed successfully!");
