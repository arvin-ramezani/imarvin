#!/usr/bin/env python3
"""Read-only skill regression checks, not a media selector or product authority.

Run from any directory; optionally check fresh eight-field JSON decisions with
--decisions PATH. Canonical changes require reviewing these test expectations.
"""
import argparse
import json
import re
from pathlib import Path

SKILL = Path(__file__).resolve().parents[1]
ROOT = SKILL.parents[2]
FIELDS = {
    "surface", "media_role", "source_identity", "presentation", "playback",
    "fallback", "accessibility_truthfulness_checks", "ambiguity",
}
# Test-only cases: role, presentation, playback, active fallback, selected refs.
# Raw inputs remain separate so fresh task agents receive no expected answers.
EXPECTED = {
    "F01": ("DISCOVERY_COVER", "IMAGE", "PROHIBITED", "NORMAL", ["ev-screen", "img-screen-4"]),
    "F02": ("DISCOVERY_COVER", "IMAGE", "PROHIBITED", "NORMAL", ["ev-screen", "img-screen-4"]),
    "F03": ("LEAD_MEDIA", "STATIC_POSTER", "EXPLICIT_PLAY_ONLY", "NORMAL", ["ev-demo", "vid-demo-4", "poster-demo-4"]),
    "F04": ("CONTEXTUAL_FIGURE", "FIGURE", "NOT_APPLICABLE", "NORMAL", ["ev-diagram"]),
    "F05": ("EVIDENCE_ITEM", "STATIC_POSTER", "EXPLICIT_PLAY_ONLY", "NORMAL", ["ev-demo", "vid-demo-4"]),
    "F06": ("DISCOVERY_COVER", "IMAGE", "PROHIBITED", "NORMAL", ["ev-screen", "img-screen-4"]),
    "F07": ("COMPANY_IDENTITY", "LOGO_NAME", "NOT_APPLICABLE", "NORMAL", ["Co Orbit"]),
    "F08": ("LEAD_MEDIA", "STATIC_POSTER", "EXPLICIT_PLAY_ONLY", "NORMAL", ["draft-5", "ev-demo"]),
    "F09": ("OWNER_REVIEW", "COMPARISON", "EXPLICIT_PLAY_ONLY", "NORMAL", ["pub-4", "draft-5", "img-screen-4", "img-new-5"]),
    "F11": ("NO_MEDIA", "TEXT_ONLY", "NOT_APPLICABLE", "NO_AUTHORED_MEDIA", []),
    "F12": ("LEAD_MEDIA", "FAILED_MEDIA", "UNAVAILABLE", "LEAD_EVIDENCE_FAILURE", ["ev-run", "vid-run-6"]),
    "F14": ("OWNER_REVIEW", "FAILED_MEDIA", "UNAVAILABLE", "OWNER_FAILED", ["draft-7", "ev-next"]),
    "F15": ("OWNER_REVIEW", "PENDING_MEDIA", "UNAVAILABLE", "OWNER_PENDING", ["draft-8", "ev-pending"]),
    "F21": ("DISCOVERY_COVER", "IMAGE", "PROHIBITED", "NORMAL", ["ev-alt", "img-alt-4"]),
    "F23": ("DISCOVERY_COVER", "IMAGE", "PROHIBITED", "NORMAL", ["ev-screen", "img-screen-4"]),
    "F24": ("DISCOVERY_COVER", "STATIC_POSTER", "PROHIBITED", "NORMAL", ["ev-flow", "poster-flow-2"]),
    "F25": ("NO_MEDIA", "TEXT_ONLY", "NOT_APPLICABLE", "NO_AUTHORED_MEDIA", []),
    "F26": ("DISCOVERY_COVER", "FAILED_MEDIA", "PROHIBITED", "DISCOVERY_FAILURE", ["ev-screen", "img-screen-4"]),
    "F27": ("DISCOVERY_COVER", "STATIC_POSTER", "PROHIBITED", "NORMAL", ["ev-flow", "poster-flow-2"]),
    "F28": ("LEAD_MEDIA", "STATIC_POSTER", "EXPLICIT_PLAY_ONLY", "NORMAL", ["ev-demo", "vid-demo-4"]),
    "F29": ("LEAD_MEDIA", "STATIC_POSTER", "UNAVAILABLE", "MISSING_RECORDING", ["ev-lost", "poster-lost-2"]),
    "F31": ("NO_MEDIA", "TEXT_ONLY", "NOT_APPLICABLE", "NO_AUTHORED_MEDIA", []),
    "F32": ("DISCOVERY_COVER", "FAILED_MEDIA", "PROHIBITED", "DISCOVERY_FAILURE", ["ev-flow", "poster-flow-2"]),
    "F33": ("NO_MEDIA", "TEXT_ONLY", "NOT_APPLICABLE", "NO_AUTHORED_MEDIA", []),
}
OWNER = {"F10", "F13", "F16", "F17", "F18", "F19", "F22", "F30"}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def row(text, label):
    return next(line for line in text.splitlines() if line.startswith(f"| {label} |"))


def check_inputs():
    data = json.loads((SKILL / "references/fixtures.json").read_text())
    ids = [case["id"] for case in data["cases"]]
    require(set(ids) == set(EXPECTED) | OWNER | {"F20"} and len(ids) == 33, "Fixture coverage/IDs changed")
    require("Synthetic" in data["note"] and "expected" not in data, "Raw input boundary missing")
    for case in data["cases"]:
        require(all(ref in data["records"] for ref in case.get("records", [])), f"{case['id']}: missing record")
    skill = (SKILL / "SKILL.md").read_text()
    media = (ROOT / "docs/specs/media-evidence-spec.md").read_text()
    for label in ("Work browse", "Experience"):
        require("discovery" in row(media, label), f"Canonical {label} mapping changed; review tests")
    for label in ("Work browse", "Experience multi-project choice"):
        contract = row(skill, label)
        require(all(word in contract for word in ("discovery", "poster", "player", "autoplay")), f"{label}: static discovery contract missing")
        require("OWNER DECISION REQUIRED" not in contract, f"{label}: stale unconditional escalation")
    for phrase in ("Failed discovery delivery", "Failed lead/Evidence delivery", "Missing actual recording/source", "Owner selected media pending or failed"):
        require(phrase in skill, f"Missing distinct fallback: {phrase}")
    for path in (SKILL / "SKILL.md", ROOT / "AGENTS.md", ROOT / "docs/engineering/ui-skill-policy.md"):
        require(len(path.read_text().splitlines()) <= 120, f"Markdown line target exceeded: {path}")
        require("do not uniquely map" not in path.read_text().lower(), f"Stale mapping gap: {path}")
    return data


def check_decisions(path):
    decisions = json.loads(path.read_text())
    inputs = json.loads((SKILL / "references/fixtures.json").read_text())
    cases = {case["id"]: case for case in inputs["cases"]}
    identifiers = re.compile(r"\b(?:s|exp|pub|draft|ev|img|vid|poster|record|still)-[A-Za-z0-9-]+")
    require(isinstance(decisions, dict) and set(decisions) == set(EXPECTED) | OWNER | {"F20"}, "Decision coverage mismatch")
    for case, result in decisions.items():
        if case == "F20":
            require(result.get("routing") == "SKIP", "Unrelated UI must skip this skill")
            continue
        require(set(result) == FIELDS and all(isinstance(v, str) and v for v in result.values()), f"{case}: eight compact fields required")
        facts = [cases[case], *(inputs["records"][ref] for ref in cases[case].get("records", []))]
        available = set(identifiers.findall(json.dumps(facts)))
        selected = set(identifiers.findall(result["source_identity"]))
        require(selected <= available, f"{case}: invented or foreign identity {selected - available}")
        if case in OWNER:
            require(result["ambiguity"].startswith("OWNER DECISION REQUIRED") and "?" in result["ambiguity"], f"{case}: owner marker/question missing")
            continue
        require(result["ambiguity"].startswith("NONE"), f"{case}: settled case escalated")
        role, presentation, playback, fallback, refs = EXPECTED[case]
        for field, prefix in zip(("media_role", "presentation", "playback", "fallback"), (role, presentation, playback, fallback)):
            accepted = {prefix}
            if field == "presentation" and case in {"F03", "F05", "F08", "F28"}:
                accepted.add("INLINE_PLAYER")  # Ready, paused inline player is also valid.
            if field == "presentation" and case == "F12":
                accepted.add("STATIC_POSTER")  # Existing same-recording poster still works.
            if field == "presentation" and case == "F14":
                accepted.add("COMPARISON")  # Failed candidate remains identified in review.
            if field == "fallback" and case == "F07":
                accepted.add("NO_AUTHORED_MEDIA")  # Company logo is confirmed absent.
            require(any(result[field].startswith(tag) for tag in accepted), f"{case}: {field} must be one of {sorted(accepted)}")
        require(all(ref in result["source_identity"] for ref in refs), f"{case}: wrong selected identity")
    for case in ("F26", "F32"):
        recovery = (decisions[case]["presentation"] + decisions[case]["fallback"]).lower()
        require("usable" in recovery and "substitut" in recovery, f"{case}: usable discovery/no-substitution behavior missing")
    for case in ("F14", "F15"):
        require("block" in decisions[case]["fallback"].lower(), f"{case}: publication block missing")
    for case in ("F13", "F29"):
        require(decisions[case]["playback"].startswith("UNAVAILABLE"), f"{case}: poster cannot be playable")
    print("PASS: 33 decision outputs, including 8 owner decisions and unrelated-UI skip")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--decisions", type=Path, help="Fresh case-ID keyed eight-field JSON decisions")
    args = parser.parse_args()
    try:
        check_inputs()
        if args.decisions:
            check_decisions(args.decisions)
        print("PASS: synthetic input integrity, current discovery contracts, fallback distinctions and line limits")
    except (ValueError, KeyError, StopIteration, json.JSONDecodeError) as error:
        parser.exit(1, f"FAIL: {error}\n")
