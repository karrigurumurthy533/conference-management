const commonSpeakers = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Professor of Neuroscience",
    organization: "Harvard Medical School",
    specialty: "Neuroscience & Brain Health",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=500&q=85",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Dr. Michael Anderson",
    role: "Clinical Specialist",
    organization: "Mayo Clinic",
    specialty: "Clinical Research",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=500&q=85",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Dr. Emily Carter",
    role: "Research Scientist",
    organization: "Johns Hopkins Medicine",
    specialty: "Research & Innovation",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=85",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Dr. James Wilson",
    role: "Medical Specialist",
    organization: "Cleveland Clinic",
    specialty: "Healthcare Innovation",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=500&q=85",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Dr. Olivia Brown",
    role: "Healthcare Innovation Expert",
    organization: "Stanford Medicine",
    specialty: "AI & Precision Medicine",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=500&q=85",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Dr. Daniel Thompson",
    role: "Clinical Researcher",
    organization: "Mount Sinai Health",
    specialty: "Clinical Research",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=85",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Dr. Sophia Williams",
    role: "Nutrition Scientist",
    organization: "Global Wellness Institute",
    specialty: "Nutrition & Wellness",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=500&q=85",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Dr. Robert Davis",
    role: "Digital Researcher",
    organization: "University of California",
    specialty: "AI & Digital Innovation",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85",
    linkedin: "https://www.linkedin.com/",
  },
];

const conferences = [
  {
    id: "autism-research",

    category: "Autism & Neurodiversity",

    title:
      "International Conference on Autism Research & Innovations",

    subtitle:
      "Next-Generation Autism Research: AI, Neuroscience, Genetics & Personalized Intervention",

    image:
      "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=1600&q=90",

    aboutImage:
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=900&q=90",

    date: "April 06–07, 2027",

    time: "9:00 AM – 5:00 PM",

    location: "Webinar",

    mode: "Online Conference",

    participants: "500+",

    description:
      "A global platform bringing together researchers, clinicians, educators, therapists, and professionals to discuss emerging research, innovative approaches, and new developments in autism and neurodiversity.",

    about:
      "It is our great pleasure to welcome you to the International Conference on Autism Research and Innovations, scheduled to take place on April 06–07, 2027 in Webinar. The main theme of the conference is Next-Generation Autism Research: AI, Neuroscience, Genetics & Personalized Intervention.",

    aboutSecond:
      "This conference provides a vibrant platform to explore the latest developments in autism research, early diagnosis, intervention methods, behavioral science, education, assistive technologies, and community-based support. Our mission is to promote a deeper and more inclusive understanding of neurodevelopmental diversity while highlighting practical strategies that improve everyday outcomes for individuals with autism.",

    quote:
      "Together, we can advance research, support families, and create a more inclusive future for every individual with autism.",

    speakers: commonSpeakers,

    topics: [
      "Autism Research, Clinical Trials and Global Collaboration",
      "Advances in Autism Diagnosis and Screening",
      "Early Intervention Strategies and Developmental Therapies",
      "Autism and Education: Inclusive Learning Models",
      "Behavioral Science and Social Development in Autism",
      "Technology, AI, and Assistive Innovation in Autism",
      "Autism Across the Lifespan: Adolescence to Adulthood",
      "Family Support, Caregiving, and Community Engagement",
      "Sensory Processing and Adaptive Behavior",
      "Communication, Language Development, and AAC",
      "Genetics, Neuroscience, and Biological Foundations of Autism",
      "Social Inclusion, Rights, and Policy Development",
      "Employment, Vocational Training, and Independent Living",
      "Neurodiversity, Strength-Based Approaches, and Quality of Life",
    ],

    tracks: [
      {
        title:
          "Autism, Mental Health, and Emotional Well-Being",
        description:
          "Covers co-occurring conditions like anxiety, depression, and emotional regulation. Focuses on holistic therapeutic approaches for mental well-being and supportive care models.",
      },
      {
        title:
          "Advances in Autism Diagnosis and Screening",
        description:
          "Explores innovations in early detection, AI tools, and assessment methods. Emphasizes improving diagnostic accuracy and timely evaluations.",
      },
      {
        title:
          "Early Intervention Strategies and Developmental Therapies",
        description:
          "Highlights evidence-based interventions such as ABA, speech, and OT. Focuses on personalized care for communication and social development.",
      },
      {
        title:
          "Autism and Education: Inclusive Learning Models",
        description:
          "Examines inclusive teaching strategies and classroom accommodations. Supports academic success and accessible learning environments.",
      },
      {
        title:
          "Behavioral Science and Social Development in Autism",
        description:
          "Covers behavioral patterns, social challenges, emotional regulation, communication, and evidence-based behavioral support.",
      },
      {
        title:
          "Technology, AI, and Assistive Innovation in Autism",
        description:
          "Showcases AI tools, apps, AAC devices, VR/AR, and robotics. Highlights technology's role in independence and communication.",
      },
      {
        title:
          "Autism Across the Lifespan: Adolescence to Adulthood",
        description:
          "Focuses on transitions, identity, mental well-being, career readiness, relationships, and independent living.",
      },
      {
        title:
          "Family Support, Caregiving, and Community Engagement",
        description:
          "Explores caregiver well-being, stress management, family engagement, stronger support systems, and service access.",
      },
    ],
  },

  {
    id: "mental-health",

    category: "Mental Health & Psychiatry",

    title:
      "International Conference on Mental Health & Psychiatry",

    subtitle:
      "Advancing Mental Health Through Research, Innovation & Compassionate Care",

    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1600&q=90",

    aboutImage:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=90",

    date: "May 15–16, 2027",
    time: "9:00 AM – 5:00 PM",
    location: "Dubai, UAE",
    mode: "Hybrid Conference",
    participants: "600+",

    description:
      "A global meeting point for psychiatrists, psychologists, researchers, therapists, clinicians and healthcare professionals working toward better mental health outcomes.",

    about:
      "The Mental Health & Psychiatry Conference brings together global experts to discuss modern approaches to mental healthcare, psychiatric research, prevention, diagnosis and treatment.",

    aboutSecond:
      "The program focuses on emerging psychiatric research, digital mental health, behavioral science, neuroscience, patient-centered care and community-based mental health systems.",

    quote:
      "Better mental health begins with better understanding, collaboration and compassionate care.",

    speakers: commonSpeakers,

    topics: [
      "Clinical Psychiatry",
      "Mental Health & Wellness",
      "Depression and Anxiety",
      "Child and Adolescent Psychiatry",
      "Digital Mental Health",
      "Behavioral Science",
      "Neuroscience",
      "Psychotherapy",
      "Addiction Psychiatry",
      "Community Mental Health",
      "Psychiatric Research",
      "AI in Mental Healthcare",
    ],

    tracks: [
      {
        title: "Modern Psychiatry and Clinical Practice",
        description:
          "Latest developments in psychiatric diagnosis, treatment and patient-centered clinical care.",
      },
      {
        title: "Depression, Anxiety and Emotional Well-Being",
        description:
          "Research and practical strategies for understanding and managing common mental health conditions.",
      },
      {
        title: "Digital Mental Health and AI",
        description:
          "Explores digital platforms, AI tools and technology-enabled mental healthcare.",
      },
      {
        title: "Child and Adolescent Mental Health",
        description:
          "Focuses on early intervention, developmental mental health and support systems.",
      },
    ],
  },

  {
    id: "endocrinology-diabetes",

    category: "Endocrinology & Diabetes",

    title:
      "International Conference on Endocrinology & Diabetes",

    subtitle:
      "New Frontiers in Diabetes, Hormones, Metabolism & Precision Medicine",

    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=90",

    aboutImage:
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=900&q=90",

    date: "June 10–11, 2027",
    time: "9:00 AM – 5:00 PM",
    location: "Singapore",
    mode: "Hybrid Conference",
    participants: "700+",

    description:
      "A scientific platform connecting endocrinologists, diabetologists, researchers and healthcare professionals to explore advances in metabolic health and diabetes care.",

    about:
      "This conference brings together specialists to discuss diabetes prevention, treatment, endocrinology, metabolic disorders and emerging therapeutic approaches.",

    aboutSecond:
      "Sessions include clinical research, precision medicine, obesity management, endocrine disorders, technology-enabled diabetes management and patient-centered care.",

    quote:
      "Innovation in metabolic healthcare can transform prevention, treatment and quality of life.",

    speakers: commonSpeakers,

    topics: [
      "Diabetes Research",
      "Endocrinology",
      "Obesity and Metabolism",
      "Type 1 Diabetes",
      "Type 2 Diabetes",
      "Diabetes Technology",
      "Hormonal Disorders",
      "Thyroid Disorders",
      "Precision Medicine",
      "Metabolic Syndrome",
      "Clinical Trials",
      "Nutrition and Diabetes",
    ],

    tracks: [
      {
        title: "Diabetes Research and Clinical Care",
        description:
          "Emerging research and modern clinical approaches to diabetes management.",
      },
      {
        title: "Endocrine Disorders",
        description:
          "Current developments in thyroid, adrenal, pituitary and reproductive endocrine disorders.",
      },
      {
        title: "Obesity and Metabolic Health",
        description:
          "Research on obesity prevention, metabolic syndrome and personalized treatment.",
      },
      {
        title: "Digital Diabetes Management",
        description:
          "Technology, remote monitoring and digital solutions for diabetes care.",
      },
    ],
  },

  {
    id: "oncology-ai",

    category: "Oncology & Cancer Research",

    title:
      "International Conference on Oncology Research & AI Innovations",

    subtitle:
      "Transforming Cancer Research Through AI, Precision Medicine & Innovation",

    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=90",

    aboutImage:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=90",

    date: "July 20–21, 2027",
    time: "9:00 AM – 5:00 PM",
    location: "London, UK",
    mode: "Hybrid Conference",
    participants: "800+",

    description:
      "A global oncology platform exploring cancer research, precision medicine, immunotherapy, clinical trials and artificial intelligence.",

    about:
      "The Oncology Research & AI Innovations Conference brings together oncologists, researchers, clinicians, technology experts and healthcare innovators.",

    aboutSecond:
      "The conference focuses on cancer prevention, diagnosis, treatment innovation, precision medicine, AI-powered research and multidisciplinary collaboration.",

    quote:
      "Research, technology and collaboration can open new possibilities in cancer care.",

    speakers: commonSpeakers,

    topics: [
      "Cancer Research",
      "Precision Oncology",
      "Immunotherapy",
      "Cancer Genomics",
      "AI in Oncology",
      "Clinical Trials",
      "Early Cancer Detection",
      "Radiation Oncology",
      "Surgical Oncology",
      "Targeted Therapy",
      "Cancer Prevention",
      "Digital Health",
    ],

    tracks: [
      {
        title: "Precision Oncology",
        description:
          "Explores personalized cancer treatment based on molecular and genomic information.",
      },
      {
        title: "AI in Cancer Research",
        description:
          "Applications of artificial intelligence in diagnosis, research and clinical decision support.",
      },
      {
        title: "Immunotherapy and Targeted Therapy",
        description:
          "Latest developments in immune-based and targeted cancer treatments.",
      },
      {
        title: "Cancer Prevention and Early Detection",
        description:
          "Strategies for prevention, screening and earlier cancer diagnosis.",
      },
    ],
  },

  {
    id: "healthcare-innovation",

    category: "Healthcare Innovation",

    title:
      "International Conference on Healthcare Innovation & Precision Medicine",

    subtitle:
      "AI, Digital Health, Precision Medicine & The Future of Healthcare",

    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=90",

    aboutImage:
      "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=900&q=90",

    date: "August 12–13, 2027",
    time: "9:00 AM – 5:00 PM",
    location: "Singapore",
    mode: "Hybrid Conference",
    participants: "750+",

    description:
      "A global healthcare innovation platform bringing together clinicians, researchers, technology leaders and healthcare organizations.",

    about:
      "The conference explores how technology, AI and precision medicine are transforming healthcare delivery.",

    aboutSecond:
      "Participants will discuss digital health, medical AI, personalized medicine, healthcare systems, interoperability and patient-centered innovation.",

    quote:
      "The future of healthcare belongs to innovation that improves real patient outcomes.",

    speakers: commonSpeakers,

    topics: [
      "Healthcare Innovation",
      "Artificial Intelligence",
      "Digital Health",
      "Precision Medicine",
      "Telemedicine",
      "Healthcare Data",
      "Medical Devices",
      "Interoperability",
      "Patient-Centered Care",
      "Healthcare Systems",
      "Robotics",
      "Future of Medicine",
    ],

    tracks: [
      {
        title: "AI and Healthcare",
        description:
          "Explores applications of AI and machine learning across healthcare.",
      },
      {
        title: "Precision Medicine",
        description:
          "Discusses personalized approaches to diagnosis and treatment.",
      },
      {
        title: "Digital Health",
        description:
          "Covers telemedicine, remote monitoring and digital healthcare platforms.",
      },
      {
        title: "Future Healthcare Technologies",
        description:
          "Emerging technologies shaping the next generation of healthcare.",
      },
    ],
  },

  {
    id: "nutrition-wellness",

    category: "Food, Nutrition & Wellness",

    title:
      "International Conference on Food, Nutrition & Wellness",

    subtitle:
      "Nutrition Science, Healthy Living, Food Innovation & Sustainable Wellness",

    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=90",

    aboutImage:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=90",

    date: "September 08–09, 2027",
    time: "9:00 AM – 5:00 PM",
    location: "Dubai, UAE",
    mode: "Hybrid Conference",
    participants: "500+",

    description:
      "A multidisciplinary conference exploring nutrition science, food technology, wellness, preventive health and sustainable food systems.",

    about:
      "This conference brings together nutritionists, food scientists, healthcare professionals, researchers and wellness experts.",

    aboutSecond:
      "The program explores healthy diets, nutrition research, functional foods, food safety, sustainable nutrition and preventive healthcare.",

    quote:
      "Better nutrition creates healthier communities and a stronger future.",

    speakers: commonSpeakers,

    topics: [
      "Nutrition Science",
      "Food Technology",
      "Healthy Lifestyle",
      "Functional Foods",
      "Sports Nutrition",
      "Clinical Nutrition",
      "Food Safety",
      "Sustainable Food",
      "Preventive Health",
      "Child Nutrition",
      "Public Health Nutrition",
      "Wellness",
    ],

    tracks: [
      {
        title: "Nutrition Science",
        description:
          "Latest research in nutrition, dietary patterns and human health.",
      },
      {
        title: "Food Innovation",
        description:
          "Emerging food technologies, functional foods and food product innovation.",
      },
      {
        title: "Nutrition and Preventive Healthcare",
        description:
          "How nutrition can support disease prevention and healthy aging.",
      },
      {
        title: "Sustainable Food Systems",
        description:
          "Exploring sustainable, accessible and healthy food systems.",
      },
    ],
  },

  {
    id: "brain-health",

    category: "Brain Health & Neurodiversity",

    title:
      "International Conference on Brain Health, Neurodiversity & Neuroscience",

    subtitle:
      "Understanding the Brain Through Neuroscience, Research & Innovation",

    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1600&q=90",

    aboutImage:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=900&q=90",

    date: "October 14–15, 2027",
    time: "9:00 AM – 5:00 PM",
    location: "Amsterdam, Netherlands",
    mode: "Hybrid Conference",
    participants: "650+",

    description:
      "A scientific meeting focused on neuroscience, brain health, neurodevelopment and emerging approaches to neurological research.",

    about:
      "The conference connects neuroscientists, neurologists, researchers, clinicians and technology experts.",

    aboutSecond:
      "The program explores brain development, neurological disorders, neurodiversity, cognitive health and emerging neuroscience technologies.",

    quote:
      "Understanding the brain helps us build healthier and more inclusive communities.",

    speakers: commonSpeakers,

    topics: [
      "Neuroscience",
      "Brain Health",
      "Neurodevelopment",
      "Neurodiversity",
      "Cognitive Health",
      "Neurological Disorders",
      "Brain Imaging",
      "Neurotechnology",
      "AI in Neuroscience",
      "Mental Health",
      "Brain Aging",
      "Clinical Neuroscience",
    ],

    tracks: [
      {
        title: "Neuroscience Research",
        description:
          "Latest discoveries in brain science and neurological research.",
      },
      {
        title: "Brain Health and Aging",
        description:
          "Strategies for maintaining cognitive and neurological health.",
      },
      {
        title: "Neurotechnology and AI",
        description:
          "Technology and AI applications in neuroscience and brain research.",
      },
      {
        title: "Neurodiversity",
        description:
          "Understanding neurodevelopmental diversity and inclusive approaches.",
      },
    ],
  },

  {
    id: "cardiovascular",

    category: "Cardiovascular Diseases",

    title:
      "International Conference on Cardiovascular Diseases & Innovation",

    subtitle:
      "Advances in Cardiology, Prevention, Diagnostics & Cardiovascular Technology",

    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1600&q=90",

    aboutImage:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=900&q=90",

    date: "November 10–11, 2027",
    time: "9:00 AM – 5:00 PM",
    location: "Paris, France",
    mode: "Hybrid Conference",
    participants: "700+",

    description:
      "A global cardiovascular meeting covering cardiology research, prevention, diagnostics, treatment and emerging technologies.",

    about:
      "Cardiovascular experts, researchers and clinicians will explore the latest developments in heart health and cardiovascular medicine.",

    aboutSecond:
      "The conference focuses on cardiovascular prevention, imaging, interventional cardiology, digital health and innovative treatment strategies.",

    quote:
      "Prevention, research and innovation are central to a healthier heart.",

    speakers: commonSpeakers,

    topics: [
      "Cardiology",
      "Heart Disease",
      "Preventive Cardiology",
      "Interventional Cardiology",
      "Cardiac Imaging",
      "Heart Failure",
      "Hypertension",
      "Arrhythmia",
      "Digital Cardiology",
      "Cardiovascular Research",
      "Cardiac Surgery",
      "AI in Cardiology",
    ],

    tracks: [
      {
        title: "Preventive Cardiology",
        description:
          "Strategies for reducing cardiovascular risk and improving heart health.",
      },
      {
        title: "Interventional Cardiology",
        description:
          "Advances in minimally invasive cardiovascular procedures.",
      },
      {
        title: "Cardiac Imaging",
        description:
          "Modern imaging technologies for cardiovascular diagnosis.",
      },
      {
        title: "Digital Cardiology and AI",
        description:
          "Digital technologies and AI applications in cardiovascular medicine.",
      },
    ],
  },

  {
    id: "digital-psychiatry",

    category: "AI & Digital Psychiatry",

    title:
      "International Conference on AI & Digital Psychiatry",

    subtitle:
      "Artificial Intelligence, Digital Therapeutics & The Future of Mental Healthcare",

    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1600&q=90",

    aboutImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=90",

    date: "December 05–06, 2027",
    time: "9:00 AM – 5:00 PM",
    location: "London, UK",
    mode: "Online Conference",
    participants: "550+",

    description:
      "A future-focused conference exploring artificial intelligence, digital therapeutics and technology-enabled mental healthcare.",

    about:
      "The AI & Digital Psychiatry Conference brings together psychiatrists, researchers, technology professionals and healthcare innovators.",

    aboutSecond:
      "Sessions explore AI-assisted diagnosis, digital therapeutics, remote mental healthcare, behavioral data and responsible technology adoption.",

    quote:
      "Technology should make mental healthcare more accessible, personalized and connected.",

    speakers: commonSpeakers,

    topics: [
      "AI in Psychiatry",
      "Digital Therapeutics",
      "Telepsychiatry",
      "Mental Health Apps",
      "Machine Learning",
      "Behavioral Data",
      "Digital Diagnostics",
      "Virtual Reality",
      "Remote Healthcare",
      "Mental Health Research",
      "Responsible AI",
      "Future Psychiatry",
    ],

    tracks: [
      {
        title: "Artificial Intelligence in Psychiatry",
        description:
          "AI applications in psychiatric research, diagnosis and clinical decision support.",
      },
      {
        title: "Digital Therapeutics",
        description:
          "Digital interventions designed to support mental health and behavioral care.",
      },
      {
        title: "Telepsychiatry",
        description:
          "Technology-enabled psychiatric services and remote patient care.",
      },
      {
        title: "Responsible AI in Mental Healthcare",
        description:
          "Ethical, privacy and responsible implementation of AI technologies.",
      },
    ],
  },
];

export default conferences;