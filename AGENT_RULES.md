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

## GAME1H001 bounded sequential progression

During the explicitly authorized GAME1H001 benchmark only:

- the infrastructure still runs exactly one queue task
- after a GAME phase gate PASSes, first change only that phase RED -> GREEN
- update docs/PROGRESS.md and docs/AGENT_STATUS.md
- then continue inside the same GAME1H001 task to the next lowest-numbered RED GAME phase
- never skip an incomplete RED phase
- STOP on the first failed or unproven phase gate
- STOP when the FREE route is unavailable
- STOP when the task/session time limit is reached
- never create another queue task
