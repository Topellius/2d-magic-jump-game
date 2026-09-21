# 2D Magic Jump Game — Agent Roadmap & One-Hour Benchmark

## Project goal
Browser-based 2D action/platform game published with GitHub Pages.

Primary technologies:
- HTML
- CSS
- JavaScript / Canvas 2D
- C++ compiled to WebAssembly after the JavaScript MVP is stable

Controls:
- Left Arrow: move left
- Right Arrow: move right
- Up Arrow: jump
- Down Arrow: crouch
- Z: melee
- X: forward magic
- C: sky-to-ground magic
- Esc: pause

Required systems:
- gravity and platform collision
- enemies with HP and death
- player HP, death and checkpoint respawn
- multiple levels, one HTML page per level
- shared engine code
- JSON level data where practical
- tests, docs and GitHub Pages deployment

## Recommended structure

```text
2d-magic-jump-game/
├── index.html
├── level1.html
├── level2.html
├── level3.html
├── css/game.css
├── js/
│   ├── main.js
│   ├── input.js
│   ├── player.js
│   ├── physics.js
│   ├── collision.js
│   ├── combat.js
│   ├── magic.js
│   ├── enemies.js
│   ├── camera.js
│   ├── respawn.js
│   ├── level-loader.js
│   └── debug.js
├── cpp/game_core.cpp
├── cpp/game_core.h
├── wasm/game_core.js
├── wasm/game_core.wasm
├── data/levels/level1.json
├── data/levels/level2.json
├── data/levels/level3.json
├── assets/
├── tests/smoke-test.js
├── docs/CONTROLS.md
├── docs/ARCHITECTURE.md
├── docs/PROGRESS.md
├── .agent-backups/
├── .gitignore
├── ROADMAP.md
├── AGENT_RULES.md
└── README.md
```

`.agent-backups/` must be excluded from Git.

## Protocols

Input:
MOVE_LEFT, MOVE_RIGHT, JUMP, CROUCH, MELEE, MAGIC_FORWARD, MAGIC_SKY, PAUSE

Player states:
IDLE, RUN, JUMP, FALL, CROUCH, ATTACK, CAST, HIT, DEAD, RESPAWNING

Enemy states:
IDLE, PATROL, CHASE, ATTACK, HIT, DEAD

Game states:
LOADING, PLAYING, PAUSED, PLAYER_DEAD, RESPAWNING, LEVEL_COMPLETE

Damage event example:

```js
{
  source: "player",
  target: "enemy-03",
  type: "magic_forward",
  damage: 25
}
```

## Gate convention
- GREEN = explicitly proven PASS
- RED = incomplete, failed or unproven
- RED blocks unrelated progression
- the queue/pipeline never starts a second queue task automatically
- during the explicitly authorized GAME1H001 one-hour benchmark, the single running GAME1H001 queue task may continue sequentially to the next RED GAME phase only after the current phase gate PASSes
- this internal GAME-phase progression must STOP on the first failed or unproven gate, FREE-route failure, or task/session deadline
- phase becomes GREEN only after its stated gate passes

## Mandatory roadmap status update
After every individual GAME roadmap phase:
1. run that phase's stated gate
2. if the gate PASSes, replace only that phase row's `RED` state with `GREEN` in `ROADMAP.md`
3. preserve the phase title, goal and gate text; do not delete the row
4. update `docs/PROGRESS.md` with the proof, tests and changed files
5. update `docs/AGENT_STATUS.md` to `STATE=PASS` for that phase
6. only then move to the next permitted phase

If the gate fails or is unproven:
- leave the roadmap phase `RED`
- write `STATE=STOP` to `docs/AGENT_STATUS.md`
- record the exact blocker in `docs/PROGRESS.md`
- do not mark any later phase GREEN

The RED -> GREEN change is therefore part of the phase completion evidence, not a cosmetic edit.

## Roadmap

| Phase | State | Goal | Gate |
|---|---|---|---|
| GAME#P0 | GREEN | requirements and architecture | roadmap approved |
| GAME#P1 | GREEN | repository structure | required files/directories exist |
| GAME#P2 | GREEN | Canvas + game loop | renders without JS syntax errors |
| GAME#P3 | GREEN | input system | control keys detected |
| GAME#P4 | GREEN | movement + gravity | left/right/jump/crouch work |
| GAME#P5 | GREEN | collision | no falling through platforms |
| GAME#P6 | GREEN | melee | Z damages nearby enemies only |
| GAME#P7 | GREEN | forward magic | X projectile works |
| GAME#P8 | GREEN | sky magic | C sky attack works |
| GAME#P9 | GREEN | enemies | HP and death work |
| GAME#P10 | GREEN | player HP/death | player can die |
| GAME#P11 | GREEN | checkpoint respawn | correct respawn point |
| GAME#P12 | GREEN | Level 1 | playable start-to-finish |
| GAME#P13 | GREEN | Level 2 | separate HTML/data |
| GAME#P14 | GREEN | Level 3 | harder separate level |
| GAME#P15 | GREEN | JSON level protocol | schema documented |
| GAME#P16 | GREEN | camera | stable scrolling |
| GAME#P17 | GREEN | HUD | HP/cooldown/level/checkpoint |
| GAME#P18 | GREEN | pause/restart | safe pause/restart |
| GAME#P19 | RED | C++ core | selected logic compiles to WASM |
| GAME#P20 | RED | WASM integration | browser really calls WASM |
| GAME#P21 | RED | smoke tests | movement/combat/respawn PASS |
| GAME#P22 | RED | asset/license gate | origins/licenses documented |
| GAME#P23 | RED | security gate | no secrets/eval/unsafe runtime deps |
| GAME#P24 | RED | performance gate | stable playable loop |
| GAME#P25 | RED | GitHub Pages | published game works |
| GAME#P26 | RED | documentation | controls/build/deploy/WASM documented |
| GAME#P27 | RED | FINAL GATE | all mandatory previous gates PASS |

## Backup protocol
Before risky changes:
- preserve latest working state in `.agent-backups/`

After each successful gate:
- update `docs/PROGRESS.md`
- record changed files
- record tests
- create a new checkpoint
- retain previous known-good checkpoint

Never overwrite the last known-good checkpoint.

## Blocker / AI consultation protocol
If blocked:
1. capture exact error
2. capture expected behavior
3. include only relevant non-secret code
4. perform at most one FREE_CODING consultation
5. make at most one bounded fix
6. rerun exact failed test
7. if still failing: STOP

Limits:
- CONSULTATIONS_PER_BLOCKER=1
- FIX_ATTEMPTS_AFTER_CONSULTATION=1

Never include secrets, credentials, API keys, passwords or tokens.

## Live activity / heartbeat visibility
The benchmark must provide visible signs of life while the agent is working. This is observational only and must not create a second agent loop.

Repository heartbeat file: `docs/AGENT_STATUS.md`

Required fields:
```text
UPDATED_UTC=
TASK=GAME1H001
PHASE=
STATE=STARTING|WORKING|TESTING|PASS|STOP
CURRENT_ACTION=
LAST_TEST=
LAST_RESULT=
FILES_TOUCHED=
NEXT_ACTION=
HEARTBEAT_SEQ=
```

Update `docs/AGENT_STATUS.md`:
- when a roadmap phase starts
- before an important test
- immediately after the test result
- when the phase becomes GREEN
- immediately before STOP
- after any meaningful multi-file implementation step

Do not run an artificial infinite heartbeat loop inside the agent. Live monitoring is performed externally by the operator.

Operator visibility during the one-hour run must include at least one continuously visible view:
- VS Code Source Control / Explorer showing changing files and `docs/AGENT_STATUS.md`, or
- a terminal dashboard showing queue state, active systemd stage, recent journal output, repository status and heartbeat file, or
- GitHub showing the published agent branch/PR after publish.

For the one-hour benchmark, prefer VS Code plus a separate terminal dashboard so the operator can immediately distinguish WORKING, TESTING, PASS, STOP and stalled states.

## Agent rules
- work only inside assigned repository
- no sudo
- no system-file changes
- no secret access
- no automatic merge
- no next-phase auto-start
- after a phase gate PASS, change only that phase's ROADMAP state from RED to GREEN
- never mark a failed or unproven phase GREEN
- maintain `docs/AGENT_STATUS.md` as visible progress evidence
- no paid AI/provider fallback
- no CDN runtime dependency
- no eval()
- prefer small modules over one giant file
- stop on unresolved gate failure

Required end-of-phase output:

```text
PHASE=
STATUS=PASS or STOP
FILES_CREATED=
FILES_CHANGED=
TESTS_RUN=
TEST_RESULT=
CHECKPOINT=
BLOCKERS=
ROADMAP_STATE=GREEN or RED
AGENT_STATUS_UPDATED=1
NEXT_ALLOWED=0
```

## C++ / WebAssembly
Order:
1. working JavaScript MVP
2. stable tests
3. choose bounded subsystem
4. port to C++
5. compile with Emscripten
6. load WASM in browser
7. prove JavaScript really calls WASM

Suitable C++ candidates:
- collision math
- damage calculation
- movement helpers
- deterministic physics helpers

## Strict free-only / billing policy

Primary rule:

```text
FREE -> FREE -> STOP
```

Never:

```text
FREE -> PAID
```

Preferred account state:
- Free Tier
- no billing account
- no payment method
- no paid balance
- no auto top-up
- no paid fallback

If a provider requires a card even for Free Tier:
- card may be added only manually by the human
- Free Tier must remain the active plan
- paid plan remains disabled
- auto top-up disabled
- paid fallback disabled
- exact provider/model allowlists remain enforced
- provider-side hard spending cap set to 1 EUR only if the provider truly enforces it
- card should ideally be debit/prepaid/virtual rather than credit
- avoid overdraft/credit
- keeping only about 5 EUR on the linked account may be used as an additional damage limiter

Important:
A 1 EUR provider cap and 5 EUR bank balance are defense-in-depth, not the primary zero-paid proof. Pending authorizations, delayed settlement, taxes, exchange rates, overdraft or provider billing behavior can invalidate assumptions.

Therefore:
- if the provider cannot enforce a hard stop at the configured budget, exclude it from unattended execution
- if free quota is exhausted: STOP
- if a paid model would be needed: STOP
- if billing status cannot be verified: STOP

Local Bifrost requirements before unattended execution:
- FREE_CODING Virtual Key active
- allow_all_providers=0
- allow_all_keys=0
- direct keys disabled
- exact provider allowlist
- exact model allowlist
- Gemini only on approved Free-Tier project/model
- OpenRouter only with exact `:free` model
- routing rules reviewed
- pricing overrides reviewed
- no paid provider credential
- no paid fallback
- no positive external provider billing evidence

Bifrost local accounting cost is not by itself proof of external billing.

## One-hour benchmark priorities
1. repository skeleton
2. Canvas + Level 1
3. movement/jump/crouch
4. collision
5. melee
6. forward magic
7. sky magic
8. enemy HP/death
9. player HP/death
10. checkpoint respawn
11. level finish
12. Level 2 placeholder
13. docs + smoke tests
14. C++/WASM only if everything above passes

## One-hour benchmark task

```text
ID=GAME1H001
STATUS=READY
REPO=2d-magic-jump-game
BRANCH=agent/GAME1H001

TASK=
Build the first playable MVP of the 2D Magic Jump Game.

You have one bounded implementation run.
Work strictly in priority order.

Priority 1:
Create the repository structure and playable Level 1 canvas.

Priority 2:
Implement Left Arrow, Right Arrow, Up Arrow jump, Down Arrow crouch.

Priority 3:
Implement Z melee, X forward magic, C sky-to-ground magic.

Priority 4:
Implement at least one enemy type with HP and death.

Priority 5:
Implement player HP, death and checkpoint respawn.

Priority 6:
Add level-complete area linking to level2.html.
Create level2.html only as a safe placeholder if time remains.

Priority 7:
Add README, controls, architecture notes and basic smoke tests.

Do not start C++/WebAssembly unless Priorities 1-7 all pass.

Use HTML, CSS and vanilla JavaScript for the MVP.
No CDN.
No external runtime dependency.
No paid service.
No remote API.
No secrets.

Do not run git or gh.
Do not modify .git.

Before risky changes preserve the working version in .agent-backups/.
After each successful priority update docs/PROGRESS.md.

Roadmap completion rule:
For every GAME phase you complete, run its gate first.
Only after PASS, change that exact ROADMAP.md row from RED to GREEN.
Never delete the roadmap row or mark an unproven phase GREEN.
Update docs/PROGRESS.md and docs/AGENT_STATUS.md at every phase boundary.

Visible activity rule:
Create and maintain docs/AGENT_STATUS.md.
Record STARTING/WORKING/TESTING/PASS/STOP, current phase, current action and last test result.
Update it at phase start, before/after important tests, after meaningful implementation steps and immediately before STOP.
Do not create an artificial infinite heartbeat loop.

If blocked:
diagnose first.
Make one bounded fix.
If still blocked, perform at most one FREE_CODING consultation.
Then make one final bounded fix.
If still failing, STOP.

TEST=
level1.html loads without JavaScript syntax errors.
All completed priorities are recorded in docs/PROGRESS.md.

MAX_ATTEMPTS=1
```

## One-hour benchmark measurements
Capture before and after:
- start/end time
- queue/task state
- runtime
- provider/model used
- fallback events
- AI request count
- completed GAME phases
- first failed phase
- consultation count
- files created/changed
- tests
- commit SHA
- pull request
- Bifrost accounting
- Gemini billing status
- OpenRouter billing status
- any real charge or authorization hold
- timer/session-stop behavior
- ROADMAP RED -> GREEN transitions completed
- phases still RED at stop/end time
- `docs/AGENT_STATUS.md` final state and update sequence
- visible activity evidence from terminal/systemd journal and repository changes
- last observed activity timestamp before completion or STOP

## Current orchestration prerequisite
P#6.3.0 FINAL GATE is PASS.

Before GAME1H001 enters READY, prepare the dedicated game repository, install the operator visibility dashboard, verify a clean baseline, and record rollback evidence. Then start exactly one bounded one-hour unattended session.
