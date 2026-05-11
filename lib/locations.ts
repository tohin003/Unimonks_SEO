import type { Metadata } from "next";

import { absoluteUrl, siteConfig, type FaqItem } from "@/lib/site";

export type LocationProof = {
  title: string;
  body: string;
};

export type Location = {
  slug: string;
  area: string;
  fullName: string;
  searchQuery: string;
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroHeadline: string;
  intro: string;
  commuteHeading: string;
  commuteParagraphs: string[];
  metroNote: string;
  driveNote: string;
  landmarks: string[];
  schools: string[];
  whyHere: string;
  proofPoints: LocationProof[];
  localFaqs: FaqItem[];
};

export const locations: Location[] = [
  {
    slug: "munirka",
    area: "Munirka",
    fullName: "Munirka, South Delhi",
    searchQuery: "CUET coaching in Munirka",
    metaTitle: "CUET Coaching in Munirka, New Delhi — UNIMONKS Centre",
    metaDescription:
      "UNIMONKS runs CUET coaching from its Munirka centre near Munirka Metro and JNU East Gate, with GT, English, domain support, mock review, and DU admissions guidance.",
    heroEyebrow: "CUET coaching in Munirka",
    heroHeadline:
      "CUET coaching in Munirka that students from RK Puram, JNU, and Vasant Kunj can actually reach every week.",
    intro:
      "Munirka sits at the joint between the JNU campus, RK Puram, and the southern stretch of South Delhi, which is why UNIMONKS chose it for the main centre. Students from Munirka Vihar, DDA Flats, and the Munirka Marg residential strip can walk in for doubt sessions, and aspirants commuting from nearby colonies reach the same room through one metro change. Consistency is what eventually moves CUET scores, and being in Munirka is what makes that consistency possible.",
    commuteHeading: "Getting to UNIMONKS in Munirka",
    commuteParagraphs: [
      "Munirka Metro on the Magenta Line drops students three minutes from the centre. The 2nd floor address at Chhabra Complex, opposite Canara Bank in Laxmi Nagar Market, is on the main connecting road so the walk from any direction is short and well-lit.",
      "Auto rickshaws from JNU East Gate, RK Puram Sector 4, and Vasant Vihar reach the centre in five to ten minutes off-peak. Parents driving in usually pull up at the market lane in front of Canara Bank.",
    ],
    metroNote: "Munirka Metro (Magenta Line) — three minute walk to the centre.",
    driveNote:
      "Direct routes from Outer Ring Road, Aurobindo Marg, and Nelson Mandela Marg with paid parking in Munirka market.",
    landmarks: [
      "Munirka Metro Station (Magenta Line)",
      "Munirka DDA Flats",
      "JNU East Gate",
      "NIPCCD",
      "Munirka Bus Terminal",
      "Munirka Marg petrol pump",
    ],
    schools: [
      "Mother's International School, RK Puram",
      "DPS RK Puram",
      "Sardar Patel Vidyalaya",
      "Bal Bharati Public School, RK Puram",
      "Kendriya Vidyalaya, RK Puram Sector 8",
      "Kendriya Vidyalaya, JNU Campus",
    ],
    whyHere:
      "Students in Munirka and the neighbourhoods that surround it already share the same exam calendar, school cycles, and admissions concerns. Running CUET coaching from the middle of that catchment removes the friction that usually decides whether a six-month preparation plan actually gets followed.",
    proofPoints: [
      {
        title: "Walk-in doubt sessions",
        body: "Students at the Munirka centre can drop in for short doubt clarifications instead of saving questions for the next batch, which is how concepts actually consolidate before tests.",
      },
      {
        title: "Parent meetings without a long commute",
        body: "Parents from Munirka, RK Puram, and Vasant Vihar are minutes away. Progress check-ins happen in person, not as a phone call rushed between work hours.",
      },
      {
        title: "Mocks reviewed in the room",
        body: "Mocks are run, marked, and reviewed in the same week. Students at the centre get their error log read back to them before the pattern becomes a habit.",
      },
    ],
    localFaqs: [
      {
        question: "How close is the Munirka centre to JNU and RK Puram?",
        answer:
          "The centre is a five to ten minute walk from JNU East Gate and roughly ten minutes by auto from RK Puram Sector 4. Munirka Metro on the Magenta Line connects directly to both JNU and Hauz Khas.",
      },
      {
        question: "Which classes run from the Munirka centre?",
        answer:
          "Foundation classes for Class 11 and 12 students run alongside the Target Batch for focused CUET aspirants. Both share GT, English, and domain coverage; the Target Batch adds rank-oriented mock cycles.",
      },
      {
        question: "Is the Munirka centre suitable for students who also coach for DU admissions?",
        answer:
          "Yes. The admissions desk continues after CUET, covering DU CSAS preferences, document readiness, and counseling for top-tier DU colleges as well as JNU UG and central university choices.",
      },
    ],
  },
  {
    slug: "vasant-kunj",
    area: "Vasant Kunj",
    fullName: "Vasant Kunj, South Delhi",
    searchQuery: "CUET coaching in Vasant Kunj",
    metaTitle: "CUET Coaching in Vasant Kunj — UNIMONKS Munirka Centre",
    metaDescription:
      "CUET coaching for Vasant Kunj students at the UNIMONKS Munirka centre — direct Magenta Line connection, GT, English, domain support, mocks, and DU admissions guidance.",
    heroEyebrow: "CUET coaching for Vasant Kunj",
    heroHeadline:
      "CUET coaching in Munirka that Vasant Kunj students reach in one metro stop or a fifteen minute auto.",
    intro:
      "Vasant Kunj sits one Magenta Line stop from Munirka, which is why aspirants from B Block, C Block, and the Nelson Mandela Marg corridor make it to the centre even on school nights. The walk from Vasant Vihar Metro to the centre is short, autos from the Vasant Kunj sector roads are direct, and the route along Nelson Mandela Marg avoids the worst of the Aurobindo Marg traffic. Most students treat the commute as study time — a Magenta Line ride is when GT current-affairs notes get read.",
    commuteHeading: "Getting to Munirka from Vasant Kunj",
    commuteParagraphs: [
      "Take the Magenta Line from Vasant Vihar to Munirka — a single stop, eight to ten minutes including the platform change. From Munirka Metro, the centre is a three minute walk down Laxmi Nagar Market road to Chhabra Complex, opposite Canara Bank.",
      "By car or auto, the most reliable route is Nelson Mandela Marg to Munirka Marg, around fifteen minutes off-peak and twenty during evening rush. Parents from DLF Promenade and Ambience Mall side reach the centre quickest via the Vasant Kunj C Block exit road.",
    ],
    metroNote:
      "Vasant Vihar Metro to Munirka Metro — one stop on the Magenta Line.",
    driveNote: "Nelson Mandela Marg → Munirka Marg, fifteen to twenty minutes.",
    landmarks: [
      "DLF Promenade Mall",
      "Ambience Mall, Vasant Kunj",
      "Vasant Kunj B Block Market",
      "Nelson Mandela Marg",
      "Vasant Vihar Metro Station",
      "Indira Gandhi National Open University (IGNOU)",
    ],
    schools: [
      "Delhi Public School, Vasant Kunj",
      "Ryan International School, Vasant Kunj",
      "The Shri Ram School",
      "Vasant Valley School",
      "Mount Carmel School",
      "ITL Public School",
    ],
    whyHere:
      "Vasant Kunj has high concentrations of CUET aspirants targeting both DU's commerce and humanities colleges and the central universities. The Magenta Line means students can finish school, change at home, and still arrive at the centre before the first GT slot.",
    proofPoints: [
      {
        title: "One-stop metro commute",
        body: "The Magenta Line connects Vasant Vihar to Munirka in a single stop. Students sustain a four-evenings-a-week schedule without parents driving them every time.",
      },
      {
        title: "Aligned to Vasant Kunj school cycles",
        body: "Batch timings respect the typical end times of DPS, Ryan, and Vasant Valley so that students from each can reach the centre without rushing.",
      },
      {
        title: "Counseling for DU and central universities",
        body: "Most Vasant Kunj families consider DU's top colleges alongside Ashoka, central universities, and JNU UG. Admissions counseling at UNIMONKS is wired for that exact comparison set.",
      },
    ],
    localFaqs: [
      {
        question: "How long does the Vasant Kunj to Munirka commute actually take?",
        answer:
          "Eight to ten minutes on the Magenta Line door-to-door for students near Vasant Vihar Metro. By auto from the Vasant Kunj sectors, fifteen minutes off-peak via Nelson Mandela Marg.",
      },
      {
        question: "Do Vasant Kunj students need a separate batch?",
        answer:
          "No. Vasant Kunj students join the standard Foundation or Target batches at the Munirka centre. The batch mix benefits from cross-area peers who compare strategy without competing for the same seat at a single school.",
      },
      {
        question: "Is the commute safe for students travelling alone in the evening?",
        answer:
          "The Munirka Metro station has visible security and the walk to the centre is on a lit market road. Most senior school students travel the route alone after the first week. Parents often join for the first session to confirm the path.",
      },
    ],
  },
  {
    slug: "jnu",
    area: "JNU",
    fullName: "JNU Campus and surrounding colonies",
    searchQuery: "CUET coaching near JNU",
    metaTitle: "CUET Coaching near JNU — UNIMONKS Munirka Centre",
    metaDescription:
      "CUET coaching for students living in or near JNU campus — UNIMONKS centre at Munirka, walking distance from JNU East Gate, with GT, English, domain coverage, and JNU UG admissions support.",
    heroEyebrow: "CUET coaching near JNU",
    heroHeadline:
      "CUET coaching at walking distance from JNU East Gate, built for aspirants targeting JNU UG, DU, and central universities.",
    intro:
      "Aspirants studying in or living around JNU usually have two CUET goals: JNU's own UG programmes — Languages, Foreign Languages, Sciences — and the wider central university circuit. The UNIMONKS Munirka centre is a five to ten minute walk from JNU East Gate, which means a CUET batch can sit cleanly alongside school or college without adding a commute. Students from JNU staff quarters and faculty colonies often join the Foundation track in Class 11 and roll into the Target Batch by Class 12.",
    commuteHeading: "Getting to UNIMONKS from JNU",
    commuteParagraphs: [
      "From JNU East Gate the walk to the centre is roughly seven minutes along Aruna Asaf Ali Marg into the Munirka market lane. The route stays on main roads, which most senior students walk alone after the first visit.",
      "From the North Gate side, an e-rickshaw to East Gate plus the walk takes about ten minutes. Students from Brahmaputra Hostel, Periyar, and the Aravali faculty residence routinely use this path.",
    ],
    metroNote: "Munirka Metro (Magenta Line) — three minute walk to the centre after a short e-rickshaw from JNU.",
    driveNote: "JNU East Gate → Munirka centre, five to seven minute walk along Aruna Asaf Ali Marg.",
    landmarks: [
      "JNU East Gate",
      "JNU North Gate",
      "Aruna Asaf Ali Marg",
      "Brahmaputra and Periyar Hostels",
      "JNU staff quarters (Aravali, Dakshinapuram)",
      "Kendriya Vidyalaya JNU Campus",
    ],
    schools: [
      "Kendriya Vidyalaya, JNU Campus",
      "Kendriya Vidyalaya, RK Puram Sector 8",
      "Mother's International School",
      "DPS RK Puram",
      "Sardar Patel Vidyalaya",
      "Sanskriti School",
    ],
    whyHere:
      "Students with one foot inside JNU and one foot inside a CUET schedule cannot afford a long commute. The Munirka centre is close enough that GT prep at 6 PM and an evening at home are still possible on the same day.",
    proofPoints: [
      {
        title: "Aspirants targeting JNU UG",
        body: "JNU UG via CUET has its own preference logic — language programmes, social sciences, and central school subjects matter differently. Counseling at the centre handles JNU UG specifically alongside DU.",
      },
      {
        title: "Workable for children of JNU staff",
        body: "Many KV JNU and KV RK Puram students live in JNU faculty residences. The walk to and from the centre fits inside a normal school evening without disrupting home routine.",
      },
      {
        title: "GT taught with academic depth",
        body: "JNU-adjacent students tend to be analytically strong. The GT and English programs lean into reasoning depth and reading speed rather than rote drill, which keeps stronger students engaged.",
      },
    ],
    localFaqs: [
      {
        question: "Is the Munirka centre suitable for students applying to JNU UG?",
        answer:
          "Yes. JNU UG via CUET is part of the regular admissions counseling track. Coverage includes BA Hons Languages, Foreign Languages, and JNU's UG sciences alongside DU CSAS and other central universities.",
      },
      {
        question: "How long is the walk from JNU East Gate to the centre?",
        answer:
          "About seven minutes along Aruna Asaf Ali Marg into the Munirka market lane. The route uses main roads and is well-lit through the evening batches.",
      },
      {
        question: "Are there batch options for JNU staff children studying at KV JNU?",
        answer:
          "Foundation and Target batches at the Munirka centre run in late afternoon and evening slots that fit KV JNU and KV RK Puram dispersal times.",
      },
    ],
  },
  {
    slug: "rk-puram",
    area: "R K Puram",
    fullName: "R K Puram, South Delhi",
    searchQuery: "CUET coaching in R K Puram",
    metaTitle: "CUET Coaching in R K Puram — UNIMONKS Munirka Centre",
    metaDescription:
      "CUET coaching for R K Puram students at UNIMONKS Munirka centre — fifteen minute auto from Sectors 1–13 with GT, English, domain support, and DU admissions guidance.",
    heroEyebrow: "CUET coaching for R K Puram",
    heroHeadline:
      "CUET coaching that R K Puram students from Mother's International, DPS, and Bal Bharati can reach in fifteen minutes.",
    intro:
      "R K Puram is one of the densest CUET catchments in South Delhi. Mother's International School, DPS RK Puram, Bal Bharati, and the chain of KVs across the sectors all feed serious aspirants into a small radius. The Munirka centre is the closest dedicated CUET setup for that catchment — fifteen minutes by auto from Sector 4, twelve minutes from Sector 12, and a short bus ride from Sector 7 — which is why so many of the centre's seats fill from RK Puram first.",
    commuteHeading: "Getting to Munirka from R K Puram",
    commuteParagraphs: [
      "By auto, RK Puram Sector 4 to the Munirka centre is about twelve to fifteen minutes off-peak. Sector 12, Sector 7, and Sector 1 students typically take the inner colony roads to Munirka Marg, avoiding the Outer Ring Road traffic.",
      "By metro, the closest line from RK Puram is the Pink Line at R K Puram Metro Station, then a short auto to Munirka. For students close to Sarvodaya School or KV RKP Sector 8, an auto direct to the centre is usually faster than two metro changes.",
    ],
    metroNote: "R K Puram Metro (Pink Line) — short auto onward to Munirka, or direct auto from sectors.",
    driveNote: "RK Puram Sectors 1–13 → Munirka Marg, twelve to fifteen minutes off-peak.",
    landmarks: [
      "Mother's International School",
      "DPS RK Puram",
      "R K Puram Metro Station (Pink Line)",
      "Bhikaji Cama Place",
      "Sector 7 R K Puram market",
      "Air Force Station, R K Puram",
    ],
    schools: [
      "Mother's International School",
      "Delhi Public School, R K Puram",
      "Bal Bharati Public School, R K Puram",
      "Air Force Bal Bharati School",
      "Kendriya Vidyalaya, R K Puram Sector 2",
      "Kendriya Vidyalaya, R K Puram Sector 8",
    ],
    whyHere:
      "Most CUET-serious students in R K Puram already coach for something — JEE, NEET, or board exam tutoring — and CUET ends up squeezed between them. A centre this close lets the CUET slot stay realistic instead of getting cut to a Sunday workshop.",
    proofPoints: [
      {
        title: "Reachable on a school evening",
        body: "Twelve to fifteen minute commute means a class from 5:30 PM still allows students to be home for dinner. That single constraint is what decides whether the schedule survives till the exam.",
      },
      {
        title: "Aligned to the RK Puram school exam calendar",
        body: "RK Puram schools run heavy assessment cycles. The batch calendar is built with those test windows in mind so CUET work does not collide with school internals.",
      },
      {
        title: "Counseling that handles DU first",
        body: "Most R K Puram aspirants target DU as the primary option, often Mother's International alumni aiming at Stephen's and LSR. The counseling desk is set up to handle that pipeline specifically.",
      },
    ],
    localFaqs: [
      {
        question: "How long is the commute from RK Puram to the Munirka centre?",
        answer:
          "Twelve to fifteen minutes by auto from Sectors 4, 7, and 12 off-peak. Twenty minutes by metro plus a short auto onward from R K Puram Metro Station.",
      },
      {
        question: "Do RK Puram students need to switch to a separate batch?",
        answer:
          "No. The Foundation and Target batches at Munirka draw students from across South Delhi. The mix is intentional — it keeps the room sharper than a single-school batch usually feels.",
      },
      {
        question: "Can the centre coordinate with school assessment dates at DPS RK Puram or Mother's International?",
        answer:
          "Yes. Batch planning around February–April school internal windows is standard so CUET preparation doesn't fall apart during school pre-board cycles.",
      },
    ],
  },
  {
    slug: "hauz-khas",
    area: "Hauz Khas",
    fullName: "Hauz Khas and IIT Delhi area, South Delhi",
    searchQuery: "CUET coaching in Hauz Khas",
    metaTitle: "CUET Coaching in Hauz Khas — UNIMONKS Munirka Centre",
    metaDescription:
      "CUET coaching for students in Hauz Khas and the IIT Delhi area at UNIMONKS Munirka centre — direct metro link, GT, English, domain support, and DU admissions counseling.",
    heroEyebrow: "CUET coaching for Hauz Khas",
    heroHeadline:
      "CUET coaching in Munirka that Hauz Khas, IIT Delhi, and Green Park aspirants reach with one metro stop.",
    intro:
      "Hauz Khas Metro is one Magenta Line stop from Munirka, which is the easiest commute in this list. Students from IIT Delhi staff quarters, Green Park, SDA, and Hauz Khas Enclave can leave home, take a single metro ride, and still walk into the centre with time to spare. The IIT Delhi side of Hauz Khas also brings in CUET aspirants from KV IIT Delhi and Sanskriti, who tend to be sharper in quant and want a CUET programme that respects that.",
    commuteHeading: "Getting to Munirka from Hauz Khas",
    commuteParagraphs: [
      "Take the Magenta Line one stop from Hauz Khas to Munirka — about six minutes between platforms. The walk to the centre from Munirka Metro is three minutes. Most students from Green Park and SDA reach the metro on foot or by short auto.",
      "By auto, Hauz Khas to Munirka is twelve to fifteen minutes via Aurobindo Marg or Outer Ring Road off-peak. Students from inside IIT Delhi typically exit via Gate 1 and take the IIT Marg auto straight to Munirka.",
    ],
    metroNote: "Hauz Khas Metro (Yellow + Magenta) to Munirka Metro — one Magenta Line stop.",
    driveNote: "Hauz Khas to Munirka, twelve to fifteen minutes via Aurobindo Marg or IIT Marg.",
    landmarks: [
      "IIT Delhi (Gate 1, Gate 4)",
      "Hauz Khas Metro Station",
      "Hauz Khas Village",
      "Deer Park",
      "Green Park Market",
      "Sri Aurobindo Marg",
    ],
    schools: [
      "Sanskriti School",
      "Kendriya Vidyalaya, IIT Delhi",
      "Mother's International School",
      "DPS RK Puram",
      "Mount Carmel School",
      "Springdales School, Pusa Road",
    ],
    whyHere:
      "Hauz Khas, Green Park, and the IIT Delhi pocket have a high concentration of analytically strong students. The CUET preparation programme leans into that profile — GT reasoning depth, fast reading comprehension, and domain papers taught with conceptual rigour.",
    proofPoints: [
      {
        title: "Six-minute metro commute",
        body: "Hauz Khas to Munirka is one Magenta Line stop. Parents do not have to drop and pick — students sustain four-day weekly attendance on their own.",
      },
      {
        title: "Strong GT and reasoning fit",
        body: "Many Hauz Khas and IIT-area students are quant-strong. The GT preparation does not water down reasoning sections, which is what keeps the room engaged.",
      },
      {
        title: "DU + central university routing",
        body: "Hauz Khas families often weigh DU's top colleges, Ashoka, and central universities together. Counseling at UNIMONKS handles that overlap rather than treating CUET as a DU-only path.",
      },
    ],
    localFaqs: [
      {
        question: "How long is Hauz Khas to Munirka?",
        answer:
          "Six minutes between platforms on the Magenta Line, plus a three minute walk from Munirka Metro to the centre. About fifteen minutes door-to-door for most Hauz Khas locations.",
      },
      {
        question: "Are batches built for stronger reasoning students?",
        answer:
          "Yes. The Target Batch in particular pushes reasoning and reading depth so that quant-strong aspirants don't feel under-stretched on GT.",
      },
      {
        question: "Is the centre suitable for IIT Delhi staff children?",
        answer:
          "Yes. KV IIT Delhi students join the regular Foundation and Target batches. Batch timings respect KV dispersal, and admissions counseling covers DU, JNU UG, and central universities.",
      },
    ],
  },
  {
    slug: "saket",
    area: "Saket",
    fullName: "Saket and Malviya Nagar area, South Delhi",
    searchQuery: "CUET coaching in Saket",
    metaTitle: "CUET Coaching in Saket — UNIMONKS Munirka Centre",
    metaDescription:
      "CUET coaching for Saket and Malviya Nagar students at UNIMONKS Munirka — direct connection via Aurobindo Marg, with GT, English, domain support, and DU admissions counseling.",
    heroEyebrow: "CUET coaching for Saket",
    heroHeadline:
      "CUET coaching in Munirka built for Saket and Malviya Nagar students who want a centre that's reachable without losing an evening to traffic.",
    intro:
      "Saket sits roughly seven kilometres from Munirka, but the route is straight — Aurobindo Marg most of the way, with the option of the Yellow Line plus a short auto when the road is heavy. Students from Saket J Block, the Press Enclave Road residential pocket, and Malviya Nagar make the run in twenty-five to thirty minutes most evenings. The Saket catchment skews toward DU's south-campus colleges — SRCC, LSR, Hindu, Hansraj — which is what most of the admissions counseling at UNIMONKS ends up addressing.",
    commuteHeading: "Getting to Munirka from Saket",
    commuteParagraphs: [
      "By car or auto, the most reliable route is Press Enclave Road to Aurobindo Marg, exiting at Munirka Marg. Twenty-five to thirty minutes off-peak, longer during evening rush. Students living west of Saket Metro (toward Malviya Nagar) often find this faster than the metro option.",
      "By metro, take the Yellow Line from Saket or Malviya Nagar to Hauz Khas, change to the Magenta Line, and get off one stop later at Munirka. Total time is roughly thirty-five minutes door-to-door — best for students who study on the ride.",
    ],
    metroNote: "Saket Metro (Yellow Line) → Hauz Khas → Munirka (Magenta Line) — one change.",
    driveNote: "Press Enclave Road → Aurobindo Marg → Munirka Marg, twenty-five to thirty minutes.",
    landmarks: [
      "Saket District Centre (Select Citywalk, DLF Place)",
      "Saket Metro Station (Yellow Line)",
      "PVR Saket",
      "Malviya Nagar Metro Station",
      "Press Enclave Road",
      "Khirki Village",
    ],
    schools: [
      "Apeejay School, Saket",
      "Amity International School, Saket",
      "Step by Step School",
      "Cambridge School, Indirapuram",
      "Modern School, Saket",
      "Mount Carmel School",
    ],
    whyHere:
      "Saket students often combine DU south-campus aspirations with strong domain subject loads in Commerce and Humanities. The centre handles both — domain depth in subjects like Business Studies, Economics, Political Science, and Psychology, and admissions counseling that knows the DU south-campus preference ladder in detail.",
    proofPoints: [
      {
        title: "DU south-campus preference logic",
        body: "Saket families often aim at SRCC, LSR, Hindu, and Hansraj. Counseling at UNIMONKS builds the preference list around that ladder instead of treating DU as one undifferentiated block.",
      },
      {
        title: "Strong Commerce and Humanities domain support",
        body: "Apeejay, Amity, and Modern Saket alumni tend to bring Commerce and Humanities streams. The domain coverage at the centre is calibrated for those papers, not just for science aspirants converting to CUET.",
      },
      {
        title: "Workable schedule from Saket",
        body: "Batch timings start late enough that students leaving Saket schools at 2 PM can reach Munirka, settle, and start a 5 PM class without rushing dinner.",
      },
    ],
    localFaqs: [
      {
        question: "How long is the Saket to Munirka commute?",
        answer:
          "Twenty-five to thirty minutes by car off-peak via Aurobindo Marg, thirty-five minutes by metro with one change at Hauz Khas. Plan thirty-five during evening rush.",
      },
      {
        question: "Is the centre good for Commerce-stream aspirants from Apeejay or Amity Saket?",
        answer:
          "Yes. Business Studies, Economics, and Accountancy CUET papers are core to the domain coverage at the centre, with practice sets and revision frameworks built for Commerce aspirants.",
      },
      {
        question: "Can admissions counseling help with DU south-campus preference lists?",
        answer:
          "Yes. South-campus preference building — SRCC, LSR, Hindu, Hansraj, Kirori Mal — is one of the things the admissions desk handles most often, alongside JNU UG and central universities.",
      },
    ],
  },
];

export function getLocationBySlug(slug: string) {
  return locations.find((location) => location.slug === slug);
}

export function getOtherLocations(slug: string) {
  return locations.filter((location) => location.slug !== slug);
}

export function getLocationSlugs() {
  return locations.map((location) => location.slug);
}

export function buildLocationMetadata(slug: string): Metadata {
  const location = getLocationBySlug(slug);
  if (!location) {
    return {};
  }

  return {
    title: location.metaTitle,
    description: location.metaDescription,
    alternates: {
      canonical: `/cuet-coaching-in-${location.slug}`,
    },
    keywords: [
      location.searchQuery,
      `${location.searchQuery} near me`,
      `${siteConfig.name} ${location.area}`,
      `CUET classes in ${location.area}`,
      `${location.area} CUET coaching`,
    ],
    openGraph: {
      title: location.metaTitle,
      description: location.metaDescription,
      url: absoluteUrl(`/cuet-coaching-in-${location.slug}`),
      type: "website",
    },
  };
}
