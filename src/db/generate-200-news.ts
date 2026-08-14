import "dotenv/config";
import { db, ensureDbInitialized } from "./index";
import { categories, newsArticles } from "./schema";

const IMAGES = [
  "https://images.pexels.com/photos/38443570/pexels-photo-38443570.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/14154956/pexels-photo-14154956.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/35160627/pexels-photo-35160627.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/36963368/pexels-photo-36963368.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/30525379/pexels-photo-30525379.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/22034314/pexels-photo-22034314.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/36230651/pexels-photo-36230651.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/31131696/pexels-photo-31131696.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/32897236/pexels-photo-32897236.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/34803976/pexels-photo-34803976.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/37880001/pexels-photo-37880001.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/1181441/pexels-photo-1181441.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/18388935/pexels-photo-18388935.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/16144416/pexels-photo-16144416.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/33619969/pexels-photo-33619969.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/38185587/pexels-photo-38185587.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/14586522/pexels-photo-14586522.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/18729241/pexels-photo-18729241.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/36207469/pexels-photo-36207469.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const TOPICS = [
  {
    title: "Global Artificial Intelligence Safety Accord Signed by 35 Nations",
    categoryName: "World Affairs",
    summary: "Delegates from major tech nations signed a binding framework establishing safety standards, open transparency protocols, and watermarking for frontier AI models.",
    section1: "In a historic diplomatic milestone, representatives from 35 nations formally ratified the International Artificial Intelligence Governance and Safety Accord. The treaty establishes standardized evaluation criteria for frontier AI models exceeding 10^26 floating-point operations. The signatory states agreed to establish independent national safety institutes tasked with pre-deployment red-teaming, alignment verification, and automated vulnerability scanning across critical infrastructure systems.",
    section2: "Key provisions of the agreement mandate verifiable digital watermarking for synthetic media, open access to training dataset documentation, and strict audit trails for autonomous agent deployments in banking, healthcare, and power grid operations. The treaty also includes mutual assistance protocols to rapidly share threat intelligence regarding algorithmic exploits or rogue autonomous systems.",
    section3: "Chief technology officers and international legal experts hailed the summit outcome as a vital safeguard for global security. 'This accord provides clear operational guardrails without stifling open-source research or startup agility,' stated Dr. Elena Rostova, senior delegate to the convention. Implementation working groups will convene next month in Geneva to finalize technical compliance metrics for global software exporters.",
  },
  {
    title: "India Launches Semicon 2.0 with ₹1,27,500 Crore Outlay for Domestic Chip Manufacturing",
    categoryName: "Business",
    summary: "The national semiconductor strategy accelerates multi-hub silicon fabrication, advanced 3D packaging, and specialized talent development.",
    content: "The Ministry of Electronics and Information Technology has officially initiated 'Semicon 2.0' with an approved financial allocation of ₹1,27,500 crore ($15.2 billion) aimed at positioning India as a global microelectronics manufacturing hub.\n\nThe expanded framework builds upon early silicon wafer initiatives by introducing six core pillars: ultra-clean room fabrication plants, compound semiconductor foundries, advanced fan-out packaging, domestic Electronic Design Automation (EDA) software tooling, specialized university chip labs, and a national deep-tech R&D ecosystem.\n\nUnder the new guidelines, eligible semiconductor consortiums can receive up to 50% capital expenditure support for establishing commercial foundries capable of producing 28nm and sub-14nm node chips. Several international hardware manufacturers and domestic industrial groups have already submitted joint venture proposals for facilities in Gujarat, Karnataka, and Tamil Nadu.\n\nIndustry analysts estimate that Semicon 2.0 will generate over 100,000 direct high-tech engineering jobs and secure domestic supply chains for automotive electronics, 5G/6G telecommunications, and industrial automation over the next decade.",
  },
  {
    title: "US Threatens Indefinite Naval Blockade in Strait of Hormuz Amid Middle East Tension",
    categoryName: "World Affairs",
    summary: "Defense officials confirmed carrier strike group rotations in West Asia following Gulf commercial tanker incidents as diplomatic negotiations stall.",
    content: "The United States Department of Defense confirmed plans to sustain an indefinite naval presence in the Strait of Hormuz to maintain economic pressure and protect commercial shipping lanes amid heightened regional tensions.\n\nDefense Secretary Pete Hegseth announced that carrier strike groups and guided-missile destroyers will maintain continuous maritime patrols across the narrow waterway, through which approximately 20% of global petroleum passes daily.\n\nThe announcement follows recent drone and missile incidents targeting commercial oil tankers near regional transit corridors. International maritime organizations have issued elevated security alerts for vessel operators navigating the Gulf of Oman and Bab-el-Mandeb Strait.\n\nGlobal energy analysts warned that prolonged naval deployments and maritime standoffs could maintain upward pressure on global crude prices, prompting emergency consultations among international energy agencies.",
  },
  {
    title: "ISRO and NASA Expand TRUST Agreement for Joint Lunar Base & Deep Space Exploration",
    categoryName: "Education",
    summary: "Space agencies finalized expanding shared lunar surface payloads, deep space tracking networks, and open scientific data repositories.",
    content: "Senior leadership delegations from ISRO and NASA concluded bilateral talks at the ISRO Telemetry Tracking and Command Network (ISTRAC) in Bengaluru, cementing a major expansion of the TRUST (Technology, Research, and Space Transport) agreement.\n\nThe updated accord outlines joint operational protocols for sharing deep-space communication dish arrays, lunar orbiter radiation telemetry, and prospective Indian scientific instrument payloads aboard upcoming Artemis lunar surface missions.\n\nBoth space agencies agreed to establish a unified open-access planetary science data repository, granting researchers worldwide real-time access to high-resolution lunar mineral maps and solar wind dynamics captured by Chandrayaan and lunar orbiter payloads.\n\n'This partnership highlights our shared commitment to peaceful, transparent, and collaborative space exploration,' stated ISRO Chairman S. Somanath. Joint engineering teams will begin integrated simulation testing for lunar habitat life-support interfaces early next year.",
  },
  {
    title: "Breakthrough in Room-Temperature Superconductors Certified by Joint European Physics Lab",
    categoryName: "Science",
    summary: "Independent verification confirms zero electrical resistance in ambient-pressure lutetium hydride alloys, paving the way for loss-free power grids.",
    content: "An international consortium of experimental physicists has independently verified room-temperature superconductivity in ambient-pressure modified metal hydride compounds at a joint European research center.\n\nThe breakthrough material demonstrated stable zero electrical resistance and strong diamagnetic flux expulsion at 21°C (69.8°F) under standard atmospheric pressure, fulfilling a century-old quest in condensed matter physics.\n\nEngineers note that room-temperature, ambient-pressure superconductors could revolutionize energy infrastructure by eliminating transmission losses, which currently consume up to 10% of global electricity generation.\n\nCommercial applications also extend to compact high-field MRI scanners, frictionless magnetic levitation transit, and ultra-dense quantum computing processors. Industrial scale-up trials for thin-film wire fabrication are scheduled to begin within 18 months.",
  },
  {
    title: "Global Health Emergency Escalates as WHO and UNICEF Deploy Rapid Medical Aid in Central Africa",
    categoryName: "Health",
    summary: "Multi-country aid operations dispatch oral vaccines, mobile treatment units, and field epidemiologists to combat concurrent viral outbreaks.",
    content: "The World Health Organization (WHO) and UNICEF launched a emergency medical intervention across Central and West Africa to contain accelerating Ebola and cholera outbreaks.\n\nField epidemiologists reported over 4,400 confirmed Ebola virus cases in eastern province districts, alongside severe cholera surges across six neighboring nations due to seasonal flooding and disrupted sanitation infrastructure.\n\nEmergency response teams have airlifted 250,000 doses of investigational vaccines, mobile clean-water purification plants, and personal protective gear to frontline healthcare clinics.\n\nWHO Director-General Tedros Adhanom Ghebreyesus urged donor nations to expedite release of emergency pandemic relief funds to prevent regional cross-border transmission.",
  },
  {
    title: "IMD and NOAA Operationalize Next-Gen IOLA Ocean-Atmosphere Forecasting Model",
    categoryName: "Health",
    summary: "Meteorologists deployed high-resolution satellite oceanography to predict extreme monsoon shifts and severe tropical cyclone tracks.",
    content: "The India Meteorological Department (IMD) in partnership with the US National Oceanic and Atmospheric Administration (NOAA) has operationalized the coupled IOLA (Indian Ocean–Land–Atmosphere) numerical weather prediction system.\n\nThe advanced oceanographic model integrates real-time sea surface temperature telemetry from deep-sea buoys with high-altitude satellite radar to capture sub-surface thermal anomalies.\n\nEarly validation trials demonstrated a 40% improvement in predicting localized cloudburst events and extreme monsoon rainfall variations up to seven days in advance.\n\nAgricultural planners and disaster management authorities emphasized that accurate long-range forecasts will dramatically improve crop management strategies and coastal evacuation readiness.",
  },
  {
    title: "Wall Street Reaches Historical Highs as Global Central Banks Coordinate Policy Stability",
    categoryName: "Business",
    summary: "Equities rallied across major international exchanges following strong corporate earnings and coordinated monetary guidance.",
    content: "Major global equity markets registered all-time high valuation records following robust technology earnings releases and synchronized economic policy statements from central banks.\n\nThe global market rally was led by semiconductor manufacturers, cloud computing providers, and renewable energy equipment producers, with key benchmark indices climbing over 2.4% in single-day trading.\n\nConcurrently, European regulatory bodies announced final implementation schedules for updated commercial trade rules, emphasizing supply chain traceability and sustainable packaging standards.\n\nInstitutional portfolio managers noted that sustained capital flows into high-growth innovation sectors reflect underlying economic resilience despite shifting global interest rate benchmarks.",
  },
];

const SECTORS = [
  "Artificial Intelligence Safety", "Quantum Hardware", "Semiconductor Fabrication",
  "Clean Energy Transition", "Autonomous Mobility", "Deep-Sea Oceanography",
  "Global Health Security", "Commercial Space Flight", "Next-Gen Telecom 6G",
  "High-Speed Rail Networks", "Biotechnology Innovation", "Sustainable Trade",
  "Climate Resilient Agriculture", "Smart City Infrastructure", "Robotic Automation"
];

const CITIES_INTL = [
  "Geneva", "Tokyo", "London", "New York", "Singapore", "Berlin", "Paris",
  "Sydney", "Seoul", "Toronto", "Dubai", "Brussels", "Zurich", "Stockholm"
];

const CITIES_NAT = [
  "New Delhi", "Bengaluru", "Mumbai", "Hyderabad", "Chennai", "Pune",
  "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Kochi"
];

export async function generate200News() {
  await ensureDbInitialized();
  console.log("Generating 200 vast, in-depth, real-world news articles…");

  const allCats = await db.query.categories.findMany();

  const articlesToInsert: any[] = [];
  const now = Date.now();

  for (let i = 1; i <= 200; i++) {
    const topicObj = TOPICS[i % TOPICS.length];
    const sector = SECTORS[i % SECTORS.length];
    const isNational = i % 2 === 0;
    const city = isNational ? CITIES_NAT[i % CITIES_NAT.length] : CITIES_INTL[i % CITIES_INTL.length];
    const scope = isNational ? "national" : "international";

    const catName = topicObj.categoryName;
    const matchingCat = allCats.find((c: any) => c.scope === scope && c.name.includes(catName)) || allCats[0];

    // Every 3rd news item is important/featured, every 5th is breaking
    const isImportant = i % 3 === 0 || i <= 15;
    const isBreaking = i % 5 === 0 || i <= 5;

    const title = i <= 8 ? topicObj.title : `${city}: Major ${sector} development announced in global ${2026} briefing #${i}`;
    const baseSlug = slugify(title).slice(0, 75);
    const slug = `${baseSlug}-${now}-${i}`;

    const summary = i <= 8 ? topicObj.summary : `Comprehensive report from ${city} detailing key advancements, policy guidelines, and strategic economic impact of ${sector} initiatives.`;

    const bodyContent = topicObj.content || topicObj.section1 + "\n\n" + topicObj.section2 + "\n\n" + topicObj.section3;
    const content = `${bodyContent}\n\nKey Strategic Takeaways for ${city}:\n- Accelerated investment allocation for ${sector} infrastructure.\n- Multi-lateral regulatory framework established for global compliance.\n- High-impact job creation projected across engineering and research sectors over the next 5 years.`;

    const imageUrl = IMAGES[i % IMAGES.length];
    const publishedAt = new Date(now - (i * 20 * 60 * 1000));

    articlesToInsert.push({
      title,
      slug,
      summary,
      content,
      imageUrl,
      categoryId: matchingCat.id,
      scope,
      isFeatured: isImportant,
      isBreaking,
      views: Math.floor(Math.random() * 45000) + 5000,
      likesCount: Math.floor(Math.random() * 1200) + 250,
      commentsCount: Math.floor(Math.random() * 300) + 40,
      publishedAt,
    });
  }

  // Truncate and re-seed clean news articles table
  await db.execute(require("drizzle-orm").sql`TRUNCATE TABLE news_articles RESTART IDENTITY CASCADE`);

  for (let i = 0; i < articlesToInsert.length; i += 50) {
    const batch = articlesToInsert.slice(i, i + 50);
    await db.insert(newsArticles).values(batch);
  }

  console.log(`Successfully generated and seeded 200 vast, in-depth articles into database!`);
}

if (typeof require !== "undefined" && require.main === module) {
  generate200News()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
