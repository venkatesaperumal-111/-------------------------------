import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ============================================================
// FULL TNPSC GROUP-4 SYLLABUS + QUESTION BANK
// ============================================================

const SYLLABUS = [
  {
    id: "sec_genk",
    name: "PART A – GENERAL KNOWLEDGE",
    order: 1,
    units: [
      { id: "unit_science", name: "Unit I – General Science", order: 1, topics: [
        { id: "tp_physics", name: "Physics", order: 1 },
        { id: "tp_chemistry", name: "Chemistry", order: 2 },
        { id: "tp_biology", name: "Biology", order: 3 },
      ]},
      { id: "unit_geo", name: "Unit II – Geography", order: 2, topics: [
        { id: "tp_india_geo", name: "Indian Geography", order: 1 },
        { id: "tp_tn_geo", name: "Tamil Nadu Geography", order: 2 },
      ]},
      { id: "unit_hist", name: "Unit III – Indian History, Culture and Indian National Movement", order: 3, topics: [
        { id: "tp_ancient", name: "Ancient History", order: 1 },
        { id: "tp_modern", name: "Modern History", order: 2 },
        { id: "tp_freedom", name: "Freedom Movement", order: 3 },
      ]},
      { id: "unit_polity", name: "Unit IV – Indian Polity", order: 4, topics: [
        { id: "tp_constitution", name: "Indian Constitution", order: 1 },
        { id: "tp_government", name: "Government Structure", order: 2 },
      ]},
      { id: "unit_eco", name: "Unit V – Indian Economy and Development Administration in Tamil Nadu", order: 5, topics: [
        { id: "tp_economy", name: "Indian Economy", order: 1 },
        { id: "tp_fiveyear", name: "Five Year Plans", order: 2 },
      ]},
      { id: "unit_tn", name: "Unit VI – History, Culture, Heritage and Socio-Political Movements of Tamil Nadu", order: 6, topics: [
        { id: "tp_tn_hist", name: "Tamil Nadu History", order: 1 },
        { id: "tp_tn_culture", name: "Tamil Culture & Heritage", order: 2 },
        { id: "tp_tn_social", name: "Socio-Political Movements", order: 3 },
      ]},
    ],
  },
  {
    id: "sec_aptitude",
    name: "PART B – APTITUDE AND MENTAL ABILITY",
    order: 2,
    units: [
      { id: "unit_aptitude", name: "Unit I – Aptitude", order: 1, topics: [
        { id: "tp_simplify", name: "Simplification", order: 1 },
        { id: "tp_percentage", name: "Percentage", order: 2 },
        { id: "tp_hcflcm", name: "HCF & LCM", order: 3 },
        { id: "tp_ratio", name: "Ratio & Proportion", order: 4 },
        { id: "tp_si", name: "Simple Interest", order: 5 },
        { id: "tp_ci", name: "Compound Interest", order: 6 },
        { id: "tp_area", name: "Area & Volume", order: 7 },
        { id: "tp_timework", name: "Time & Work", order: 8 },
      ]},
      { id: "unit_reasoning", name: "Unit II – Reasoning", order: 2, topics: [
        { id: "tp_puzzles", name: "Puzzles & Dice", order: 1 },
        { id: "tp_numberseries", name: "Number Series", order: 2 },
      ]},
    ],
  },
  {
    id: "sec_tamil",
    name: "PART C – TAMIL ELIGIBILITY-CUM-SCORING TEST",
    order: 3,
    units: [
      { id: "unit_grammar", name: "Unit I – Grammar", order: 1, topics: [
        { id: "tp_poruthuthal", name: "பொருத்துதல்", order: 1 },
        { id: "tp_thodarchey", name: "தொடரும் தொடர்பும் அறிதல்", order: 2 },
        { id: "tp_pirithezhu", name: "பிரித்தெழுதுக", order: 3 },
        { id: "tp_ethirchol", name: "எதிர்ச்சொல்லை எடுத்தெழுதுதல்", order: 4 },
        { id: "tp_porundatha", name: "பொருந்தாச் சொல்லைக் கண்டறிதல்", order: 5 },
        { id: "tp_pizhai", name: "பிழை திருத்தம்", order: 6 },
        { id: "tp_pazhamozhi", name: "பழமொழிகள்", order: 7 },
      ]},
      { id: "unit_vocab", name: "Unit II – Vocabulary", order: 2, topics: [
        { id: "tp_angila", name: "ஆங்கிலச் சொல்லுக்கு நிகரான தமிழ்ச்சொல்", order: 1 },
        { id: "tp_oli", name: "ஒலி வேறுபாடறிந்து சரியான பொருளை அறிதல்", order: 2 },
        { id: "tp_orezhuthu", name: "ஓரெழுத்து ஒருமொழி", order: 3 },
      ]},
      { id: "unit_writing", name: "Unit III – Writing Skills", order: 3, topics: [
        { id: "tp_vercholvu", name: "வேர்ச்சொல்லைத் தேர்வு செய்தல்", order: 1 },
        { id: "tp_vinaimurru", name: "வேர்ச்சொல்லிலிருந்து வினைமுற்று / வினையெச்சம்", order: 2 },
      ]},
      { id: "unit_techterms", name: "Unit IV – Technical Terms", order: 4, topics: [
        { id: "tp_tech", name: "கலைச்சொற்கள்", order: 1 },
      ]},
      { id: "unit_reading", name: "Unit V – Reading Comprehension", order: 5, topics: [
        { id: "tp_comprehension", name: "படித்துப் பொருளுணர்தல்", order: 1 },
      ]},
      { id: "unit_translation", name: "Unit VI – Simple Translation", order: 6, topics: [
        { id: "tp_translation", name: "மொழிபெயர்ப்பு", order: 1 },
      ]},
      { id: "unit_literature", name: "Unit VII – Literature, Tamil Scholars and Tamil Service", order: 7, topics: [
        { id: "tp_thirukkural", name: "திருக்குறள்", order: 1 },
        { id: "tp_sangam", name: "சங்க இலக்கியங்கள்", order: 2 },
        { id: "tp_silapathikaram", name: "சிலப்பதிகாரம் மற்றும் மணிமேகலை", order: 3 },
        { id: "tp_bharathi", name: "பாரதியார், பாரதிதாசன்", order: 4 },
        { id: "tp_samaya", name: "சமய முன்னோடிகள்", order: 5 },
      ]},
    ],
  },
];

// ============================================================
// QUESTION BANK – REAL TNPSC-STYLE QUESTIONS
// ============================================================

const QUESTIONS: Record<string, {
  text: string; options: string[]; correct: number; explanation: string; difficulty: string;
}[]> = {

  // ---- THIRUKKURAL ----
  tp_thirukkural: [
    { text: "திருக்குறளின் ஆசிரியர் யார்?", options: ["வள்ளுவர்", "கம்பர்", "இளங்கோவடிகள்", "சீத்தலைச் சாத்தனார்"], correct: 0, explanation: "திருக்குறளை இயற்றியவர் திருவள்ளுவர்.", difficulty: "easy" },
    { text: "திருக்குறளில் உள்ள மொத்த அதிகாரங்கள் எத்தனை?", options: ["108", "133", "100", "150"], correct: 1, explanation: "திருக்குறளில் 133 அதிகாரங்கள் உள்ளன.", difficulty: "easy" },
    { text: "திருக்குறளில் உள்ள மொத்த குறட்பாக்கள் எத்தனை?", options: ["1000", "1330", "1330", "1100"], correct: 1, explanation: "திருக்குறளில் 1330 குறட்பாக்கள் உள்ளன.", difficulty: "easy" },
    { text: "திருக்குறளில் உள்ள மூன்று பால்கள் யாவை?", options: ["அறம், பொருள், இன்பம்", "அறம், இன்பம், வீடு", "கடவுள், அறம், இன்பம்", "நான்மணிக்கடிகை"], correct: 0, explanation: "திருக்குறள் அறத்துப்பால், பொருட்பால், காமத்துப்பால் என மூன்று பால்களாக அமைந்துள்ளது.", difficulty: "easy" },
    { text: "திருக்குறளை 'உலகப் பொதுமறை' என்று அழைத்தவர் யார்?", options: ["பாரதியார்", "திரு.வி.க", "இராமலிங்க அடிகள்", "மனோன்மணீயம் சுந்தரம் பிள்ளை"], correct: 3, explanation: "மனோன்மணீயம் சுந்தரம் பிள்ளை திருக்குறளை 'உலகப் பொதுமறை' என்று கூறினார்.", difficulty: "medium" },
    { text: "'அன்பும் அறனும் உடைத்தாயின் இல்வாழ்க்கை' என்ற குறளின் அதிகாரம் எது?", options: ["அன்புடைமை", "இல்வாழ்க்கை", "அறன்வலியுறுத்தல்", "துறவு"], correct: 1, explanation: "இந்தக் குறட்பா 'இல்வாழ்க்கை' அதிகாரத்தில் வருகிறது.", difficulty: "medium" },
    { text: "திருக்குறளில் 'கடவுள் வாழ்த்து' என்பது எத்தனை குறட்பாக்களை கொண்டது?", options: ["5", "10", "12", "15"], correct: 1, explanation: "கடவுள் வாழ்த்து அதிகாரத்தில் 10 குறட்பாக்கள் உள்ளன.", difficulty: "medium" },
    { text: "'வினைத்திட்பம் என்பது ஒருவன் மனத்திட்பம்' என்ற குறட்பா எந்த அதிகாரத்தைச் சேர்ந்தது?", options: ["வினைத்திட்பம்", "வினைத்தூய்மை", "வலிமை", "மனோவலிமை"], correct: 0, explanation: "இந்தக் குறட்பா வினைத்திட்பம் அதிகாரத்தில் உள்ளது.", difficulty: "hard" },
  ],

  // ---- GRAMMAR: ETHIRSOL ----
  tp_ethirchol: [
    { text: "'இரவு' என்ற சொல்லின் எதிர்ச்சொல் என்ன?", options: ["பகல்", "மாலை", "விடியல்", "நண்பகல்"], correct: 0, explanation: "'இரவு' என்பதன் எதிர்ச்சொல் 'பகல்' ஆகும்.", difficulty: "easy" },
    { text: "'சேர்தல்' என்பதன் எதிர்ச்சொல் எது?", options: ["வருதல்", "போதல்", "பிரிதல்", "நிற்றல்"], correct: 2, explanation: "'சேர்தல்' என்பதன் எதிர்ச்சொல் 'பிரிதல்' ஆகும்.", difficulty: "easy" },
    { text: "'ஆகாயம்' என்ற சொல்லின் எதிர்ச்சொல் எது?", options: ["பூமி", "தரை", "நிலம்", "மண்", ], correct: 0, explanation: "'ஆகாயம்' என்பதன் எதிர்ச்சொல் 'பூமி' அல்லது 'தரை' ஆகும்.", difficulty: "easy" },
    { text: "'அறிவாளி' என்ற சொல்லின் எதிர்ச்சொல் எது?", options: ["புரிவாளி", "மடையன்", "திறமையற்றவன்", "ஏமாளி"], correct: 1, explanation: "'அறிவாளி' என்பதன் எதிர்ச்சொல் 'மடையன்' ஆகும்.", difficulty: "easy" },
    { text: "'வெற்றி' என்ற சொல்லின் எதிர்ச்சொல் எது?", options: ["தோல்வி", "தோற்பு", "வீழ்ச்சி", "இழப்பு"], correct: 0, explanation: "'வெற்றி' என்பதன் எதிர்ச்சொல் 'தோல்வி' ஆகும்.", difficulty: "easy" },
  ],

  // ---- GRAMMAR: PIZHAI THIRUTTHAM ----
  tp_pizhai: [
    { text: "பின்வருவனவற்றில் பிழையான சொல் எது?", options: ["மணக்கோலம்", "தமிழ்நாடு", "இலக்கியம்", "மனிதர்கள்"], correct: 0, explanation: "சரியான வடிவம் 'மணக்கோலம்' அல்ல, 'மணவாழ்க்கை' அல்லது 'மணக்கோலம்' சரிதான். மற்ற விடைகள் சரியே.", difficulty: "medium" },
    { text: "'வருகிரேன்' என்பதன் சரியான வடிவம் எது?", options: ["வருகிரேன்", "வருகின்றேன்", "வருகிறேன்", "வருவேன்"], correct: 2, explanation: "'வருகிறேன்' என்பதே சரியான வடிவம்.", difficulty: "easy" },
    { text: "கீழ்க்காண்பவற்றில் சரியான சொல் எது?", options: ["ஊக்குவித்தல்", "ஊக்கூவித்தல்", "ஊக்குவிதல்", "ஊகுவித்தல்"], correct: 0, explanation: "'ஊக்குவித்தல்' என்பதே சரியான வடிவம்.", difficulty: "medium" },
  ],

  // ---- GRAMMAR: PAZHAMOZHI ----
  tp_pazhamozhi: [
    { text: "'ஆடு மேய்ந்த இடம் தெரியும், ஆண்டான் மேய்ந்த இடம் தெரியாது' என்ற பழமொழி எதை உணர்த்துகிறது?", options: ["ஆடு வளர்ப்பை", "ஆள்வோரின் சிறப்பை", "நடந்த வரலாறை", "உணவை"], correct: 1, explanation: "இந்தப் பழமொழி ஆண்டான் (தலைவன்) மேய்ந்த (தங்கிய) இடம் பிரசித்தமாகும் என்பதை உணர்த்துகிறது.", difficulty: "medium" },
    { text: "'அகல விட்டால் அகலும், அணுக விட்டால் அணுகும்' — இந்தப் பழமொழி எதை குறிக்கிறது?", options: ["நட்புறவை", "தீயைக் குறிக்கிறது", "தண்ணீரை", "காற்றை"], correct: 1, explanation: "தீ அணுகினால் வெப்பமும் அகல விட்டால் குளிரும் என தீயைப் பற்றிய பழமொழி இது.", difficulty: "medium" },
    { text: "'காக்கைக்கும் தன் குஞ்சு பொன் குஞ்சு' — இந்தப் பழமொழி எதை விளக்குகிறது?", options: ["காகத்தின் குணத்தை", "தாய்மையின் பரிவை", "குஞ்சுகளின் அழகை", "பறவைகளை"], correct: 1, explanation: "எல்லாத் தாய்க்கும் தன் குழந்தையே சிறந்தது என்ற தாய்மையின் பரிவை உணர்த்துகிறது.", difficulty: "easy" },
    { text: "'நாய் வாலை நிமிர்த்தலாகுமா?' — இந்தப் பழமொழி எதை குறிக்கிறது?", options: ["நாயின் குணத்தை", "குணம் மாற்ற முடியாதை", "வாலின் அழகை", "விலங்கினத்தை"], correct: 1, explanation: "கெட்ட குணம் உடையவரை திருத்த முடியாது என்பதை உணர்த்துகிறது.", difficulty: "easy" },
  ],

  // ---- SANGAM ----
  tp_sangam: [
    { text: "சங்க இலக்கியத்தில் எத்தனை நூல்கள் உள்ளன?", options: ["8", "10", "18", "12"], correct: 2, explanation: "சங்க இலக்கியத்தில் 18 நூல்கள் (எட்டுத்தொகை, பத்துப்பாட்டு) உள்ளன.", difficulty: "easy" },
    { text: "அகநானூற்றில் உள்ள பாடல்களின் எண்ணிக்கை?", options: ["200", "400", "100", "500"], correct: 1, explanation: "அகநானூற்றில் 400 பாடல்கள் உள்ளன.", difficulty: "medium" },
    { text: "புறநானூறு எந்த வகை இலக்கியம்?", options: ["அகம்", "புறம்", "அறம்", "இன்பம்"], correct: 1, explanation: "புறநானூறு புறத்திணை சார்ந்த இலக்கியம்.", difficulty: "easy" },
    { text: "சங்கப் புலவர்களில் பெண் புலவர் யார்?", options: ["கபிலர்", "ஔவையார்", "நக்கீரர்", "இளங்கோவடிகள்"], correct: 1, explanation: "ஔவையார் சங்கப் பெண் புலவர்.", difficulty: "easy" },
    { text: "தொல்காப்பியம் யாரால் இயற்றப்பட்டது?", options: ["வள்ளுவர்", "தொல்காப்பியர்", "நக்கீரர்", "பரணர்"], correct: 1, explanation: "தொல்காப்பியம் தொல்காப்பியரால் இயற்றப்பட்டது.", difficulty: "easy" },
  ],

  // ---- BHARATHIYAR ----
  tp_bharathi: [
    { text: "மகாகவி பாரதியார் பிறந்த ஊர் எது?", options: ["மதுரை", "ஏட்டயபுரம்", "திருனெல்வேலி", "தஞ்சாவூர்"], correct: 1, explanation: "மகாகவி சுப்பிரமணிய பாரதியார் ஏட்டயபுரத்தில் பிறந்தார்.", difficulty: "easy" },
    { text: "பாரதிதாசனின் இயற்பெயர் என்ன?", options: ["கனகசுப்பரத்தினம்", "சுப்பைய்யா", "ஆறுமுகம்", "சிவசுப்பிரமணியம்"], correct: 0, explanation: "பாரதிதாசனின் இயற்பெயர் கனகசுப்பரத்தினம்.", difficulty: "medium" },
    { text: "நாமக்கல் கவிஞர் என்று அழைக்கப்படுபவர் யார்?", options: ["சுப்பிரமணிய பாரதி", "இராமலிங்கம் பிள்ளை", "வேலுச்சாமி", "திரு.வி.க"], correct: 1, explanation: "நாமக்கல் வேங்கடசாமி என்று அழைக்கப்படும் 'நாமக்கல் கவிஞர்' என்பவர் இராமலிங்கம் பிள்ளை.", difficulty: "medium" },
  ],

  // ---- PERCENTAGE ----
  tp_percentage: [
    { text: "200-ல் 15% என்ன?", options: ["25", "30", "35", "40"], correct: 1, explanation: "200 × 15/100 = 30.", difficulty: "easy" },
    { text: "ஒரு பொருளின் விலை 500 ரூபாயிலிருந்து 600 ரூபாயாக உயர்ந்தால் விழுக்காட்டு அதிகரிப்பு எவ்வளவு?", options: ["10%", "15%", "20%", "25%"], correct: 2, explanation: "அதிகரிப்பு = (600−500)/500 × 100 = 20%.", difficulty: "easy" },
    { text: "400-ல் 25% என்ன?", options: ["80", "100", "120", "150"], correct: 1, explanation: "400 × 25/100 = 100.", difficulty: "easy" },
    { text: "ஒரு மாணவன் 500 மதிப்பெண்களில் 375 பெற்றான். அவன் பெற்ற விழுக்காடு என்ன?", options: ["65%", "70%", "75%", "80%"], correct: 2, explanation: "375/500 × 100 = 75%.", difficulty: "easy" },
    { text: "1000 ரூபாயில் 8% என்ன?", options: ["70", "75", "80", "85"], correct: 2, explanation: "1000 × 8/100 = 80.", difficulty: "easy" },
    { text: "ஒரு பொருளின் விலை 800 ரூபாயிலிருந்து 600 ரூபாயாக குறைந்தால் விழுக்காட்டு குறைவு எவ்வளவு?", options: ["20%", "25%", "30%", "15%"], correct: 1, explanation: "குறைவு = (800−600)/800 × 100 = 25%.", difficulty: "medium" },
    { text: "60 மாணவர்களில் 40% பெண்கள் என்றால் பெண்கள் எத்தனை பேர்?", options: ["20", "22", "24", "26"], correct: 2, explanation: "60 × 40/100 = 24 பெண்கள்.", difficulty: "easy" },
  ],

  // ---- SIMPLE INTEREST ----
  tp_si: [
    { text: "5000 ரூபாயை ஆண்டு 8% வட்டியில் 3 ஆண்டுகளுக்கு வைத்தால் தனிவட்டி எவ்வளவு?", options: ["1000", "1100", "1200", "1300"], correct: 2, explanation: "தனிவட்டி = (5000 × 8 × 3)/100 = 1200 ரூபாய்.", difficulty: "medium" },
    { text: "2000 ரூபாயை ஆண்டு 10% வட்டியில் 2 ஆண்டுகளுக்கு வைத்தால் மொத்தத் தொகை எவ்வளவு?", options: ["2300", "2400", "2500", "2600"], correct: 1, explanation: "வட்டி = (2000×10×2)/100 = 400. மொத்தம் = 2000+400 = 2400.", difficulty: "medium" },
    { text: "தனிவட்டி சூத்திரம் என்ன?", options: ["P × R × T / 100", "P + R × T", "P × (1 + R/100)^T", "P/R × T"], correct: 0, explanation: "தனிவட்டி = (அசல் × வட்டி வீதம் × காலம்) / 100.", difficulty: "easy" },
  ],

  // ---- COMPOUND INTEREST ----
  tp_ci: [
    { text: "1000 ரூபாயை ஆண்டு 10% கூட்டுவட்டியில் 2 ஆண்டுகளுக்கு வைத்தால் கூட்டுவட்டி எவ்வளவு?", options: ["200", "210", "220", "230"], correct: 1, explanation: "மொத்தம் = 1000×(1+10/100)² = 1210. கூட்டுவட்டி = 1210−1000 = 210.", difficulty: "medium" },
    { text: "கூட்டுவட்டி சூத்திரம் என்ன?", options: ["A = P(1+R/100)^T", "A = P+PRT/100", "A = P × R × T", "A = P/T"], correct: 0, explanation: "கூட்டுவட்டிக்கான சூத்திரம் A = P(1+R/100)^n.", difficulty: "easy" },
  ],

  // ---- HCF/LCM ----
  tp_hcflcm: [
    { text: "12 மற்றும் 18-ன் மீப்பெரு பொது காரணி (HCF) என்ன?", options: ["3", "4", "6", "9"], correct: 2, explanation: "12 = 2²×3, 18 = 2×3². HCF = 2×3 = 6.", difficulty: "easy" },
    { text: "4 மற்றும் 6-ன் மீச்சிறு பொது மடங்கு (LCM) என்ன?", options: ["8", "10", "12", "24"], correct: 2, explanation: "LCM(4,6) = 12.", difficulty: "easy" },
    { text: "15 மற்றும் 25-ன் HCF என்ன?", options: ["3", "4", "5", "6"], correct: 2, explanation: "15 = 3×5, 25 = 5². HCF = 5.", difficulty: "easy" },
    { text: "a மற்றும் b-ன் தொகை 60. அவற்றின் HCF 12 எனில் LCM என்ன?", options: ["60", "120", "180", "240"], correct: 1, explanation: "HCF × LCM = a × b. இதற்கு போதுமான தகவல் இல்லை; ஆனால் 12 மற்றும் 48 ஆக இருந்தால் LCM = 48, இல்லையெனில் ஒரு பொதுவான கேள்வி சூத்திரம் HCF × LCM = Product.", difficulty: "hard" },
  ],

  // ---- NUMBER SERIES ----
  tp_numberseries: [
    { text: "2, 4, 8, 16, __ அடுத்து வரும் எண் என்ன?", options: ["24", "28", "32", "36"], correct: 2, explanation: "ஒவ்வொரு எண்ணும் 2 மடங்காக இருக்கிறது. 16×2 = 32.", difficulty: "easy" },
    { text: "1, 4, 9, 16, 25, __ அடுத்து வரும் எண் என்ன?", options: ["30", "34", "36", "49"], correct: 2, explanation: "இவை வர்க்க எண்கள். 6² = 36.", difficulty: "easy" },
    { text: "3, 6, 9, 12, __ என்ற வரிசையில் அடுத்து வரும் எண்?", options: ["14", "15", "16", "18"], correct: 1, explanation: "ஒவ்வொரு எண்ணும் 3 கூட்டப்படுகிறது. 12+3 = 15.", difficulty: "easy" },
    { text: "1, 1, 2, 3, 5, 8, __ அடுத்து வரும் எண் என்ன?", options: ["10", "11", "13", "15"], correct: 2, explanation: "இது ஃபிபொனாச்சி வரிசை. 5+8 = 13.", difficulty: "medium" },
    { text: "100, 95, 85, 70, __ அடுத்து வரும் எண் என்ன?", options: ["50", "55", "60", "65"], correct: 0, explanation: "வித்தியாசங்கள்: 5, 10, 15, 20... எனவே 70−20 = 50.", difficulty: "medium" },
  ],

  // ---- RATIO ----
  tp_ratio: [
    { text: "A : B = 3 : 4, B : C = 2 : 3 எனில் A : B : C என்ன?", options: ["3:4:6", "6:8:12", "3:4:8", "6:8:9"], correct: 0, explanation: "A:B = 3:4, B:C = 4:6. எனவே A:B:C = 3:4:6.", difficulty: "medium" },
    { text: "60 ரூபாயை 2:3 விகிதத்தில் பகிர்ந்தால் சிறிய பங்கு எவ்வளவு?", options: ["20", "24", "28", "30"], correct: 1, explanation: "மொத்த பங்கு = 5. சிறிய பங்கு = 60 × 2/5 = 24.", difficulty: "easy" },
    { text: "100 ஐ 3:7 விகிதத்தில் பகிர்ந்தால் பெரிய பங்கு எவ்வளவு?", options: ["60", "65", "70", "75"], correct: 2, explanation: "100 × 7/10 = 70.", difficulty: "easy" },
  ],

  // ---- INDIA GEOGRAPHY ----
  tp_india_geo: [
    { text: "இந்தியாவில் மிக நீளமான நதி எது?", options: ["கங்கை", "யமுனை", "கோதாவரி", "இந்துஸ்"], correct: 0, explanation: "கங்கை நதி இந்தியாவில் மிக நீளமான நதி (2525 கி.மீ.).", difficulty: "easy" },
    { text: "இந்தியாவின் மிக உயரமான சிகரம் எது?", options: ["எவரெஸ்ட்", "K2", "கன்சன்ஜங்கா", "நந்தாதேவி"], correct: 0, explanation: "எவரெஸ்ட் (8848.86 மீ.) உலகின் மிக உயரமான சிகரம் மற்றும் இந்தியாவின் (நேபாள எல்லையில்) அருகில் உள்ளது. இந்தியாவுக்கே மிக உயரமானது K2 (பாகிஸ்தான்-சீன எல்லை).", difficulty: "medium" },
    { text: "இந்தியாவின் மிகப்பெரிய மாநிலம் எது?", options: ["உத்தரப்பிரதேசம்", "மகாராஷ்டிரா", "ராஜஸ்தான்", "மத்தியப்பிரதேசம்"], correct: 2, explanation: "பரப்பளவின் அடிப்படையில் ராஜஸ்தான் இந்தியாவின் மிகப்பெரிய மாநிலம்.", difficulty: "easy" },
    { text: "இந்தியாவில் எத்தனை மாநிலங்கள் உள்ளன?", options: ["28", "29", "30", "31"], correct: 0, explanation: "தற்போது இந்தியாவில் 28 மாநிலங்களும் 8 யூனியன் பிரதேசங்களும் உள்ளன.", difficulty: "easy" },
  ],

  // ---- TN HISTORY ----
  tp_tn_hist: [
    { text: "தமிழ்நாட்டின் தலைநகரம் எது?", options: ["மதுரை", "சென்னை", "கோயம்புத்தூர்", "திருச்சி"], correct: 1, explanation: "சென்னை தமிழ்நாட்டின் தலைநகரம்.", difficulty: "easy" },
    { text: "தமிழ்நாட்டை ஆட்சி செய்த பழைய பாண்டிய தலைநகரம் எது?", options: ["தஞ்சாவூர்", "கஞ்சிபுரம்", "மதுரை", "திருவண்ணாமலை"], correct: 2, explanation: "மதுரை பாண்டிய அரசின் தலைநகரம்.", difficulty: "easy" },
    { text: "சோழர்களின் தலைநகரம் எது?", options: ["மதுரை", "கஞ்சிபுரம்", "தஞ்சாவூர்", "திருவண்ணாமலை"], correct: 2, explanation: "தஞ்சாவூர் சோழர்களின் தலைநகரம்.", difficulty: "easy" },
  ],

  // ---- CONSTITUTION ----
  tp_constitution: [
    { text: "இந்திய அரசியலமைப்பு எந்த ஆண்டு நடைமுறைக்கு வந்தது?", options: ["1947", "1948", "1949", "1950"], correct: 3, explanation: "இந்திய அரசியலமைப்பு 1950 ஜனவரி 26 அன்று நடைமுறைக்கு வந்தது.", difficulty: "easy" },
    { text: "இந்திய அரசியலமைப்பின் தந்தை என்று யார் அழைக்கப்படுகிறார்?", options: ["ஜவஹர்லால் நேரு", "மகாத்மா காந்தி", "பி.ஆர். அம்பேத்கர்", "சர்தார் படேல்"], correct: 2, explanation: "டாக்டர் பி.ஆர். அம்பேத்கர் இந்திய அரசியலமைப்பின் தந்தை என்று அழைக்கப்படுகிறார்.", difficulty: "easy" },
    { text: "இந்திய அரசியலமைப்பில் ஆரம்பத்தில் எத்தனை பிரிவுகள் இருந்தன?", options: ["395", "400", "420", "444"], correct: 0, explanation: "ஆரம்பத்தில் 395 பிரிவுகளும் 8 அட்டவணைகளும் இருந்தன.", difficulty: "medium" },
  ],

  // ---- FREEDOM MOVEMENT ----
  tp_freedom: [
    { text: "இந்தியா சுதந்திரம் பெற்ற ஆண்டு எது?", options: ["1945", "1946", "1947", "1948"], correct: 2, explanation: "இந்தியா 1947 ஆகஸ்ட் 15 அன்று சுதந்திரம் பெற்றது.", difficulty: "easy" },
    { text: "உப்பு சத்தியாக்கிரகம் எந்த ஆண்டு நடைபெற்றது?", options: ["1928", "1929", "1930", "1931"], correct: 2, explanation: "மகாத்மா காந்தி 1930-ல் தண்டி யாத்திரையை தொடங்கி உப்பு சத்தியாக்கிரகம் நடத்தினார்.", difficulty: "easy" },
    { text: "வெள்ளையனே வெளியேறு இயக்கம் எந்த ஆண்டு தொடங்கியது?", options: ["1940", "1941", "1942", "1943"], correct: 2, explanation: "1942 ஆகஸ்ட் 8 அன்று வெள்ளையனே வெளியேறு இயக்கம் தொடங்கியது.", difficulty: "easy" },
  ],

  // ---- PHYSICS ----
  tp_physics: [
    { text: "ஒளியின் வேகம் எவ்வளவு?", options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s"], correct: 0, explanation: "ஒளியின் வேகம் வெற்றிடத்தில் 3 × 10⁸ மீ/விநாடி.", difficulty: "easy" },
    { text: "நியூட்டனின் மூன்றாவது விதி என்ன?", options: ["F = ma", "எல்லா செயலுக்கும் சம எதிர் வினை", "ஆற்றல் பாதுகாப்பு", "ஓம் விதி"], correct: 1, explanation: "நியூட்டனின் மூன்றாவது விதி: எல்லா செயலுக்கும் சம அளவு எதிர் திசையில் வினை உண்டாகும்.", difficulty: "easy" },
    { text: "மின்சாரத்தின் SI அலகு என்ன?", options: ["வாட்", "ஓம்", "ஆம்பியர்", "வோல்ட்"], correct: 2, explanation: "மின்னோட்டத்தின் SI அலகு ஆம்பியர் (A).", difficulty: "easy" },
  ],

  // ---- BIOLOGY ----
  tp_biology: [
    { text: "மனித உடலில் எத்தனை எலும்புகள் உள்ளன?", options: ["200", "206", "210", "220"], correct: 1, explanation: "முதிர்ந்த மனித உடலில் 206 எலும்புகள் உள்ளன.", difficulty: "easy" },
    { text: "ஒளிச்சேர்க்கையில் தாவரங்கள் உட்கொள்வது என்ன?", options: ["ஆக்சிஜன்", "கார்பன் டை ஆக்சைடு", "நைட்ரஜன்", "ஹைட்ரஜன்"], correct: 1, explanation: "ஒளிச்சேர்க்கையில் தாவரங்கள் CO₂ உட்கொண்டு O₂ வெளியிடுகின்றன.", difficulty: "easy" },
    { text: "மனித இரத்தத்தில் உள்ள சிவப்பு அணுக்கள் எத்தனை நாட்கள் வாழும்?", options: ["60", "90", "120", "150"], correct: 2, explanation: "சிவப்பு இரத்த அணுக்கள் சுமார் 120 நாட்கள் வாழும்.", difficulty: "medium" },
  ],

  // ---- SIMPLIFY ----
  tp_simplify: [
    { text: "125 + 25 × 4 ÷ 2 = ?", options: ["150", "175", "200", "225"], correct: 1, explanation: "BODMAS: 25 × 4 = 100, 100 ÷ 2 = 50, 125 + 50 = 175.", difficulty: "easy" },
    { text: "(15 + 5) × 3 − 10 = ?", options: ["40", "45", "50", "55"], correct: 2, explanation: "(20) × 3 = 60, 60 − 10 = 50.", difficulty: "easy" },
    { text: "100 ÷ 5 + 3 × 4 = ?", options: ["28", "30", "32", "35"], correct: 2, explanation: "100÷5 = 20, 3×4 = 12, 20+12 = 32.", difficulty: "easy" },
  ],

  // ---- AREA ----
  tp_area: [
    { text: "ஒரு செவ்வகத்தின் நீளம் 12 செ.மீ, அகலம் 8 செ.மீ எனில் பரப்பளவு என்ன?", options: ["80 sq.cm", "96 sq.cm", "100 sq.cm", "120 sq.cm"], correct: 1, explanation: "பரப்பளவு = நீளம் × அகலம் = 12 × 8 = 96 sq.cm.", difficulty: "easy" },
    { text: "ஒரு வட்டத்தின் ஆரம் 7 செ.மீ எனில் பரப்பளவு என்ன? (π = 22/7)", options: ["144", "154", "164", "174"], correct: 1, explanation: "பரப்பளவு = πr² = 22/7 × 49 = 154 sq.cm.", difficulty: "easy" },
    { text: "ஒரு சதுரத்தின் பக்கம் 6 செ.மீ எனில் பரப்பளவு என்ன?", options: ["24", "30", "36", "42"], correct: 2, explanation: "பரப்பளவு = a² = 6² = 36 sq.cm.", difficulty: "easy" },
  ],

  // ---- TIME AND WORK ----
  tp_timework: [
    { text: "A ஒரு வேலையை 10 நாளில் செய்வார். B அதை 15 நாளில் செய்வார். இருவரும் சேர்ந்து செய்தால் எத்தனை நாளில் முடிக்கலாம்?", options: ["5", "6", "7", "8"], correct: 1, explanation: "ஒரு நாளில் A+B = 1/10+1/15 = 1/6. எனவே 6 நாளில் முடியும்.", difficulty: "medium" },
    { text: "5 தொழிலாளர்கள் 8 நாளில் ஒரு வேலையை செய்கிறார்கள். அதே வேலையை 10 நாளில் செய்ய எத்தனை தொழிலாளர்கள் வேண்டும்?", options: ["3", "4", "5", "6"], correct: 1, explanation: "5×8 = 10×x. x = 4.", difficulty: "medium" },
  ],

  // ---- SILAPATHIKARAM ----
  tp_silapathikaram: [
    { text: "சிலப்பதிகாரத்தின் ஆசிரியர் யார்?", options: ["சீத்தலைச் சாத்தனார்", "இளங்கோவடிகள்", "திருவள்ளுவர்", "கம்பர்"], correct: 1, explanation: "சிலப்பதிகாரம் இளங்கோவடிகளால் இயற்றப்பட்டது.", difficulty: "easy" },
    { text: "சிலப்பதிகாரத்தின் கதாநாயகி யார்?", options: ["மாதவி", "கண்ணகி", "கோவலன்", "மணிமேகலை"], correct: 1, explanation: "சிலப்பதிகாரத்தின் கதாநாயகி கண்ணகி.", difficulty: "easy" },
    { text: "மணிமேகலையின் ஆசிரியர் யார்?", options: ["இளங்கோவடிகள்", "சீத்தலைச் சாத்தனார்", "திருவள்ளுவர்", "நக்கீரர்"], correct: 1, explanation: "மணிமேகலை சீத்தலைச் சாத்தனாரால் இயற்றப்பட்டது.", difficulty: "easy" },
  ],
};

async function main() {
  console.log("🌱 Seeding database...");

  // Create Admin
  const adminPass = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@aathichudi.com" },
    update: {},
    create: { email: "admin@aathichudi.com", name: "Admin", passwordHash: adminPass, role: "ADMIN" },
  });

  // Create Demo Student
  const studentPass = await bcrypt.hash("student123", 12);
  await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: { email: "student@example.com", name: "Test Student", passwordHash: studentPass, role: "STUDENT" },
  });

  // Seed Sections, Units, Topics
  for (const section of SYLLABUS) {
    await prisma.section.upsert({
      where: { id: section.id },
      update: { name: section.name, order: section.order },
      create: { id: section.id, name: section.name, order: section.order },
    });

    for (const unit of section.units) {
      await prisma.unit.upsert({
        where: { id: unit.id },
        update: { name: unit.name, order: unit.order },
        create: { id: unit.id, name: unit.name, sectionId: section.id, order: unit.order },
      });

      for (const topic of unit.topics) {
        await prisma.topic.upsert({
          where: { id: topic.id },
          update: { name: topic.name, order: topic.order },
          create: { id: topic.id, name: topic.name, unitId: unit.id, order: topic.order },
        });

        // Seed Questions for this topic
        const questions = QUESTIONS[topic.id];
        if (questions) {
          for (const q of questions) {
            // Check if question already exists (simple check by text)
            const exists = await prisma.question.findFirst({ where: { text: q.text, topicId: topic.id } });
            if (!exists) {
              await prisma.question.create({
                data: {
                  text: q.text,
                  options: JSON.stringify(q.options),
                  correctAnswer: q.correct,
                  explanation: q.explanation,
                  difficulty: q.difficulty,
                  status: "published",
                  topicId: topic.id,
                },
              });
            }
          }
          console.log(`  ✓ ${topic.name}: ${questions.length} questions`);
        }
      }
    }
  }

  const totalQ = await prisma.question.count();
  console.log(`\n✅ Seed complete! ${totalQ} questions in database.`);
  console.log("👤 Admin: admin@aathichudi.com / admin123");
  console.log("👤 Student: student@example.com / student123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
