# romania-intelligence-reform-dataflows

Interactive demo of current and target-state information data flows between Romanian intelligence, oversight, judicial and civilian institutions

## Commands

| Task | Command |
|---|---|
| install | `npm ci` |
| lint | `npm run lint` |
| build | `npm run build` |

## How this repo is gated

- `dev` is the default branch. Correctness CI exposes `verify`; remote required-check settings are managed separately.
- `main` is production. Agents must never merge any PR or deploy, regardless of credential permissions.
- This repo ships GitHub Pages. That fires on a merge to `main`, which is the restricted branch — so an agent's work reaching `dev` deploys nothing.

## Working rules

- Branch from `dev` with an approved prefix: `feat/`, `fix/`, `chore/`, `docs/`,
  `sec/`, `adr/`. Land back into `dev` through a pull request.
- Conventional Commits. Imperative subject, lower case, no trailing full stop,
  72 characters hard limit. The body explains *why*; the diff already shows what.
- Never modify vendored third-party sources. Fix the environment instead.
- Local setup and correctness tests are credential-free. Publishing credentials are maintainer-only.
- Verify before claiming completion. A merged pull request is not a deployment,
  and a git tag is not a publication.

See CONTRIBUTING.md for self-contained setup and acceptance evidence.

## Contribution workflow

Use Node 22 (Node 24 for the host) and the package manager in package.json.
Local verification needs no credentials, private handbook, or 1Password.
Credentials are only for maintainer-operated publishing; never store them in source.
Agents must never merge pull requests (including into dev) or deploy.
Open scoped Conventional Commit PRs against dev. State acceptance criteria in the
issue/PR, explain the source or fixture behind the change, and include exact
verification commands/results and remaining limitations.

Maintainers: fetch origin, then `wt new chore/my-change origin/dev`; worktrees
belong at `<repo>/.worktrees/<name>`. Contributors without wt can use a separate
clone and `git switch -c chore/my-change origin/dev`. Preserve existing user work.
Generated dist/, node_modules/, browser reports and build metadata are not source.
Keep the project license and attribution when adapting source material.

## Simulation boundaries

src/data/actors.ts and flows.ts define bilingual current/target graphs. Endpoints
must exist in the corresponding actor list. src/lib/warrant.ts gates SSC requests;
crypto.ts must bind nested warrant fields, including the time window. ledger.ts
serializes appends and verifies metadata, sequence and chain hashes. These are
in-memory demonstrations with a public demo key, never production authorization.
Read CONTRIBUTING.md for tests and the targeted Mermaid dependency override.
Run `npm run verify` after `npm ci` and Chromium setup.
