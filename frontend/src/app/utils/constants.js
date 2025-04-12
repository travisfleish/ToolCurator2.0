// Categories for filtering enterprise tools
export const CATEGORIES = [
  { name: "All Categories", id: "" },
  { name: "Fan Intelligence", id: "Fan Intelligence", mobileName: "Fan Intel", group: "sports" },
  { name: "Advertising & Media", id: "Advertising & Media", mobileName: "Ad & Media", group: "sports" },
  { name: "Creative & Personalization", id: "Creative & Personalization", mobileName: "Creative", group: "sports" },
  { name: "Sponsorship & Revenue", id: "Sponsorship & Revenue", mobileName: "Revenue", group: "sports" },
  { name: "Measurement & Analytics", id: "Measurement & Analytics", mobileName: "Analytics", group: "sports" },
  { name: "Agent Builders", id: "Agent Builders", mobileName: "Agents", group: "ai" },
  { name: "LLM Frameworks & Orchestration", id: "LLM Frameworks & Orchestration", mobileName: "LLM", group: "ai" },
  { name: "Model Hubs & Customization", id: "Model Hubs & Customization", mobileName: "Models", group: "ai" },
  { name: "AI Coding & App Platforms", id: "AI Coding & App Platforms", mobileName: "Coding", group: "ai" },
  { name: "Embeddings & Vector Search", id: "Embeddings & Vector Search", mobileName: "Vector", group: "ai" }
];

// Category groups for new dropdown UI
export const CATEGORY_GROUPS = {
  SPORTS: [
    { name: "All Sports Tools", id: "sports_all", mobileName: "All Sports" },
    { name: "Fan Intelligence", id: "Fan Intelligence", mobileName: "Fan Intel" },
    { name: "Advertising & Media", id: "Advertising & Media", mobileName: "Ad & Media" },
    { name: "Creative & Personalization", id: "Creative & Personalization", mobileName: "Creative" },
    { name: "Sponsorship & Revenue", id: "Sponsorship & Revenue", mobileName: "Revenue" },
    { name: "Measurement & Analytics", id: "Measurement & Analytics", mobileName: "Analytics" }
  ],
  AI: [
    { name: "All AI Tools", id: "ai_all", mobileName: "All AI" },
    { name: "Agent Builders", id: "Agent Builders", mobileName: "Agents" },
    { name: "LLM Frameworks & Orchestration", id: "LLM Frameworks & Orchestration", mobileName: "LLM" },
    { name: "Model Hubs & Customization", id: "Model Hubs & Customization", mobileName: "Models" },
    { name: "AI Coding & App Platforms", id: "AI Coding & App Platforms", mobileName: "Coding" },
    { name: "Embeddings & Vector Search", id: "Embeddings & Vector Search", mobileName: "Vector" }
  ]
};

// Filters for toggling between view modes
export const FILTERS = [
  { name: "Personal Productivity", id: "personal", shortName: "Personal" },
  { name: "Enterprise Solutions", id: "enterprise", shortName: "Enterprise" },
];

// Categories for personal productivity tools
export const DEMO_CATEGORIES = [
  "Foundational AI",
  "Writing & Editing",
  "Meeting Assistants",
  "Deck Automation",
  "Content Creation",
  "Research & Analysis",
  "Task & Workflow",
  "Voice & Audio",
  "Learning & Skills"
];

// Sponsor logos for the carousel - matching SIL website style
export const SPONSORS = [
  { id: 1, name: "ClientLogo 1", logoUrl: "/logos/ClientLogo.jpg" },
  { id: 2, name: "ClientLogo 2", logoUrl: "/logos/ClientLogo_2.jpg" },
  { id: 3, name: "ClientLogo 3", logoUrl: "/logos/ClientLogo_3.jpg" },
  { id: 4, name: "ClientLogo 4", logoUrl: "/logos/ClientLogo_4.jpg" },
  { id: 6, name: "ClientLogo 6", logoUrl: "/logos/ClientLogo_6.jpg" },
  { id: 7, name: "ClientLogo 7", logoUrl: "/logos/ClientLogo_7.jpg" },
  { id: 9, name: "ClientLogo 9", logoUrl: "/logos/ClientLogo_9.jpg" },
  { id: 10, name: "ClientLogo 10", logoUrl: "/logos/ClientLogo_10.jpg" },
  { id: 11, name: "ClientLogo 11", logoUrl: "/logos/ClientLogo_11.jpg" },
  { id: 12, name: "ClientLogo 12", logoUrl: "/logos/ClientLogo_12.jpg" },
  { id: 13, name: "ClientLogo 13", logoUrl: "/logos/ClientLogo_13.jpg" },
  { id: 14, name: "ClientLogo 14", logoUrl: "/logos/ClientLogo_14.jpg" },
  { id: 15, name: "ClientLogo 15", logoUrl: "/logos/ClientLogo_15.jpg" },
  { id: 16, name: "ClientLogo 16", logoUrl: "/logos/ClientLogo_16.jpg" },
  { id: 17, name: "ClientLogo 17", logoUrl: "/logos/ClientLogo_17.jpg" },
  { id: 18, name: "ClientLogo 18", logoUrl: "/logos/ClientLogo_18.jpg" },
  { id: 19, name: "ClientLogo 19", logoUrl: "/logos/ClientLogo_19.jpg" },
  { id: 20, name: "ClientLogo 20", logoUrl: "/logos/ClientLogo_20.jpg" },
  { id: 21, name: "ClientLogo 21", logoUrl: "/logos/ClientLogo_21.jpg" },
  { id: 22, name: "ClientLogo 22", logoUrl: "/logos/ClientLogo_22.jpg" }
];

// Content types
export const CONTENT_TYPES = {
  ARTICLE: 'article',
  VIDEO: 'video',
  TOOL: 'tool',
  CASE_STUDY: 'case_study'
};

// API endpoints
export const API_ENDPOINTS = {
  TOOLS: '/api/tools',
  NEWSLETTER: '/api/newsletter',
  CONTACT: '/api/contact'
};

// Social media links
export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/sportsinnovlab',
  LINKEDIN: 'https://linkedin.com/company/sports-innovation-lab',
  INSTAGRAM: 'https://instagram.com/sportsinnovlab',
  YOUTUBE: 'https://youtube.com/sportsinnovationlab'
};