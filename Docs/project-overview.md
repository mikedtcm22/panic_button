# Improv Panic Button – Product Requirements Document  
**Version:** v0.9 (11 July 2025)  
**Author:** [Your Name]

---

## 1  Purpose & Vision  
**Improv Panic Button** is a web companion that lets Dungeon Masters off‑load real‑time improvisation to an AI without derailing the table. Upload any prep materials—home‑brew Word docs, markdown notes, PDFs—and the system builds an always‑ready **Campaign Digest**. During live play the DM hits a canned “panic” prompt (or types free‑text) and instantly receives lore‑consistent NPCs, encounters, or plot redirects. Games stay on track; stress goes down; players never see the sausage being made.

---

## 2  Target Audience  
Digital‑forward 5e DMs who run sessions with a laptop or second monitor. Stretch audience: storytellers in other SRD‑compatible systems.

---

## 3  User Personas  

| Persona             | Key Need                     | Typical Panic Moment                           |
|---------------------|------------------------------|------------------------------------------------|
| **Dan the Over‑Planner** | Respect his 15‑session epic | Players chase a throw‑away NPC                 |
| **Riley the Rookie**    | One‑click game juice        | Needs a tavern name in three seconds           |
| **Alex the Streamer**   | Zero dead air               | Silence on stream when story stalls            |

---

## 4  User Journey (Happy Path)  

1. **Onboard & Upload** – Drag‑and‑drop docs or PDFs (incl. D&D Beyond encounter exports).  
2. **Digest Confirmation** – AI surfaces concise NPC & plot outline; DM edits/approves.  
3. **Session Prep** – DM flags tonight’s scenes; that slice becomes the **Active Context**.  
4. **Live Panic** – Radial menu shows five canned prompts (NPC, Filler Encounter, Redirect Plot, Flavor Detail, Foreshadow Hook).  
5. **Log & Save** – Outputs are stamped into session notes for continuity.

---

## 5  Functional Requirements  

| ID   | Requirement                                                                                                            | Priority |
|------|------------------------------------------------------------------------------------------------------------------------|----------|
| F‑1  | Parse home‑brew DOCX/MD/TXT and D&D Beyond PDFs; architecture must remain file‑type agnostic for future adapters.      | P0       |
| F‑4  | Radial UI with canned prompts; free‑text fallback chat remains.                                                        | P0       |
| F‑6  | Token Budgeter: default ≤ 8 k tokens (active context) + prompt; optional **Deep Context** toggle (premium).            | P0       |
| F‑9  | Encounter Scaler uses Kobold Fight Club CR math.                                                                       | P1       |
| F‑12 | “Session” timer: free trial = single five‑hour contiguous block starting at first panic call.                          | P0       |

---

## 6  Non‑Functional & Compliance  

* **Latency** – \< 3 s (canned) / \< 10 s (typed).  
* **Data Storage** – Encrypted at rest; lore cached to minimize repeat token spend.  
* **Licensing** – Output limited to SRD or user‑provided text; block proprietary monster stats.  

---

## 7  Technical Architecture (MVP)  

* **Frontend** – Next.js + radial command component.  
* **Backend** – Node API, file‑ingestion micro‑service (e.g. Unstructured.io); embeddings in Pinecone.  
* **LLM** – GPT‑4o‑mini, 128 k context for price/performance.  
* **Auth & Billing** – Clerk.dev + Stripe; “first session free,” then recurring monthly subscription.  

---

## 8  Cost Model Guidance  

| Assumption                               | Value                          |
|------------------------------------------|--------------------------------|
| Model price (GPT‑4o‑mini)                | \$0.15 / M input tokens<br>\$0.60 / M output tokens |
| Stretch goal users                       | 1 000 paying DMs               |
| Average sessions per user per month      | 4                              |
| Tokens per session (input + output)      | ~90 k                          |
| **Estimated monthly model spend**        | ~~\$108 (double‑buffer = \$220) |


> Charging \$8–10 per DM leaves comfortable gross margin at MVP scale.

---

## 9  Success Metrics  

| Metric                                              | Target (90 days post‑launch) |
|-----------------------------------------------------|------------------------------|
| Activation – % of new users who run Panic ≥ 3 times | ≥ 70 %                       |
| Subscription conversion (after free session)        | ≥ 25 %                       |
| Avg. response latency (canned prompt)               | \< 3 s                       |
| Net Promoter Score after 3 sessions                 | ≥ 45                         |
| Monthly paid churn                                  | \< 8 %                       |

---

## 10  Roadmap (Rolling 12 Months)  

| Quarter | Milestones                                                                        |
|---------|-----------------------------------------------------------------------------------|
| **Q1**  | MVP launch: file‑ingestion, 5‑hour trial logic, Stripe billing.                    |
| **Q2**  | Encounter Scaler (KFC math), Obsidian export, voice‑input beta.                   |
| **Q3**  | Map stub generator, premium deep‑context tier, mobile‑responsive tweaks.          |

---

## 11  Risks & Mitigations  

| Risk                                        | Likelihood | Impact | Mitigation                                                     |
|---------------------------------------------|------------|--------|----------------------------------------------------------------|
| LLM hallucination breaks lore consistency   | Medium     | High   | Retrieval‑augmented prompts; show source snippets for review.  |
| WotC policy changes on AI‑generated content | Medium     | High   | Limit to SRD; monitor legal updates; prepare OGL fallback.     |
| Latency spikes on Friday nights             | Low        | Medium | Pre‑warm model instances; regional autoscaling.                |
| Subscription price resistance               | Medium     | Medium | One free session; demo videos; bundle discount with VTTs.      |

---

## 12  Open Items  

1. Preferred LLM vendor SLA (Azure vs. OpenAI direct) for \< 500 ms P95 latency.  
2. Final subscription price point—\$8, \$10, or tiered?  
3. Long‑term licensing strategy for AI‑generated battle maps.  

---

*End of document*
