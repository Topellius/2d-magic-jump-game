# 2D Magic Jump Game — Expansion Roadmap: XP, Level Up, Skills & Enemy Evolution

## Purpose

This is a **second, independent roadmap lane** for extending the existing 2D Magic Jump Game with progression and replay-value systems.

The base game roadmap remains authoritative for its own `GAME#P0–P27` phases.

This expansion roadmap uses its own namespace:

```text
EXP#P0 ... EXP#P27
```

Important:

- `EXP#` progression is independent from unfinished C++/WASM phases in the base roadmap.
- `GAME#P19–P27` may remain RED while this expansion roadmap is developed.
- do not change `GAME#` roadmap states while executing `EXP#` work
- use `ROADMAP_EXPANSION.md` as the authoritative roadmap for this lane
- JavaScript/Canvas implementation is sufficient
- Emscripten, C++ and WebAssembly are **not required** for this expansion lane

---

## Expansion goal

Add a lightweight RPG-style progression system to the current browser game:

- player earns experience points
- player levels up
- every level gives the player a meaningful permanent choice
- milestone levels unlock new abilities
- progression is visible in the HUD
- new enemy archetypes appear
- enemies gain simple level-based scaling and optional elite traits
- progression can be saved locally
- all additions remain playable with HTML, CSS and vanilla JavaScript

The goal is to add depth without replacing the working movement, combat, checkpoint or level systems.

---

## Existing controls to preserve

```text
Left Arrow   = move left
Right Arrow  = move right
Up Arrow     = jump
Down Arrow   = crouch
Z            = melee
X            = forward magic
C            = sky-to-ground magic
Esc          = pause
```

New controls may be added only when their skill is unlocked:

```text
V            = Arc Burst / Arc Nova        (unlock at player level 5)
Up Arrow     = second press in air         (double jump unlock at player level 10)
Shift        = short directional dash      (unlock at player level 15)
B            = temporary magic barrier     (unlock at player level 20)
```

No existing control may be removed or remapped.

---

## Progression rules

### Starting state

```text
PLAYER_LEVEL=1
PLAYER_XP=0
```

### XP requirement

Use a simple deterministic formula:

```js
xpNeeded(level) = 100 + ((level - 1) * 50)
```

Examples:

```text
Level 1 -> 2 = 100 XP
Level 2 -> 3 = 150 XP
Level 3 -> 4 = 200 XP
Level 4 -> 5 = 250 XP
Level 5 -> 6 = 300 XP
```

XP overflow must carry into the next level.

Example:

```text
player needs 20 XP
player gains 50 XP
level increases
remaining 30 XP is preserved
```

Multiple level-ups from one large XP reward must work correctly.

---

## Every-level reward rule

Every completed level-up must give the player a choice of **one permanent upgrade**.

The game should display three upgrade choices.

The player selects exactly one.

Suggested upgrade pool:

```text
VITALITY
+10 maximum HP

MELEE_POWER
+10% melee damage

MAGIC_POWER
+10% magic damage

MOVE_SPEED
+4% movement speed
cap: +20%

JUMP_POWER
+3% jump strength
cap: +15%

COOLDOWN
-5% magic cooldown duration
cap: -30%

PROJECTILE_SPEED
+8% forward-magic projectile speed
cap: +40%

CHECKPOINT_RECOVERY
+10 HP restored when activating or respawning at checkpoint
```

Rules:

- do not offer already capped upgrades
- choices must not be duplicates
- chosen upgrade applies immediately
- choice is permanent for the current save
- level-up selection must not occur while the player is actively taking damage
- gameplay pauses while the reward selection is open
- closing the menu without choosing is not allowed

---

## Milestone ability rules

Milestone abilities are awarded **in addition to** the normal level-up choice.

### Level 5 — Arc Burst

Control:

```text
V
```

Effect:

- short-range circular magic burst around player
- damages nearby enemies once per cast
- visible circular effect
- cooldown required
- cannot repeatedly damage the same enemy during one cast

### Level 10 — Double Jump

Control:

```text
Up Arrow while airborne
```

Effect:

- one additional jump before touching ground
- resets after landing
- no infinite jump chain
- checkpoint respawn resets double-jump state

### Level 15 — Dash

Control:

```text
Shift
```

Effect:

- short horizontal burst in current facing direction
- brief cooldown
- player remains inside level boundaries
- dash cannot permanently disable gravity or collision

### Level 20 — Magic Barrier

Control:

```text
B
```

Effect:

- short-duration protective barrier
- reduces incoming damage
- visible effect around player
- cooldown required
- must expire automatically

---

## XP sources

Initial suggested values:

```text
basic enemy          = 10 XP
runner enemy         = 12 XP
jumper enemy         = 15 XP
mage enemy           = 18 XP
shield guard         = 22 XP
elite enemy          = base XP × 2
mini-boss            = 100 XP
level completion     = 50 XP
```

Rules:

- XP is granted only once for one enemy death
- dead enemies cannot repeatedly grant XP
- level-completion XP is granted only once per completion
- respawning must not duplicate previously collected XP rewards from already-dead enemies unless the level itself intentionally resets them

---

## Recommended expansion structure

```text
2d-magic-jump-game/
├── ROADMAP_EXPANSION.md
├── js/
│   ├── progression.js
│   ├── upgrades.js
│   ├── skills.js
│   ├── enemy-types.js
│   └── save.js
├── data/
│   ├── progression.json
│   └── enemies.json
├── tests/
│   ├── progression-test.js
│   ├── upgrades-test.js
│   ├── skills-test.js
│   └── enemies-test.js
└── docs/
    └── EXPANSION_PROGRESS.md
```

Existing modules may be extended where appropriate.

Prefer small modules instead of moving all progression code into `main.js`.

---

## Suggested data model

Example player progression state:

```js
{
  level: 1,
  xp: 0,
  xpToNext: 100,

  upgrades: {
    vitality: 0,
    meleePower: 0,
    magicPower: 0,
    moveSpeed: 0,
    jumpPower: 0,
    cooldown: 0,
    projectileSpeed: 0,
    checkpointRecovery: 0
  },

  skills: {
    arcBurst: false,
    doubleJump: false,
    dash: false,
    barrier: false
  }
}
```

Do not store secrets or remote credentials.

---

## Enemy expansion

### Runner

Behavior:

- faster horizontal patrol
- detects player at shorter distance
- chases quickly
- low HP
- low damage
- 12 XP

### Jumper

Behavior:

- patrols normally
- periodically jumps toward player
- must still obey collision and gravity
- medium HP
- 15 XP

### Mage

Behavior:

- prefers distance
- periodically fires a simple projectile
- projectile has finite lifetime
- projectile cannot pass forever through the world
- 18 XP

### Shield Guard

Behavior:

- slow movement
- higher HP
- reduces frontal damage
- normal damage from behind or during vulnerable window
- 22 XP

### Elite modifier

An existing enemy may become an elite variant.

Elite properties:

- visibly distinguishable
- increased HP
- slightly increased damage
- optional faster movement
- XP reward ×2

Do not stack unlimited elite multipliers.

---

## Player-level enemy scaling

Enemy scaling should remain modest.

Example:

```js
scale = 1 + Math.min((playerLevel - 1) * 0.03, 0.60)
```

Suggested scaling:

```text
enemy max HP  *= scale
enemy damage  *= 1 + min((level - 1) * 0.02, 0.40)
```

Do not scale:

- collision boxes
- projectile size
- player controls
- level geometry

The game must remain playable at higher player levels.

---

## Mini-boss concept — Void Warden

A simple mini-boss suitable for Canvas implementation.

Behavior:

1. patrols a bounded arena
2. fires one ranged attack
3. occasionally performs a short charge
4. has visibly larger sprite/shape
5. has a larger HP pool
6. rewards 100 XP once

No complex pathfinding is required.

Primitive Canvas shapes are acceptable.

---

## Persistence

Use browser `localStorage`.

Allowed saved data:

```text
player level
current XP
selected permanent upgrades
unlocked milestone abilities
highest completed level
```

Required actions:

```text
SAVE
LOAD
RESET PROGRESSION
```

Rules:

- malformed localStorage data must fail safely
- missing save must start a new progression state
- save data must have a schema/version field
- reset requires explicit player action
- no remote account
- no cloud backend
- no cookies required
- no secret data

---

## Gate convention

```text
GREEN = explicitly proven PASS
RED = incomplete, failed or unproven
WORKING = implementation in progress
TESTING = exact gate currently being tested
```

Rules:

- `EXP#` phases progress strictly in numeric order
- a RED `EXP#` phase blocks later `EXP#` phases
- do not change `GAME#` states while working this roadmap
- a phase becomes GREEN only after its own gate passes
- do not mark a phase GREEN because a similar feature exists
- inspect actual runtime behavior where the gate is visual/interactive
- preserve the last working state before risky changes

---

# Expansion roadmap

| Phase | State | Goal | Gate |
|---|---|---|---|
| EXP#P0 | RED | expansion architecture | progression/enemy/skill plan documented |
| EXP#P1 | RED | module structure | progression/upgrades/skills/enemy/save modules load without syntax errors |
| EXP#P2 | RED | progression state | player level/XP/xpToNext state initializes deterministically |
| EXP#P3 | RED | XP rewards | enemy death and level completion grant XP exactly once |
| EXP#P4 | RED | level calculation | XP threshold, overflow and multi-level-up behavior PASS |
| EXP#P5 | RED | level-up event | gameplay pauses and exactly one level-up event is created |
| EXP#P6 | RED | upgrade catalog | upgrade definitions, caps and effects are represented cleanly |
| EXP#P7 | RED | three-choice reward UI | three valid non-duplicate choices render and one selection applies |
| EXP#P8 | RED | vitality upgrade | max HP increases and current HP remains valid |
| EXP#P9 | RED | combat upgrades | melee and magic power choices change real damage calculations |
| EXP#P10 | RED | movement upgrades | capped move/jump/cooldown/projectile upgrades affect real gameplay |
| EXP#P11 | RED | milestone framework | level milestone unlocks occur once and survive later levels |
| EXP#P12 | RED | Level 5 Arc Burst | V creates bounded AoE magic with cooldown and real enemy damage |
| EXP#P13 | RED | Level 10 double jump | exactly one airborne extra jump works and resets on landing |
| EXP#P14 | RED | Level 15 dash | Shift performs bounded directional dash with cooldown |
| EXP#P15 | RED | Level 20 barrier | B visibly reduces incoming damage temporarily and expires |
| EXP#P16 | RED | progression HUD | current level, XP bar and XP-to-next value update visibly |
| EXP#P17 | RED | enemy archetype protocol | enemy type/state configuration is data-driven where practical |
| EXP#P18 | RED | Runner enemy | fast chase enemy behaves distinctly and awards correct XP |
| EXP#P19 | RED | Jumper enemy | jumping enemy obeys gravity/collision and awards correct XP |
| EXP#P20 | RED | Mage enemy | ranged enemy fires bounded projectiles and awards correct XP |
| EXP#P21 | RED | Shield Guard | frontal mitigation works without making enemy permanently invulnerable |
| EXP#P22 | RED | elite enemies | elite modifier changes appearance/stats and doubles XP once |
| EXP#P23 | RED | level-based enemy scaling | enemy HP/damage scale modestly with player level and respect caps |
| EXP#P24 | RED | Void Warden mini-boss | boss has HP, charge/ranged behavior, death and one-time 100 XP reward |
| EXP#P25 | RED | local progression save | versioned localStorage save/load/reset survives page reload safely |
| EXP#P26 | RED | automated expansion tests | progression/upgrades/skills/enemies tests PASS |
| EXP#P27 | RED | expansion final runtime gate | all EXP#P0–P26 GREEN and playable browser runtime verified |

---

# Detailed phase gates

## EXP#P0 — Expansion architecture

Required:

- define progression state
- define upgrade pool
- define milestone skills
- define enemy archetypes
- define save schema
- record module boundaries

Gate:

```text
EXPANSION_ARCHITECTURE=PASS
```

No gameplay mutation required yet.

---

## EXP#P1 — Module structure

Required modules should load without JavaScript syntax errors.

Gate:

```text
NODE_SYNTAX_ALL_EXPANSION_MODULES=PASS
BROWSER_MODULE_LOAD=PASS
```

---

## EXP#P2 — Progression state

Required:

```text
level >= 1
xp >= 0
xpToNext > 0
upgrades object exists
skills object exists
```

Gate:

```text
PROGRESSION_INITIAL_STATE=PASS
```

---

## EXP#P3 — XP rewards

Test:

1. kill one basic enemy
2. XP increases exactly once
3. repeat updates on dead enemy
4. XP does not increase again
5. complete a level
6. completion reward occurs exactly once

Gate:

```text
XP_REWARD_ONCE=PASS
```

---

## EXP#P4 — Level calculation

Required tests:

```text
99 / 100 XP -> no level-up
100 / 100 XP -> level-up
150 excess XP -> overflow retained
large XP reward -> multiple level-ups work
```

Gate:

```text
LEVEL_CALCULATION=PASS
XP_OVERFLOW=PASS
```

---

## EXP#P5 — Level-up event

Required:

- level increments
- gameplay pauses
- upgrade choice appears
- player cannot take active gameplay actions behind menu
- selection resumes gameplay

Gate:

```text
LEVEL_UP_FLOW=PASS
```

---

## EXP#P6 — Upgrade catalog

Each upgrade must have:

```text
id
name
description
current rank
maximum rank/cap where applicable
apply function or deterministic effect mapping
```

Gate:

```text
UPGRADE_CATALOG=PASS
```

---

## EXP#P7 — Three-choice reward UI

Required:

- exactly three choices when at least three valid upgrades exist
- no duplicate choices
- capped choices omitted
- clicking/selecting one applies exactly one upgrade
- menu closes only after successful selection

Gate:

```text
LEVEL_UP_CHOICES=PASS
```

---

## EXP#P8 — Vitality

Gate:

```text
MAX_HP_BEFORE=N
MAX_HP_AFTER=N+10
CURRENT_HP_VALID=PASS
```

---

## EXP#P9 — Combat upgrades

Required:

- melee-power choice changes melee damage
- magic-power choice changes magic damage
- no damage multiplication is accidentally applied twice

Gate:

```text
MELEE_UPGRADE_DAMAGE=PASS
MAGIC_UPGRADE_DAMAGE=PASS
```

---

## EXP#P10 — Movement upgrades

Required:

- move-speed cap enforced
- jump-power cap enforced
- cooldown reduction cap enforced
- projectile-speed cap enforced
- collision remains stable

Gate:

```text
MOVEMENT_UPGRADES=PASS
UPGRADE_CAPS=PASS
```

---

## EXP#P11 — Milestone framework

Required milestone check:

```text
level 4 -> level 5
skill unlock occurs once
future updates do not repeatedly unlock/reinitialize it
```

Gate:

```text
MILESTONE_UNLOCK_FRAMEWORK=PASS
```

---

## EXP#P12 — Level 5 Arc Burst

Required:

- locked before level 5
- V works after unlock
- visible effect
- nearby enemy receives damage
- distant enemy does not
- same cast does not repeatedly hit one enemy
- cooldown enforced

Gate:

```text
ARC_BURST=PASS
```

---

## EXP#P13 — Level 10 Double Jump

Required:

```text
ground jump = works
second airborne jump = works
third airborne jump = blocked
landing = resets extra jump
respawn = resets extra jump
```

Gate:

```text
DOUBLE_JUMP=PASS
```

---

## EXP#P14 — Level 15 Dash

Required:

- locked before level 15
- Shift works after unlock
- dash follows facing direction
- dash distance bounded
- world collision remains valid
- cooldown enforced

Gate:

```text
DASH=PASS
```

---

## EXP#P15 — Level 20 Barrier

Required:

- locked before level 20
- B activates barrier
- visible barrier indicator
- incoming damage reduced while active
- barrier expires
- cooldown enforced

Gate:

```text
MAGIC_BARRIER=PASS
```

---

## EXP#P16 — Progression HUD

Display:

```text
LEVEL
XP
XP bar
XP needed for next level
```

Optional:

```text
active milestone skill cooldowns
```

Gate:

```text
PROGRESSION_HUD_VISIBLE=PASS
PROGRESSION_HUD_UPDATES=PASS
```

---

## EXP#P17 — Enemy archetype protocol

Prefer a simple structure such as:

```js
{
  type: "runner",
  hp: 50,
  damage: 8,
  speed: 1.4,
  xpReward: 12
}
```

Gate:

```text
ENEMY_TYPE_PROTOCOL=PASS
```

---

## EXP#P18 — Runner

Gate:

```text
RUNNER_DISTINCT_BEHAVIOR=PASS
RUNNER_XP=12
```

---

## EXP#P19 — Jumper

Gate:

```text
JUMPER_JUMP_BEHAVIOR=PASS
JUMPER_COLLISION=PASS
JUMPER_XP=15
```

---

## EXP#P20 — Mage

Gate:

```text
MAGE_RANGED_ATTACK=PASS
PROJECTILE_LIFETIME_BOUNDED=PASS
MAGE_XP=18
```

---

## EXP#P21 — Shield Guard

Gate:

```text
FRONTAL_DAMAGE_REDUCED=PASS
NON_FRONTAL_DAMAGE_NORMAL=PASS
SHIELD_GUARD_CAN_DIE=PASS
SHIELD_GUARD_XP=22
```

---

## EXP#P22 — Elite enemy

Gate:

```text
ELITE_VISUAL_DIFFERENCE=PASS
ELITE_HP_INCREASE=PASS
ELITE_DAMAGE_INCREASE=PASS
ELITE_XP_MULTIPLIER=2
ELITE_XP_AWARDED_ONCE=PASS
```

---

## EXP#P23 — Enemy scaling

Required:

- higher player level modestly increases enemy HP/damage
- scaling caps enforced
- level geometry unaffected
- low-level gameplay unchanged

Gate:

```text
ENEMY_LEVEL_SCALING=PASS
SCALING_CAPS=PASS
```

---

## EXP#P24 — Void Warden

Required:

- boss HP
- bounded arena
- ranged attack
- charge behavior
- visible boss distinction
- death state
- 100 XP once

Gate:

```text
VOID_WARDEN=PASS
BOSS_XP_ONCE=PASS
```

---

## EXP#P25 — Local save

Save schema example:

```js
{
  version: 1,
  progression: { ... },
  highestCompletedLevel: 3
}
```

Gate:

```text
SAVE=PASS
LOAD=PASS
RELOAD_PERSISTENCE=PASS
MALFORMED_SAVE_FAIL_SAFE=PASS
RESET_PROGRESSION=PASS
```

---

## EXP#P26 — Automated expansion tests

Required test areas:

```text
XP
level thresholds
XP overflow
upgrade caps
milestone unlocks
double jump reset
skill cooldowns
enemy XP once
enemy scaling caps
save/load validation
```

Gate:

```text
EXPANSION_TESTS=PASS
```

---

## EXP#P27 — Final runtime gate

Required:

- EXP#P0–P26 GREEN
- page loads without uncaught JavaScript runtime errors
- Canvas visibly renders
- player remains controllable
- XP changes after enemy kill
- level-up UI can be exercised
- one upgrade visibly affects game state
- milestone unlock can be demonstrated using a deterministic debug/test setup
- at least three new enemy archetypes can be demonstrated
- save/load works
- base movement/combat/checkpoint systems still work

Gate:

```text
EXPANSION_FINAL_GATE=PASS
```

Only after this gate may EXP#P27 become GREEN.

---

# Expansion backup protocol

Before risky changes:

- preserve current working file in `.agent-backups/`
- do not overwrite the last known-good backup
- record changed files in `docs/EXPANSION_PROGRESS.md`

After each successful gate:

```text
PHASE=
STATE=PASS
FILES_CREATED=
FILES_CHANGED=
TESTS_RUN=
TEST_RESULT=
BLOCKERS=
```

---

# Blocker protocol

If blocked:

1. capture exact error
2. identify exact EXP phase
3. preserve current working state
4. diagnose locally first
5. make one bounded repair
6. rerun the failed test
7. optionally use at most one FREE_CODING consultation
8. make one final bounded repair
9. if still failing, STOP that phase

Do not skip the RED phase.

Do not mark later EXP phases GREEN.

---

# Expansion agent rules

- work only inside assigned repository
- no sudo
- no system-file changes
- no secret access
- no automatic merge
- no paid AI fallback
- no CDN runtime dependency
- no remote API
- no eval()
- no C++/WASM requirement in this expansion lane
- do not edit base `GAME#P0–P27` roadmap states
- use `EXP#P0–P27` only
- preserve current working gameplay
- prefer additive modules over rewriting working systems
- do not replace entire working files when a bounded integration is sufficient
- run syntax checks after JavaScript edits
- run relevant tests after each feature
- visually verify Canvas/UI behavior when required
- stop on an unresolved exact phase gate

---

# Recommended implementation order

```text
1. progression core
2. XP
3. level-up flow
4. upgrade choices
5. milestone framework
6. milestone abilities
7. progression HUD
8. enemy archetypes
9. enemy scaling
10. mini-boss
11. local save
12. regression tests
13. final runtime verification
```

---

# Two-hour expansion task template

```text
ID=GAMEEXP001
STATUS=READY
REPO=game
BRANCH=agent/GAMEEXP001

TASK=
Extend the existing 2D Magic Jump Game using ROADMAP_EXPANSION.md.

ROADMAP_EXPANSION.md is authoritative for this task.

Do not modify the state of GAME#P0-P27.

Start from the lowest RED EXP phase.

Work strictly in EXP numeric order.

For every phase:

1. set phase state to WORKING in expansion progress documentation
2. inspect existing implementation before editing
3. preserve working behavior
4. implement the smallest complete change
5. run syntax/tests
6. perform runtime/visual verification where relevant
7. set phase to GREEN only after its exact gate passes
8. record files and tests
9. continue to the next numeric RED EXP phase only while time remains

Primary priorities:

Priority 1:
EXP#P0-P7
Progression state, XP, level-up and three-choice upgrade UI.

Priority 2:
EXP#P8-P16
Permanent upgrades and milestone abilities.

Priority 3:
EXP#P17-P24
New enemy archetypes, elites, scaling and mini-boss.

Priority 4:
EXP#P25-P27
Local save, automated tests and final runtime verification.

Do not use C++ or WebAssembly for this expansion task.

Do not use git or gh.
Do not modify .git.
Do not use sudo.
Do not access secrets.
Do not enable paid fallback.
Do not use remote APIs or CDN dependencies.
Do not rewrite already working systems unless necessary for a proven integration.

If an EXP phase cannot be proven:
leave it RED,
record the blocker,
and STOP before advancing past it.

TEST=
All changed JavaScript must pass Node syntax checks.
Completed EXP phases must have exact recorded gate evidence.
Base movement, combat and checkpoint behavior must remain functional.

MAX_ATTEMPTS=1
```

---

# Suggested future expansion ideas — not part of EXP#P0–P27

These can become a third roadmap later:

```text
skill tree
equipment and loot
coins/shop
boss-specific loot
status effects
fire/ice/lightning elements
quest objectives
procedural challenge rooms
difficulty modes
achievements
combo system
critical hits
healing items
secret areas
player skins
enemy elemental resistances
new worlds/biomes
boss phases
New Game+
```

Keep these outside the current expansion roadmap until EXP#P27 passes.
