// src/utils/translations.ts
interface Translation {
  // Navigation
  home: string;
  services: string;
  about: string;
  team: string;
  portfolio: string;
  contact: string;
  allServices: string;
  selectLanguage: string;

  // Hero Section
  heroTitle: string;
  printing: string;
  heroSubtitle: string;
  exploreServices: string;
  contactUs: string;
  scrollDown: string;

  // Services Section
  ourServices: string;
  servicesSubtitle: string;
  digitalPrinting: string;
  digitalPrintingDesc: string;
  offsetPrinting: string;
  offsetPrintingDesc: string;
  largeFormat: string;
  largeFormatDesc: string;
  packagingSolutions: string;
  packagingSolutionsDesc: string;
  designServices: string;
  designServicesDesc: string;

  // About Section
  aboutTitle: string;
  aboutDescription1: string;
  aboutDescription2: string;
  feature1: string;
  feature2: string;
  feature3: string;
  feature4: string;
  yearsExperience: string;
  inPrinting: string;
  learnMore: string;

  // Team Section
  ourTeam: string;
  teamSubtitle: string;
  founderCEO: string;
  founderBio: string;
  designDirector: string;
  designDirectorBio: string;
  productionManager: string;
  productionManagerBio: string;
  salesDirector: string;
  salesDirectorBio: string;

  // Portfolio Section
  ourPortfolio: string;
  portfolioSubtitle: string;
  all: string;
  branding: string;
  print: string;
  packaging: string;
  brandIdentityProject: string;
  annualReport: string;
  packagingDesign: string;
  marketingMaterials: string;
  corporateBrochure: string;
  brandStationery: string;

  // Testimonials Section
  ourClients: string;
  clientsSubtitle: string;
  testimonial1: string;
  testimonial2: string;
  testimonial3: string;

  // Contact Section
  getInTouch: string;
  contactSubtitle: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  businessHours: string;
  yourName: string;
  yourEmail: string;
  subject: string;
  message: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  selectSubject: string;
  requestQuote: string;
  generalInquiry: string;
  supportRequest: string;
  partnership: string;
  messagePlaceholder: string;
  sendMessage: string;
  sending: string;
  messageSent: string;
  messageConfirmation: string;
  errorSending: string;

  // Footer
  footerAbout: string;
  quickLinks: string;
  printingServices: string;
  businessCards: string;
  brochures: string;
  flyers: string;
  banners: string;
  posters: string;
  logoDesign: string;
  brandIdentity: string;
  illustrationService: string;
  binding: string;
  lamination: string;
  embossing: string;
  foiling: string;
  finishingServices: string;
  newsletter: string;
  newsletterText: string;
  allRightsReserved: string;
  privacyPolicy: string;
  termsOfService: string;
  cookiePolicy: string;

  // Chatbot
  chatWithUs: string;
  typeMessage: string;
  chatbotWelcome: string;
  chatbotResponse: string;
  chatbotName: string;
  chatbotProactiveDashboard: string; // NEW
  chatbotProactiveDashboardPrompt: string; // NEW

  // Image Upload Features
  imageUploadPrompt: string;
  imageAnalyzing: string;
  imageUnsupportedFormat: string;
  imageSizeTooLarge: string;
  imageAnalysisError: string;
  imageUploadSuccess: string;
  imageUploadFailed: string;
  uploadImage: string;
  analyzeImage: string;

  // Form Validation and Errors
  allFieldsRequired: string;
  invalidEmail: string;
  smtpError: string;
  dbError: string;
  serverError: string;

  // Dashboard Specific (NEW)
  noGoalsYet: string;
  addYourFirstGoal: string;
  noActivitiesYet: string;
  logFirstActivity: string;
}

export const translations: { [key: string]: Translation } = {
  id: {
    // ... (Navigation, Hero, Services, About, Team, Portfolio, Testimonials, Contact, Footer) ...
    // Navigation
    home: "Beranda",
    services: "Layanan",
    about: "Tentang",
    team: "Tim",
    portfolio: "Portofolio",
    contact: "Kontak",
    allServices: "Semua Layanan",
    selectLanguage: "Pilih Bahasa",

    // Hero Section
    heroTitle: "Solusi Printing",
    printing: "Emran Ghanim Asahi",
    heroSubtitle:
      "Kami menyediakan layanan cetak berkualitas tinggi dengan teknologi modern untuk memenuhi kebutuhan bisnis Anda",
    exploreServices: "Jelajahi Layanan",
    contactUs: "Hubungi Kami",
    scrollDown: "Gulir ke bawah",

    // Services Section
    ourServices: "Layanan Kami",
    servicesSubtitle:
      "Kami menawarkan berbagai layanan cetak dan desain untuk memenuhi kebutuhan bisnis Anda",
    digitalPrinting: "Cetak Digital",
    digitalPrintingDesc:
      "Solusi cetak digital berkualitas tinggi untuk proyek dengan tenggat waktu singkat",
    offsetPrinting: "Cetak Offset",
    offsetPrintingDesc:
      "Cetak offset berkualitas tinggi untuk volume besar dengan hasil yang konsisten",
    largeFormat: "Format Besar",
    largeFormatDesc:
      "Cetak format besar untuk banner, poster, dan display dengan kualitas premium",
    packagingSolutions: "Solusi Kemasan",
    packagingSolutionsDesc:
      "Desain dan produksi kemasan yang inovatif untuk produk Anda",
    designServices: "Layanan Desain",
    designServicesDesc:
      "Layanan desain kreatif untuk branding dan materi pemasaran",

    // About Section
    aboutTitle: "Tentang Emran Ghani Asahi",
    aboutDescription1:
      "Sejak Maret 2023, kami telah menjadi mitra terpercaya dalam industri percetakan, menghadirkan solusi cetak berkualitas tinggi untuk berbagai kebutuhan bisnis.",
    aboutDescription2:
      "Dengan teknologi modern dan tim ahli, kami berkomitmen untuk memberikan hasil terbaik bagi setiap proyek.",
    feature1: "Teknologi Cetak Modern",
    feature2: "Tim Profesional",
    feature3: "Kualitas Premium",
    feature4: "Pengiriman Tepat Waktu",
    yearsExperience: "5+ Tahun",
    inPrinting: "Pengalaman",
    learnMore: "Pelajari Lebih Lanjut",

    // Team Section
    ourTeam: "Produk Kami",
    teamSubtitle: "Product yang telah kami produksi",
    founderCEO: "UPC",
    founderBio:
      "Berikut adalah sample dari product yang telah kami kerjakan dan telah kami produksi",
    designDirector: "Labels",
    designDirectorBio:
      "Berikut adalah Layout dari product  dan salah satu product yang kami kerjakan",
    productionManager: "Hangtags",
    productionManagerBio: "Hangtags adalah salahsatu product andalan kami",
    salesDirector: "Sticker",
    salesDirectorBio:
      "Gambar di atas adalah Sticker Design salah satu product yang kami Produksi ",

    // Portfolio Section
    ourPortfolio: "Portofolio Kami",
    portfolioSubtitle: "Lihat beberapa proyek terbaik yang telah kami kerjakan",
    all: "Semua",
    branding: "Branding",
    print: "Cetak",
    packaging: "Kemasan",
    brandIdentityProject: "Proyek Identitas Brand",
    annualReport: "Laporan Tahunan",
    packagingDesign: "Desain Kemasan",
    marketingMaterials: "Materi Pemasaran",
    corporateBrochure: "Brosur Korporat",
    brandStationery: "Alat Tulis Brand",

    // Testimonials Section
    ourClients: "Klien Kami",
    clientsSubtitle: "Apa yang dikatakan klien tentang layanan kami",
    testimonial1:
      "Kualitas cetak dan layanan pelanggan mereka luar biasa. Sangat merekomendasikan untuk semua kebutuhan cetak bisnis.",
    testimonial2:
      "Tim desain mereka sangat kreatif dan profesional. Hasil akhirnya melampaui ekspektasi kami.",
    testimonial3:
      "Pengiriman tepat waktu dan kualitas yang konsisten membuat mereka menjadi mitra yang dapat diandalkan.",

    // Contact Section
    getInTouch: "Hubungi Kami",
    contactSubtitle: "Kami siap membantu mewujudkan proyek Anda",
    address: "Alamat",
    phone: "Telepon",
    email: "Email",
    hours: "Jam Kerja",
    businessHours: "Senin - Sabtu: 09:00 - 17:00",
    yourName: "Nama Anda",
    yourEmail: "Email Anda",
    subject: "Subjek",
    message: "Pesan",
    namePlaceholder: "Masukkan nama Anda",
    emailPlaceholder: "Masukkan email Anda",
    selectSubject: "Pilih subjek",
    requestQuote: "Permintaan Penawaran",
    generalInquiry: "Pertanyaan Umum",
    supportRequest: "Permintaan Dukungan",
    partnership: "Kerjasama",
    messagePlaceholder: "Tulis pesan Anda di sini...",
    sendMessage: "Kirim Pesan",
    sending: "Mengirim...",
    messageSent: "Pesan Terkirim!",
    messageConfirmation:
      "Terima kasih telah menghubungi kami. Kami akan segera merespons.",
    errorSending: "Gagal mengirim pesan. Silakan coba lagi.",

    // Footer
    footerAbout:
      "Emran Ghani Asahi adalah perusahaan percetakan terkemuka yang menyediakan solusi cetak berkualitas tinggi untuk bisnis.",
    quickLinks: "Tautan Cepat",
    printingServices: "Layanan Cetak",
    businessCards: "Kartu Nama",
    brochures: "Brosur",
    flyers: "Flyer",
    banners: "Banner",
    posters: "Poster",
    logoDesign: "Desain Logo",
    brandIdentity: "Identitas Brand",
    illustrationService: "Layanan Ilustrasi",
    binding: "Penjilidan",
    lamination: "Laminasi",
    embossing: "Emboss",
    foiling: "Foil",
    finishingServices: "Layanan Finishing",
    newsletter: "Newsletter",
    newsletterText:
      "Berlangganan newsletter kami untuk mendapatkan update terbaru",
    allRightsReserved: "Hak Cipta Dilindungi",
    privacyPolicy: "Kebijakan Privasi",
    termsOfService: "Syarat & Ketentuan",
    cookiePolicy: "Kebijakan Cookie",

    // Chatbot
    chatWithUs: "Chat dengan Kami",
    typeMessage: "Ketik pesan Anda...",
    chatbotWelcome: "Halo! Ada yang bisa kami bantu?",
    chatbotResponse:
      "Terima kasih atas pesan Anda. Tim kami akan segera menghubungi Anda.",
    chatbotName: "Emran Chatbot",
    chatbotProactiveDashboard: "Selamat datang di Dashboard Anda! Apakah Anda ingin mencatat aktivitas atau menetapkan tujuan baru?", // NEW
    chatbotProactiveDashboardPrompt: "Saya ingin mencatat aktivitas", // NEW

    // Image Upload Features
    imageUploadPrompt: "Klik ikon klip untuk mengunggah gambar",
    imageAnalyzing: "Emran Chatbot sedang menganalisis gambar Anda...",
    imageUnsupportedFormat: "Format gambar tidak didukung. Gunakan JPG, PNG, atau WebP.",
    imageSizeTooLarge: "Ukuran gambar terlalu besar. Maksimal 5MB.",
    imageAnalysisError: "Gagal menganalisis gambar. Silakan coba lagi.",
    imageUploadSuccess: "Gambar berhasil diunggah",
    imageUploadFailed: "Gagal mengunggah gambar",
    uploadImage: "Unggah Gambar",
    analyzeImage: "Analisis Gambar",

    // Form Validation and Errors
    allFieldsRequired: "Semua field harus diisi",
    invalidEmail: "Format email tidak valid",
    smtpError: "Gagal mengirim email",
    dbError: "Gagal menyimpan data",
    serverError: "Kesalahan konfigurasi server",

    // Dashboard Specific (NEW)
    noGoalsYet: "Belum ada tujuan yang ditetapkan. Tetapkan tujuan untuk membantu Anda tetap termotivasi dan melacak kemajuan Anda!",
    addYourFirstGoal: "Tambahkan Tujuan Pertama Anda",
    noActivitiesYet: "Belum ada aktivitas yang dicatat. Catat aktivitas Anda untuk melacak kemajuan dan membangun streak Anda!",
    logFirstActivity: "Catat Aktivitas Pertama Anda",
  },
  en: {
    // ... (Navigation, Hero, Services, About, Team, Portfolio, Testimonials, Contact, Footer) ...
    // Navigation
    home: "Home",
    about: "About",
    services: "Services",
    team: "Team",
    portfolio: "Portfolio",
    contact: "Contact",
    allServices: "All Services",
    selectLanguage: "Select Language",

    // Hero Section
    heroTitle: "Premium Quality Commercial",
    printing: "Printing",
    heroSubtitle:
      "Expert printing solutions for businesses of all sizes, delivering exceptional quality and innovation.",
    exploreServices: "Explore Services",
    contactUs: "Contact Us",
    scrollDown: "Scroll Down",

    // Services Section
    ourServices: "Our Services",
    servicesSubtitle:
      "We offer a comprehensive range of printing and design services to meet your business needs.",
    digitalPrinting: "Digital Printing",
    digitalPrintingDesc:
      "High-quality, on-demand printing with quick turnaround times for short to medium runs.",
    offsetPrinting: "Offset Printing",
    offsetPrintingDesc:
      "Traditional printing method delivering superior quality and color accuracy for larger quantities.",
    largeFormat: "Large Format Printing",
    largeFormatDesc:
      "Eye-catching banners, posters, and displays for maximum visual impact at events and promotions.",
    packagingSolutions: "Packaging Solutions",
    packagingSolutionsDesc:
      "Custom packaging design and production to showcase and protect your products.",
    designServices: "Design Services",
    designServicesDesc:
      "Creative design services from concept to completion, including branding and marketing materials.",

    // About Section
    aboutTitle: "Emran Ghani Asahi Printing",
    aboutDescription1:
      "Established in March 2023, Emran Ghani Asahi Printing has grown to become a leading provider of premium printing solutions in Tokyo and across Japan.",
    aboutDescription2:
      "We combine traditional Japanese craftsmanship with cutting-edge technology to deliver exceptional quality and service to our clients.",
    feature1: "Eco-friendly printing options",
    feature2: "State-of-the-art technology",
    feature3: "Expert design consultants",
    feature4: "On-time delivery guarantee",
    yearsExperience: "5+ Years",
    inPrinting: "in printing excellence",
    learnMore: "Learn More",

    // Team Section
    ourTeam: "Our Product",
    teamSubtitle: "These our product that already productions.",
    founderCEO: "UPC",
    founderBio:
      "With over 20 years of experience in the printing industry, Emran leads our team with vision and passion.",
    designDirector: "Label",
    designDirectorBio:
      "Sarah brings her creative expertise to every project, ensuring visually stunning results for our clients.",
    productionManager: "Hangtags",
    productionManagerBio:
      "Akira oversees all production processes, ensuring the highest quality standards are maintained.",
    salesDirector: "Sticker",
    salesDirectorBio:
      "Michael builds lasting relationships with our clients, understanding their needs and providing tailored solutions.",

    // Portfolio Section
    ourPortfolio: "Our Portfolio",
    portfolioSubtitle:
      "Explore some of our finest work for clients across various industries.",
    all: "All",
    branding: "Branding",
    print: "Print",
    packaging: "Packaging",
    brandIdentityProject: "Corporate Brand Identity",
    annualReport: "Annual Report Design",
    packagingDesign: "Product Packaging",
    marketingMaterials: "Marketing Materials",
    corporateBrochure: "Corporate Brochure",
    brandStationery: "Brand Stationery Set",

    // Testimonials Section
    ourClients: "What Our Clients Say",
    clientsSubtitle:
      "Hear from some of our satisfied customers about their experience working with us.",
    testimonial1:
      "Emran Ghani Asahi Printing delivered exceptional quality print materials for our corporate rebrand. Their attention to detail and professional service exceeded our expectations.",
    testimonial2:
      "We've worked with many printing companies before, but none match the quality and service provided by Emran Ghani Asahi. They are now our exclusive printing partner.",
    testimonial3:
      "The team at Emran Ghani Asahi helped us bring our packaging vision to life. Their innovative approach and commitment to quality sets them apart.",

    // Contact Section
    getInTouch: "Get In Touch",
    contactSubtitle: "Have a question or project in mind? Reach out to us.",
    address: "Address",
    phone: "Phone",
    email: "Email",
    hours: "Business Hours",
    businessHours: "Mon-Fri: 9AM-6PM, Sat: 10AM-2PM",
    yourName: "Your Name",
    namePlaceholder: "Enter your name",
    yourEmail: "Your Email",
    emailPlaceholder: "Enter your email",
    subject: "Subject",
    selectSubject: "Select a subject",
    requestQuote: "Request a Quote",
    generalInquiry: "General Inquiry",
    supportRequest: "Support Request",
    partnership: "Partnership Opportunity",
    message: "Message",
    messagePlaceholder: "How can we help you?",
    sendMessage: "Send Message",
    sending: "Sending...",
    messageSent: "Message Sent!",
    messageConfirmation:
      "Thank you for your message. We will get back to you shortly.",
    errorSending: "Failed to send message. Please try again.",

    // Footer
    footerAbout:
      "Emran Ghani Asahi Printing is committed to delivering exceptional quality printing services with innovation and excellence.",
    quickLinks: "Quick Links",
    printingServices: "Printing Services",
    businessCards: "Business Cards",
    brochures: "Brochures",
    flyers: "Flyers",
    banners: "Banners",
    posters: "Posters",
    logoDesign: "Logo Design",
    brandIdentity: "Brand Identity",
    illustrationService: "Illustration",
    binding: "Binding",
    lamination: "Lamination",
    embossing: "Embossing",
    foiling: "Foiling",
    finishingServices: "Finishing Services",
    newsletter: "Newsletter",
    newsletterText:
      "Subscribe to our newsletter for the latest updates and offers.",
    allRightsReserved: "All Rights Reserved",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    cookiePolicy: "Cookie Policy",

    // Chatbot
    chatWithUs: "Chat with Us",
    typeMessage: "Type your message...",
    chatbotWelcome:
      "Hello! Welcome to Emran Ghani Asahi Printing. How can I assist you today?",
    chatbotResponse:
      "Thank you for your message. One of our representatives will get back to you shortly. For immediate assistance, please call our customer service line.",
    chatbotName: "Emran Chatbot",
    chatbotProactiveDashboard: "Welcome to your Dashboard! Would you like to log an activity or set a new goal?", // NEW
    chatbotProactiveDashboardPrompt: "I want to log an activity", // NEW

    // Image Upload Features
    imageUploadPrompt: "Click the paperclip icon to upload an image",
    imageAnalyzing: "Emran Chatbot is analyzing your image...",
    imageUnsupportedFormat: "Unsupported image format. Please use JPG, PNG, or WebP.",
    imageSizeTooLarge: "Image size too large. Maximum 5MB allowed.",
    imageAnalysisError: "Failed to analyze image. Please try again.",
    imageUploadSuccess: "Image uploaded successfully",
    imageUploadFailed: "Failed to upload image",
    uploadImage: "Upload Image",
    analyzeImage: "Analyze Image",

    // Form Validation and Errors
    allFieldsRequired: "All fields are required",
    invalidEmail: "Invalid email format",
    smtpError: "Failed to send email",
    dbError: "Failed to save submission",
    serverError: "Server configuration error",

    // Dashboard Specific (NEW)
    noGoalsYet: "No goals set yet. Set some goals to help you stay motivated and track your progress!",
    addYourFirstGoal: "Add Your First Goal",
    noActivitiesYet: "No activities logged yet. Log your activities to track progress and build your streak!",
    logFirstActivity: "Log Your First Activity",
  },
  ja: {
    // ... (Your existing Japanese translations) ...
    // Navigation
    home: "ホーム",
    about: "会社概要",
    services: "サービス",
    team: "チーム",
    portfolio: "作品集",
    contact: "お問い合わせ",
    allServices: "全てのサービス",
    selectLanguage: "言語を選択",

    // Hero Section
    heroTitle: "高品質な商業",
    printing: "印刷",
    heroSubtitle:
      "あらゆる規模のビジネスに対応する専門的な印刷ソリューション。卓越した品質と革新をお届けします。",
    exploreServices: "サービスを見る",
    contactUs: "お問い合わせ",
    scrollDown: "スクロールダウン",

    // Services Section
    ourServices: "私たちのサービス",
    servicesSubtitle:
      "ビジネスニーズに応える総合的な印刷・デザインサービスを提供しています。",
    digitalPrinting: "デジタル印刷",
    digitalPrintingDesc:
      "短中規模の印刷に最適な、迅速な納期と高品質のオンデマンド印刷。",
    offsetPrinting: "オフセット印刷",
    offsetPrintingDesc:
      "大量印刷に優れた品質と色精度を提供する伝統的な印刷方法。",
    largeFormat: "大判印刷",
    largeFormatDesc:
      "イベントやプロモーションで最大の視覚的効果を発揮する、目を引くバナー、ポスター、ディスプレイ。",
    packagingSolutions: "パッケージソリューション",
    packagingSolutionsDesc:
      "製品を魅せ、保護するためのカスタムパッケージデザインと製造。",
    designServices: "デザインサービス",
    designServicesDesc:
      "ブランディングやマーケティング資料など、コンセプトから完成までのクリエイティブなデザインサービス。",

    // About Section
    aboutTitle: "エムラン・ガニ旭印刷",
    aboutDescription1:
      "2005年に設立されたエムラン・ガニ旭印刷は、東京を中心に日本全国でプレミアム印刷ソリューションを提供するリーディングカンパニーに成長しました。",
    aboutDescription2:
      "日本の伝統的な職人技と最先端の技術を組み合わせ、お客様に卓越した品質とサービスを提供しています。",
    feature1: "環境に優しい印刷オプション",
    feature2: "最先端の技術",
    feature3: "専門デザインコンサルタント",
    feature4: "納期保証",
    yearsExperience: "20年以上",
    inPrinting: "の印刷業界での実績",
    learnMore: "詳細を見る",

    // Team Section
    ourTeam: "専門家チーム",
    teamSubtitle:
      "私たちの成功を支える才能あるプロフェッショナルをご紹介します。",
    founderCEO: "創業者 & CEO",
    founderBio:
      "印刷業界で20年以上の経験を持つエムランは、ビジョンと情熱をもってチームを率いています。",
    designDirector: "デザインディレクター",
    designDirectorBio:
      "サラは全てのプロジェクトに創造的な専門知識を活かし、クライアントに視覚的に魅力的な結果を提供します。",
    productionManager: "製作マネージャー",
    productionManagerBio:
      "アキラは全ての製作プロセスを監督し、最高品質の基準が維持されるよう確保しています。",
    salesDirector: "営業ディレクター",
    salesDirectorBio:
      "マイケルはクライアントとの永続的な関係を構築し、ニーズを理解して適切なソリューションを提供します。",

    // Portfolio Section
    ourPortfolio: "作品集",
    portfolioSubtitle:
      "様々な業界のクライアントのために手がけた最高の作品をご覧ください。",
    all: "全て",
    branding: "ブランディング",
    print: "印刷",
    packaging: "パッケージ",
    brandIdentityProject: "企業ブランドアイデンティティ",
    annualReport: "年次報告書デザイン",
    packagingDesign: "製品パッケージ",
    marketingMaterials: "マーケティング資料",
    corporateBrochure: "企業パンフレット",
    brandStationery: "ブランド文具セット",

    // Testimonials Section
    ourClients: "お客様の声",
    clientsSubtitle:
      "私たちとの仕事の経験について、満足いただいているお客様からの声をご紹介します。",
    testimonial1:
      "エムラン・ガニ旭印刷は、弊社の企業リブランディングに際し、卓越した品質の印刷物を提供してくれました。細部へのこだわりとプロフェッショナルなサービスは、期待を上回るものでした。",
    testimonial2:
      "私たちは過去に多くの印刷会社と仕事をしてきましたが、エムラン・ガニ旭印刷の品質とサービスに匹敵する会社はありません。現在は独占的な印刷パートナーとして協力しています。",
    testimonial3:
      "エムラン・ガニ旭印刷のチームは、私たちのパッケージングビジョンを実現するのを手伝ってくれました。彼らの革新的なアプローチと品質へのこだわりが他社と一線を画しています。",

    // Contact Section
    getInTouch: "お問い合わせ",
    contactSubtitle:
      "ご質問やプロジェクトについてお気軽にお問い合わせください。",
    address: "住所",
    phone: "電話",
    email: "メール",
    hours: "営業時間",
    businessHours: "月-金: 9時-18時, 土: 10時-14時",
    yourName: "お名前",
    namePlaceholder: "お名前を入力してください",
    yourEmail: "メールアドレス",
    emailPlaceholder: "メールアドレスを入力してください",
    subject: "件名",
    selectSubject: "件名を選択してください",
    requestQuote: "お見積り依頼",
    generalInquiry: "一般的なお問い合わせ",
    supportRequest: "サポートリクエスト",
    partnership: "パートナーシップ機会",
    message: "メッセージ",
    messagePlaceholder: "どのようにお手伝いできますか？",
    sendMessage: "メッセージを送信",
    sending: "送信中...",
    messageSent: "メッセージを送信しました！",
    messageConfirmation:
      "お問い合わせありがとうございます。速やかにご連絡いたします。",
    errorSending: "メッセージの送信に失敗しました。再度お試しください。",

    // Footer
    footerAbout:
      "エムラン・ガニ旭印刷は、革新と卓越性を持って例外的な品質の印刷サービスを提供することに取り組んでいます。",
    quickLinks: "クイックリンク",
    printingServices: "印刷サービス",
    businessCards: "名刺",
    brochures: "パンフレット",
    flyers: "チラシ",
    banners: "バナー",
    posters: "ポスター",
    logoDesign: "ロゴデザイン",
    brandIdentity: "ブランドアイデンティティ",
    illustrationService: "イラスト",
    binding: "製本",
    lamination: "ラミネート加工",
    embossing: "エンボス加工",
    foiling: "箔押し",
    finishingServices: "仕上げサービス",
    newsletter: "ニュースレター",
    newsletterText:
      "最新情報やお得な情報を受け取るには、ニュースレターにご登録ください。",
    allRightsReserved: "全権利所有",
    privacyPolicy: "プライバシーポリシー",
    termsOfService: "利用規約",
    cookiePolicy: "クッキーポリシー",

    // Chatbot
    chatWithUs: "チャットでお問い合わせ",
    typeMessage: "メッセージを入力...",
    chatbotWelcome:
      "こんにちは！エムラン・ガニ旭印刷へようこそ。どのようにお手伝いできますか？",
    chatbotResponse:
      "メッセージをいただきありがとうございます。担当者が速やかにご連絡いたします。緊急のご用件は、カスタマーサービスまでお電話ください。",
    chatbotName: "エムランチャットボット",
    chatbotProactiveDashboard: "ダッシュボードへようこそ！活動を記録したり、新しい目標を設定しますか？", // NEW
    chatbotProactiveDashboardPrompt: "活動を記録したい", // NEW

    // Image Upload Features
    imageUploadPrompt: "クリップアイコンをクリックして画像をアップロード",
    imageAnalyzing: "エムランチャットボットが画像を分析中...",
    imageUnsupportedFormat: "サポートされていない画像形式です。JPG、PNG、WebPを使用してください。",
    imageSizeTooLarge: "画像サイズが大きすぎます。最大5MBまでです。",
    imageAnalysisError: "画像の分析に失敗しました。再度お試しください。",
    imageUploadSuccess: "画像のアップロードが完了しました",
    imageUploadFailed: "画像のアップロードに失敗しました",
    uploadImage: "画像をアップロード",
    analyzeImage: "画像を分析",

    // Form Validation and Errors
    allFieldsRequired: "すべてのフィールドが必要です",
    invalidEmail: "メールアドレスの形式が無効です",
    smtpError: "メールの送信に失敗しました",
    dbError: "データの保存に失敗しました",
    serverError: "サーバー構成エラー",

    // Dashboard Specific (NEW)
    noGoalsYet: "まだ目標が設定されていません。モチベーションを維持し、進捗を追跡するために目標を設定しましょう！",
    addYourFirstGoal: "最初の目標を追加",
    noActivitiesYet: "まだ活動が記録されていません。進捗を追跡し、連続記録を構築するために活動を記録しましょう！",
    logFirstActivity: "最初の活動を記録",
  },
  zh: {
    // ... (Your existing Chinese translations) ...
    // Navigation
    home: "首页",
    about: "关于我们",
    services: "服务",
    team: "团队",
    portfolio: "作品集",
    contact: "联系我们",
    allServices: "所有服务",
    selectLanguage: "选择语言",

    // Hero Section
    heroTitle: "高品质商业",
    printing: "印刷",
    heroSubtitle:
      "为各种规模的企业提供专业的印刷解决方案，带来卓越的品质和创新。",
    exploreServices: "探索服务",
    contactUs: "联系我们",
    scrollDown: "向下滚动",

    // Services Section
    ourServices: "我们的服务",
    servicesSubtitle: "我们提供全面的印刷和设计服务，以满足您的业务需求。",
    digitalPrinting: "数字印刷",
    digitalPrintingDesc: "高质量按需印刷，适合中小批量，快速交付。",
    offsetPrinting: "胶印",
    offsetPrintingDesc: "为大批量印刷提供卓越品质和色彩精准度的传统印刷方法。",
    largeFormat: "大幅面印刷",
    largeFormatDesc: "为活动和促销提供引人注目的横幅、海报和展示物。",
    packagingSolutions: "包装解决方案",
    packagingSolutionsDesc: "定制包装设计和生产，展示并保护您的产品。",
    designServices: "设计服务",
    designServicesDesc: "从概念到完成的创意设计服务，包括品牌和营销材料。",

    // About Section
    aboutTitle: "艾姆兰·加尼旭日印刷",
    aboutDescription1:
      "成立于2005年，艾姆兰·加尼旭日印刷已成为东京及日本全国领先的高端印刷解决方案提供商。",
    aboutDescription2:
      "我们结合传统日本工艺与尖端技术，为客户提供卓越的品质和服务。",
    feature1: "环保印刷选项",
    feature2: "最先进的技术",
    feature3: "专业设计顾问",
    feature4: "准时交付保证",
    yearsExperience: "20多年",
    inPrinting: "印刷行业经验",
    learnMore: "了解更多",

    // Team Section
    ourTeam: "专家团队",
    teamSubtitle: "认识支持我们成功的才华横溢的专业人士。",
    founderCEO: "创始人兼首席执行官",
    founderBio: "拥有20多年印刷行业经验，艾姆兰以远见和热情领导我们的团队。",
    designDirector: "设计总监",
    designDirectorBio:
      "莎拉为每个项目带来创意专长，确保为客户提供视觉上惊艳的成果。",
    productionManager: "生产经理",
    productionManagerBio: "明监督所有生产流程，确保维持最高质量标准。",
    salesDirector: "销售总监",
    salesDirectorBio:
      "迈克尔与客户建立持久关系，了解他们的需求并提供量身定制的解决方案。",

    // Portfolio Section
    ourPortfolio: "作品集",
    portfolioSubtitle: "探索我们为各行业客户完成的精美作品。",
    all: "全部",
    branding: "品牌",
    print: "印刷",
    packaging: "包装",
    brandIdentityProject: "企业品牌标识",
    annualReport: "年报设计",
    packagingDesign: "产品包装",
    marketingMaterials: "营销材料",
    corporateBrochure: "企业宣传册",
    brandStationery: "品牌文具套装",

    // Testimonials Section
    ourClients: "客户评价",
    clientsSubtitle: "听听一些满意客户分享他们与我们合作的经验。",
    testimonial1:
      "艾姆兰·加尼旭日印刷为我们的企业品牌重塑提供了卓越品质的印刷材料。他们的专业服务超出了我们的期望。",
    testimonial2:
      "我们曾与多家印刷公司合作，但艾姆兰·加尼旭日的质量和服务无人能及。他们现在是我们的独家印刷合作伙伴。",
    testimonial3:
      "艾姆兰·加尼旭日的团队帮助我们实现了包装愿景。他们的创新方法和对质量的承诺使他们脱颖而出。",

    // Contact Section
    getInTouch: "联系我们",
    contactSubtitle: "有问题或项目想法？请与我们联系。",
    address: "地址",
    phone: "电话",
    email: "电子邮件",
    hours: "营业时间",
    businessHours: "周一至周五: 9点-18点, 周六: 10点-14点",
    yourName: "您的姓名",
    yourEmail: "您的电子邮件",
    subject: "主题",
    message: "留言",
    namePlaceholder: "输入您的姓名",
    emailPlaceholder: "输入您的电子邮件",
    selectSubject: "选择主题",
    requestQuote: "请求报价",
    generalInquiry: "一般咨询",
    supportRequest: "支持请求",
    partnership: "合作机会",
    messagePlaceholder: "我们如何帮助您？",
    sendMessage: "发送消息",
    sending: "发送中...",
    messageSent: "消息已发送！",
    messageConfirmation: "感谢您的留言。我们将尽快回复您。",
    errorSending: "发送消息失败。请重试。",

    // Footer
    footerAbout: "艾姆兰·加尼旭日印刷致力于以创新和卓越提供优质印刷服务。",
    quickLinks: "快速链接",
    printingServices: "印刷服务",
    businessCards: "名片",
    brochures: "宣传册",
    flyers: "传单",
    banners: "横幅",
    posters: "海报",
    logoDesign: "标志设计",
    brandIdentity: "品牌标识",
    illustrationService: "插图",
    binding: "装订",
    lamination: "覆膜",
    embossing: "压纹",
    foiling: "烫金",
    finishingServices: "后期加工服务",
    newsletter: "新闻通讯",
    newsletterText: "订阅我们的新闻通讯，获取最新更新和优惠。",
    allRightsReserved: "版权所有",
    privacyPolicy: "隐私政策",
    termsOfService: "服务条款",
    cookiePolicy: "Cookie政策",

    // Chatbot
    chatWithUs: "与我们聊天",
    typeMessage: "输入您的留言...",
    chatbotWelcome: "您好！欢迎来到艾姆兰·加尼旭日印刷。今天我们能帮您什么？",
    chatbotResponse: "感谢您的留言。我们的团队将尽快联系您。",
    chatbotName: "艾姆兰聊天机器人",
    chatbotProactiveDashboard: "欢迎来到您的仪表板！您想记录活动或设置新目标吗？", // NEW
    chatbotProactiveDashboardPrompt: "我想记录一项活动", // NEW

    // Image Upload Features
    imageUploadPrompt: "点击回形针图标上传图片",
    imageAnalyzing: "艾姆兰聊天机器人正在分析您的图片...",
    imageUnsupportedFormat: "不支持的图片格式。请使用JPG、PNG或WebP。",
    imageSizeTooLarge: "图片大小过大。最大允许5MB。",
    imageAnalysisError: "图片分析失败。请重试。",
    imageUploadSuccess: "图片上传成功",
    imageUploadFailed: "图片上传失败",
    uploadImage: "上传图片",
    analyzeImage: "分析图片",

    // Form Validation and Errors
    allFieldsRequired: "所有字段均为必填",
    invalidEmail: "电子邮件格式无效",
    smtpError: "发送电子邮件失败",
    dbError: "保存数据失败",
    serverError: "服务器配置错误",

    // Dashboard Specific (NEW)
    noGoalsYet: "尚未设定目标。设定一些目标，帮助您保持积极性并跟踪进度！",
    addYourFirstGoal: "添加您的第一个目标",
    noActivitiesYet: "尚未记录活动。记录您的活动以跟踪进度并建立您的连胜记录！",
    logFirstActivity: "记录您的第一个活动",
  },
  ar: {
    // ... (Your existing Arabic translations) ...
    // Navigation
    home: "الرئيسية",
    about: "حول",
    services: "الخدمات",
    team: "الفريق",
    portfolio: "الأعمال",
    contact: "اتصل بنا",
    allServices: "جميع الخدمات",
    selectLanguage: "اختر اللغة",

    // Hero Section
    heroTitle: "طباعة تجارية",
    printing: "عالية الجودة",
    heroSubtitle:
      "حلول طباعة متخصصة للشركات بجميع أحجامها، تقدم جودة استثنائية وابتكار.",
    exploreServices: "استكشاف الخدمات",
    contactUs: "اتصل بنا",
    scrollDown: "مرر لأسفل",

    // Services Section
    ourServices: "خدماتنا",
    servicesSubtitle:
      "نقدم مجموعة شاملة من خدمات الطباعة والتصميم لتلبية احتياجات عملك.",
    digitalPrinting: "الطباعة الرقمية",
    digitalPrintingDesc:
      "طباعة عالية الجودة حسب الطلب مع أوقات إنجاز سريعة للطبعات القصيرة إلى المتوسطة.",
    offsetPrinting: "الطباعة الأوفست",
    offsetPrintingDesc:
      "طريقة طباعة تقليدية توفر جودة فائقة ودقة في الألوان للكميات الكبيرة.",
    largeFormat: "طباعة الحجم الكبير",
    largeFormatDesc:
      "لافتات وملصقات وعروض ملفتة للنظر لتحقيق أقصى تأثير مرئي في الفعاليات والعروض الترويجية.",
    packagingSolutions: "حلول التعبئة والتغليف",
    packagingSolutionsDesc: "تصميم وإنتاج عبوات مخصصة لعرض منتجاتك وحمايتها.",
    designServices: "خدمات التصميم",
    designServicesDesc:
      "خدمات تصميم إبداعية من المفهوم إلى الإنجاز، بما في ذلك العلامات التجارية ومواد التسويق.",

    // About Section
    aboutTitle: "إمران غاني أساهي للطباعة",
    aboutDescription1:
      "تأسست شركة إمران غاني أساهي للطباعة في عام 2005، ونمت لتصبح مزودًا رائدًا لحلول الطباعة المتميزة في طوكيو وجميع أنحاء اليابان.",
    aboutDescription2:
      "نحن نجمع بين الحرفية اليابانية التقليدية والتكنولوجيا المتطورة لتقديم جودة وخدمة استثنائية لعملائنا.",
    feature1: "خيارات طباعة صديقة للبيئة",
    feature2: "تكنولوجيا متطورة",
    feature3: "مستشارو تصميم خبراء",
    feature4: "ضمان التسليم في الموعد المحدد",
    yearsExperience: "+20 عامًا",
    inPrinting: "من التميز في الطباعة",
    learnMore: "معرفة المزيد",

    // Team Section
    ourTeam: "فريقنا من الخبراء",
    teamSubtitle: "تعرف على المحترفين الموهوبين وراء نجاحنا.",
    founderCEO: "المؤسس والرئيس التنفيذي",
    founderBio:
      "مع أكثر من 20 عامًا من الخبرة في صناعة الطباعة، يقود إمران فريقنا برؤية وشغف.",
    designDirector: "مدير التصميم",
    designDirectorBio:
      "تجلب سارة خبرتها الإبداعية لكل مشروع، مما يضمن نتائج بصرية مذهلة لعملائنا.",
    productionManager: "مدير الإنتاج",
    productionManagerBio:
      "يشرف أكيرا على جميع عمليات الإنتاج، مما يضمن الحفاظ على أعلى معايير الجودة.",
    salesDirector: "مدير المبيعات",
    salesDirectorBio:
      "يبني مايكل علاقات دائمة مع عملائنا، ويفهم احتياجاتهم ويقدم حلولاً مخصصة.",

    // Portfolio Section
    ourPortfolio: "أعمالنا",
    portfolioSubtitle:
      "استكشف بعضًا من أفضل أعمالنا للعملاء عبر مختلف الصناعات.",
    all: "الكل",
    branding: "العلامات التجارية",
    print: "الطباعة",
    packaging: "التعبئة والتغليف",
    brandIdentityProject: "هوية العلامة التجارية للشركات",
    annualReport: "تصميم التقرير السنوي",
    packagingDesign: "تعبئة وتغليف المنتجات",
    marketingMaterials: "مواد تسويقية",
    corporateBrochure: "بروشور الشركة",
    brandStationery: "مجموعة القرطاسية للعلامة التجارية",

    // Testimonials Section
    ourClients: "ما يقوله عملاؤنا",
    clientsSubtitle: "اسمع من بعض عملائنا الراضين عن تجربتهم في العمل معنا.",
    testimonial1:
      "قدمت شركة إمران غاني أساهي للطباعة مواد طباعة استثنائية الجودة لإعادة تصميم العلامة التجارية لشركتنا. تجاوز اهتمامهم بالتفاصيل وخدمتهم المهنية توقعاتنا.",
    testimonial2:
      "لقد عملنا مع العديد من شركات الطباعة من قبل، ولكن لا أحد يضاهي الجودة والخدمة التي تقدمها إمران غاني أساهي. هم الآن شريكنا الحصري في الطباعة.",
    testimonial3:
      "ساعدنا فريق إمران غاني أساهي في تحقيق رؤيتنا للتعبئة والتغليف. نهجهم المبتكر والتزامهم بالجودة يميزهم عن غيرهم.",

    // Contact Section
    getInTouch: "تواصل معنا",
    contactSubtitle: "هل لديك سؤال أو مشروع في ذهنك؟ تواصل معنا.",
    address: "العنوان",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    hours: "ساعات العمل",
    businessHours: "الإثنين-الجمعة: 9 صباحًا-6 مساءً، السبت: 10 صباحًا-2 ظهرًا",
    yourName: "اسمك",
    namePlaceholder: "أدخل اسمك",
    yourEmail: "بريدك الإلكتروني",
    emailPlaceholder: "أدخل بريدك الإلكتروني",
    subject: "الموضوع",
    selectSubject: "اختر موضوعًا",
    requestQuote: "طلب عرض سعر",
    generalInquiry: "استفسار عام",
    supportRequest: "طلب الدعم",
    partnership: "فرصة شراكة",
    message: "الرسالة",
    messagePlaceholder: "كيف يمكننا مساعدتك؟",
    sendMessage: "إرسال الرسالة",
    sending: "جاري الإرسال...",
    messageSent: "تم إرسال الرسالة!",
    messageConfirmation: "شكرًا لرسالتك. سنرد عليك في أقرب وقت ممكن.",
    errorSending: "فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.",

    // Footer
    footerAbout:
      "تلتزم شركة إمران غاني أساهي للطباعة بتقديم خدمات طباعة استثنائية الجودة مع الابتكار والتميز.",
    quickLinks: "روابط سريعة",
    printingServices: "خدمات الطباعة",
    businessCards: "بطاقات العمل",
    brochures: "البروشورات",
    flyers: "المنشورات",
    banners: "اللافتات",
    posters: "الملصقات",
    logoDesign: "تصميم الشعار",
    brandIdentity: "هوية العلامة التجارية",
    illustrationService: "الرسوم التوضيحية",
    binding: "التجليد",
    lamination: "التغليف",
    embossing: "النقش البارز",
    foiling: "التذهيب",
    finishingServices: "خدمات التشطيب",
    newsletter: "النشرة الإخبارية",
    newsletterText:
      "اشترك في نشرتنا الإخبارية للحصول على أحدث التحديثات والعروض.",
    allRightsReserved: "جميع الحقوق محفوظة",
    privacyPolicy: "سياسة الخصوصية",
    termsOfService: "شروط الخدمة",
    cookiePolicy: "سياسة ملفات تعريف الارتباط",

    // Chatbot
    chatWithUs: "تحدث معنا",
    typeMessage: "اكتب رسالتك...",
    chatbotWelcome:
      "مرحبًا! أهلاً بك في إمران غاني أساهي للطباعة. كيف يمكنني مساعدتك اليوم؟",
    chatbotResponse:
      "شكرًا لرسالتك. سيرد عليك أحد ممثلينا قريبًا. للحصول على مساعدة فورية، يرجى الاتصال بخط خدمة العملاء.",
    chatbotName: "إمران شات بوت",
    chatbotProactiveDashboard: "مرحبًا بك في لوحة التحكم الخاصة بك! هل ترغب في تسجيل نشاط أو تحديد هدف جديد؟", // NEW
    chatbotProactiveDashboardPrompt: "أريد تسجيل نشاط", // NEW

    // Image Upload Features
    imageUploadPrompt: "انقر على أيقونة المشبك لرفع صورة",
    imageAnalyzing: "إمران شات بوت يحلل صورتك...",
    imageUnsupportedFormat: "تنسيق صورة غير مدعوم. يرجى استخدام JPG أو PNG أو WebP.",
    imageSizeTooLarge: "حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت.",
    imageAnalysisError: "فشل في تحليل الصورة. يرجى المحاولة مرة أخرى.",
    imageUploadSuccess: "تم رفع الصورة بنجاح",
    imageUploadFailed: "فشل في رفع الصورة",
    uploadImage: "رفع صورة",
    analyzeImage: "تحليل الصورة",

    // Form Validation and Errors
    allFieldsRequired: "جميع الحقول مطلوبة",
    invalidEmail: "تنسيق البريد الإلكتروني غير صالح",
    smtpError: "فشل إرسال البريد الإلكتروني",
    dbError: "فشل حفظ البيانات",
    serverError: "خطأ في تكوين الخادم",

    // Dashboard Specific (NEW)
    noGoalsYet: "لم يتم تعيين أهداف بعد. حدد بعض الأهداف لمساعدتك على البقاء متحفزًا وتتبع تقدمك!",
    addYourFirstGoal: "أضف هدفك الأول",
    noActivitiesYet: "لم يتم تسجيل أنشطة بعد. سجل أنشطتك لتتبع التقدم وبناء سلسلة نجاحك!",
    logFirstActivity: "سجل نشاطك الأول",
  },
};