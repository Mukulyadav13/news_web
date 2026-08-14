import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "./index";
import {
  bookmarks,
  categories,
  colleges,
  comments,
  communityPosts,
  follows,
  likes,
  newsArticles,
  notifications,
  users,
} from "./schema";

/* ------------------------------------------------------------------ */
/* Image URLs (stock photography used for demo data only)              */
/* ------------------------------------------------------------------ */
const IMG = {
  indiaMarket:
    "https://images.pexels.com/photos/38443570/pexels-photo-38443570.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  autoRickshaw:
    "https://images.pexels.com/photos/14154956/pexels-photo-14154956.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  varanasiStreet:
    "https://images.pexels.com/photos/35160627/pexels-photo-35160627.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  varanasiColor:
    "https://images.pexels.com/photos/36963368/pexels-photo-36963368.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  streetFood:
    "https://images.pexels.com/photos/30525379/pexels-photo-30525379.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  mumbaiStreet:
    "https://images.pexels.com/photos/22034314/pexels-photo-22034314.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cricketNight:
    "https://images.pexels.com/photos/36230651/pexels-photo-36230651.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cricketAction:
    "https://images.pexels.com/photos/31131696/pexels-photo-31131696.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cricketBat:
    "https://images.pexels.com/photos/32897236/pexels-photo-32897236.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  techCode:
    "https://images.pexels.com/photos/34803976/pexels-photo-34803976.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  techHands:
    "https://images.pexels.com/photos/37880001/pexels-photo-37880001.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  laptop:
    "https://images.pexels.com/photos/1181441/pexels-photo-1181441.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  nyc:
    "https://images.pexels.com/photos/18388935/pexels-photo-18388935.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  beijing:
    "https://images.pexels.com/photos/16144416/pexels-photo-16144416.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  brooklyn:
    "https://images.pexels.com/photos/33619969/pexels-photo-33619969.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  shanghai:
    "https://images.pexels.com/photos/38185587/pexels-photo-38185587.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  shanghaiNight:
    "https://images.pexels.com/photos/14586522/pexels-photo-14586522.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  london:
    "https://images.pexels.com/photos/18729241/pexels-photo-18729241.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  swissParliament:
    "https://images.pexels.com/photos/36207469/pexels-photo-36207469.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  campusWalk:
    "https://images.pexels.com/photos/7972324/pexels-photo-7972324.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  campusStairs:
    "https://images.pexels.com/photos/37762503/pexels-photo-37762503.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  campusSun:
    "https://images.pexels.com/photos/31039051/pexels-photo-31039051.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  campusBackpacks:
    "https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  campusHallway:
    "https://images.pexels.com/photos/37762500/pexels-photo-37762500.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  campusCorridor:
    "https://images.pexels.com/photos/6140610/pexels-photo-6140610.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  campusPark:
    "https://images.pexels.com/photos/5537996/pexels-photo-5537996.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  campusSocial:
    "https://images.pexels.com/photos/7972544/pexels-photo-7972544.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function hoursAgo(n: number): Date {
  return new Date(Date.now() - n * 60 * 60 * 1000);
}

export async function seedData(targetDb?: any) {
  const database = targetDb || db;
  // eslint-disable-next-line no-console
  console.log("Seeding database…");

  await database.execute(
    sql`TRUNCATE TABLE notifications, follows, comments, bookmarks, likes, community_posts, news_articles, colleges, categories, users RESTART IDENTITY CASCADE`,
  );

  /* ----------------------------- Users ---------------------------- */
  const [aarav, priya, rohan, ananya, vikram] = await database
    .insert(users)
    .values([
      {
        name: "Aarav Sharma",
        username: "aarav",
        email: "aarav@samachar.example",
        bio: "Curious about my city. I share stories worth noticing.",
      },
      {
        name: "Priya Nair",
        username: "priya",
        email: "priya@samachar.example",
        bio: "Reader, runner, community volunteer.",
      },
      {
        name: "Rohan Gupta",
        username: "rohan",
        email: "rohan@samachar.example",
        bio: "MNNIT alum. Tech + travel.",
      },
      {
        name: "Ananya Iyer",
        username: "ananya",
        email: "ananya@samachar.example",
        bio: "Foodie documenting every street corner.",
      },
      {
        name: "Vikram Singh",
        username: "vikram",
        email: "vikram@samachar.example",
        bio: "Building things and writing about them.",
      },
    ])
    .returning();

  /* --------------------------- Categories ------------------------- */
  const catDefs: Array<{ name: string; scope: string; sort: number }> = [
    // National
    { name: "Politics", scope: "national", sort: 1 },
    { name: "Business", scope: "national", sort: 2 },
    { name: "Technology", scope: "national", sort: 3 },
    { name: "Education", scope: "national", sort: 4 },
    { name: "Sports", scope: "national", sort: 5 },
    { name: "Entertainment", scope: "national", sort: 6 },
    { name: "Science", scope: "national", sort: 7 },
    { name: "Health", scope: "national", sort: 8 },
    { name: "Crime", scope: "national", sort: 9 },
    { name: "Other", scope: "national", sort: 10 },
    // International
    { name: "World Affairs", scope: "international", sort: 1 },
    { name: "Business", scope: "international", sort: 2 },
    { name: "Technology", scope: "international", sort: 3 },
    { name: "Science", scope: "international", sort: 4 },
    { name: "Sports", scope: "international", sort: 5 },
    { name: "Entertainment", scope: "international", sort: 6 },
    { name: "Other", scope: "international", sort: 7 },
    // Community
    { name: "Local News", scope: "community", sort: 1 },
    { name: "College", scope: "community", sort: 2 },
    { name: "Education", scope: "community", sort: 3 },
    { name: "Sports", scope: "community", sort: 4 },
    { name: "Business", scope: "community", sort: 5 },
    { name: "Technology", scope: "community", sort: 6 },
    { name: "Entertainment", scope: "community", sort: 7 },
    { name: "Event", scope: "community", sort: 8 },
    { name: "Achievement", scope: "community", sort: 9 },
    { name: "Accident / Incident", scope: "community", sort: 10 },
    { name: "Problem / Issue", scope: "community", sort: 11 },
    { name: "Lost & Found", scope: "community", sort: 12 },
    { name: "Opinion", scope: "community", sort: 13 },
    { name: "Other", scope: "community", sort: 14 },
  ];

  const catRows = await db
    .insert(categories)
    .values(catDefs.map((c) => ({ ...c, slug: slugify(c.name) })))
    .returning();

  const catId = (scope: string, name: string): number => {
    const found = catRows.find((c: any) => c.scope === scope && c.name === name);
    if (!found) throw new Error(`Category not found: ${scope}/${name}`);
    return found.id;
  };

  /* --------------------------- Colleges --------------------------- */
  const collegeRows = await db
    .insert(colleges)
    .values([
      {
        name: "MNNIT Allahabad",
        slug: "mnnit-allahabad",
        city: "Prayagraj",
        state: "Uttar Pradesh",
        description:
          "Motilal Nehru National Institute of Technology — a premier engineering institute in Prayagraj.",
        imageUrl: IMG.campusWalk,
      },
      {
        name: "IIT Kanpur",
        slug: "iit-kanpur",
        city: "Kanpur",
        state: "Uttar Pradesh",
        description:
          "Indian Institute of Technology Kanpur — known for engineering, research and innovation.",
        imageUrl: IMG.campusSun,
      },
      {
        name: "Delhi University",
        slug: "delhi-university",
        city: "New Delhi",
        state: "Delhi",
        description: "A central university with a network of colleges across New Delhi.",
        imageUrl: IMG.campusCorridor,
      },
      {
        name: "IISc Bangalore",
        slug: "iisc-bangalore",
        city: "Bengaluru",
        state: "Karnataka",
        description:
          "Indian Institute of Science — a top research institution in Bengaluru.",
        imageUrl: IMG.campusHallway,
      },
      {
        name: "Anna University",
        slug: "anna-university",
        city: "Chennai",
        state: "Tamil Nadu",
        description: "A public state university focused on engineering and technology in Chennai.",
        imageUrl: IMG.campusStairs,
      },
    ])
    .returning();

  const collegeId = (slug: string): number => {
    const found = collegeRows.find((c: any) => c.slug === slug);
    if (!found) throw new Error(`College not found: ${slug}`);
    return found.id;
  };

  /* --------------------------- News ------------------------------- */
  const news = [
    {
      title: "City councils push pedestrian-first streets across metro India",
      slug: "city-councils-push-pedestrian-first-streets",
      summary:
        "Several metro cities are piloting car-free zones, wider footpaths and shaded crossings as part of a national push to put pedestrians first.",
      content:
        "Municipal bodies in multiple metro cities have begun piloting pedestrian-first street designs, including car-free zones, wider footpaths and shaded crossings.\n\nThe programme, which is expected to roll out in phases, aims to make short trips on foot safer and more pleasant while reducing congestion around markets and transit hubs.\n\nUrban planners say early feedback has been positive, though shopkeepers in some commercial areas have asked for better parking and loading zones before full implementation.",
      imageUrl: IMG.varanasiStreet,
      categoryId: catId("national", "Politics"),
      scope: "national",
      isFeatured: false,
      isBreaking: true,
      views: 12400,
      likesCount: 320,
      commentsCount: 45,
      publishedAt: hoursAgo(2),
    },
    {
      title: "Clean energy startups see record funding this year",
      slug: "clean-energy-startups-record-funding",
      summary:
        "Venture funding into clean energy startups hit an all-time high, driven by solar, battery storage and electric mobility bets.",
      content:
        "Venture capital flowing into clean energy startups reached an all-time high this year, according to industry trackers, with solar, battery storage and electric mobility attracting the largest share.\n\nInvestors are increasingly backing founders building domestic supply chains and grid-scale storage solutions.\n\nAnalysts caution that while capital is abundant, execution and unit economics will determine how many of these startups scale beyond pilot projects.",
      imageUrl: IMG.techCode,
      categoryId: catId("national", "Business"),
      scope: "national",
      isFeatured: true,
      isBreaking: false,
      views: 9800,
      likesCount: 210,
      commentsCount: 30,
      publishedAt: hoursAgo(5),
    },
    {
      title: "New education policy focus shifts to skill-based learning",
      slug: "education-policy-skill-based-learning",
      summary:
        "Schools are increasingly introducing hands-on, skill-based modules alongside traditional academics, educators report.",
      content:
        "A growing number of schools are introducing hands-on, skill-based modules alongside traditional academics, according to educators across the country.\n\nThe shift includes maker labs, vocational electives and project-based assessments that aim to prepare students for a broader range of careers.\n\nTeachers say the change requires new training and infrastructure, but early pilots show improved engagement among students.",
      imageUrl: IMG.campusBackpacks,
      categoryId: catId("national", "Education"),
      scope: "national",
      isFeatured: false,
      isBreaking: false,
      views: 7200,
      likesCount: 150,
      commentsCount: 60,
      publishedAt: hoursAgo(9),
    },
    {
      title: "Domestic cricket league sets a new attendance record this season",
      slug: "cricket-league-new-attendance-record",
      summary:
        "This season's league has drawn the largest cumulative stadium crowds in its history, organisers said.",
      content:
        "This season's domestic cricket league has drawn the largest cumulative stadium crowds in its history, according to organisers.\n\nStrong turnouts across host cities and a spike in weekend fixtures have been credited for the growth, along with improved stadium facilities.\n\nFranchises say merchandise and digital viewership have also climbed, pointing to a broader appetite for live cricket.",
      imageUrl: IMG.cricketNight,
      categoryId: catId("national", "Sports"),
      scope: "national",
      isFeatured: true,
      isBreaking: false,
      views: 15400,
      likesCount: 540,
      commentsCount: 120,
      publishedAt: hoursAgo(14),
    },
    {
      title: "Telemedicine services now reaching smaller towns",
      slug: "telemedicine-reaches-smaller-towns",
      summary:
        "Affordable telemedicine platforms are expanding into smaller towns, connecting patients with specialists.",
      content:
        "Affordable telemedicine platforms are expanding into smaller towns, connecting patients with specialists who were previously out of reach.\n\nProviders report that dermatology, mental health and follow-up consultations are the most requested services in these regions.\n\nHealth workers say reliable connectivity and digital literacy remain the biggest hurdles to wider adoption.",
      imageUrl: IMG.autoRickshaw,
      categoryId: catId("national", "Health"),
      scope: "national",
      isFeatured: false,
      isBreaking: false,
      views: 6400,
      likesCount: 180,
      commentsCount: 25,
      publishedAt: hoursAgo(20),
    },
    {
      title: "Global markets rally as central banks signal stability",
      slug: "global-markets-rally-central-banks",
      summary:
        "Equities climbed across major exchanges after central banks signalled a measured approach to policy.",
      content:
        "Equities climbed across major exchanges after central banks signalled a measured approach to monetary policy in coordinated statements.\n\nThe rally lifted technology and industrial stocks, while bond yields eased from recent highs.\n\nAnalysts cautioned that markets remain sensitive to inflation data and any surprise in upcoming policy reviews.",
      imageUrl: IMG.nyc,
      categoryId: catId("international", "Business"),
      scope: "international",
      isFeatured: true,
      isBreaking: false,
      views: 11800,
      likesCount: 260,
      commentsCount: 40,
      publishedAt: hoursAgo(3),
    },
    {
      title: "Climate summit closes with fresh emissions commitments",
      slug: "climate-summit-emissions-commitments",
      summary:
        "Negotiators agreed on new interim targets as countries committed to faster emissions cuts over the next decade.",
      content:
        "Negotiators at the latest climate summit agreed on new interim targets, with countries committing to faster emissions cuts over the next decade.\n\nThe agreement also expanded financing for adaptation projects in climate-vulnerable regions.\n\nCampaigners welcomed the progress but said the commitments still fall short of what science says is needed.",
      imageUrl: IMG.beijing,
      categoryId: catId("international", "World Affairs"),
      scope: "international",
      isFeatured: false,
      isBreaking: true,
      views: 13500,
      likesCount: 390,
      commentsCount: 70,
      publishedAt: hoursAgo(7),
    },
    {
      title: "International team announces fusion energy breakthrough",
      slug: "fusion-energy-breakthrough-announced",
      summary:
        "Researchers reported a sustained fusion reaction that produced more energy than it consumed.",
      content:
        "An international research team reported a sustained fusion reaction that produced more energy than was put in, marking a significant milestone for clean energy.\n\nThe experiment was conducted at a joint facility over several years and has now been independently reviewed.\n\nExperts say commercial fusion power is still a long way off, but the result validates the scientific path.",
      imageUrl: IMG.shanghai,
      categoryId: catId("international", "Science"),
      scope: "international",
      isFeatured: true,
      isBreaking: false,
      views: 16200,
      likesCount: 610,
      commentsCount: 150,
      publishedAt: hoursAgo(12),
    },
    {
      title: "World Cup host cities reveal sustainability plans",
      slug: "world-cup-host-cities-sustainability",
      summary:
        "Host cities unveiled transport and energy plans aimed at cutting the tournament's carbon footprint.",
      content:
        "Host cities for the upcoming World Cup unveiled transport and energy plans designed to reduce the tournament's carbon footprint.\n\nInitiatives include expanded public transit, renewable-powered venues and a recycling programme across fan zones.\n\nOrganisers say the plans build on lessons from previous tournaments and will be tracked publicly.",
      imageUrl: IMG.brooklyn,
      categoryId: catId("international", "Sports"),
      scope: "international",
      isFeatured: false,
      isBreaking: false,
      views: 8900,
      likesCount: 220,
      commentsCount: 55,
      publishedAt: hoursAgo(18),
    },
    {
      title: "Space agencies plan joint lunar research station",
      slug: "space-agencies-joint-lunar-station",
      summary:
        "A coalition of space agencies outlined a shared lunar research station for the next decade.",
      content:
        "A coalition of space agencies outlined plans for a shared lunar research station, aiming for a crewed presence within the next decade.\n\nThe station would support experiments on resource utilisation and long-duration surface operations.\n\nPartners said the project will be modular, allowing new countries and private companies to join over time.",
      imageUrl: IMG.shanghaiNight,
      categoryId: catId("international", "Science"),
      scope: "international",
      isFeatured: false,
      isBreaking: false,
      views: 7600,
      likesCount: 190,
      commentsCount: 35,
      publishedAt: hoursAgo(26),
    },
    {
      title: "US threatens indefinite naval blockade in Strait of Hormuz amid Middle East tension",
      slug: "us-naval-blockade-strait-of-hormuz",
      summary:
        "US defense officials confirmed naval ship rotations in West Asia following Gulf tanker incidents as diplomatic talks stall.",
      content:
        "The United States has indicated it will sustain a naval blockade in the Strait of Hormuz to maintain economic pressure following stalled ceasefire talks in West Asia.\n\nDefense Secretary Pete Hegseth stated that naval forces will rotate aircraft carrier strike groups to ensure maritime security and freedom of navigation across critical energy transit routes.\n\nThe announcement comes after regional authorities reported attacks on commercial tankers, prompting international calls for immediate de-escalation and safe passage.",
      imageUrl: IMG.shanghaiNight,
      categoryId: catId("international", "World Affairs"),
      scope: "international",
      isFeatured: true,
      isBreaking: true,
      views: 24800,
      likesCount: 890,
      commentsCount: 310,
      publishedAt: hoursAgo(1),
    },
    {
      title: "WHO and UNICEF escalate emergency response to Ebola and Cholera outbreaks in Central Africa",
      slug: "who-unicef-ebola-cholera-outbreak-response",
      summary:
        "Health organizations have dispatched medical supplies and vaccines across the DRC and neighboring nations to contain spreading infections.",
      content:
        "The World Health Organization (WHO) and UNICEF have intensified emergency medical aid operations in the Democratic Republic of the Congo and West Africa following rising case counts.\n\nOver 4,400 confirmed Ebola cases have been tracked alongside active cholera surges across six regional countries, driving urgent distribution of oral rehydration salts and vaccines.\n\nGlobal health officials emphasized that swift international funding and local community engagement are critical to stemming transmission.",
      imageUrl: IMG.autoRickshaw,
      categoryId: catId("international", "World Affairs"),
      scope: "international",
      isFeatured: false,
      isBreaking: true,
      views: 18900,
      likesCount: 420,
      commentsCount: 95,
      publishedAt: hoursAgo(4),
    },
    {
      title: "International relief efforts underway following 7.4 magnitude earthquake in Colombia",
      slug: "colombia-earthquake-relief-efforts",
      summary:
        "Search and rescue teams have deployed to western Colombia after severe tremors damaged infrastructure across key regions.",
      content:
        "Emergency responders and international humanitarian teams have launched search operations in western Colombia following a major 7.4 magnitude earthquake.\n\nInitial reports indicate damage to roads, bridges and power grids, with civil protection agencies coordinating emergency shelters and medical relief.\n\nGlobal humanitarian organizations have pledged medical supplies and heavy rescue equipment to assist affected municipal areas.",
      imageUrl: IMG.swissParliament,
      categoryId: catId("international", "World Affairs"),
      scope: "international",
      isFeatured: false,
      isBreaking: true,
      views: 21500,
      likesCount: 630,
      commentsCount: 140,
      publishedAt: hoursAgo(6),
    },
    {
      title: "Wall Street hits new record highs while EU enforces strict PPWR trade regulations",
      slug: "wall-street-record-highs-eu-packaging-regulations",
      summary:
        "Equities climbed following stable economic indicators as European trade regulators roll out updated packaging rules for global exporters.",
      content:
        "Major stock indices reached all-time highs following data indicating steady economic growth and moderating inflation metrics.\n\nConcurrently, European authorities announced the full applicability of the Packaging and Packaging Waste Regulation (PPWR), establishing stricter circular economy standards for global manufacturers.\n\nMarket analysts noted that technology and industrial sectors led trading gains despite shifting compliance requirements for international supply chains.",
      imageUrl: IMG.nyc,
      categoryId: catId("international", "Business"),
      scope: "international",
      isFeatured: true,
      isBreaking: false,
      views: 19400,
      likesCount: 510,
      commentsCount: 88,
      publishedAt: hoursAgo(8),
    },
    {
      title: "India launches Semicon 2.0 with ₹1,27,500 crore outlay for chip fabrication push",
      slug: "semicon-india-2-semiconductor-fabrication-push",
      summary:
        "The national semiconductor initiative targets domestic chip design, advanced packaging, and multi-hub fabrication plants.",
      content:
        "India has officially initiated 'Semicon 2.0' with an approved outlay of ₹1,27,500 crore aimed at expanding the nation's high-tech manufacturing capacity.\n\nThe programme focuses on six strategic pillars: semiconductor design, advanced packaging facilities, equipment manufacturing, R&D institutes, and talent pipelines.\n\nIndustry leaders welcomed the initiative, highlighting plans for new private-public partnerships to build domestic silicon wafers and microelectronics hubs.",
      imageUrl: IMG.techHands,
      categoryId: catId("national", "Business"),
      scope: "national",
      isFeatured: true,
      isBreaking: true,
      views: 28900,
      likesCount: 1120,
      commentsCount: 240,
      publishedAt: hoursAgo(2),
    },
    {
      title: "ISRO and NASA expand TRUST bilateral agreement for joint lunar exploration and deep space R&D",
      slug: "isro-nasa-trust-lunar-exploration-agreement",
      summary:
        "Space agencies agreed on expanded scientific data sharing and prospective joint payloads under the TRUST space initiative.",
      content:
        "Senior delegations from ISRO and NASA concluded bilateral talks in Bengaluru, expanding their cooperative framework under the TRUST initiative.\n\nDiscussions prioritized open scientific data sharing, deep space navigation protocols, and prospective Indian scientific payloads on future lunar surface missions.\n\nBoth agencies reaffirmed their commitment to encouraging private space startups and commercial rocket launch authorizations.",
      imageUrl: IMG.techCode,
      categoryId: catId("national", "Education"),
      scope: "national",
      isFeatured: true,
      isBreaking: false,
      views: 23100,
      likesCount: 940,
      commentsCount: 180,
      publishedAt: hoursAgo(5),
    },
    {
      title: "IMD and NOAA deploy IOLA coupled ocean model to improve extreme monsoon forecasting",
      slug: "imd-noaa-iola-monsoon-weather-forecasting",
      summary:
        "Meteorological institutions have operationalized an integrated Indian Ocean forecasting system for severe weather events.",
      content:
        "The India Meteorological Department (IMD) and US oceanographic researchers have deployed the coupled IOLA (Indian Ocean–Land–Atmosphere) forecasting model.\n\nThe system combines high-resolution sea surface temperature observations with atmospheric dynamics to predict intense precipitation and monsoon fluctuations.\n\nScientists expect the enhanced forecasting accuracy to significantly assist agricultural planners and flood management agencies across coastal and inland states.",
      imageUrl: IMG.varanasiColor,
      categoryId: catId("national", "Health"),
      scope: "national",
      isFeatured: false,
      isBreaking: false,
      views: 14200,
      likesCount: 380,
      commentsCount: 62,
      publishedAt: hoursAgo(10),
    },
  ];

  await db.insert(newsArticles).values(news);

  /* ------------------------ Community posts ----------------------- */
  const posts = [
    {
      title: "Our neighbourhood finally got a community library",
      slug: "neighbourhood-community-library",
      description:
        "A tiny library opened at the corner of the main road — and it is already buzzing every evening.",
      content:
        "A small community library opened at the corner of the main road last week, and it is already buzzing every evening.\n\nIt started as a collection of donated books from residents and has grown into a proper reading corner with a few benches.\n\nAnyone nearby should drop in — it is free and open to all.",
      images: [IMG.indiaMarket, IMG.varanasiColor],
      authorId: priya.id,
      categoryId: catId("community", "Local News"),
      state: "Karnataka",
      city: "Bengaluru",
      localArea: "Indiranagar",
      views: 2500,
      likesCount: 150,
      commentsCount: 25,
      bookmarksCount: 40,
      createdAt: hoursAgo(6),
    },
    {
      title: "Lost: black wallet near Central Market — please help",
      slug: "lost-black-wallet-central-market",
      description:
        "Dropped a black leather wallet near the Central Market bus stop this morning. Please reach out if found.",
      content:
        "I dropped a black leather wallet near the Central Market bus stop this morning around 9am.\n\nIt has an ID card and a couple of cards inside. Nothing of much value, but the documents are important to me.\n\nIf you found it, please comment here or contact me. Happy to offer a small reward.",
      images: [IMG.mumbaiStreet],
      authorId: rohan.id,
      categoryId: catId("community", "Lost & Found"),
      state: "Uttar Pradesh",
      city: "Lucknow",
      localArea: "Hazratganj",
      views: 900,
      likesCount: 240,
      commentsCount: 12,
      bookmarksCount: 8,
      createdAt: hoursAgo(11),
    },
    {
      title: "Street food festival this weekend at the city grounds",
      slug: "street-food-festival-weekend",
      description:
        "A two-day street food festival is happening this weekend with over 40 stalls from across the region.",
      content:
        "A two-day street food festival is happening this weekend at the city grounds.\n\nThere are over 40 stalls from across the region, live music in the evening and a dedicated kids' zone.\n\nEntry is free and stalls accept both cash and UPI. See you there!",
      images: [IMG.streetFood],
      authorId: ananya.id,
      categoryId: catId("community", "Event"),
      state: "Madhya Pradesh",
      city: "Indore",
      localArea: "Palasia",
      views: 1800,
      likesCount: 90,
      commentsCount: 50,
      bookmarksCount: 65,
      createdAt: hoursAgo(16),
    },
    {
      title: "Rescued an injured stray dog near the park this morning",
      slug: "rescued-injured-stray-dog",
      description:
        "Found an injured stray near the park and took it to a nearby shelter. Sharing an update on how it is doing.",
      content:
        "This morning I found an injured stray dog near the park, limping and clearly in pain.\n\nWith help from a couple of neighbours, we took it to a nearby animal shelter where it received first aid.\n\nThe shelter says it should recover well. If you are in the area and want to help out, they always welcome volunteers and supplies.",
      images: [IMG.autoRickshaw],
      authorId: aarav.id,
      categoryId: catId("community", "Other"),
      state: "Maharashtra",
      city: "Pune",
      localArea: "Koregaon Park",
      views: 3200,
      likesCount: 410,
      commentsCount: 60,
      bookmarksCount: 30,
      createdAt: hoursAgo(24),
    },
    {
      title: "Local tech meetup keeps growing every month",
      slug: "local-tech-meetup-growing",
      description:
        "Our monthly tech meetup crossed 200 attendees for the first time. Here is what we talked about.",
      content:
        "Our monthly tech meetup crossed 200 attendees for the first time this weekend.\n\nWe had talks on building products with small teams, a live demo of a local AI project, and a really useful Q&A on getting your first job in tech.\n\nThe next meetup is already scheduled — details will be shared here soon.",
      images: [IMG.laptop],
      authorId: vikram.id,
      categoryId: catId("community", "Technology"),
      state: "Telangana",
      city: "Hyderabad",
      localArea: "Gachibowli",
      views: 1100,
      likesCount: 75,
      commentsCount: 18,
      bookmarksCount: 22,
      createdAt: hoursAgo(30),
    },
    // College-related community posts
    {
      title: "Avishkar 2026 — MNNIT's flagship tech fest is back",
      slug: "avishkar-2026-mnnit-tech-fest",
      description:
        "MNNIT Allahabad's annual tech fest Avishkar is returning with hackathons, robotics and cultural nights.",
      content:
        "Avishkar, MNNIT Allahabad's flagship tech fest, is back this year with a packed lineup.\n\nExpect hackathons, a robotics arena, coding competitions and cultural nights spread over three days.\n\nRegistrations are open to all colleges. If you have never been, this is a great reason to visit the campus.",
      images: [IMG.campusWalk, IMG.campusSocial],
      authorId: rohan.id,
      categoryId: catId("community", "College"),
      state: "Uttar Pradesh",
      city: "Prayagraj",
      localArea: "MNNIT Campus",
      collegeId: collegeId("mnnit-allahabad"),
      views: 4200,
      likesCount: 320,
      commentsCount: 85,
      bookmarksCount: 120,
      createdAt: hoursAgo(4),
    },
    {
      title: "Campus placements cross a new milestone this season",
      slug: "campus-placements-milestone-season",
      description:
        "This placement season saw the highest package yet offered on campus, with strong internship conversions.",
      content:
        "This placement season has been a strong one for our batch.\n\nThe highest package offered on campus crossed a new milestone, and a large share of offers came through internship conversions.\n\nCongratulations to everyone placed — and best of luck to those still in the process.",
      images: [IMG.campusSun],
      authorId: priya.id,
      categoryId: catId("community", "Achievement"),
      state: "Uttar Pradesh",
      city: "Prayagraj",
      localArea: "MNNIT Campus",
      collegeId: collegeId("mnnit-allahabad"),
      views: 5600,
      likesCount: 180,
      commentsCount: 40,
      bookmarksCount: 90,
      createdAt: hoursAgo(8),
    },
    {
      title: "New sports complex inaugurated on campus",
      slug: "new-sports-complex-campus",
      description:
        "The new indoor sports complex is finally open, with badminton, table tennis and a fitness centre.",
      content:
        "The new indoor sports complex was inaugurated on campus this week.\n\nIt includes badminton courts, table tennis tables and a modern fitness centre that students can use with their campus ID.\n\nBooking slots through the campus portal should open by next week.",
      images: [IMG.campusBackpacks],
      authorId: aarav.id,
      categoryId: catId("community", "College"),
      state: "Uttar Pradesh",
      city: "Prayagraj",
      localArea: "MNNIT Campus",
      collegeId: collegeId("mnnit-allahabad"),
      views: 1500,
      likesCount: 95,
      commentsCount: 22,
      bookmarksCount: 40,
      createdAt: hoursAgo(28),
    },
    {
      title: "Inter-hostel robotics challenge drew record teams",
      slug: "inter-hostel-robotics-challenge",
      description:
        "IIT Kanpur's inter-hostel robotics challenge saw its biggest participation yet this year.",
      content:
        "The inter-hostel robotics challenge at IIT Kanpur saw its biggest participation yet.\n\nTeams built line-following and obstacle-avoiding bots in a weekend-long sprint, with some genuinely creative designs.\n\nIt was great to see first-years competing head to head with seniors.",
      images: [IMG.campusHallway],
      authorId: vikram.id,
      categoryId: catId("community", "College"),
      state: "Uttar Pradesh",
      city: "Kanpur",
      localArea: "IIT Kanpur Campus",
      collegeId: collegeId("iit-kanpur"),
      views: 2100,
      likesCount: 130,
      commentsCount: 30,
      bookmarksCount: 55,
      createdAt: hoursAgo(34),
    },
    {
      title: "Lost a notebook near the Arts Faculty — please return",
      slug: "lost-notebook-arts-faculty",
      description:
        "Left a spiral notebook with class notes near the Arts Faculty steps. Please return if found.",
      content:
        "I left a spiral notebook with my class notes near the Arts Faculty steps yesterday afternoon.\n\nIt has no contact details inside, unfortunately, but the cover has a small sticker of a mountain.\n\nIf anyone picked it up, please comment here. These notes are all I have for the upcoming exams.",
      images: [IMG.campusCorridor],
      authorId: ananya.id,
      categoryId: catId("community", "Lost & Found"),
      state: "Delhi",
      city: "New Delhi",
      localArea: "North Campus",
      collegeId: collegeId("delhi-university"),
      views: 700,
      likesCount: 210,
      commentsCount: 15,
      bookmarksCount: 12,
      createdAt: hoursAgo(40),
    },
  ];

  await db.insert(communityPosts).values(posts);

  const postRows = await db
    .select({ id: communityPosts.id, slug: communityPosts.slug })
    .from(communityPosts);

  const postId = (slug: string): number => {
    const found = postRows.find((p: any) => p.slug === slug);
    if (!found) throw new Error(`Post not found: ${slug}`);
    return found.id;
  };

  const newsRows = await db
    .select({ id: newsArticles.id, slug: newsArticles.slug })
    .from(newsArticles);

  const newsId = (slug: string): number => {
    const found = newsRows.find((n: any) => n.slug === slug);
    if (!found) throw new Error(`News not found: ${slug}`);
    return found.id;
  };

  /* --------------------------- Comments --------------------------- */
  const commentRows: Array<{
    targetType: string;
    targetId: number;
    authorId: number;
    content: string;
    createdAt: Date;
  }> = [
    { targetType: "community", targetId: postId("neighbourhood-community-library"), authorId: vikram.id, content: "Visited yesterday — such a lovely space. Donated a few books too!", createdAt: hoursAgo(4) },
    { targetType: "community", targetId: postId("neighbourhood-community-library"), authorId: ananya.id, content: "This is exactly what the area needed.", createdAt: hoursAgo(3) },
    { targetType: "community", targetId: postId("street-food-festival-weekend"), authorId: rohan.id, content: "Going on Saturday evening. Anyone else?", createdAt: hoursAgo(10) },
    { targetType: "community", targetId: postId("rescued-injured-stray-dog"), authorId: priya.id, content: "Thank you for stopping to help. The shelter does great work.", createdAt: hoursAgo(18) },
    { targetType: "community", targetId: postId("rescued-injured-stray-dog"), authorId: vikram.id, content: "Respect. Will check if they need supplies this weekend.", createdAt: hoursAgo(16) },
    { targetType: "community", targetId: postId("avishkar-2026-mnnit-tech-fest"), authorId: aarav.id, content: "Can't wait. The hackathon last year was brilliant.", createdAt: hoursAgo(2) },
    { targetType: "community", targetId: postId("avishkar-2026-mnnit-tech-fest"), authorId: priya.id, content: "Registering with my team today!", createdAt: hoursAgo(1) },
    { targetType: "community", targetId: postId("campus-placements-milestone-season"), authorId: rohan.id, content: "Congrats everyone! Great season overall.", createdAt: hoursAgo(6) },
    { targetType: "news", targetId: newsId("cricket-league-new-attendance-record"), authorId: priya.id, content: "The stadium atmosphere this season has been unreal.", createdAt: hoursAgo(10) },
    { targetType: "news", targetId: newsId("cricket-league-new-attendance-record"), authorId: vikram.id, content: "Weekend fixtures are sold out everywhere.", createdAt: hoursAgo(9) },
    { targetType: "news", targetId: newsId("fusion-energy-breakthrough-announced"), authorId: aarav.id, content: "Huge if it can be scaled. Fingers crossed.", createdAt: hoursAgo(8) },
    { targetType: "news", targetId: newsId("fusion-energy-breakthrough-announced"), authorId: rohan.id, content: "Still decades away, but the science is exciting.", createdAt: hoursAgo(7) },
    { targetType: "news", targetId: newsId("climate-summit-emissions-commitments"), authorId: ananya.id, content: "Progress, but we need more urgency.", createdAt: hoursAgo(5) },
    { targetType: "community", targetId: postId("lost-black-wallet-central-market"), authorId: priya.id, content: "Hope you find it soon. Try checking with the bus depot.", createdAt: hoursAgo(9) },
    { targetType: "community", targetId: postId("new-sports-complex-campus"), authorId: rohan.id, content: "The fitness centre looks amazing.", createdAt: hoursAgo(20) },
  ];
  await db.insert(comments).values(commentRows);

  /* ---------------------------- Likes ----------------------------- */
  const likeRows: Array<{ userId: number; targetType: string; targetId: number }> = [
    { userId: aarav.id, targetType: "community", targetId: postId("neighbourhood-community-library") },
    { userId: aarav.id, targetType: "community", targetId: postId("avishkar-2026-mnnit-tech-fest") },
    { userId: aarav.id, targetType: "news", targetId: newsId("cricket-league-new-attendance-record") },
    { userId: priya.id, targetType: "community", targetId: postId("rescued-injured-stray-dog") },
    { userId: rohan.id, targetType: "community", targetId: postId("street-food-festival-weekend") },
    { userId: ananya.id, targetType: "community", targetId: postId("avishkar-2026-mnnit-tech-fest") },
    { userId: vikram.id, targetType: "news", targetId: newsId("fusion-energy-breakthrough-announced") },
    { userId: priya.id, targetType: "news", targetId: newsId("clean-energy-startups-record-funding") },
  ];
  await db.insert(likes).values(likeRows);

  /* -------------------------- Bookmarks --------------------------- */
  const bookmarkRows: Array<{ userId: number; targetType: string; targetId: number }> = [
    { userId: aarav.id, targetType: "community", targetId: postId("street-food-festival-weekend") },
    { userId: aarav.id, targetType: "community", targetId: postId("campus-placements-milestone-season") },
    { userId: aarav.id, targetType: "news", targetId: newsId("education-policy-skill-based-learning") },
    { userId: aarav.id, targetType: "news", targetId: newsId("space-agencies-joint-lunar-station") },
    { userId: priya.id, targetType: "community", targetId: postId("avishkar-2026-mnnit-tech-fest") },
  ];
  await db.insert(bookmarks).values(bookmarkRows);

  /* ---------------------------- Follows --------------------------- */
  await db.insert(follows).values([
    { userId: aarav.id, targetType: "college", targetId: collegeId("mnnit-allahabad") },
    { userId: aarav.id, targetType: "college", targetId: collegeId("iit-kanpur") },
    { userId: aarav.id, targetType: "user", targetId: priya.id },
    { userId: aarav.id, targetType: "user", targetId: rohan.id },
    { userId: priya.id, targetType: "college", targetId: collegeId("mnnit-allahabad") },
  ]);

  /* ------------------------- Notifications ------------------------ */
  await db.insert(notifications).values([
    { userId: aarav.id, type: "like", message: "Your story 'Rescued an injured stray dog' passed 400 likes.", read: false },
    { userId: aarav.id, type: "comment", message: "Rohan Gupta commented on 'Avishkar 2026'.", read: false },
    { userId: aarav.id, type: "follow", message: "MNNIT Allahabad shared a new campus update.", read: true },
    { userId: aarav.id, type: "system", message: "Welcome to Samachar! Your story was published.", read: true },
  ]);

  // eslint-disable-next-line no-console
  console.log("Seeding complete.");
}

if (typeof require !== "undefined" && require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
      console.error(error);
      process.exit(1);
    });
}
