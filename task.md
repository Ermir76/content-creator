# Tasks

## Priority 1: Prompt Preview (Read-only)

**Goal:** Show users the final prompt before generating.

### UI Design

Button placement: "Show Prompt" above "Generate Content" in ContentComposer.

Modal with tabs for multiple platforms:

```
┌─────────────────────────────────────────────────┐
│  Prompt Preview                            [X]  │
├─────────────────────────────────────────────────┤
│  eg. [LinkedIn] [Twitter] [Reddit] etc          │
├─────────────────────────────────────────────────┤
│                                                 │
│  You are a content creator for LinkedIn.        │
│                                                 │
│  INPUT:                                         │
│  {user's idea prompt}                           │
│                                                 │
│  STYLE REQUIREMENTS:                            │
│  AUTHOR PERSONA: Write in first-person.         │
│  Personality: strongly human, noticeably...     │
│  ...                                            │
│                                                 │
├─────────────────────────────────────────────────┤
│                                      [Copy] 📋  │
└─────────────────────────────────────────────────┘
```

### Backend
- [ ] Create POST /api/preview-prompt endpoint
- [ ] Return prompts for all selected platforms

### Frontend
- [ ] Add "Show Prompt" button in ContentComposer
- [ ] Create PromptPreviewModal component with tabs
- [ ] Add copy-to-clipboard button

---

## Priority 2: Saved Profiles

**Goal:** Save and switch between multiple configurations per platform.

### Database
- [ ] Create ConfigProfile table

### Backend
- [ ] POST /api/profiles (save)
- [ ] GET /api/profiles (list)
- [ ] DELETE /api/profiles/{id}

### Frontend
- [ ] "Save as Profile" button
- [ ] Profile selector dropdown
- [ ] Delete confirmation

---

## Priority 3: Prompt Editing

**Goal:** Let users edit the prompt before sending.

### Backend
- [ ] Accept optional custom_prompt in generate endpoint

### Frontend
- [ ] "Advanced Mode" toggle
- [ ] Editable prompt textarea
- [ ] "Reset to Default" button