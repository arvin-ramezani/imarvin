## Browser Choice

In ChatGPT Work Mode, always use the cloud browser available to that chat. If it is not initially visible, load the Browser skill and follow its setup instructions before concluding it is unavailable.

In Codex Desktop, use `@Browser` and explicitly select the in-app surface with `agent.browsers.get("iab")`.

In Codex Desktop, use Chrome only when the user asks for it, the task needs an existing Chrome tab/login/profile/extension, or the in-app Browser is unavailable or blocked.

If ChatGPT Work Mode does not expose both the cloud browser and `@Sites` after preflight, tell the user once:

```text
Cloud browser and Sites are not available in this chat. I can still build a single-page HTML prototype, but I cannot visually verify it or publish a live checkpoint, so fidelity and interaction polish may be lower. Continue with that fallback?
```

Only proceed after the user agrees. Do not claim the fallback is verified, open, hosted, or ready to share. This fallback applies to image-to-code and new prototypes. It does not apply to URL-to-code when browser capture is required.
