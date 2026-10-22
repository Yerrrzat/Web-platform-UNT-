# 2. Evidence of Relevance

This section separates **verified findings** (backed by data, documents or interviews) from **working assumptions** that still have to be tested during the pilot.

## 2.1 Evidence sources

| # | Source type | What was done | Status |
|---|---|---|---|
| E1 | Analysis of available data | Official UNT 2026 format: 120 items, 5 subjects, 4 hours, 140 points; Informatics is a profile subject paired with Mathematics with 40 items (Informburo, 2026; NTC specification) | Verified |
| E2 | Analysis of available data | Market scan of UNT preparation services and their prices (Informburo, 2021; current websites of iTest, Joo.kz, Daryn.online, Baimly, NTC trial test), see Section 4 | Verified |
| E3 | Observation of the relevant process | Author's own experience of writing UNT Informatics practice versions to the 2026 specification and teaching Python to school students: recurring student errors and topics that need explanation | Verified (first-hand) |
| E4 | Interviews with potential users | 3–5 semi-structured interviews with UNT candidates (Mathematics–Informatics profile) and informatics teachers/tutors, using the guide in 2.3 | **To complete before submission; results go in 2.4** |
| E5 | Discussion with supervisor | Review of the topic, scope and the startup format with the supervisor (see Section 11) | **To record in Section 11** |

## 2.2 Findings from data and observation (E1–E3)

1. **Informatics carries a large share of the score for IT applicants.** In the 2026 format, each profile subject has 40 items. For students on the Mathematics–Informatics profile, Informatics is one of the two subjects that most affect the grant score. *(E1)*
2. **A free official trial exists but only gives a score and a topic analysis.** The NTC trial (prob-ent.testcenter.kz) is free and gives an individual thematic analysis. No source says it explains individual answers. *(E1, E2)*
3. **Commercial services are bundled and expensive, or general-purpose.** Course-based services cost from about 9,900 to over 100,000 KZT per course (2021 prices). Test-bank services such as iTest are cheap (from 4,490 KZT per 90 days) but cover 20 subjects with general content. None of the reviewed services is focused on Informatics. *(E2)*
4. **Item types have changed.** Current UNT Informatics versions use context blocks with Python code, SQL queries over tables and spreadsheet fragments. Producing such items with good distractors takes expertise and time, which is why generic banks lag behind. *(E3)*
5. **Students need explanations, not just answers.** When working with students, the author sees the same error patterns repeatedly: mixing up units of information, off-by-one errors in loops, and SQL condition logic. A correct letter alone does not fix these errors; a short explanation tied to the topic does. *(E3; to be confirmed in E4)*

## 2.3 Interview guide (used for E4)

**Participants:** 3–5 people in total: at least 2 grade 10–11 students on the Mathematics–Informatics profile, and at least 1 informatics teacher or tutor.
**Format:** 15–20 minutes, in person or by call, in Kazakh or Russian. Notes are anonymised (P1…P5); no personal data is stored in the repository.

*Students*
1. How are you preparing for the Informatics part of the UNT now? Which resources do you use?
2. How often do you take full mock tests? Where?
3. After a mock test, what do you do with your mistakes? What information is missing?
4. Which Informatics topics are hardest for you (Python code, SQL, spreadsheets, number systems, networks…)?
5. Have you paid for any UNT preparation? How much? What made it worth paying for, or not?
6. What would make you choose a new Informatics-only platform? What price per month seems fair?
7. Do you prefer the phone or a computer for practising tests?

*Teachers / tutors*
1. How do you prepare students for UNT Informatics? Which materials do you use?
2. What problems do you see with existing test banks (outdated, errors, no explanations, language)?
3. Would you recommend a paid platform to students? Under what conditions?
4. What would you need to see (reports, assigning tests) to use it with a class?

## 2.4 Interview results (E4)

> **Status (October 2026):** interviews are being scheduled with students of the Mathematics–Informatics profile and informatics teachers. Results will be added as anonymised notes after each interview (task UNT-3).

| ID | Role / grade | Language | Date | Key statements (short) | Supports finding # | Contradicts / new insight |
|---|---|---|---|---|---|---|
| P1 |  |  |  |  |  |  |
| P2 |  |  |  |  |  |  |
| P3 |  |  |  |  |  |  |
| P4 |  |  |  |  |  |  |
| P5 |  |  |  |  |  |  |

**Summary of interview findings:** will be added after the interviews are completed (UNT-3).

## 2.5 Verified findings vs. assumptions

| Statement | Status | Evidence / how it will be tested |
|---|---|---|
| UNT 2026 has 40 Informatics items for the Mathematics–Informatics profile | **Verified** | E1 |
| Free official trial tests exist (NTC) | **Verified** | E1, E2 |
| No reviewed service focuses on Informatics with item-level explanations | **Verified for the 5 reviewed systems** | E2, Section 4 |
| Students value item-level explanations more than extra test volume | Assumption | E4 interviews; pilot survey (Section 9) |
| Students are willing to pay about 1,500–2,500 KZT per month for an Informatics-only service | Assumption | E4 question 5–6; pilot paywall click-through and pre-orders |
| Teachers would recommend the platform to classes | Assumption | E4 teacher interviews; pilot referral count |
| Kazakh-language content is a differentiator | Partly verified (author's observation) | E4; share of users choosing Kazakh in pilot |

## 2.6 Impact on requirements

| Finding | Requirement (Section 6) |
|---|---|
| UNT format and item types | FR-05 (timed runner), FR-06 (scoring rules), FR-07 (code/SQL rendering) |
| Need for explanations | FR-08 (explanations per item), FR-09 (topic breakdown) |
| Price sensitivity, freemium hypothesis | FR-11 (free tier), FR-12 (subscription), FR-15 (paywall analytics) |
| Kazakh-language gap | NFR-07 (Kazakh interface and content) |
