# Token Efficiency Rules

- Read only files directly relevant to the current task. Never scan the full project unless explicitly asked.
- Before coding: give a short plan (file paths, function/component names, one-line summary per change). Wait for confirmation.
- After confirmation: show only diffs or new code blocks. No re-printing unchanged code. Minimal inline comments, only where logic isn't obvious.
- On failure: stop, show the exact error, give a one-line likely cause. Do not auto-retry. Wait for confirmation before fixing.
- No filler text, no restating the request, no pre-explaining before acting.
- Use Fast Mode for typos, CSS, docs, and minor logic fixes.
- Delegate multi-file/multi-step tasks to Mission Control for background execution.
- Treat stable docs/specs as static context, don't reprocess them each turn.
- Default to the most token-efficient path unless told otherwise.
