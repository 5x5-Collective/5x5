/**
 * Grid Content Data
 *
 * Content definitions for the 5x5 grid.
 * Extracted from AnimatedGrid.tsx for reusability.
 */

// Define the grid content types
export type ContentKey =
  | "About"
  | "Companies"
  | "Residency"
  | "Grants"
  | "Contributors"
  | "Subscribe"
  | "Quarantine Dreams"
  | "Dancing Monkey"
  | "Power to the People"
  | "Experiments in Reincarnation"
  | "Made You Think"
  | "BGM"
  | "Awaken"
  | "Ikenga Wines"
  | "Darkgrade"
  | "Mount Lawrence"
  | "Fullstack Human"
  | "Black Brick Project"
  | "Double Zero"
  | "Telepath"
  | "Ship By Friday"
  | "Etched"
  | "Bot or Not"
  | "Onwards And Beyond"
  | "Original music"
  | "Two Take Flight"
  | "Lance Weiler";

/**
 * Grid layout - 5 rows x 5 columns
 * Row 0: Navigation items
 * Rows 1-4: Projects and content
 */
export const gridContent: ContentKey[][] = [
  ["About", "Companies", "Residency", "Grants", "Contributors"],
  [
    "Quarantine Dreams",
    "Dancing Monkey",
    "Power to the People",
    "Experiments in Reincarnation",
    "Made You Think",
  ],
  ["BGM", "Awaken", "Ikenga Wines", "Darkgrade", "Double Zero"],
  [
    "Fullstack Human",
    "Black Brick Project",
    "Mount Lawrence",
    "Telepath",
    "Bot or Not",
  ],
  [
    "Ship By Friday",
    "Etched",
    "Onwards And Beyond",
    "Original music",
    "Two Take Flight",
  ],
];

/**
 * Content metadata for each grid item
 */
export interface ContentData {
  text: string;
  link: string;
  createdBy?: { name: string; url: string };
  images?: string[];
}

export const placeholderContent: Record<ContentKey, ContentData> = {
  // Row 1 - Navigation
  About: {
    text: "5x5 is a collective of artists, engineers, chefs, tinkerers, and adventurers exploring new and ancient technologies to understand the world we inhabit and the futures we can create.\n\nThe term 5x5 is a reference to the rarest major basketball statline, in which a player must get 5 counting stats in the 5 major categories in the game: points, rebounds, assists, steals, and blocks. Like the 14 NBA players who have ever accomplished this, the 5x5 collective aims to find skilled generalists who can impact the game in every dimension. Get in touch to find out more.",
    link: "mailto:nikhil@5x5.studio",
  },
  Companies: {
    text: "We occasionally invest in founders who are taking swings to create the kind of future they want to live in. We are less concerned with finding unicorns and more concerned with finding the kind of weirdness that needs to exist but often has no home. Tell us about your project and why we should be inspired by it.",
    link: "mailto:nikhil@5x5.studio",
  },
  Residency: {
    text: "In the Fall of 2025, we will begin piloting an art and science residency program in the Catskills. More info to come soon, but if you cannot wait to hear more, please reach out.",
    link: "mailto:nikhil@5x5.studio",
  },
  Grants: {
    text: "Alongside our residency program, we will soon begin to offer small grants to artists and citizen scientists to fund cutting edge non-commercial projects. Reach out to find out more.",
    link: "mailto:nikhil@5x5.studio",
  },
  Contributors: {
    text: "The current contributors to 5x5 are listed below. If you would like to contribute, please reach out and share a sampling of your work.",
    link: "contributing",
  },
  Subscribe: {
    text: "Subscribe to our newsletter to stay up to date on our latest news and events.",
    link: "subscribe",
  },

  // Row 2 - Team
  "Quarantine Dreams": {
    text: "A Pandemic-era fever dream music video with both music and visuals created by Nikhil Kumar using a variety of technologies, instruments, and recording techniques to present a disorienting glimpse into the mundanity of lockdown",
    link: "https://www.youtube.com/watch?v=I5AjdG9m8bk",
    createdBy: { name: "Nikhil Kumar", url: "https://nikhilkumar.media" },
  },
  "Dancing Monkey": {
    text: "The Dancing Monkey is a new film adapted from Eugene O'Neill's classic groundbreaking play, 'The Hairy Ape.' Set in the present, the film follows Wayne, a factory worker with an important decision to make. After being compared to a dancing monkey by one of the factory owners, Wayne sets out to find an answer to a question that will decide his fate and those around him.",
    link: "https://www.thedancingmonkeyfilm.com/",
    createdBy: { name: "Chandler Wild", url: "https://chandlerwild.com" },
  },
  "Power to the People": {
    text: "There's a systems design term and web-era phrase — graceful degradation — that suddenly feels like an important core ethic for civilization. In Europe and USA, we're being presented with two divergent visions of how society navigates technology… Read more.",
    link: "https://x.com/hv23/status/1918141243395019036",
    createdBy: { name: "Harish Venkatesan", url: "https://twitter.com/hv23" },
  },
  "Experiments in Reincarnation": {
    text: "Experiments in Reincarnation is a sculptural exploration of transformation -- of bodies, of attachments, of scale. It began with a fascination: how do we define who we are over time?… See more.",
    link: "https://vimeo.com/558070075",
    createdBy: { name: "Nikhil Kumar", url: "https://nikhilkumar.media" },
    images: ["/content-images/experiments-in-reincarnation-1.png"],
  },
  "Made You Think": {
    text: "Join Nat, Neil, and Adil as they examine ideas that – as the name suggests – make you think. Episodes will explore books, essays, podcasts, and anything else that warrants further discussion, teaches something useful, or at the very least, exercises our brain muscles.",
    link: "https://www.madeyouthinkpodcast.com/",
    createdBy: { name: "Adil Majid", url: "https://adilmajid.com" },
  },

  // Row 3 - Projects
  BGM: {
    text: "The first flour mill to open in Brooklyn since the 1800s, featuring a new American-made stone mill and all locally sourced grains from Northeastern farmers",
    link: "https://brooklyngranaryandmill.com/",
  },
  Awaken: {
    text: "The best crypto tax software for the Solana ecosystem and beyond",
    link: "https://awaken.tax/",
  },
  "Ikenga Wines": {
    text: "The first biodesigned palm wine, made in America without any palm. Ikenga is bringing the varied flavors of Nigerian palm wine to the US using sophisticated fermentation techniques that produce the familiar flavors of palm wine in environmentally sustainable ways… Learn more.",
    link: "https://ikengawines.com/",
  },
  Darkgrade: {
    text: "Let your camera understand the world. We're building a protocol for large language models to directly interface with image sensors.",
    link: "https://darkgrade.com/",
    images: ["/content-images/darkgrade-1.jpeg"],
  },

  // Row 4 - Portfolio
  "Mount Lawrence": {
    text: "Mount Lawrence follows filmmaker Chandler Wild's 6,700 mile bicycle ride from New York City to the end of the road in Alaska to reconnect with his adventure loving father, a victim of suicide.",
    link: "https://www.amazon.com/Mount-Lawrence-Chandler-Wild/dp/B09RFT4JP9",
    createdBy: { name: "Chandler Wild", url: "https://chandlerwild.com" },
  },
  "Fullstack Human": {
    text: "Follow Nikhil on his quest to learn how to make everything he likes to consume.",
    link: "https://www.instagram.com/fullstack_human/",
    createdBy: { name: "Nikhil Kumar", url: "https://nikhilkumar.media" },
  },
  "Black Brick Project": {
    text: "Art gallery in Brooklyn supporting experimental and emerging artists through residencies, exhibitions, and performance series.",
    link: "https://www.blackbrickproject.com/",
  },
  "Double Zero": {
    text: "DoubleZero is a global fiber network for high performance distributed systems and blockchains, bringing high-performance networking and hardware acceleration to crypto. It is not a new L1 or L2, it is the first N1 in the world. Base layer network infrastructure for distributed systems.",
    link: "https://doublezero.xyz/",
  },
  Telepath: {
    text: "A better Telegram client for professionals in business development, client enablement, forward deployed engineering, and other similarly client-facing roles.",
    link: "Coming soon",
    createdBy: { name: "Jon Wong", url: "https://x.com/jnwng" },
  },

  // Row 5 - Recommendations
  "Ship By Friday": {
    text: "If I was to boil down the most important rule learned over eleven years of shipping software, it would be: velocity above all else.Velocity trumps everything. It trumps prioritization, code quality, design polish, feature completion, and whatever else you consider sacred.Velocity is the cure to the sluggishness that so many software teams fall into. I think of this rule as Ship by Friday.",
    link: "https://www.adilmajid.com/post/ship-by-friday",
    createdBy: { name: "Adil Majid", url: "https://adilmajid.com" },
  },
  Etched: {
    text: "Etched is a proof of concept platform that allows writers to own their works by minting them as NFTs with the essay text written in markdown in the description of the NFT.",
    link: "https://etched.id",
    createdBy: { name: "Jon Wong", url: "https://x.com/jnwng" },
  },
  "Bot or Not": {
    text: "A mini-game meant to test whether you can tell the difference between a human and an AI.",
    link: "https://botornot.is/",
    createdBy: { name: "Harish Venkatesan", url: "https://twitter.com/hv23" },
  },
  "Onwards And Beyond": {
    text: "Nikhil blogged his backpacking trip in 2012 and sporadically updated it until 2015. Take a trip in the Time Machine here.",
    link: "https://onwardsandbeyond-blog.tumblr.com/",
    createdBy: { name: "Nikhil Kumar", url: "https://nikhilkumar.media" },
  },
  "Original music": {
    text: "Some music made by Nikhil over the years, usually using Logic or Ableton, often using analog sounds. His live performances are very different from this.",
    link: "https://soundcloud.com/nkumar23",
    createdBy: { name: "Nikhil Kumar", url: "https://nikhilkumar.media" },
  },
  "Two Take Flight": {
    text: "Two Take Flight is a travel blog documenting the journey of Neal Modi and Anushka Chayya as they traveled around the world for a year",
    link: "https://www.twotakeflight.com/",
  },
  "Lance Weiler": {
    text: `In 17th-century Japan, Sashiko emerged as a method of visible mending, a way to prolong the life of cloth through patterned stitches. Each thread was a gesture of survival, repetition, and care. These works extend that logic into the digital realm.

Starting with a glitch, a rupture in the smooth surface of code, I printed the error onto fabric, sewing it into a wearable object. Then, I photographed the shirt and glitched it again. The result is a layered act of digital and material repair, a recursive performance of breakage and reassembly.

Like Sashiko, these glitches don't hide the wound. They illuminate it. They ask: what happens when we tend to the error instead of erasing it? What ancient methods might we apply to broken systems of the future?`,
    link: "mailto:nikhil@5x5.studio",
  },
};

/**
 * Contributors list
 */
export const contributorsList = [
  { name: "Chandler Wild", url: "https://chandlerwild.com" },
  { name: "Harish Venkatesan", url: "https://twitter.com/hv23" },
  { name: "Jon Wong", url: "https://x.com/jnwng" },
  { name: "Nikhil Kumar", url: "https://nikhilkumar.media" },
  { name: "Adil Majid", url: "https://adilmajid.com" },
];

/**
 * Get main grid rows (first 3 rows of content)
 */
export const getMainRows = () => gridContent.slice(0, 3);

/**
 * Get overflow grid rows (last 2 rows of content)
 */
export const getOverflowRows = () => gridContent.slice(3, 5);
