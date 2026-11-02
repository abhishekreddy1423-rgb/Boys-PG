/**
 * Sri Mallikarjuna Swami The Boys PG - Central Configuration File
 * ==============================================================
 * This single file controls all content, contact information, pricing,
 * image paths, room carousels, video tours, food menus, rules, and FAQs.
 * 
 * PHOTO PATHS:
 * All images are stored as real photograph files under /public/images/...
 * Simply drop your own real photos into those folders using the same names
 * and the entire site will automatically display them with zero code changes!
 */

window.HOSTEL_CONFIG = {
  // Hostel General Details
  name: "Sri Mallikarjuna Swami The Boys PG",
  nameTe: "శ్రీ మల్లికార్జున స్వామి ది బాయ్స్ పీజీ",
  tagline: "Safe, clean and affordable stay near MITS College",
  taglineTe: "MITS కాలేజ్ సమీపంలో సురక్షితమైన, పరిశుభ్రమైన మరియు సరసమైన బాయ్స్ పీజీ హాస్టల్",
  establishedYear: 2018,
  totalCapacity: 75,
  currentAvailableBeds: 4,

  // Contact Information
  contact: {
    ownerName: "Sathish",
    ownerRole: "Owner & Resident Warden",
    ownerRoleTe: "ఓనర్ & రెసిడెంట్ వార్డెన్",
    phoneDisplay: "+91 63094 95985",
    phoneRaw: "916309495985", // Without spaces or plus sign for tel: and WhatsApp
    whatsappNumber: "916309495985",
    altPhone: "+91 63094 95985",
    email: "srimallikarjunapg.mits@gmail.com",
    address: {
      street: "Opposite MITS College street",
      area: "Angallu",
      mandal: "Kurabala Kota",
      district: "Annamayya District (Chittoor)",
      state: "Andhra Pradesh",
      pincode: "517325",
      fullAddress: "Opposite MITS College Street, Angallu, Kurabala Kota, Andhra Pradesh - 517325",
      fullAddressTe: "MITS కాలేజ్ వీధి ఎదురుగా, అంగళ్లు, కురబలకోట, ఆంధ్రప్రదేశ్ - 517325"
    },
    googleMapsUrl: "https://maps.app.goo.gl/N4oCkHCrvy7YgDuv7",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=13.6288,78.4802"
  },

  // Google Apps Script Web App URL for automated booking notifications & Google Sheet logging
  // Deploy Code.gs as Web App (Execute as: Me, Access: Anyone) and paste your URL below:
  bookingWebhookUrl: "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",

  // Room & Bed Inventory Configuration (14 Rooms, 49 Beds)
  inventory: {
    totalRooms: 14,
    totalBeds: 49,
    // Editable Room Definitions & Pricing
    rooms: [
      { room: "101", type: "2 Sharing", typeId: "2-sharing", beds: 2, price: 7000, title: "2 Sharing Executive" },
      { room: "102", type: "3 Sharing", typeId: "3-sharing", beds: 3, price: 5000, title: "3 Sharing Comfort" },
      { room: "103", type: "3 Sharing", typeId: "3-sharing", beds: 3, price: 5000, title: "3 Sharing Comfort" },
      { room: "104", type: "3 Sharing", typeId: "3-sharing", beds: 3, price: 5000, title: "3 Sharing Comfort" },
      { room: "105", type: "3 Sharing", typeId: "3-sharing", beds: 3, price: 5000, title: "3 Sharing Comfort" },
      { room: "106", type: "3 Sharing", typeId: "3-sharing", beds: 3, price: 5000, title: "3 Sharing Comfort" },
      { room: "201", type: "4 Sharing", typeId: "4-sharing", beds: 4, price: 5000, title: "4 Sharing Economy" },
      { room: "202", type: "4 Sharing", typeId: "4-sharing", beds: 4, price: 5000, title: "4 Sharing Economy" },
      { room: "203", type: "4 Sharing", typeId: "4-sharing", beds: 4, price: 5000, title: "4 Sharing Economy" },
      { room: "204", type: "4 Sharing", typeId: "4-sharing", beds: 4, price: 5000, title: "4 Sharing Economy" },
      { room: "205", type: "4 Sharing", typeId: "4-sharing", beds: 4, price: 5000, title: "4 Sharing Economy" },
      { room: "206", type: "4 Sharing", typeId: "4-sharing", beds: 4, price: 5000, title: "4 Sharing Economy" },
      { room: "207", type: "4 Sharing", typeId: "4-sharing", beds: 4, price: 5000, title: "4 Sharing Economy" },
      { room: "208", type: "4 Sharing", typeId: "4-sharing", beds: 4, price: 5000, title: "4 Sharing Economy" }
    ],
    // Admin password SHA-256 hash (Never store plaintext password in source code)
    adminPasswordHash: "a79b44494ba830b7e8506959e9ca4fcefea074685f4c798ead557f704eed76da",
    // Beds JSON data path
    bedsDataPath: "data/beds.json"
  },

  // Key Highlights / Quick Info Bar
  quickStats: {
    distanceToCollege: "150 Meters",
    distanceToCollegeTe: "150 మీటర్లు",
    walkingTime: "2 Min Walk",
    walkingTimeTe: "2 నిమిషాల నడక",
    startingRent: "₹5,000",
    securityDeposit: "₹3,000",
    depositPolicy: "100% Refundable",
    depositPolicyTe: "పూర్తిగా వాపస్ ఇవ్వబడును",
    foodIncluded: true,
    foodIncludedText: "3 Meals + Evening Tea & Snacks Included",
    foodIncludedTextTe: "3 పూటలా భోజనం + సాయంత్రం టీ & స్నాక్స్ ఉచితం",
    gateClosingTime: "9:30 PM",
    gateClosingTimeTe: "రాత్రి 9:30 గంటలకు"
  },

  // Hero Full-Width 16:9 Real Photograph Image Slider
  heroSlides: [
    {
      id: "slide-building",
      image: "public/images/hero/landing-banner.png",
      title: "Sri Mallikarjuna Swami The Boys PG",
      titleTe: "శ్రీ మల్లికార్జున స్వామి ది బాయ్స్ పీజీ",
      subtitle: "Modern 3-Storey Facility Right Opposite MITS College Street",
      subtitleTe: "MITS కాలేజ్ వీధికి సరిగ్గా ఎదురుగా 3 అంతస్తుల ఆధునిక భవనం",
      caption: "Real Building Front with Visible Name Board & Gated Motorbike Parking",
      captionTe: "హాస్టల్ ప్రధాన భవనం మరియు సురక్షితమైన గేట్"
    },
    {
      id: "slide-room",
      image: "public/images/rooms/2-sharing-1.jpg",
      title: "Clean & Spacious Sharing Rooms",
      titleTe: "పరిశుభ్రమైన మరియు విశాలమైన గదులు",
      subtitle: "Comfortable Cots, Fresh Bedding & Wooden Wardrobes",
      subtitleTe: "సౌకర్యవంతమైన మంచాలు మరియు చెక్క అల్మారాలు",
      caption: "Well-ventilated rooms with attached washrooms & 24/7 hot water geyser",
      captionTe: "అటాచ్డ్ బాత్రూమ్ మరియు 24/7 వేడి నీటి సదుపాయం"
    },
    {
      id: "slide-dining",
      image: "public/images/facilities/mess.jpg",
      title: "100% Homely Andhra Food & Mess",
      titleTe: "100% రుచికరమైన ఆంధ్రా ఇంటి భోజనం",
      subtitle: "Unlimited Hot Servings & Sunday Chicken Dum Biryani",
      subtitleTe: "వేడి భోజనం మరియు ఆదివారం చికెన్ దమ్ బిర్యానీ",
      caption: "Clean dining hall with stainless steel plates and pure RO mineral water",
      captionTe: "పరిశుభ్రమైన డైనింగ్ హాల్ మరియు ఫిల్టర్ చేసిన RO తాగునీరు"
    }
  ],

  // About Section
  about: {
    title: "A Second Home for MITS Engineering Students",
    titleTe: "MITS ఇంజనీరింగ్ విద్యార్థులకు స్వచ్ఛమైన రెండవ ఇల్లు",
    description: "Established in 2018, Sri Mallikarjuna Swami The Boys PG was founded with a single mission: to provide MITS College students with a safe, disciplined, and comfortable home away from home. Located just a 2-minute walk from the college campus, we combine modern hostel amenities with healthy, hygienic, homemade South Indian food and uninterrupted study spaces.",
    descriptionTe: "2018 లో స్థాపించబడిన శ్రీ మల్లికార్జున స్వామి బాయ్స్ పీజీ, MITS కాలేజ్ విద్యార్థులకు సురక్షితమైన, క్రమశిక్షణతో కూడిన మరియు ఆహ్లాదకరమైన వాతావరణాన్ని అందించడమే లక్ష్యంగా పనిచేస్తోంది. కాలేజీకి కేవలం 2 నిమిషాల నడక దూరంలో ఉంటూ, రుచికరమైన ఇంటి భోజనం మరియు ప్రశాంతమైన చదువుల వాతావరణం కల్పిస్తున్నాము.",
    wardenMessage: "As the resident warden, I personally oversee the quality of every meal, maintenance, and student safety. We maintain 24/7 CCTV surveillance, strictly adhere to night gate timings, and offer direct communication to parents at all times.",
    wardenMessageTe: "రెసిడెంట్ వార్డెన్‌గా నేను స్వయంగా ప్రతి పూట భోజన నాణ్యత, పరిశుభ్రత మరియు భద్రతను పర్యవేక్షిస్తాను. 24 గంటల సీసీటీవీ నిఘా, ఖచ్చితమైన సమయపాలన మరియు తల్లిదండ్రులతో నిరంతర సంప్రదింపులు మా ప్రత్యేకత.",
    featuresList: [
      { en: "Strict 9:30 PM gate closing for complete safety", te: "రాత్రి 9:30 గంటలకు గేటు మూసివేత - పూర్తి భద్రత" },
      { en: "Purified RO mineral water with hot & cold dispenser", te: "పరిశుభ్రమైన RO మినరల్ వాటర్ సదుపాయం" },
      { en: "High-speed dual-band Wi-Fi for uninterrupted online study", te: "ఆన్‌లైన్ చదువులకు హై-స్పీడ్ వై-ఫై" },
      { en: "Daily room cleaning and sanitization by full-time staff", te: "ప్రతిరోజూ రూమ్ క్లీనింగ్ మరియు పరిశుభ్రత" }
    ]
  },

  // Rooms & Pricing Plans (Each with 3 Real Photograph Carousels)
  rooms: [
    {
      id: "2-sharing",
      title: "2 Sharing Executive Room",
      titleTe: "2 షేరింగ్ ఎగ్జిక్యూటివ్ గది",
      badge: "Executive",
      badgeTe: "ఎగ్జిక్యూటివ్",
      badgeType: "success",
      monthlyRent: 7000,
      deposit: 3000,
      description: "Spacious premium room with natural daylight, single cots, wooden wardrobes, and attached geyser washroom.",
      descriptionTe: "సహజమైన వెలుతురు, చెక్క కప్‌బోర్డులు మరియు అటాచ్డ్ గీజర్ బాత్రూమ్ కలిగిన విశాలమైన గది.",
      images: [
        {
          src: "public/images/rooms/2-sharing-1.jpg",
          caption: "2 single cots with comfortable bedding, wooden wardrobes, and daylight window",
          captionTe: "సౌకర్యవంతమైన పరుపులు, చెక్క కప్‌బోర్డ్ మరియు కిటికీతో 2-పడకల గది"
        },
        {
          src: "public/images/rooms/2-sharing-2.jpg",
          caption: "Spacious room layout with tiled flooring and ceiling fan",
          captionTe: "విశాలమైన గది, టైల్డ్ ఫ్లోరింగ్ మరియు సీలింగ్ ఫ్యాన్"
        },
        {
          src: "public/images/rooms/2-sharing-3.jpg",
          caption: "Attached sanitized bathroom with 24/7 hot water geyser",
          captionTe: "24 గంటల వేడి నీటి గీజర్‌తో అటాచ్డ్ బాత్రూమ్"
        }
      ],
      features: [
        { en: "Attached Washroom with Geyser", te: "గీజర్‌తో కూడిన అటాచ్డ్ బాత్రూమ్" },
        { en: "Spacious Wooden Wardrobes", te: "విశాలమైన చెక్క అల్మారాలు" },
        { en: "Solid Cot & Orthopedic Mattress", te: "దృఢమైన మంచం & ఆర్థోపెడిక్ పరుపు" },
        { en: "Ceiling Fan & Natural Daylight", te: "సీలింగ్ ఫ్యాన్ & సహజ వెలుతురు" },
        { en: "High Speed 5G Wi-Fi Access Point", te: "హై-స్పీడ్ 5G వై-ఫై" },
        { en: "3 Homely Meals + Evening Snacks Included", te: "3 పూటలా భోజనం & స్నాక్స్ ఉచితం" }
      ]
    },
    {
      id: "3-sharing",
      title: "3 Sharing Comfort Room",
      titleTe: "3 షేరింగ్ కంఫర్ట్ గది",
      badge: "Comfort Choice",
      badgeTe: "కంఫర్ట్ ఛాయిస్",
      badgeType: "warning",
      monthlyRent: 5000,
      deposit: 3000,
      description: "Our most popular student choice balancing affordability, personal wardrobe space, and companionship.",
      descriptionTe: "విద్యార్థులలో అత్యంత ఆదరణ పొందిన సరసమైన ధర మరియు సౌకర్యవంతమైన గది.",
      images: [
        {
          src: "public/images/rooms/3-sharing-1.jpg",
          caption: "3-sharing room with three single cots, clean bedding, and cross ventilation",
          captionTe: "మూడు మంచాలు, మంచి వెంటిలేషన్‌తో కూడిన 3-షేరింగ్ రూమ్"
        },
        {
          src: "public/images/rooms/3-sharing-2.jpg",
          caption: "Spacious room with wooden wardrobes and individual storage",
          captionTe: "చెక్క కప్‌బోర్డులతో కూడిన విశాలమైన గది"
        },
        {
          src: "public/images/rooms/3-sharing-3.jpg",
          caption: "Attached clean washroom with daily sanitation",
          captionTe: "రోజూ శుభ్రం చేసే అటాచ్డ్ బాత్రూమ్"
        }
      ],
      features: [
        { en: "Attached Clean Washroom", te: "అటాచ్డ్ శుభ్రమైన బాత్రూమ్" },
        { en: "Wooden Wardrobes for Storage", te: "చెక్క కప్‌బోర్డ్‌లు" },
        { en: "Quality Mattress, Bedsheet & Pillow", te: "నాణ్యమైన పరుపు, బెడ్‌షీట్ & దిండు" },
        { en: "Ceiling Fan & Good Ventilation", te: "సీలింగ్ ఫ్యాన్ & మంచి వెంటిలేషన్" },
        { en: "Daily Housekeeping Service", te: "రోజువారీ హౌస్ కీపింగ్" },
        { en: "3 Meals + Evening Snacks Included", te: "3 పూటలా భోజనం & స్నాక్స్ ఉచితం" }
      ]
    },
    {
      id: "4-sharing",
      title: "4 Sharing Economy Room",
      titleTe: "4 షేరింగ్ ఎకానమీ గది",
      badge: "Best Value",
      badgeTe: "బెస్ట్ వాల్యూ",
      badgeType: "success",
      monthlyRent: 5000,
      deposit: 3000,
      description: "Budget-friendly option offering the best value for engineering students with full hostel amenities.",
      descriptionTe: "తక్కువ బడ్జెట్‌లో అన్ని సౌకర్యాలతో కూడిన ఉత్తమ విద్యార్థి గది.",
      images: [
        {
          src: "public/images/rooms/4-sharing-1.jpg",
          caption: "Spacious 4-sharing room with comfortable cots, ceiling fans, and large windows",
          captionTe: "విశాలమైన 4-షేరింగ్ గది, మంచాలు మరియు కిటికీలు"
        },
        {
          src: "public/images/rooms/4-sharing-2.jpg",
          caption: "Comfortable layout with wooden wardrobes for student storage",
          captionTe: "పుస్తకాలు, దుస్తుల కోసం కప్‌బోర్డులు"
        },
        {
          src: "public/images/rooms/4-sharing-3.jpg",
          caption: "Attached washroom with geyser and sanitary fittings",
          captionTe: "గీజర్‌తో కూడిన అటాచ్డ్ బాత్రూమ్"
        }
      ],
      features: [
        { en: "Attached Clean Washroom", te: "అటాచ్డ్ శుభ్రమైన బాత్రూమ్" },
        { en: "Wardrobe Storage per Student", te: "ప్రతి విద్యార్థికి కప్‌బోర్డ్" },
        { en: "Individual Cot & Mattress", te: "వ్యక్తిగత మంచం & పరుపు" },
        { en: "Ceiling Fans & Excellent Cross-Ventilation", te: "సీలింగ్ ఫ్యాన్లు & మంచి వెంటిలేషన్" },
        { en: "Free High-Speed Wi-Fi", te: "ఉచిత హై-స్పీడ్ వై-ఫై" },
        { en: "3 Meals + Evening Snacks Included", te: "3 పూటలా భోజనం & స్నాక్స్ ఉచితం" }
      ]
    }
  ],

  // 2D Architectural Floor Plan Blueprint
  floorPlan: {
    image: "assets/images/floor-plan-layout.svg",
    title: "Standard Room Layout Blueprint",
    titleTe: "ప్రామాణిక రూమ్ లేఅవుట్ బ్లూప్రింట్",
    dimensions: "14 ft × 16 ft (224 sq. ft.)",
    description: "Architectural 2D diagram showing the optimal placement of single cots, lockable wooden wardrobes, ergonomic study table, and the attached geyser bathroom with door-swing clearances.",
    descriptionTe: "మంచాలు, కప్‌బోర్డులు, స్టడీ టేబుల్ మరియు అటాచ్డ్ బాత్రూమ్ అమరికను చూపించే 2D లేఅవుట్ చిత్రం."
  },

  // Virtual Walkthrough Video Section (30-60 second tour)
  videoTour: {
    title: "Virtual Hostel Video Walkthrough",
    titleTe: "హాస్టల్ వర్చువల్ వీడియో టూర్",
    subtitle: "A 45-second tour of our rooms, dining hall, corridors, and campus street for students & parents.",
    subtitleTe: "గదులు, డైనింగ్ హాల్ మరియు పరిసరాలను చూపించే 45 సెకన్ల వీడియో టూర్.",
    duration: "45 Seconds",
    thumbnail: "public/images/hero/building.jpg",
    youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0" // Replace with real YouTube hostel video link
  },

  // Facilities & Amenities
  facilities: [
    {
      id: "wifi",
      icon: "wifi",
      title: "High-Speed Wi-Fi",
      titleTe: "హై-స్పీడ్ వై-ఫై",
      desc: "5G high-speed optical fiber Wi-Fi throughout all floors for seamless online classes and coding labs.",
      descTe: "ఆన్‌లైన్ క్లాసులు, కోడింగ్ ప్రాక్టీస్ కోసం అన్ని అంతస్తుల్లో 5G హై-స్పీడ్ వై-ఫై."
    },
    {
      id: "hot-water",
      icon: "flame",
      title: "24/7 Hot Water",
      titleTe: "24/7 వేడి నీటి సదుపాయం",
      desc: "Solar water heaters and backup electric geysers provide instant hot water every morning.",
      descTe: "ప్రతి ఉదయం స్నానానికి సోలార్ మరియు ఎలక్ట్రిక్ గీజర్ ద్వారా వేడి నీరు అందుబాటులో ఉంటుంది."
    },
    {
      id: "ro-water",
      icon: "droplet",
      title: "RO Drinking Water",
      titleTe: "RO మినరల్ వాటర్",
      desc: "Multi-stage RO + UV water purification system with cold and normal drinking water on every floor.",
      descTe: "ప్రతి ఫ్లోర్‌లోనూ పరిశుభ్రమైన, స్వచ్ఛమైన చల్లటి మరియు సాధారణ RO తాగునీరు."
    },
    {
      id: "laundry",
      icon: "shirt",
      title: "Laundry & Washing",
      titleTe: "లాండ్రీ & వాషింగ్",
      desc: "Fully automatic washing machines available for students along with a sunny terrace drying area.",
      descTe: "బట్టలు ఉతుక్కోవడానికి ఆటోమేటిక్ వాషింగ్ మెషీన్లు మరియు ఆరబెట్టడానికి టెర్రస్ సదుపాయం."
    },
    {
      id: "power-backup",
      icon: "zap",
      title: "24/7 Power Backup",
      titleTe: "24/7 పవర్ బ్యాకప్",
      desc: "Heavy-duty inverter power backup ensures lights, fans, and Wi-Fi continue running during power outages.",
      descTe: "కరెంట్ పోయినా చదువుకు ఇబ్బంది లేకుండా ఫ్యాన్లు, లైట్లు, వై-ఫై కోసం ఇన్వర్టర్ బ్యాకప్."
    },
    {
      id: "cctv",
      icon: "shield-check",
      title: "CCTV & Security",
      titleTe: "CCTV & పూర్తి భద్రత",
      desc: "Full HD CCTV cameras cover all entry points, corridors, and bike parking with a resident warden on site.",
      descTe: "ప్రవేశ ద్వారాలు, కారిడార్లు మరియు పార్కింగ్ వద్ద సీసీటీవీ కెమెరాల నిఘా."
    },
    {
      id: "parking",
      icon: "bike",
      title: "Two-Wheeler Parking",
      titleTe: "బైక్ పార్కింగ్",
      desc: "Spacious, covered, and gated parking within premises for student bikes and bicycles.",
      descTe: "హాస్టల్ ప్రాంగణంలోనే విద్యార్థుల ద్విచక్ర వాహనాల కోసం సురక్షితమైన పార్కింగ్."
    },
    {
      id: "study-area",
      icon: "book-open",
      title: "Quiet Study Area",
      titleTe: "ప్రశాంతమైన స్టడీ ఏరియా",
      desc: "Well-lit dedicated study zone with quiet hours from 10 PM for semester exams and project preparation.",
      descTe: "పరీక్షల సమయంలో నిశ్శబ్దంగా చదువుకోవడానికి ప్రత్యేకంగా కేటాయించిన స్టడీ హాల్."
    },
    {
      id: "bed-mattress",
      icon: "bed",
      title: "Cot & Mattress",
      titleTe: "మంచం & మెత్తటి పరుపు",
      desc: "Individual solid iron cot, comfortable orthopedic foam mattress, and fresh pillow provided to each student.",
      descTe: "ప్రతి విద్యార్థికి వ్యక్తిగత దృఢమైన మంచం, సౌకర్యవంతమైన పరుపు మరియు దిండు."
    },
    {
      id: "cupboard",
      icon: "archive",
      title: "Individual Cupboard",
      titleTe: "వ్యక్తిగత కప్‌బోర్డ్",
      desc: "Spacious lockable wooden wardrobe with personal key for books, clothes, and laptop storage.",
      descTe: "పుస్తకాలు, దుస్తులు మరియు ల్యాప్‌టాప్ భద్రపరుచుకోవడానికి తాళం ఉన్న వ్యక్తిగత అల్మారా."
    }
  ],

  // Weekly Food Menu
  foodMenu: {
    timings: {
      breakfast: "7:30 AM - 9:45 AM",
      lunch: "12:30 PM - 2:00 PM",
      dinner: "7:30 PM - 9:00 PM"
    },
    note: "Menu may change slightly based on availability and festivals.",
    noteTe: "అందుబాటు మరియు పండుగల ఆధారంగా మెనూలో స్వల్ప మార్పులు ఉండవచ్చు.",
    schedule: [
      {
        day: "Monday",
        te: "సోమవారము",
        breakfast: ["Idli", "Vada"],
        lunch: ["Rice", "Dal", "Vadiyalu", "Rasam", "Curd"],
        dinner: ["Veg Rice"]
      },
      {
        day: "Tuesday",
        te: "మంగళవారము",
        breakfast: ["Dosa"],
        lunch: ["Rice", "Sambar", "Vadiyalu"],
        dinner: ["Egg Rice"]
      },
      {
        day: "Wednesday",
        te: "బుధవారము",
        breakfast: ["Puri"],
        lunch: ["Chicken Curry / Chicken Kabab"],
        dinner: ["Jeera Rice"]
      },
      {
        day: "Thursday",
        te: "గురువారము",
        breakfast: ["Pongal"],
        lunch: ["Rice", "Leafy-vegetable Dal", "Ladies' Finger (Okra) Fry"],
        dinner: ["Uttapam / Dosa"]
      },
      {
        day: "Friday",
        te: "శుక్రవారము",
        breakfast: ["Bondalu"],
        lunch: ["Kushka"],
        dinner: ["Egg Chapati"]
      },
      {
        day: "Saturday",
        te: "శనివారము",
        breakfast: ["Dosa"],
        lunch: ["Rice", "Alasanda (Cowpea) Dal", "Potato Fry"],
        dinner: ["Sweet / Gobi Rice"]
      },
      {
        day: "Sunday",
        te: "ఆదివారము",
        breakfast: ["Pulihora"],
        lunch: ["Dum Biryani"],
        dinner: ["Rice", "Dal", "Rasam"]
      }
    ]
  },

  // Photo Gallery with Real Photographs & Captions
  gallery: [
    {
      id: "building",
      category: "Building",
      categoryTe: "భవనం",
      title: "Hostel Exterior & Gate",
      titleTe: "హాస్టల్ బయటి దృశ్యం & గేట్",
      caption: "Modern 4-storey building opposite MITS College street with secure entrance gate",
      captionTe: "MITS కాలేజ్ ఎదురుగా సురక్షితమైన 4 అంతస్తుల భవనం & ప్రవేశ ద్వారం",
      image: "public/images/hero/building.jpg",
      thumb: "public/images/hero/building.jpg"
    },
    {
      id: "room2",
      category: "Rooms",
      categoryTe: "గదులు",
      title: "2-Sharing Executive Bedroom",
      titleTe: "విశాలమైన 2-షేరింగ్ రూమ్",
      caption: "2 single cots with comfortable bedding, wooden wardrobes, and bright natural sunlight",
      captionTe: "సౌకర్యవంతమైన పరుపులు, చెక్క కప్‌బోర్డ్ మరియు సహజ వెలుతురుతో 2-పడకల గది",
      image: "public/images/rooms/2-sharing-1.jpg",
      thumb: "public/images/rooms/2-sharing-1.jpg"
    },
    {
      id: "room3",
      category: "Rooms",
      categoryTe: "గదులు",
      title: "3-Sharing Comfort Room",
      titleTe: "3-షేరింగ్ విద్యార్థి గది",
      caption: "Spacious 3-sharing room with three single cots, wooden wardrobes, and ceiling fan",
      captionTe: "మూడు మంచాలు, చెక్క కప్‌బోర్డులు మరియు ఫ్యాన్‌తో కూడిన 3-షేరింగ్ రూమ్",
      image: "public/images/rooms/3-sharing-1.jpg",
      thumb: "public/images/rooms/3-sharing-1.jpg"
    },
    {
      id: "room4",
      category: "Rooms",
      categoryTe: "గదులు",
      title: "4-Sharing Economy Room",
      titleTe: "4-షేరింగ్ ఎకానమీ గది",
      caption: "Spacious 4-sharing room with comfortable cots, wooden wardrobes, and large window",
      captionTe: "విశాలమైన 4-షేరింగ్ గది, సౌకర్యవంతమైన మంచాలు మరియు కప్‌బోర్డులు",
      image: "public/images/rooms/4-sharing-1.jpg",
      thumb: "public/images/rooms/4-sharing-1.jpg"
    },
    {
      id: "dining",
      category: "Mess",
      categoryTe: "డైనింగ్ & మెస్",
      title: "Hygienic Dining Hall & Mess",
      titleTe: "పరిశుభ్రమైన డైనింగ్ హాల్",
      caption: "Covered dining hall with TV, green chairs, and unlimited 100% homely meals counter",
      captionTe: "టీవీ, విశాలమైన డైనింగ్ టేబుల్స్ మరియు పరిశుభ్రమైన ఆహార కౌంటర్",
      image: "public/images/facilities/mess.jpg",
      thumb: "public/images/facilities/mess.jpg"
    },
    {
      id: "washroom",
      category: "Facilities",
      categoryTe: "సౌకర్యాలు",
      title: "Clean Washroom with 24/7 Geyser",
      titleTe: "గీజర్‌తో శుభ్రమైన బాత్‌రూమ్‌లు",
      caption: "Attached sanitized washroom with western toilet, health faucet, and instant hot water geyser",
      captionTe: "పాశ్చాత్య టాయిలెట్, హెల్త్ ఫాసెట్ మరియు 24/7 వేడి నీటి గీజర్‌తో అటాచ్డ్ బాత్‌రూమ్",
      image: "public/images/facilities/bathroom.jpg",
      thumb: "public/images/facilities/bathroom.jpg"
    },
    {
      id: "solar",
      category: "Facilities",
      categoryTe: "సౌకర్యాలు",
      title: "Rooftop Solar Water Heating & Terrace",
      titleTe: "రూఫ్‌టాప్ సోలార్ వాటర్ హీటర్ & టెర్రస్",
      caption: "Eco-friendly rooftop solar water heating system providing 24/7 hot water with scenic hill views",
      captionTe: "24 గంటల వేడి నీటి కోసం ఆధునిక సోలార్ వాటర్ హీటర్ వ్యవస్థ మరియు విశాలమైన టెర్రస్",
      image: "public/images/facilities/solar.jpg",
      thumb: "public/images/facilities/solar.jpg"
    }
  ],

  // Hostel Rules & Regulations
  rules: {
    timings: [
      { rule: "Hostel Main Gate closes at 9:30 PM sharp every night.", ruleTe: "ప్రతి రాత్రి 9:30 గంటలకు ఖచ్చితంగా హాస్టల్ ప్రధాన గేటు మూసివేయబడుతుంది." },
      { rule: "Late entry for college projects or labs requires prior warden permission.", ruleTe: "కాలేజీ ల్యాబ్స్ లేదా ప్రాజెక్ట్ పనుల కోసం ఆలస్యమైతే ముందుగానే వార్డెన్ అనుమతి తీసుకోవాలి." },
      { rule: "Study hours observed strictly from 10:00 PM to 6:00 AM (maintain silence).", ruleTe: "రాత్రి 10:00 నుండి ఉదయం 6:00 వరకు నిశ్శబ్ద సమయం పాటించాలి." }
    ],
    visitors: [
      { rule: "Parents and guardians can meet students in the visitor lounge from 9:00 AM to 7:00 PM.", ruleTe: "తల్లిదండ్రులు ఉదయం 9:00 నుండి రాత్రి 7:00 వరకు విజిటర్స్ లాంజ్‌లో కలవవచ్చు." },
      { rule: "No outsiders or friends are permitted to stay overnight inside student rooms.", ruleTe: "బయటి వ్యక్తులు లేదా స్నేహితులు రాత్రి వేళల్లో గదులలో ఉండటానికి అనుమతి లేదు." },
      { rule: "Female visitors are restricted strictly to the ground floor reception area.", ruleTe: "మహిళా సందర్శకులను గ్రౌండ్ ఫ్లోర్ రిసెప్షన్ వరకు మాత్రమే అనుమతిస్తారు." }
    ],
    dosAndDonts: [
      { type: "do", text: "Switch off fans, lights, and taps when leaving the room.", textTe: "రూమ్ నుండి బయటకు వెళ్ళేటప్పుడు ఫ్యాన్లు, లైట్లు మరియు నల్లాలు బంద్ చేయండి." },
      { type: "do", text: "Keep your room and wardrobe clean and locked when stepping out.", textTe: "మీ గదిని మరియు కప్‌బోర్డ్‌ను శుభ్రంగా ఉంచుకోండి మరియు తాళం వేయండి." },
      { type: "dont", text: "Alcohol, smoking, and any intoxicating substances are strictly prohibited with zero tolerance.", textTe: "ధూమపానం, మద్యం మరియు మత్తు పదార్థాలు పూర్తిగా నిషేధం." },
      { type: "dont", text: "Do not use heavy electrical appliances (immersion rods, electric stoves) inside bedrooms.", textTe: "బెడ్‌రూమ్‌లలో వాటర్ హీటర్ రాడ్లు లేదా ఎలక్ట్రిక్ స్టవ్‌లు ఉపయోగించరాదు." }
    ]
  },

  // Landmarks & Distances from MITS College
  landmarks: [
    {
      name: "MITS College Main Gate",
      nameTe: "MITS కాలేజ్ మెయిన్ గేట్",
      distance: "150 meters",
      distanceTe: "150 మీటర్లు",
      time: "2 mins walk",
      timeTe: "2 నిమిషాల నడక",
      type: "college"
    },
    {
      name: "Angallu RTC Bus Stop",
      nameTe: "అంగళ్లు బస్టాప్",
      distance: "250 meters",
      distanceTe: "250 మీటర్లు",
      time: "3 mins walk",
      timeTe: "3 నిమిషాల నడక",
      type: "transport"
    },
    {
      name: "Sri Sai Medical & Pharmacy",
      nameTe: "శ్రీ సాయి మెడికల్ షాప్",
      distance: "100 meters",
      distanceTe: "100 మీటర్లు",
      time: "1 min walk",
      timeTe: "1 నిమిషం నడక",
      type: "medical"
    },
    {
      name: "Angallu Supermarket & Grocery",
      nameTe: "సూపర్‌మార్కెట్ & కిరాణా స్టోర్",
      distance: "120 meters",
      distanceTe: "120 మీటర్లు",
      time: "2 mins walk",
      timeTe: "2 నిమిషాల నడక",
      type: "grocery"
    },
    {
      name: "Kurabala Kota Govt Hospital & Clinic",
      nameTe: "కురబలకోట ప్రభుత్వ ఆసుపత్రి",
      distance: "800 meters",
      distanceTe: "800 మీటర్లు",
      time: "10 mins walk (3 mins bike)",
      timeTe: "10 నిమిషాల నడక",
      type: "hospital"
    }
  ],

  // Student & Parent Reviews
  testimonials: [
    {
      id: 1,
      name: "K. Sai Charan",
      nameTe: "కె. సాయి చరణ్",
      role: "B.Tech CSE, 3rd Year (MITS)",
      roleTe: "బి.టెక్ సి.ఎస్.ఇ, 3వ సంవత్సరం (MITS)",
      rating: 5,
      avatar: "SC",
      quote: "The 2-minute walking distance to MITS college is a huge blessing during morning 8 AM classes. The Wi-Fi speed is fantastic for coding, and food tastes just like home cooking. Best PG in Angallu!",
      quoteTe: "ఉదయం 8 గంటల క్లాసులకు కేవలం 2 నిమిషాల్లో కాలేజీకి చేరుకోవచ్చు. కోడింగ్ కోసం వై-ఫై స్పీడ్ అద్భుతంగా ఉంది. భోజనం సరిగ్గా ఇంటి రుచిలానే ఉంటుంది. అంగళ్లులో బెస్ట్ పీజీ!"
    },
    {
      id: 2,
      name: "Venkat Rao",
      nameTe: "వెంకట రావు",
      role: "Parent of 1st Year ECE Student",
      roleTe: "1వ సంవత్సరం ECE విద్యార్థి తండ్రి",
      rating: 5,
      avatar: "VR",
      quote: "As a parent sending my son away for B.Tech, safety was my #1 concern. Sathish garu takes care of students like a family elder. The 9:30 PM gate lock and CCTV give us complete peace of mind.",
      quoteTe: "మా అబ్బాయిని మొదటిసారి ఇంట్లో నుంచి పంపించినప్పుడు భద్రత గురించి చాలా భయపడ్డాము. కానీ సతీష్ గారు విద్యార్థులను కుటుంబ సభ్యుడిలా చూసుకుంటున్నారు. 9:30 PM గేట్ టైమింగ్ మరియు సీసీటీవీ మాకు ఎంతో నిశ్చింతను ఇచ్చాయి."
    },
    {
      id: 3,
      name: "P. Rakesh Varma",
      nameTe: "పి. రాకేష్ వర్మ",
      role: "B.Tech Mechanical, Final Year",
      roleTe: "బి.టెక్ మెకానికల్, ఫైనల్ ఇయర్",
      rating: 5,
      avatar: "RV",
      quote: "I have stayed here for 3 years. The Sunday Biryani, daily hot water, power backup during exams, and peaceful atmosphere helped me prepare for campus placements smoothly.",
      quoteTe: "నేను ఇక్కడ 3 సంవత్సరాల నుంచి ఉంటున్నాను. ఆదివారం బిర్యానీ, ప్రతిరోజూ వేడి నీరు, ఇన్వర్టర్ బ్యాకప్ చాలా బాగుంటాయి. క్యాంపస్ ప్లేస్‌మెంట్స్ ప్రిపరేషన్‌కు ఇది సరైన హాస్టల్."
    }
  ],

  // FAQ Section
  faqs: [
    {
      q: "What are the room sharing options and monthly rents?",
      qTe: "రూమ్ షేరింగ్ రకాలు మరియు నెలవారీ అద్దె వివరాలు ఏమిటి?",
      a: "We offer 2 Sharing Executive Room at ₹7,000 / month, 3 Sharing Comfort Room at ₹5,000 / month, and 4 Sharing Economy Room at ₹5,000 / month per student. All rents include 3 homely meals, 24/7 hot water geyser, high-speed Wi-Fi, and power backup.",
      aTe: "మా వద్ద 2 షేరింగ్ ఎగ్జిక్యూటివ్ గది నెలకు ₹7,000, 3 షేరింగ్ కంఫర్ట్ గది నెలకు ₹5,000, మరియు 4 షేరింగ్ ఎకానమీ గది నెలకు ₹5,000. అన్ని అద్దెలలో 3 పూటలా భోజనం, వేడి నీటి గీజర్, హై-స్పీడ్ వై-ఫై మరియు ఇన్వర్టర్ బ్యాకప్ ఉంటాయి."
    },
    {
      q: "Is the security deposit refundable?",
      qTe: "సెక్యూరిటీ డిపాజిట్ తిరిగి ఇస్తారా?",
      a: "Yes, 100% of the ₹3,000 security deposit is refundable when you vacate the hostel, provided a 30-day prior notice is given and room items are intact.",
      aTe: "అవును, మీరు ఖాళీ చేసే సమయంలో 30 రోజుల ముందు నోటీసు ఇస్తే మరియు వస్తువులకు నష్టం జరగకపోతే ₹3,000 సెక్యూరిటీ డిపాజిట్ పూర్తిగా వాపస్ ఇవ్వబడుతుంది."
    },
    {
      q: "What are the mess timings, and can I pack lunch for college?",
      qTe: "భోజన సమయాలు ఏమిటి? కాలేజీకి లంచ్ బాక్స్ ప్యాక్ చేసుకోవచ్చా?",
      a: "Yes! Fresh breakfast is served from 7:30 AM to 9:00 AM. For lunch, students can either dine in between 12:30 PM - 2:00 PM or get their lunch boxes packed in the morning before leaving for MITS campus.",
      aTe: "అవును! ఉదయం 7:30 నుండి 9:00 వరకు టిఫిన్ ఉంటుంది. మధ్యాహ్నం 12:30 - 2:00 మధ్య తినవచ్చు లేదా ఉదయమే కాలేజీకి లంచ్ బాక్స్ ప్యాక్ చేసుకుని వెళ్ళవచ్చు."
    },
    {
      q: "What is the night gate closing time?",
      qTe: "రాత్రి వేళల్లో గేటు మూసివేసే సమయం ఎంత?",
      a: "The main hostel gate is strictly locked at 9:30 PM for student safety. In case of academic projects, college fest duties, or train arrival, students must inform the warden in advance.",
      aTe: "విద్యార్థుల భద్రత దృష్ట్యా రాత్రి 9:30 గంటలకు గేటు మూసివేయబడుతుంది. ప్రాజెక్ట్ వర్క్ లేదా ప్రయాణాల వల్ల ఆలస్యమైతే ముందుగానే వార్డెన్‌కు సమాచారం ఇవ్వాలి."
    },
    {
      q: "Are friends or parents allowed to stay in student rooms?",
      qTe: "స్నేహితులు లేదా తల్లిదండ్రులు రూమ్‌లో బస చేయవచ్చా?",
      a: "Parents are warmly welcome in the ground floor visitor lounge from 9:00 AM to 7:00 PM. However, to preserve study privacy and room security, overnight stays for outsiders or friends inside student rooms are not permitted.",
      aTe: "తల్లిదండ్రులు ఉదయం 9:00 నుండి రాత్రి 7:00 వరకు విజిటర్స్ లాంజ్‌లో ఉండవచ్చు. ఇతర విద్యార్థుల గోప్యత మరియు భద్రత కోసం స్నేహితులు రాత్రి బస చేయడానికి అనుమతి లేదు."
    },
    {
      q: "Is power backup available during power cuts?",
      qTe: "కరెంట్ పోయినప్పుడు పవర్ బ్యాకప్ ఉందా?",
      a: "Yes, we have high-capacity commercial inverters that power ceiling fans, room lights, and common Wi-Fi routers uninterruptedly throughout power failures.",
      aTe: "అవును, కరెంట్ పోయినప్పుడు కూడా ఫ్యాన్లు, రూమ్ లైట్లు మరియు వై-ఫై నిరంతరాయంగా పనిచేయడానికి ఇన్వర్టర్ పవర్ బ్యాకప్ ఉంది."
    },
    {
      q: "How does the laundry/washing facility work?",
      qTe: "బట్టలు ఉతుక్కోవడానికి వాషింగ్ మెషీన్ సదుపాయం ఎలా ఉంది?",
      a: "Students have access to fully automatic washing machines on the terrace area along with ample sheltered clothesline space for drying.",
      aTe: "టెర్రస్‌పై ఆటోమేటిక్ వాషింగ్ మెషీన్లు అందుబాటులో ఉన్నాయి. బట్టలు ఆరబెట్టుకోవడానికి విశాలమైన స్థలం ఉంది."
    },
    {
      q: "What is the notice period before vacating?",
      qTe: "హాస్టల్ ఖాళీ చేయడానికి ఎన్ని రోజుల ముందు చెప్పాలి?",
      a: "A 30-day notice is required before vacating. This ensures smooth deposit settlement and handover inspection.",
      aTe: "హాస్టల్ ఖాళీ చేయడానికి కనీసం 30 రోజుల ముందు వార్డెన్‌కు తెలపాలి. దీనివల్ల డిపాజిట్ రీఫండ్ త్వరగా పూర్తవుతుంది."
    },
    {
      q: "How far is the hostel from MITS College departments?",
      qTe: "MITS కాలేజ్ డిపార్ట్‌మెంట్‌ల నుండి హాస్టల్ ఎంత దూరంలో ఉంది?",
      a: "The PG is located right opposite the MITS College access street, exactly 150 meters from the college gate (just a 2-minute walk). You can easily walk back for lunch during college breaks!",
      aTe: "ఈ పీజీ MITS కాలేజ్ వీధికి సరిగ్గా ఎదురుగా కేవలం 150 మీటర్ల దూరంలో (2 నిమిషాల నడక) ఉంది. కాలేజీ లంచ్ బ్రేక్‌లో కూడా సులభంగా నడుచుకుంటూ వచ్చి భోజనం చేయవచ్చు!"
    }
  ]
};

// Admin password SHA-256 hash (Never store plaintext password)
const ADMIN_PASSWORD_HASH = "a79b44494ba830b7e8506959e9ca4fcefea074685f4c798ead557f704eed76da";
window.ADMIN_PASSWORD_HASH = ADMIN_PASSWORD_HASH;
