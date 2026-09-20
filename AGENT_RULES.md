# GAME1H001 Agent Rules

## Roadmap state

ROADMAP.md is authoritative.

When a phase starts:
- leave its state RED
- update docs/AGENT_STATUS.md to STATE=WORKING

Before its gate/test:
- update docs/AGENT_STATUS.md to STATE=TESTING

Only after the phase gate explicitly PASSes:
- replace only that exact phase row's RED state with GREEN
- never delete the phase row
- update docs/PROGRESS.md with evidence
- update docs/AGENT_STATUS.md to STATE=PASS

On failure or uncertainty:
- leave the phase RED
- write STATE=STOP
- record the exact blocker
- do not mark later phases GREEN

## Visible activity

docs/AGENT_STATUS.md is the human-visible heartbeat.

Update it:
- at each phase start
- before each meaningful test
- after each test
- after each PASS or STOP
- after meaningful groups of file changes
- during active work, do not leave it stale for more than roughly five minutes

Do not implement an artificial infinite heartbeat loop.

## Safety

No sudo.
No operating-system changes.
No secrets.
No billing access.
No paid API or paid fallback.
No automatic merge.
No work outside this repository except through the established pipeline.
MAX_ATTEMPTS remains one.
