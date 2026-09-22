# Architecture & Design

## Overview
Browser-based 2D action platformer built with HTML5 Canvas and Vanilla JavaScript.

## Modules
- `index.html`, `level2.html`, `level3.html`: Level page entrypoints
- `css/game.css`: Styling and HUD/overlay layout
- `js/input.js`: Keyboard event handlers
- `js/physics.js`: Gravity and velocity integration
- `js/collision.js`: AABB collision detection and platform resolution
- `js/combat.js`: Melee hitboxes and damage events
- `js/magic.js`: Forward projectiles and sky strike magic systems
- `js/enemies.js`: Patrol and chase enemies with HP, damage, and death
- `js/camera.js`: Smooth horizontal scrolling camera
- `js/respawn.js`: Checkpoint tracking and player respawn
- `js/level-loader.js`: Level configuration data and platform/enemy layouts
- `js/main.js`: Game state machine, loop, UI, and HUD rendering
- `tests/smoke-test.js`: Automated smoke test suite
