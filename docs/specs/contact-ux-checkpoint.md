# Contact UX — approved checkpoint
Status: owner-approved product requirements; delivery/security implementation contract and layout pending.
Recorded: 2026-10-14 | Authority: [P19–P21 checkpoint](../ux-requirements-checkpoint.md).
Supersedes P03's no-form/email-only presentation constraint; retains single-owner/English baseline.
Actual destinations, response commitments and production copy remain factual inputs, not invented fixtures.

## Intent and placement — CT01–CT03
- CT01: ImArvin enquiries reach Arvin. No BluCode branding, routing choice, service selector, booking or payment flow now.
- CT02: Home shows a contact invitation and direct channels; the dedicated Contact page shows both form and direct channels. Contact remains reachable independently of browsing work.
- CT03: Frontend/Backend/Full-stack describe capabilities only. Their enquiry actions reach the same Contact page with no service preselection.
- Shared message guidance: Tell me what you would like to build or improve. This is helper text, not an extra field or workflow; final wording can be refined.

## Form — CT04–CT05
| Field | Requirement |
| --- | --- |
| Name | Required |
| Job position | Optional |
| Email | Email or Phone required; both allowed |
| Phone | Phone or Email required; both allowed |
| Message | Required, free description of the need |
| Preferred reply channel | Ask when Phone is supplied: WhatsApp, Telegram or phone |
- CT04: No account, mandatory technical/service category or prior direct-message step is required. Collect only the agreed enquiry/contact context.
- CT05: Send enquiry to Arvin's email from the app; visitors do not need to open an email app. Exact provider/server delivery contract remains to specify.
- CT09 — APPROVED 19:40 Asia/Tehran: whenever Telegram is selected for the form reply, reveal and require one Telegram username or profile-link field. Otherwise hide it and do not require it. Email or Phone remains required; Telegram identity does not replace that condition. Do not promise a reply channel that supplied details cannot support; exact normalization/validation and hidden-field retention remain implementation details.
- CT10 — APPROVED 19:41 Asia/Tehran: no Contact attachments/upload control in V1. Visitors may include project links in Message and share files during follow-up; no extra required URL field.

## Direct contact — CT06
- Telegram is Arvin's preferred channel; display it prominently.
- Clearly offer WhatsApp, LinkedIn and Email as alternatives; do not require form completion before opening one.
- Use clearly named direct links. LinkedIn is Connect on LinkedIn, not a guaranteed chat for non-connections.
- Direct messages remain free-form; no identical form fields or mandatory template. Guidance may be shared without forcing text into a message.
- Do not add Calls by arrangement or other call-related promotional wording. No call CTA is part of the approved direct-channel presentation.
- WhatsApp's standard number-based link exposes its destination number; presentation alone cannot enforce a no-call policy. Exact links are still owner inputs.

## Feedback and protection — CT07–CT08
- CT07: Clear sending, success and failure feedback; prevent repeated submission while sending. Retain entered data on failure and provide Retry.
- Success must reflect the defined server delivery outcome, never merely a button click; exact delivery/duplicate/retry semantics need specification.
- CT08: Include spam prevention. Exact controls, privacy explanation, delivery logging, personal-data storage/retention, timeouts and accessibility behavior require a bounded implementation spec.
- Do not invent response times or promise channel availability.

## Observable checks
| ID | Scenario | Expected |
| --- | --- | --- |
| CTP01 | Form without Email and Phone | Clear contact-method requirement; input retained |
| CTP02 | Email-only / phone-only / both | Accepted when required details and selected reply channel are usable |
| CTP03 | Choose Telegram directly | Opens destination without requiring the form |
| CTP04 | Enquiry from any offering | No service selection/preselection; free Message |
| CTP05 | Sending/failure | Clear status, duplicate protection, retained fields and Retry |
| CTP06 | Public copy | Telegram preferred, alternatives clear, no BluCode or call-related wording |
| CTP07 | Select Telegram / switch away | Telegram identity required/shown only while selected; Email-or-Phone condition unchanged |
| CTP08 | Contact message with a project link | Link may be included in free Message; no upload or extra required URL field |
These are contract scenarios, not executed tests; deployment/provider/accessibility/security gates remain pending.
