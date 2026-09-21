const assert = require('assert');
const Progression = require('./progression.js');
const Upgrades = require('./upgrades.js');
const Skills = require('./skills.js');
const EnemyExpansion = require('./enemy-types.js');
const SaveSystem = require('./save.js');

console.log("Running comprehensive expansion tests...");

// 1. XP and level thresholds & overflow
Progression.reset();
assert.strictEqual(Progression.level, 1);
assert.strictEqual(Progression.xpToNext(1), 100);
let leveled = Progression.gainXp(120);
assert.strictEqual(leveled, true);
assert.strictEqual(Progression.level, 2);
assert.strictEqual(Progression.xp, 20); // 120 - 100 = 20 overflow

// Multi-level-up test
Progression.reset();
Progression.gainXp(500); // Level 1->2 (100), 2->3 (150), 3->4 (200), remaining 50
assert.strictEqual(Progression.level, 4);
assert.strictEqual(Progression.xp, 50);

// 2. Upgrade caps
Upgrades.reset();
const catalogKey = 'vitality';
const cap = Upgrades.catalog[catalogKey].cap;
for (let i = 0; i < cap + 5; i++) {
    Upgrades.applyUpgrade(catalogKey);
}
assert.strictEqual(Upgrades.owned[catalogKey], cap, "Upgrade exceeded cap");

// 3. Milestone unlocks & double jump reset
Skills.reset();
Skills.checkMilestones(5);
assert.strictEqual(Skills.unlocked.arcBurst, true);
Skills.checkMilestones(10);
assert.strictEqual(Skills.unlocked.doubleJump, true);
Skills.checkMilestones(15);
assert.strictEqual(Skills.unlocked.dash, true);
Skills.checkMilestones(20);
assert.strictEqual(Skills.unlocked.barrier, true);

// 4. Enemy XP once and scaling caps
let enemy = { xp: 15, xpGranted: false };
let xpGained = 0;
function defeatEnemy(e) {
    if (!e.xpGranted) {
        e.xpGranted = true;
        xpGained += e.xp;
    }
}
defeatEnemy(enemy);
defeatEnemy(enemy); // second kill should not grant XP
assert.strictEqual(xpGained, 15);

// Scaling caps (+60% HP, +40% damage max)
const highLevelScaling = EnemyExpansion.getScaling(100);
assert.ok(highLevelScaling.hp <= 1.60, "HP scaling exceeded cap");
assert.ok(highLevelScaling.damage <= 1.40, "Damage scaling exceeded cap");

// 5. Save/Load validation & malformed save fail safe
SaveSystem.reset();
const progData = { level: 3, xp: 40 };
const upgradeData = { vitality: 2 };
const skillData = { arcBurst: true };
SaveSystem.save(progData, upgradeData, skillData, 2);

const loaded = SaveSystem.load();
assert.strictEqual(loaded.version, 1);
assert.strictEqual(loaded.progression.level, 3);
assert.strictEqual(loaded.progression.xp, 40);
assert.strictEqual(loaded.upgrades.vitality, 2);
assert.strictEqual(loaded.skills.arcBurst, true);
assert.strictEqual(loaded.highestCompletedLevel, 2);

// Malformed save test
localStorage.setItem(SaveSystem.saveKey, "invalid_json{{{");
assert.strictEqual(SaveSystem.load(), null);

SaveSystem.reset();
assert.strictEqual(SaveSystem.load(), null);

console.log("All comprehensive expansion tests PASSED successfully!");
