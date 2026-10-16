# Design craft and adaptation provenance

Use this reference for art direction and image critique, after reading current Signal Studio authority. These are design methods, not additional product requirements.

## Inspected upstream

Source: [emilkowalski/skills](https://github.com/emilkowalski/skills) at immutable commit `2d228630ba1446365f614a108cb8252f1feda202`.

| Source | Adapted principle | Local boundary |
| --- | --- | --- |
| [emil-design-eng](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/emil-design-eng/SKILL.md) | Train judgment by studying strong work and explaining why it works; small details accumulate; defaults and cohesion matter | Apply to hierarchy, readable copy, optical alignment, grouping and recognizable actions; do not substitute upstream style for Signal Studio |
| [prototype](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/prototype/SKILL.md) | Compare three product-native alternatives along named axes; explain benefits/costs; let the owner choose | Adapt to image composition only; omit code, picker harness, runnable interactions, integration and automatic promotion |
| emil-design-eng motion framework, same source above | Decide whether motion serves a task before selecting technique; frequent operations need restraint | No motion from a still image; P16 prohibits all owner UI transitions and requires immediate reduced-motion equivalence publicly |

These custom skills are local adaptations, not verbatim upstream installations or endorsements. Keep the upstream MIT notice in [LICENSE.emilkowalski](LICENSE.emilkowalski). Do not claim a custom file's hash is an unmodified upstream skill hash or add it to the vendor lock as such.
Do not inherit upstream opener-only replies, compulsory code-review formatting, library choices, animation recipes or reduced-motion defaults where repository rules differ.

## Local design method

1. Begin with the visitor's task and concrete content. Name what must be understood first, what invites exploration and what remains secondary.
2. Study a few relevant references when available. Record their URLs/provenance and extract a principle (scale contrast, grouping, alignment, rhythm), not a whole branded layout. Treat references as inspiration, never owner-approved imarvin sources or user-research evidence.
3. Name composition axes before rendering: balance/asymmetry, work-stage scale, density, type hierarchy or relationship grouping. Keep approved section order, information hierarchy, palette and behavior fixed.
4. Use the same fixture content, theme and viewport for the initial alternatives so differences are attributable to design choices.
5. Explain one distinctive move, one user benefit and one cost per direction. If two alternatives differ only in color, wording, decoration or border radius, merge them and create a genuinely different composition.
6. Judge thumbnail recognition and full-size reading separately; neither may conceal weak hierarchy, tiny controls or clipped content. Show full-size images for review.
7. Carry selected alignment, type roles, spacing rhythm, shapes and action emphasis into later screens; adapt to content instead of copying the hero everywhere.

## Avoid default AI compositions through reasoning

| Symptom | Correction test |
| --- | --- |
| Identical equal cards for unrelated content | Can scale, alignment and grouping express Project/Story importance without a uniform wall? |
| Oversized slogan displaces the actual work | Does the first reading moment convey contribution and a clear next action within the approved hierarchy? |
| Glow, dots, blobs or gradient wallpaper create all the identity | Remove decoration: does a recognizable work-led composition remain? Enforce Signal Studio's surface policy |
| Every item is a pill, outlined box or badge | Does each shape communicate a real group, action or state? Remove repetitive framing without purpose |
| Unreadable quiet labels or mysterious icon-only actions | Keep consequential text legible and actions understandable in both themes and narrow layouts |
| Artificial novelty adds navigation, sections or interaction | Restore approved behavior; seek distinction in composition rather than invented features |
| Beautiful media hides an incomplete text layout | Inspect the genuine no-media fixture; keep meaning and next actions complete |

Do not ban familiar components merely for being common. Choose a card, grid or button when the task warrants it; reject unreasoned repetition. Do not introduce a mandatory editorial/Swiss aesthetic or select an unapproved concept.
Treat typography and spacing numbers marked proposed in the visual system as design starting points, not new fixed requirements. New tokens, fonts/dependencies and component APIs still need bounded implementation authority.
Use precise visible evidence in critique; avoid numerical beauty scores, invented usability data or promises that these methods guarantee originality.
