# Browser Choice

Use browser and screenshot tooling available in the current execution environment. Standalone Design QA requires only the ability to open or capture the source visual target and the rendered implementation at matching viewport and state.

- In ChatGPT Work Mode, use the available cloud browser when it can open or capture the required artifacts.
- In Codex Desktop, use `@Browser` and prefer the in-app surface. Use Chrome only when the user asks for it or the task needs an existing Chrome tab, login, profile, or extension.
- In other environments, use the available browser or screenshot tooling that can capture the required evidence.
- Do not require Product Design, deployment, publishing, sharing, or prototype-building to perform Design QA.
- If either required artifact cannot be opened or captured with the available tooling, mark the QA result `blocked` and name the missing evidence.
