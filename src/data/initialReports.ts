import { Report } from "../types";

export const INITIAL_REPORTS: Report[] = [
  {
    id: "SPADE-2025-0104",
    isDemo: true,
    type: "Photo",
    title: "Severe road subsidence & deep pothole near Avadi Bus Depot",
    description: "A major crater has developed right outside the primary Avadi Bus Depot exit onto CTH Road. During peak morning hours, government MTC buses and two-wheelers are forced into the oncoming lane, causing severe congestion and minor skids for commuters.",
    category: "Transport & Roads",
    location: "Avadi Bus Depot Exit · Avadi",
    neighborhood: "Avadi",
    createdAt: "2025-05-12T08:15:00Z",
    timeAgo: "25 min ago",
    author: "Maya Chen",
    authorRole: "Verified Civic Contributor",
    initials: "MC",
    verified: true,
    status: "Open issue",
    likes: 54,
    userLiked: false,
    commentsCount: 14,
    urgency: "Urgent",
    coordinates: { lat: 13.1147, lng: 80.1018 },
    media: "https://images.unsplash.com/photo-1560782205-4dd83ceb0270?auto=format&fit=crop&w=1200&q=82",
    image: "https://images.unsplash.com/photo-1560782205-4dd83ceb0270?auto=format&fit=crop&w=1200&q=82",
    alt: "Severely damaged wet asphalt road with hazardous potholes outside depot",
    updates: [
      { time: "08:15 AM", text: "Incident reported by Maya Chen with geotagged photo proof." },
      { time: "08:35 AM", text: "3 local residents corroborated road hazard." },
      { time: "09:00 AM", text: "Report routed to Avadi Municipal Corporation Road Works department." }
    ],
    comments: [
      {
        id: "c1",
        author: "Karthik Rajan",
        initials: "KR",
        role: "Daily Commuter",
        text: "I take route 70A from here daily. Bus drivers are literally swerving sharply to avoid bottoming out. Needs urgent patch-up before rains.",
        createdAt: "15 min ago"
      },
      {
        id: "c2",
        author: "Senthil Nathan",
        initials: "SN",
        role: "Avadi Resident",
        text: "Corporation ward officer was tagged with this SPADE report link. Waiting for road inspection team.",
        createdAt: "5 min ago"
      }
    ]
  },
  {
    id: "SPADE-2025-0103",
    isDemo: true,
    type: "Live",
    title: "Live: Water main burst repair underway near S.A. Engineering College",
    description: "A secondary drinking water pipeline cracked early morning along Poonamallee High Road near the S.A. Engineering College bus stop. Potable water is flooding the service lane. Metrowater maintenance crew has arrived on site and shut the master valve to initiate welding.",
    category: "Water & Sanitation",
    location: "S.A. Engineering College · Poonamallee High Road",
    neighborhood: "Poonamallee",
    createdAt: "2025-05-12T07:45:00Z",
    timeAgo: "Live now",
    author: "Jon Bell",
    authorRole: "Field Journalist",
    initials: "JB",
    verified: true,
    status: "Live coverage",
    likes: 89,
    userLiked: true,
    commentsCount: 26,
    urgency: "Urgent",
    coordinates: { lat: 13.0645, lng: 80.0821 },
    media: "https://images.unsplash.com/photo-1688846875539-3e668edcb853?auto=format&fit=crop&w=1200&q=82",
    image: "https://images.unsplash.com/photo-1688846875539-3e668edcb853?auto=format&fit=crop&w=1200&q=82",
    alt: "Water gushing from municipal pipeline valve with maintenance crew arriving",
    updates: [
      { time: "07:30 AM", text: "Students and passersby noticed heavy water leakage flooding the walkway." },
      { time: "07:55 AM", text: "Chennai Metrowater emergency maintenance crew arrived with suction truck." },
      { time: "08:20 AM", text: "Main supply valve temporarily isolated; welding repair started." }
    ],
    comments: [
      {
        id: "c3",
        author: "Pooja Sundaram",
        initials: "PS",
        role: "College Student",
        text: "Service lane pedestrian path is completely waterlogged. If you're walking toward college gate, use the footbridge side.",
        createdAt: "18 min ago"
      },
      {
        id: "c4",
        author: "Ramesh Babu",
        initials: "RB",
        role: "Local Shopkeeper",
        text: "The repair team estimates normal water supply will resume by afternoon.",
        createdAt: "7 min ago"
      }
    ]
  },
  {
    id: "SPADE-2025-0102",
    isDemo: true,
    type: "Video",
    title: "Non-functional streetlights create safety hazard along Ambattur CTH Road",
    description: "Seven consecutive LED streetlights along the 600m residential corridor connecting Ambattur OT with the railway feeder road have remained dark for five straight nights. Female factory workers on late shifts report feeling unsafe.",
    category: "Public Safety",
    location: "CTH Road corridor · Ambattur",
    neighborhood: "Ambattur",
    createdAt: "2025-05-11T19:30:00Z",
    timeAgo: "1 hr ago",
    author: "David Okoro",
    authorRole: "Civic Reporter",
    initials: "DO",
    verified: true,
    status: "Corporation notified",
    likes: 42,
    userLiked: false,
    commentsCount: 11,
    urgency: "Elevated",
    coordinates: { lat: 13.1118, lng: 80.1472 },
    media: "https://images.unsplash.com/photo-1781179740173-10ed914f8b83?auto=format&fit=crop&w=1200&q=82",
    image: "https://images.unsplash.com/photo-1781179740173-10ed914f8b83?auto=format&fit=crop&w=1200&q=82",
    alt: "Dark urban street at night with inactive light posts",
    updates: [
      { time: "Yesterday 07:30 PM", text: "Video evidence submitted showing dark stretch over 600 meters." },
      { time: "Yesterday 09:15 PM", text: "Verified by 4 Ambattur residents in neighborhood group." },
      { time: "Today 08:00 AM", text: "Official ticket #AMB-ELEC-442 logged with Corporation Electrical Wing." }
    ],
    comments: [
      {
        id: "c5",
        author: "Meenakshi V.",
        initials: "MV",
        role: "Ambattur Resident",
        text: "This stretch is right beside the industrial corridor. Hundreds of workers walk here between 8 PM and 10 PM. Immediate lighting fix needed.",
        createdAt: "45 min ago"
      }
    ]
  },
  {
    id: "SPADE-2025-0101",
    isDemo: true,
    type: "Photo",
    title: "Overflowing commercial garbage bins near Ambattur OT Market",
    description: "Two 1100-litre municipal compactor bins near the wholesale vegetable market entrance in Ambattur Old Town are overflowing into the street. Cattle and stray dogs are scattering waste across the road, creating unhygienic conditions and traffic bottlenecks.",
    category: "Environment & Waste",
    location: "Ambattur OT Wholesale Market · Chennai",
    neighborhood: "Ambattur",
    createdAt: "2025-05-11T16:00:00Z",
    timeAgo: "2 hrs ago",
    author: "Nia Patel",
    authorRole: "Public Health Advocate",
    initials: "NP",
    verified: false,
    status: "Under review",
    likes: 35,
    userLiked: false,
    commentsCount: 8,
    urgency: "Elevated",
    coordinates: { lat: 13.1176, lng: 80.1534 },
    media: "https://images.unsplash.com/photo-1574676039880-73da8368f0eb?auto=format&fit=crop&w=1200&q=82",
    image: "https://images.unsplash.com/photo-1574676039880-73da8368f0eb?auto=format&fit=crop&w=1200&q=82",
    alt: "Overflowing waste collection bins beside market street",
    updates: [
      { time: "Yesterday 04:00 PM", text: "Report posted with market stall photographs." },
      { time: "Yesterday 05:30 PM", text: "Sanitation supervisor contacted for additional evening clearance." }
    ],
    comments: [
      {
        id: "c6",
        author: "Anand Kumar",
        initials: "AK",
        role: "Vegetable Vendor",
        text: "Market waste doubles on weekends. We need a secondary compactor bin placed near the north gate.",
        createdAt: "1 hr ago"
      }
    ]
  },
  {
    id: "SPADE-2025-0099",
    isDemo: true,
    type: "Photo",
    title: "Community desilting drive ahead of monsoon in Paruthipattu canal",
    description: "Volunteer citizen groups from Paruthipattu and Avadi teamed up with youth clubs to clear plastic debris and hyacinth from the feeder channel leading to Avadi Lake. Over 40 sacks of non-biodegradable waste collected in morning session.",
    category: "Community Events",
    location: "Paruthipattu Lake Canal · Avadi",
    neighborhood: "Avadi",
    createdAt: "2025-05-11T11:20:00Z",
    timeAgo: "5 hrs ago",
    author: "Amara King",
    authorRole: "Community Journalist",
    initials: "AK",
    verified: true,
    status: "Verified",
    likes: 112,
    userLiked: true,
    commentsCount: 19,
    urgency: "Normal",
    coordinates: { lat: 13.1072, lng: 80.0982 },
    media: "https://images.unsplash.com/photo-1529792083865-d23889753466?auto=format&fit=crop&w=1200&q=82",
    image: "https://images.unsplash.com/photo-1529792083865-d23889753466?auto=format&fit=crop&w=1200&q=82",
    alt: "Volunteers and community members working along canal banks",
    updates: [
      { time: "May 11 06:30 AM", text: "Volunteers gathered at Paruthipattu bridge." },
      { time: "May 11 11:00 AM", text: "Over 40 bags of plastic waste removed; municipal vehicle transported waste to processing facility." }
    ],
    comments: [
      {
        id: "c7",
        author: "Deepak S.",
        initials: "DS",
        role: "Eco-Club Member",
        text: "Huge thanks to all 35 volunteers who showed up! Next drive is scheduled for next Saturday at 6:30 AM.",
        createdAt: "3 hrs ago"
      }
    ]
  },
  {
    id: "SPADE-2025-0098",
    isDemo: true,
    type: "Photo",
    title: "Broken pedestrian push-button crossing near Poonamallee school zone",
    description: "The pedestrian crossing signal on the 4-lane Poonamallee trunk road has had a damaged push-button module for two weeks. Over 1,200 school students struggle to cross safely during morning and evening rush hours.",
    category: "Education",
    location: "Trunk Road · Poonamallee",
    neighborhood: "Poonamallee",
    createdAt: "2025-05-10T14:10:00Z",
    timeAgo: "1 day ago",
    author: "Revathi M.",
    authorRole: "Parent Association Rep",
    initials: "RM",
    verified: true,
    status: "Corporation notified",
    likes: 67,
    userLiked: false,
    commentsCount: 15,
    urgency: "Urgent",
    coordinates: { lat: 13.0489, lng: 80.1102 },
    media: "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=1200&q=82",
    image: "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=1200&q=82",
    alt: "Pedestrian street signal post along multi-lane city highway",
    updates: [
      { time: "May 10 02:10 PM", text: "Report verified by PTA members with video documentation." },
      { time: "May 11 09:30 AM", text: "Traffic police deployment assigned during school opening hours as interim measure." }
    ],
    comments: [
      {
        id: "c8",
        author: "Subramanian G.",
        initials: "SG",
        role: "Local Resident",
        text: "Traffic police have stationed one constable at 8:30 AM, but the automated signal repair is essential for round-the-clock safety.",
        createdAt: "18 hrs ago"
      }
    ]
  },
  {
    id: "SPADE-2025-0097",
    isDemo: true,
    type: "Photo",
    title: "Irregular essential medicine inventory at Avadi Urban Primary Health Centre",
    description: "Local residents seeking routine anti-hypertension and asthma inhaler refills report stockouts over the past 10 days at the Avadi Urban PHC. Patients are being turned away or forced to buy from private pharmacies.",
    category: "Health",
    location: "Urban Primary Health Centre · Avadi West",
    neighborhood: "Avadi",
    createdAt: "2025-05-09T10:00:00Z",
    timeAgo: "2 days ago",
    author: "Kavitha R.",
    authorRole: "Community Health Monitor",
    initials: "KR",
    verified: true,
    status: "Under review",
    likes: 48,
    userLiked: false,
    commentsCount: 9,
    urgency: "Elevated",
    coordinates: { lat: 13.1201, lng: 80.0954 },
    media: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=82",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=82",
    alt: "Exterior of municipal healthcare facility clinic",
    updates: [
      { time: "May 09 10:00 AM", text: "Report documented with pharmacy counter photos." },
      { time: "May 10 11:30 AM", text: "District Health Officer notified for emergency restock indents." }
    ],
    comments: [
      {
        id: "c9",
        author: "Dr. Murali S.",
        initials: "MS",
        role: "Visiting Volunteer",
        text: "The district warehouse replenishment batch is expected by Wednesday.",
        createdAt: "1 day ago"
      }
    ]
  }
];

export const TRUSTED_CONTRIBUTORS = [
  {
    name: "Maya Chen",
    initials: "MC",
    role: "Senior Civic Contributor",
    location: "Avadi, Chennai",
    verifiedReports: 86,
    trustScore: 98,
    badge: "SPADE Lead Journalist",
    beat: "Municipal Works & Urban Transit"
  },
  {
    name: "David Okoro",
    initials: "DO",
    role: "Investigative Citizen Reporter",
    location: "Ambattur Industrial Estate",
    verifiedReports: 64,
    trustScore: 94,
    badge: "Verified Spader",
    beat: "Public Safety & Labor Welfare"
  },
  {
    name: "Jon Bell",
    initials: "JB",
    role: "Field Dispatch Specialist",
    location: "Poonamallee & Outer Ring",
    verifiedReports: 49,
    trustScore: 92,
    badge: "Verified Spader",
    beat: "Utilities & Water Systems"
  },
  {
    name: "Nia Patel",
    initials: "NP",
    role: "Environmental Monitor",
    location: "Ambattur & Korattur",
    verifiedReports: 52,
    trustScore: 91,
    badge: "Community Advocate",
    beat: "Waste Management & Public Health"
  }
];
