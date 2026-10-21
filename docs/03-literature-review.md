# 3. Literature Review

## 3.1 Method

Sources were found through Google Scholar, publisher sites and Kazakhstani university journals using these search terms: *testing effect / retrieval practice*, *practice tests feedback*, *gamification learning meta-analysis*, *Unified National Testing Kazakhstan*, *distance learning platform Kazakhstan*, *freemium willingness to pay*. Inclusion criteria:

- peer-reviewed journal articles or official documents;
- direct relevance to one of four themes: (A) how practice testing affects learning, (B) feedback design, (C) the UNT and digital preparation in Kazakhstan, (D) freemium business models;
- core sources published from 2020 onwards. Three foundational works (2006, 2008, 2013) are kept because later studies build on them.

The review covers **17 sources: 13 peer-reviewed scientific publications and 4 official or industry sources.**

## 3.2 Theme A: Practice testing improves learning

The central idea behind the platform is the **testing effect**: retrieving information from memory during a test strengthens long-term retention more than re-reading does. Roediger and Karpicke [1] showed this in controlled experiments. Dunlosky et al. [2] reviewed ten learning techniques and rated *practice testing* as one of only two with "high utility".

Recent meta-analyses confirm that the effect holds in real classrooms, not only in laboratories. Adesope, Trevisan and Sundararajan [3] analysed 272 effect sizes and found that practice tests outperform restudy and other strategies, with stronger effects when the practice and final test formats match. Yang et al. [4] reviewed 222 classroom studies and found a consistent benefit of quizzing. Agarwal, Nunes and Blunt [5] reviewed applied studies in schools and also report consistent benefits across ages and subjects.

**Implication for the project:** mock tests should copy the real UNT format (item types, timing, interface) so that practice transfers to the exam (format match [3]). The platform should also encourage *repeated* attempts spread over time rather than one cramming session [2], [5].

**Limitation taken into account:** most studies measure retention of factual or conceptual knowledge. Benefits for procedural skills such as tracing Python code are less studied. The project therefore measures improvement directly in the pilot (Section 9) instead of assuming it.

## 3.3 Theme B: Feedback design

Testing without feedback leaves errors uncorrected. Shute [6] concludes that formative feedback works best when it is **elaborated** (explains *why*), specific and given soon after the response. Wisniewski, Zierer and Hattie [7] re-analysed 435 studies and found an average effect of d ≈ 0.48. Feedback that contains high information (task-, process- and self-regulation-level) was far more effective than simple right/wrong signals.

**Implication:** every item needs an explanation and a topic tag, and the results page should show which *process* failed (for example, "loop boundary" rather than just "wrong"). This directly supports FR-08 and FR-09.

**Limitation:** elaborated feedback costs content effort. The MVP limits explanations to short texts written by the author and leaves AI-generated feedback for future work.

## 3.4 Theme C: Engagement and motivation

Sailer and Homner [8] found small but significant positive effects of gamification on cognitive, motivational and behavioural outcomes, with larger effects when game elements are combined with competition *and* collaboration. The effects were less stable in studies with strong designs.

**Implication:** the MVP uses only lightweight progress elements (streaks and a progress chart). It does not build complex gamification, because the evidence is moderate and the cost is high.

## 3.5 Theme D: UNT and digital preparation in Kazakhstan

Abdrasilov et al. [9] provide validity evidence for the UNT. The mathematics component shows strong psychometric properties, and UNT scores predict first-semester university performance. This confirms that the UNT is high-stakes and that preparation matters. Mingisheva [10] analyses UNT results from 2014, 2017 and 2020 and finds gaps between urban and rural schools and between Kazakh- and Russian-medium schools. This supports offering quality material in Kazakh and an online channel that reaches rural students.

Useinov et al. [11] describe preparing students in small rural schools for the UNT through distance learning combined with online test platforms, and report positive progress. Rakhmetov et al. [12] show that Kazakhstani informatics teachers are positive about distance-learning platforms (96% in their survey) but often lack the skills to build and use them. This points to a ready-to-use platform for teachers as a secondary market.

**Limitations:** [10] and [11] are regional studies with small samples, and none of the Kazakhstani sources evaluates Informatics preparation specifically. This gap is part of the project's motivation.

## 3.6 Theme E: Freemium monetization

Gu, Kannan and Ma [13] ran a randomized field experiment on a freemium publisher (free PDFs, paid books). The free version exerts a strong "zero-price" pull, but adding premium tiers increased sales of the existing premium product by 8.9–21.5% through compromise and attraction effects, although a cheap premium tier can cannibalize the main one. Tyrväinen and Karjaluoto [14] meta-analysed 55 studies and found that functional, hedonic, social and price value of the free tier predicts willingness to pay, partly through trust, and that the effect depends on the monetization strategy.

**Implication:** the platform offers two premium tiers (monthly and a cheaper-per-month "until UNT" pass) to use the effects in [13]. The free tier should give enough real value (full versions with explanations) to build trust, while the paid tier unlocks *volume and analytics* (all versions, topic history), which is the "limited-feature" strategy discussed in [14]. Conversion is a key pilot metric (Section 9).

## 3.7 Official and industry sources

- The NTC UNT Informatics test specification [15] defines topics, item types and the number of items. It is the basis for topic tags and the blueprint of each version.
- Informburo's 2026 UNT guide [16] provides the current format (120 items, 140 points, 4 hours).
- Informburo's 2021 review of 10 online preparation platforms [17] gives the market and price context (see Section 4).

## 3.8 Structured analysis of publications

| # | Source (year) | Type | Theme | Method / sample | Key finding | Use in project | Limitation |
|---|---|---|---|---|---|---|---|
| 1 | Roediger & Karpicke (2006) | Journal, foundational | A | Lab experiments, students | Testing beats restudy for long-term retention | Core rationale for mock tests | Lab setting, prose recall |
| 2 | Dunlosky et al. (2013) | Review, foundational | A | Review of 10 techniques | Practice testing has high utility | Spaced repeated attempts | Not domain-specific |
| 3 | Adesope et al. (2017) | Meta-analysis | A | 272 effect sizes | Practice tests > restudy; format match boosts effect | UNT-identical format | Mostly higher education |
| 4 | Yang et al. (2021) | Meta-analysis | A | 222 classroom studies | Quizzing boosts classroom learning | Justifies frequent tests | Heterogeneous designs |
| 5 | Agarwal et al. (2021) | Systematic review | A | Applied school studies | Retrieval practice benefits are consistent | School-age target users | Few informatics studies |
| 6 | Shute (2008) | Review, foundational | B | Literature review | Elaborated, specific, timely feedback works best | Explanation per item | Older, pre-mobile |
| 7 | Wisniewski et al. (2020) | Meta-analysis | B | 435 studies | Feedback d ≈ 0.48; high-information feedback strongest | Topic and process-level feedback | Wide variance |
| 8 | Sailer & Homner (2020) | Meta-analysis | C | Gamification studies | Small positive effects; unstable in rigorous designs | Lightweight progress only | Mixed quality of studies |
| 9 | Abdrasilov et al. (2026) | Journal | D | Psychometric validation of UNT | UNT is valid and predicts university grades | High-stakes context | Mathematics only |
| 10 | Mingisheva (2023) | Journal | D | UNT data 2014/2017/2020 | Urban–rural and language gaps | Kazakh content, online access | Aggregate data |
| 11 | Useinov et al. (2022) | Journal | D | Small schools, North Kazakhstan | Online test platforms + guidance improve UNT prep | Online channel for rural students | Small regional sample |
| 12 | Rakhmetov et al. (2024) | Journal | D | 149 informatics students; teacher survey | Teachers positive but lack platform skills | Teacher segment | University-level sample |
| 13 | Gu et al. (2018) | Journal | E | Randomized field experiment, freemium publisher | Premium tiers lift paid sales despite the zero-price pull of free | Tier design (monthly vs. season pass) | Not edtech |
| 14 | Tyrväinen & Karjaluoto (2024) | Meta-analysis + interviews | E | 55 studies, 15 interviews | Value types → willingness to pay, via trust | Free-tier value, limited-feature model | Mostly apps and games |
| 15 | NTC UNT Informatics specification | Official document | D | — | Topics, item types, counts | Item blueprint and topic tags | Changes yearly |
| 16 | Informburo (2026) UNT guide | Media | D | — | 2026 format facts | Format constraints | Secondary source |
| 17 | Informburo (2021) platform review | Media | Market | 10 platforms | Prices and features | Competitor context | 2021 prices |

## 3.9 What the review means for the project

1. **Approaches that exist:** general test banks, video/live courses and the free official trial. Research strongly supports the *practice test + elaborated feedback* approach.
2. **What is already known:** testing and feedback improve learning; the UNT is high-stakes and valid; there are equity gaps in Kazakhstan; freemium conversion depends on the value of the free tier.
3. **Limitations the project takes into account:** no evidence specific to Informatics or Kazakhstan, so the project measures outcomes in its own pilot. Gamification is kept minimal. Feedback costs content effort, so explanations stay short and written by the author.

## References

[1] Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. *Psychological Science, 17*(3), 249–255. https://doi.org/10.1111/j.1467-9280.2006.01693.x

[2] Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students' learning with effective learning techniques. *Psychological Science in the Public Interest, 14*(1), 4–58. https://doi.org/10.1177/1529100612453266

[3] Adesope, O. O., Trevisan, D. A., & Sundararajan, N. (2017). Rethinking the use of tests: A meta-analysis of practice testing. *Review of Educational Research, 87*(3), 659–701. https://doi.org/10.3102/0034654316689306

[4] Yang, C., Luo, L., Vadillo, M. A., Yu, R., & Shanks, D. R. (2021). Testing (quizzing) boosts classroom learning: A systematic and meta-analytic review. *Psychological Bulletin, 147*(4), 399–435. https://doi.org/10.1037/bul0000309

[5] Agarwal, P. K., Nunes, L. D., & Blunt, J. R. (2021). Retrieval practice consistently benefits student learning: A systematic review of applied research in schools and classrooms. *Educational Psychology Review, 33*, 1409–1453. https://doi.org/10.1007/s10648-021-09595-9

[6] Shute, V. J. (2008). Focus on formative feedback. *Review of Educational Research, 78*(1), 153–189. https://doi.org/10.3102/0034654307313795

[7] Wisniewski, B., Zierer, K., & Hattie, J. (2020). The power of feedback revisited: A meta-analysis of educational feedback research. *Frontiers in Psychology, 10*, 3087. https://doi.org/10.3389/fpsyg.2019.03087

[8] Sailer, M., & Homner, L. (2020). The gamification of learning: A meta-analysis. *Educational Psychology Review, 32*, 77–112. https://doi.org/10.1007/s10648-019-09498-w

[9] Abdrasilov, B. S., Shinetova, L. E., Ivanova, A. E., Kardanova, E. Yu., Beisenova, Z. Zh., Zhabayeva, G. K., Orlov, D., & Ashirbek, G. K. (2026). Validation of the Unified National Testing in Kazakhstan: Evidence-based framework for fair testing. *Voprosy Obrazovaniya / Educational Studies Moscow*, (2), 8–41. https://doi.org/10.17323/vo-2026-27950

[10] Mingisheva, N. A. (2023). Development and challenges of standardized testing in Kazakhstan: Transition from national to international standards. *Journal of Educational Sciences, 76*(3), 94–103. https://doi.org/10.26577/JES.2023.v76.i3.08

[11] Useinov, B. M., Solodovnik, A. A., Shaimerdenova, M. A., & Baizhigitova, L. O. (2022). Features of preparation for the Unified National Testing in small schools within the framework of distance learning. *Bulletin of Abai KazNPU, Series of Physical and Mathematical Sciences, 78*(2), 260–267. https://doi.org/10.51889/2022-2.1728-7901.32

[12] Rakhmetov, M., Kuanbayeva, B., Saltanova, G., Zhusupkalieva, G., & Abdykerimova, E. (2024). Improving the training on creating a distance learning platform in higher education: Evaluating their results. *Frontiers in Education, 9*, 1372002. https://doi.org/10.3389/feduc.2024.1372002

[13] Gu, X., Kannan, P. K., & Ma, L. (2018). Selling the premium in freemium. *Journal of Marketing, 82*(6), 10–27. https://doi.org/10.1177/0022242918807170

[14] Tyrväinen, O., & Karjaluoto, H. (2024). Willingness to pay for freemium services: Addressing the differences between monetization strategies. *International Journal of Information Management, 77*, 102787. https://doi.org/10.1016/j.ijinfomgt.2024.102787

[15] National Testing Center of the Republic of Kazakhstan. *UNT test specification: Informatics.* https://testcenter.kz

[16] Informburo.kz. (2026). *Всё, что нужно знать об ЕНТ-2026: от регистрации до апелляции.* https://informburo.kz/cards/vse-cto-nuzno-znat-ob-ent-2026-ot-registracii-do-apelliacii

[17] Informburo.kz. (2021, November 5). *ҰБТ-ға үйден шықпай-ақ дайындалуға болады: түлектерге арналған 10 онлайн-платформа.* https://informburo.kz/kaz/tarih/ubt-ga-uiden-syqpai-aq-daiyndaluga-bolady-tulekterge-arnalgan-10-onlain-platforma
