# Off-site SEO checklist — UNIMONKS

Code-light work that happens outside the repo. Use this as the team
checkbook for the 90-day push. Every action item maps to one of three
goals: rank in the local pack, rank in classic organic, surface in AI
search citations.

NAP that must stay byte-identical everywhere:

```
UNIMONKS
2nd Floor Chhabra Complex, Opp Canara Bank, Laxmi Nagar Market
Munirka, New Delhi 110067
+91 99106 14532
info@unimonks.com
```

If any directory rewrites the address (e.g., adds a comma, swaps "2nd
Floor" for "Floor 2"), correct it. Inconsistent NAP is one of the
fastest ways to lose local-pack ranking.

---

## 1. Google Business Profile (highest local-pack ROI)

Single most important off-site lever for "CUET coaching in Munirka"
local-pack ranking. The current local-pack signal weights are roughly:
GBP signals 32%, on-page 19%, reviews 16%, links 15%, behavioural 8%,
citations 7%.

- [ ] Claim and verify the Munirka profile if not already done.
- [ ] Primary category: **Coaching center**. Secondary: **Educational
      institution**, **Tutoring service**.
- [ ] Service area set to South Delhi covering all six location-page
      neighbourhoods (Munirka, Vasant Kunj, JNU, R K Puram, Hauz Khas,
      Saket).
- [ ] 30+ photos uploaded with descriptive filenames before the photos
      are uploaded (e.g., `unimonks-munirka-classroom.jpg`, not
      `IMG_1234.jpg`). Include centre exterior, reception, classroom
      mid-session, faculty teaching, students writing, mock-test paper
      review, parent-counseling area.
- [ ] Q&A section seeded with the same questions from the homepage FAQ
      block and each location page's FAQ.
- [ ] GBP Posts published weekly — each new blog post becomes a Post.
      Use the exact post URL as the link.
- [ ] Review-generation system live at the centre: physical QR code on
      the reception desk that opens the review form directly. Target
      50+ reviews in 90 days.
- [ ] Reply to every review within 48 hours. Include the relevant CUET
      subject the student studied in the reply where natural — this is
      a soft entity signal Google reads.
- [ ] Enable messaging from the profile so prospective students can
      WhatsApp the team straight from Search.

---

## 2. Citations and directory listings

Goal: byte-identical NAP across every directory, with the
unimonks.co.in URL as the canonical reference. List them in this
order — top of the list first.

- [ ] **AcademyCheck** — audit existing listing for current address /
      phone consistency.
- [ ] **Justdial** — paid listing if budget allows; free listing
      mandatory.
- [ ] **Sulekha** — full profile with category "CUET Coaching".
- [ ] **UrbanPro** — tutor profile for each named faculty member as
      individual profiles get verified, plus the institution profile.
- [ ] **Shiksha.com** — institute profile and program-level entries.
- [ ] **CollegeDekho** — coaching listing under CUET coaching.
- [ ] **CareerLauncher** review section (community-built; participate
      via real student reviews).
- [ ] **Google Maps** — same listing as GBP but verify the embedded
      map link on contact pages resolves to the right pin.
- [ ] **Bing Places** — secondary search engine matters more than
      people think for AI search citation training.
- [ ] **Apple Maps Connect** — for users searching from iPhones.
- [ ] **Indiamart** — institute listing under education category.
- [ ] **Quora topic pages** — claim and complete the UNIMONKS
      institution topic; add to relevant CUET topic page descriptions.

For each listing: link out to unimonks.co.in homepage AND to the
relevant deep page (the Munirka location page is the canonical "near
me" target).

---

## 3. Backlinks worth pursuing

Quality over quantity. Five guest posts on careers360-tier sites move
rankings more than 200 forum links.

### Tier 1 — high authority education domains (3-5 guest posts)

- [ ] **careers360.com** — pitch one CUET strategy article authored by
      Dr Arvind Rao or a named senior faculty. Include a link back to
      `/faculty` and a relevant blog post.
- [ ] **shiksha.com** — pitch a "How to crack CUET English" or "CUET
      domain strategy" article.
- [ ] **jagranjosh.com** — pitch DU admissions guidance angle.
- [ ] **collegedunia.com** — pitch CUET vs CLAT comparison or DU
      cutoffs band breakdown (we have on-site content to reuse).
- [ ] **theprint.in** or **scroll.in** opinion section — pitch a
      "CUET has changed Delhi admissions in these specific ways"
      opinion piece authored by Dr Arvind Rao. The link is less the
      point than the named-author authority signal.

### Tier 2 — niche education + parenting publications

- [ ] **EdexLive**, **Education Times**, **The Better India** education
      vertical — short feature pieces.

### Tier 3 — student communities (citation, not link)

- [ ] **Reddit r/CUET** — answer real student questions weekly under a
      real account (mark accounts that are UNIMONKS-affiliated in
      the bio). Do not spam.
- [ ] **Reddit r/delhiuniversity** — same approach during DU admission
      window.
- [ ] **Quora** — Dr Arvind Rao answers high-traffic CUET questions
      from a personally branded account. Each answer can link back
      where contextually relevant.

LLM search engines weigh third-party citations heavily. A founder who
shows up answering CUET questions on Quora and Reddit under their real
name is one of the strongest "this institute exists and has expertise"
signals for AI citation algorithms.

---

## 4. YouTube + video presence

- [ ] Channel created with proper About section linking back to
      unimonks.co.in.
- [ ] At least six short faculty explainer videos (3-5 minutes each)
      on tough CUET topics — CUET English strategy, Psychology
      revision frameworks, GT current affairs system, DU cutoffs
      explained, last-30-days plan, CUET vs CLAT.
- [ ] Each video description: includes target query in the first line,
      links to the matching blog post, mentions Munirka, links to
      `/enroll`.
- [ ] YouTube Shorts version of each long video for the snippet
      pipeline that powers AI search citations.

---

## 5. Social media presence (signals, not direct ranking)

- [ ] Instagram profile with the brand-consistent visual identity
      from the website (panels, eyebrow text, brand-blue + brand-pink
      accents). Link in bio rotates between blog posts, location
      pages, and the enroll page.
- [ ] LinkedIn page for UNIMONKS with founder profile clearly linked.
      Founder posts at least weekly on CUET strategy and admissions.
- [ ] Facebook page kept current — many Delhi parents still discover
      coaching via Facebook groups.

Each profile URL goes into the next iteration of `lib/site.ts`
`sameAs` array, so the `EducationalOrganization` JSON-LD on every page
reflects the verified social presence.

---

## 6. Tracking and measurement

### Google Search Console

- [ ] Property verified (DNS or HTML file method).
- [ ] Sitemap `https://unimonks.co.in/sitemap.xml` submitted.
- [ ] Coverage report monitored weekly during the indexing ramp.
- [ ] Performance report filtered for the 10 target queries (each
      location query + brand queries).

### Target queries to track

- `CUET coaching in Munirka`
- `CUET coaching in Vasant Kunj`
- `CUET coaching near JNU`
- `CUET coaching in R K Puram`
- `CUET coaching in Hauz Khas`
- `CUET coaching in Saket`
- `Best CUET coaching in South Delhi`
- `UNIMONKS` (brand query)
- `CUET coaching with admissions support Delhi`
- `DU CUET cutoffs explained`

### AI citation tracking (weekly cadence)

Manually prompt each of these systems with each target query and log
whether UNIMONKS is cited:

- ChatGPT (with web search enabled)
- Claude (claude.ai)
- Perplexity
- Google AI Overviews (via google.com/search with AI Overviews on)

Log format: date / query / system / cited yes-no / position. After
30 days the trend tells you whether the on-site GEO formatting
changes are working.

### Other tracking

- [ ] Vercel Analytics or Plausible for first-party page-view data —
      do not rely on GA alone.
- [ ] Conversion event: lead-form submission via `/api/leads`. Tie
      back to the `source` field already passed from each form
      instance (`home-page`, `enroll-page`, `blog-index`,
      `location-<slug>`, etc.) so we know which page converts.

---

## 7. 30 / 60 / 90 day checkpoint targets

### Day 30 (end of June 2026)

- GBP verified, 30+ photos, 15+ reviews.
- Sitemap submitted; coverage report shows all 25+ URLs indexed.
- Two guest posts placed.
- AI citation tracking running for 4 weeks of weekly data.

### Day 60

- 30+ reviews.
- Five guest posts placed across tier-1 publications.
- First impression in Google AI Overviews for at least one target
  query.
- 8-10 YouTube videos published.

### Day 90

- 50+ reviews; ratings above 4.6.
- 12-15 backlinks from tier-1 / tier-2 publications.
- Top 3 for `CUET coaching in Munirka` in classic organic.
- Cited by at least two of ChatGPT / Claude / Perplexity / Google AI
  Overviews for the top three target queries.
- First batch of student outcomes from the 2026 cycle verified and
  publishing on `/results` with the verified flag set.
