---
name: edit-skill
description: Edit or create a Cursor agent skill using skills-pm. Supports editing an existing installed skill (list → edit → change → publish → refresh) and creating a new skill from scratch (scaffold → write → publish → install). Use when the user says "edit skill", "create skill", "new skill", "update skill", or mentions skills-pm.
---

# edit-skill

Manage Cursor agent skills via `skills-pm`. Two modes: **edit** an existing installed skill, or **create** a brand-new one.

## Mode A — Edit existing skill

```
list → edit → make changes → publish (confirm) → refresh
```

### Step 1 — List & locate skill

```bash
skills-pm list
```

Scan output for the target skill. Note its scope:
- **Project**: installed in `.agents/skills/` — metadata in `.skills-pm.json`
- **Global**: installed in `~/.cursor/skills/` — metadata in `~/.cache/skills-pm/global.json`

Read the relevant metadata file to get `source` and `ref` (branch) for the skill.

### Step 2 — Copy to workspace for editing

```bash
# project-installed
skills-pm edit <skill-name>

# globally-installed
skills-pm edit <skill-name> -g
```

Copies skill files to `./skills/<skill-name>/`. All edits happen there.

### Step 3 — Make changes

Edit `./skills/<skill-name>/SKILL.md` (and any supporting files) per user request.

### Step 4 — Publish (confirm with user first)

Show the exact command to the user and wait for confirmation before running.
`publish` pushes to the current repo's origin (`https://github.com/procore/material-management-ui-service.git`):

```bash
skills-pm publish -b harsh/skills -s <skill-name>
```

Branch defaults to `harsh/skills`. Adjust only if the metadata `ref` differs.

### Step 5 — Refresh installed skill

Re-add from remote so the installed symlink points to the freshly published version:

```bash
# project-installed
skills-pm add procore/material-management-ui-service -s <skill-name> -b harsh/skills

# globally-installed
skills-pm add procore/material-management-ui-service -s <skill-name> -b harsh/skills -g
```

---

## Mode B — Create new skill

```
read create-skill → scaffold → write content → publish (confirm) → install (local or global)
```

### Step 0 — Load authoring best practices

**Read `/Users/harshrohila/.cursor/skills-cursor/create-skill/SKILL.md` before writing any new skill.**

It covers: description quality, SKILL.md structure, conciseness rules, progressive disclosure, anti-patterns, and the full authoring checklist. Follow it for all new skill content.

Key rules from `create-skill`:
- Description: third-person, specific, includes both WHAT + WHEN + trigger terms
- SKILL.md body: under 500 lines; move detail to reference files
- `disable-model-invocation: true` by default (omit only for ambient auto-invoke)
- Consistent terminology; no time-sensitive info; no Windows-style paths

### Step 1 — Scaffold skill files

Create `./skills/<skill-name>/SKILL.md` with valid YAML frontmatter:

```markdown
---
name: <skill-name>
description: <third-person, specific, WHAT + WHEN + trigger terms>
disable-model-invocation: true
---

# <Skill Title>

...instructions...
```

### Step 2 — Write skill content

Fill in full skill instructions per user requirements, applying `create-skill` best practices:
- Concise: drop fluff, assume smart agent
- Use Template / Examples / Workflow / Feedback Loop patterns as appropriate
- Progressive disclosure: essential in SKILL.md, detail in linked reference files (one level deep)
- Run authoring checklist from `create-skill` before finalizing

### Step 3 — Publish (confirm with user first)

Show the exact command to the user and wait for confirmation before running.
`publish` pushes to origin (`https://github.com/procore/material-management-ui-service.git`):

```bash
skills-pm publish -b harsh/skills -s <skill-name>
```

### Step 4 — Install: decide scope

Infer from the skill's purpose — ask the user if unclear:
- **Global** (`-g`): general-purpose, useful across all projects (e.g. caveman, commit, tugboat)
- **Project** (default): tied to this repo's conventions (e.g. unit-testing, pull-request, code-review)

```bash
# project-local
skills-pm add procore/material-management-ui-service -s <skill-name> -b harsh/skills

# global
skills-pm add procore/material-management-ui-service -s <skill-name> -b harsh/skills -g
```
