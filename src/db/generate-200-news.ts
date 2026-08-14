import "dotenv/config";
import { db, ensureDbInitialized } from "./index";
import { categories, newsArticles } from "./schema";
import { eq } from "drizzle-orm";

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

const TEMPLATES = [
  {
    topic: "Global Artificial Intelligence Accord Signed by 35 Nations",
    scope: "international" as const,
    categoryName: "World Affairs",
    summary: "Delegates from major tech nations signed a binding framework establishing safety standards and transparency rules for frontier AI models.",
    content: "In a landmark diplomatic gathering, representatives from 35 countries agreed on a comprehensive international agreement regarding artificial intelligence safety and governance.\n\nThe framework outlines mandatory safety testing, open transparency protocols for training datasets, and guidelines for mitigating algorithmic bias across critical infrastructure.\n\nIndustry leaders and international policymakers praised the agreement as a vital foundation for fostering innovation while protecting global security.",
  },
  {
    topic: "Renewable Energy Capacity Reaches All-Time Global Record",
    scope: "international" as const,
    categoryName: "Business",
    summary: "Solar, wind, and battery storage installations grew by over 45% year-over-year, driven by rapid industrial adoption.",
    content: "International energy monitors reported a unprecedented surge in renewable energy capacity installations worldwide over the past twelve months.\n\nSolar photovoltaic systems and offshore wind farms accounted for the vast majority of new power generation, supported by falling battery storage costs.\n\nAnalysts noted that sustained investment in grid modernization will be crucial to supporting the growing proportion of clean electricity.",
  },
  {
    topic: "Quantum Supercomputing Milestone Achieved in Joint European Lab",
    scope: "international" as const,
    categoryName: "Science",
    summary: "Researchers demonstrated fault-tolerant quantum logic gates operating with 99.9% fidelity at room temperature.",
    content: "Scientists at a joint European quantum research laboratory reported a breakthrough in fault-tolerant quantum computing operations.\n\nBy leveraging advanced superconducting materials, the team maintained stable qubit coherence at significantly higher operational temperatures than previously possible.\n\nExperts expect the advancement to accelerate applications in molecular simulation, climate modelling, and industrial optimization.",
  },
  {
    topic: "Indian High-Speed Rail Corridor Reaches Major Construction Milestone",
    scope: "national" as const,
    categoryName: "Politics",
    summary: "Engineers completed tunnel boring work across key mountain sectors ahead of schedule for the flagship rail project.",
    content: "Rail infrastructure authorities announced the successful completion of major tunneling operations along the high-speed rail corridor.\n\nThe milestone marks significant progress toward linking major commercial hubs with electric bullet train service capable of speeds up to 320 km/h.\n\nProject directors confirmed that track laying and overhead electrification installations will begin across completed elevated sections next month.",
  },
  {
    topic: "Global Health Organization Launches Universal Vaccine Supply Network",
    scope: "international" as const,
    categoryName: "Health",
    summary: "A international coalition established cold-chain drone delivery networks to reach remote regions in developing nations.",
    content: "Global health leaders unveiled a coordinated vaccine delivery initiative utilizing autonomous drone technology and solar-powered cold storage units.\n\nThe initiative addresses long-standing distribution bottlenecks in isolated rural areas, ensuring prompt delivery of essential immunization doses.\n\nField trials demonstrated a 70% reduction in transit times and near-zero inventory loss during extreme weather events.",
  },
  {
    topic: "National Semiconductor Design Hub Opens in Bengaluru",
    scope: "national" as const,
    categoryName: "Business",
    summary: "The state-of-the-art facility provides chip startups with advanced EDA tools, prototyping multi-project wafers, and mentorship.",
    content: "India's technology ministry inaugurated a state-of-the-art semiconductor design center in Bengaluru to support domestic microchip innovation.\n\nThe facility equips early-stage hardware startups with access to high-end Electronic Design Automation (EDA) software and shared prototyping foundries.\n\nGovernment representatives highlighted that the initiative aims to train over 50,000 chip design engineers over the next five years.",
  },
  {
    topic: "Oceanographic Survey Discovers Deep-Sea Ecosystem in Pacific Trench",
    scope: "international" as const,
    categoryName: "Science",
    summary: "Marine biologists mapped hydrothermal vent fields harboring previously unrecorded bioluminescent species at 8,000 meters depth.",
    content: "An international oceanographic expedition utilizing deep-sea submersibles mapped an extensive ecosystem in unexplored Pacific abyssal zones.\n\nResearchers documented dozens of novel bioluminescent organisms thriving near superheated mineral vents under extreme pressure.\n\nThe discovery highlights the importance of protecting deep ocean environments from industrial seabed mining operations.",
  },
  {
    topic: "National Athletics Championship Sees Breakout Sprint Performances",
    scope: "national" as const,
    categoryName: "Sports",
    summary: "Young athletes shattered multiple national records in track events during the annual stadium championships.",
    content: "The National Athletics Championship concluded with record-breaking performances in sprint and field events.\n\nSeveral teenage sprinters clocked sub-10.20s times in the 100m finals, securing qualification spots for upcoming international meets.\n\nCoaching staff credited revamped grass-root training academies and sports science diagnostics for the rising talent pool.",
  },
  {
    topic: "Global Autonomous Electric Transport Pilot Expands to 15 Metro Cities",
    scope: "international" as const,
    categoryName: "Business",
    summary: "Commercial transit operators expanded driverless electric shuttle fleets into urban corridors following positive safety trials.",
    content: "Urban transit authorities across fifteen global cities announced expanded operations for autonomous electric passenger shuttles.\n\nThe vehicles utilize multi-modal lidar and vision systems to navigate high-density traffic corridors with high reliability.\n\nPassenger feedback surveys reported strong public confidence, with commuter demand prompting cities to expand dedicated transit lanes.",
  },
  {
    topic: "National Clean Water Initiative Reaches 100 Million Households",
    scope: "national" as const,
    categoryName: "Politics",
    summary: "Piped drinking water connections achieved complete coverage across rural districts ahead of national target dates.",
    content: "The national rural water mission passed a historic milestone after delivering functional household tap connections to 100 million rural homes.\n\nThe program has transformed public health metrics in rural communities, drastically reducing water-borne diseases and domestic workload.\n\nCommunity water committees are taking over long-term maintenance and automated water quality monitoring.",
  },
];

const SECTORS = [
  "Artificial Intelligence", "Semiconductors", "Clean Energy", "Space Exploration",
  "Global Trade", "Electric Vehicles", "Quantum Computing", "Public Health",
  "Cybersecurity", "Fintech", "Higher Education", "Robotics", "Infrastructure",
  "Biotechnology", "Agriculture Tech", "Smart Cities", "Climate Resilience",
  "Digital Economy", "Renewable Power", "Maritime Logistics", "Telecom 6G",
  "Aero-Defence", "Medical Devices", "Urban Transit", "Supply Chain"
];

const PLACES_INTL = [
  "Geneva", "Tokyo", "London", "New York", "Singapore", "Berlin", "Paris",
  "Sydney", "Seoul", "Toronto", "Dubai", "Brussels", "Zurich", "Stockholm"
];

const PLACES_NAT = [
  "New Delhi", "Bengaluru", "Mumbai", "Hyderabad", "Chennai", "Pune",
  "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Kochi"
];

export async function generate200News() {
  await ensureDbInitialized();
  console.log("Generating 200 real-time news articles…");

  const allCats = await db.query.categories.findMany();

  const articlesToInsert: any[] = [];
  const now = Date.now();

  for (let i = 1; i <= 200; i++) {
    const template = TEMPLATES[i % TEMPLATES.length];
    const sector = SECTORS[i % SECTORS.length];
    const isNational = i % 2 === 0;
    const place = isNational ? PLACES_NAT[i % PLACES_NAT.length] : PLACES_INTL[i % PLACES_INTL.length];
    const scope = isNational ? "national" : "international";

    const catName = template.categoryName;
    const matchingCat = allCats.find((c: any) => c.scope === scope && c.name.includes(catName)) || allCats[0];

    const title = `${place}: Major ${sector} initiative announced in ${2026} update #${i}`;
    const slug = slugify(`${title}-${now}-${i}`);
    const summary = `${template.summary} Focus on ${sector} innovation in ${place}.`;
    const content = `${template.content}\n\nLocal authorities and global analysts in ${place} confirmed that the ${sector} developments represent a pivotal shift in industry standards.\n\nFurther policy details and implementation roadmaps will be reviewed in upcoming executive sessions.`;
    const imageUrl = IMAGES[i % IMAGES.length];
    const isBreaking = i % 7 === 0;
    const isFeatured = i % 5 === 0;
    const publishedAt = new Date(now - (i * 35 * 60 * 1000));

    articlesToInsert.push({
      title,
      slug,
      summary,
      content,
      imageUrl,
      categoryId: matchingCat.id,
      scope,
      isFeatured,
      isBreaking,
      views: Math.floor(Math.random() * 25000) + 1500,
      likesCount: Math.floor(Math.random() * 800) + 100,
      commentsCount: Math.floor(Math.random() * 150) + 10,
      publishedAt,
    });
  }

  // Insert in batches of 50
  for (let i = 0; i < articlesToInsert.length; i += 50) {
    const batch = articlesToInsert.slice(i, i + 50);
    await db.insert(newsArticles).values(batch);
  }

  console.log(`Successfully generated and inserted 200 news articles into database!`);
}

if (typeof require !== "undefined" && require.main === module) {
  generate200News()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
