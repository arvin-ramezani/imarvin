# Contact UX — approved checkpoint
Status: owner-approved product requirements; delivery/security implementation contract and layout pending.
Recorded: 2026-10-15 | Authority: [P19–P23 checkpoint](../ux-requirements-checkpoint.md).
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
- CT05: Send enquiry to Arvin's email from the app; visitors do not need to open an email app. V1 enquiries are handled in Arvin's email inbox, with replies using supplied details/preferred channel; no dashboard enquiries inbox, CRM or message-management feature. This excludes product inbox functionality, not any temporary server delivery/retry storage; exact provider/delivery/retention remains to specify.
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
- CT11 — APPROVED 2026-10-15 at 00:40 Asia/Tehran: show success only after the enquiry is safely accepted for delivery to Arvin; stay on Contact with a submission confirmation. It does not claim Arvin has read the message or guarantee inbox delivery. No visitor account or automatic confirmation email is required. On confirmed failure retain input/Retry; direct channels remain available. Exact durable-acceptance, unknown-outcome and duplicate/retry mechanics need specification.
- CT08: Include spam prevention. Exact controls, delivery logging, personal-data storage/retention, timeouts and accessibility behavior require a bounded implementation spec.
- CT12 — APPROVED 2026-10-15 at 01:30 Asia/Tehran: place a short privacy note beside the form explaining that supplied details are used to respond to the enquiry; link to a simple Privacy page. Exact policy copy, factual handling/providers, storage/retention and page layout remain to define; this is a UX requirement, not legal/compliance approval.
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
| CTP09 | Enquiry safely accepted / confirmed failed | Confirmation on Contact only after acceptance; otherwise retain input/Retry/direct channels; no read/delivery claim |
| CTP10 | Owner follows up enquiry | Email inbox workflow with supplied preferred channel; no dashboard inbox/account/automatic acknowledgement email |
| CTP11 | Visitor checks privacy before submission | Short form note links to simple Privacy page; handling claims require factual verification |
These are contract scenarios, not executed tests; deployment/provider/accessibility/security gates remain pending.
