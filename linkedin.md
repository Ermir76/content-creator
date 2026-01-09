## Platform policy (hard rules)

"linkedin": {
    "char_limit": 3000,              # hard cap (platform)
    "target_chars": 700,             # what we actually aim for
    "above_fold_chars": 140,          # first 2 lines
    "tone": "direct, human, reflective",
    "features": (
        "Short paragraphs (1–2 lines), no links, no emojis in first line, "
        "0–2 hashtags max at the end, invite comments"
    ),
    "format": (
        "Relatable hook, honest experience or insight, partial value, "
        "end with one open question"
    ),
    "primary_model": "openai",
    "fallback_model": "gemini",
}
 
## PromptAdapter 

GOAL: Maximize reach and comments (not completeness)

LENGTH RULES:
- Target ~700 characters
- Never exceed 900 characters
- First 2 lines must hook within 140 characters

STYLE RULES:
- No corporate language
- No emojis 
- Short paragraphs (1–2 lines)
- One idea only

ENGAGEMENT RULE:
- End with exactly ONE open-ended question
- Do not summarize or conclude strongly

## Voice profile (important change)

- voice_profile = "first-person, direct, honest, no-corporate-tone"
