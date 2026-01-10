# Content Quality & Customization Tasks

## Phase 1: Quality Improvements (COMPLETED ✓)
- [x] Remove Judge bias (unlabeled drafts A/B/C)
- [x] Remove policy parameter from Judge (blind evaluation)
- [x] Fix target_chars in Challenger prompt (700 char target, not 3000)
- [x] Fix target_chars in Synthesizer prompt (700 char target, not 3000)

## Phase 2: UI Customization Controls (COMPLETED ✓)
- [x] Add policy controls section in frontend
- [x] Target length slider (500-1500 chars)
- [x] Tone selector (radio buttons: Professional, Casual, Direct, Storytelling)
- [x] Features checkboxes (hashtags, emojis, questions, short paragraphs)
- [x] Voice profile text input (optional, with placeholder)
- [x] Hook style dropdown (Question, Bold statement, Story, Fact, Anti-pattern)
- [x] CTA strength selector (None, Soft, Medium, Strong)

## Phase 3: Backend Policy Override (COMPLETED ✓)
- [x] Update API endpoint to accept custom policy parameters
- [x] Merge custom policies with default platform policies
- [x] Pass custom policies to AgenticFlow
- [x] Validate policy parameters server-side

## Phase 4: Settings Persistence
- [ ] Save last-used settings to localStorage
- [ ] Auto-load last settings on page refresh
- [ ] Reset to defaults button
- [ ] Export/import settings as JSON

## Phase 5: Agent-Specific Controls (Advanced)
- [ ] Challenger harshness slider (light polish → ruthless critique)
- [ ] Synthesis creativity slider (conservative → experimental)
- [ ] Judge strictness selector (engagement-maximizer → credibility-enforcer)
- [ ] Risk level slider (controls Challenger aggression)

## Phase 6: Named Presets
- [ ] Create preset data structure (name, policy config)
- [ ] UI to save current settings as preset
- [ ] UI to load/delete presets
- [ ] Store presets in localStorage
- [ ] Default presets: "Professional Safe", "Bold Takes", "Story-Driven"

## Phase 7: Testing & Polish
- [ ] Test all controls affect output correctly
- [ ] Test localStorage persistence
- [ ] Test preset save/load/delete
- [ ] Mobile responsive layout for new controls
- [ ] Tooltips explaining what each control does
