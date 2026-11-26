export const PROJECT_CATEGORIES = ['All', 'AI & ML', 'Mobile', 'Desktop', 'Web']

export const projects = [
  {
    slug: 'farmwatch-ai',
    aliases: ['farmwatch'],
    mainCaseStudy: true,
    title: 'FarmWatch AI',
    category: 'AI & ML',
    year: '2026',
    shortDescription:
      'A plant disease detection application with model explanations and a FastAPI-powered interface.',
    technologies: ['PyTorch', 'MobileNetV3', 'FastAPI', 'React'],
    image: '/projects/farmwatch-ui.png',
    imageFit: 'cover',
    imageAlt: 'FarmWatch AI field leaf diagnosis and Grad-CAM web interface',
    githubUrl: 'https://github.com/princevyas01/Farmwatch-AI',
    liveUrl: null,
    gallery: [
      {
        src: '/projects/farmwatch-ui.png',
        alt: 'FarmWatch AI diagnosis web application',
        caption: 'Field Leaf Diagnosis & Grad-CAM interface',
        isChart: false,
      },
      {
        src: '/projects/farmwatch-metrics.png',
        alt: 'MobileNetV3-Small training loss, validation accuracy, and macro F1 curves',
        caption: 'Two-stage MobileNetV3-Small training progression',
        isChart: true,
      },
      {
        src: '/projects/farmwatch-gradcam.png',
        alt: 'Grad-CAM attention overlay highlighting diseased leaf regions',
        caption: 'Grad-CAM attention map on held-out field leaf sample',
        isChart: true,
      },
      {
        src: '/projects/farmwatch-confusion.png',
        alt: '11-class MobileNetV3 confusion matrix on 214 held-out test images',
        caption: 'Confusion matrix across 11 PlantDoc classes (214 test images)',
        isChart: true,
      },
    ],
    caseStudy: {
      overview:
        'FarmWatch AI classifies visible crop and leaf conditions from unconstrained field photographs using a locally served MobileNetV3-Small model and Grad-CAM visual explanations.',
      whatIBuilt: [
        'Two-stage PyTorch MobileNetV3-Small transfer-learning pipeline trained on SHA-256 deduplicated PlantDoc splits.',
        'FastAPI inference service exposing health, model metadata, sample images, metrics, and Grad-CAM heatmaps.',
        'React and TypeScript web UI for uploading field photos, cropping regions, and inspecting confidence scores.',
        'Safe non-chemical cultural advisories paired with low-confidence (< 60%) caution flags.',
      ],
      technology: [
        { name: 'PyTorch & MobileNetV3-Small', role: 'Transfer-learning vision backbone and Grad-CAM hooks' },
        { name: 'FastAPI', role: 'Typed inference and metrics API endpoints' },
        { name: 'React 19 & TypeScript', role: 'Diagnosis UI and benchmark transparency views' },
        { name: 'Tailwind CSS', role: 'Responsive diagnostic layout' },
      ],
      interestingTechnicalWork: [
        'Audited 2,581 raw PlantDoc files by SHA-256 hash to guarantee zero overlap across train (951), validation (200), and test (214) splits.',
        'Improved held-out test accuracy from 27.10% (scratch CNN) to 67.29% and macro F1 to 66.52%, eliminating all zero-F1 classes.',
        'Froze early backbone layers during Stage 1 warmup and selectively fine-tuned top blocks in Stage 2 to prevent overfitting.',
      ],
      expandableTitle: 'Verified Benchmark Comparison',
      expandableMetrics: [
        { label: 'MobileNetV3-Small Test Accuracy', value: '67.29% (144 / 214)' },
        { label: 'Macro F1-Score', value: '66.52% (0 starved classes)' },
        { label: 'Scratch Baseline (EnhancedCropCNN)', value: '27.10% acc · 21.74% F1' },
        { label: 'Model Forward Latency (CPU)', value: '15.34 ms avg' },
        { label: 'Automated Test Suite', value: '28 / 28 passing' },
      ],
      results: [
        'Achieved 67.29% test accuracy and 66.52% macro F1 across 11 field crop classes with 15.34 ms CPU forward latency.',
        'Verified end-to-end with 28/28 automated tests covering API endpoints, inference integrity, and Grad-CAM hooks.',
      ],
    },
  },
  {
    slug: 'story-continuation-generator',
    aliases: ['story-generator', 'story-continuation'],
    mainCaseStudy: true,
    title: 'Story Continuation Generator',
    category: 'AI & ML',
    year: '2026',
    shortDescription:
      'An LSTM-based story generator that continues short narratives with adjustable generation settings.',
    technologies: ['TensorFlow', 'FastAPI', 'React', 'TypeScript'],
    image: '/projects/story-generator-ui.png',
    imageFit: 'cover',
    imageAlt: 'Story Continuation Generator prompt editor and sampling parameter interface',
    githubUrl: 'https://github.com/princevyas01/story-continuation-generator-',
    liveUrl: null,
    gallery: [
      {
        src: '/projects/story-generator-ui.png',
        alt: 'Story Continuation Generator interactive UI with Temperature, Top-K, and Top-P sliders',
        caption: 'Prompt editor and autoregressive sampling controls',
        isChart: false,
      },
      {
        src: '/projects/story-loss-curve.png',
        alt: 'Training and validation cross-entropy loss curves for LSTM language model',
        caption: 'LSTM training and validation loss curve',
        isChart: true,
      },
    ],
    caseStudy: {
      overview:
        'A locally trained 2-layer stacked LSTM language model paired with a FastAPI server and React frontend for controllable story continuation without cloud APIs.',
      whatIBuilt: [
        'Custom Byte-Level BPE tokenizer (8,000 subword units) and autoregressive 2-layer LSTM trained on 50,000 TinyStories documents.',
        'FastAPI inference backend supporting model version switching (v2 baseline vs v3) and request cancellation.',
        'Interactive React and TypeScript interface with Temperature, Top-K, Top-P nucleus sampling, and seed controls.',
      ],
      technology: [
        { name: 'TensorFlow / Keras', role: 'Two-layer stacked LSTM training and raw-logit inference' },
        { name: 'FastAPI', role: 'Model lifecycle loading, Pydantic validation, and static serving' },
        { name: 'React & TypeScript', role: 'Prompt editor, hyperparameter controls, and output diagnostics' },
        { name: 'Byte-Level BPE', role: 'Subword tokenization across 128-token context windows' },
      ],
      interestingTechnicalWork: [
        'Enforced strict 90/5/5 document-level splits before windowing to guarantee zero overlap across train (45k), validation (2.5k), and test (2.5k) stories.',
        'Replaced word-level v1 and masked v2 iterations with v3 raw-logit subword prediction, reaching 11.22 test perplexity.',
        'Added repetition penalties and special-token filtering inside the CPU sampling loop to stop degenerate loops.',
      ],
      expandableTitle: 'Model v3 Training Summary',
      expandableMetrics: [
        { label: 'Parameters', value: '4,577,088' },
        { label: 'Vocabulary / Context', value: '8,000 BPE · 128 tokens' },
        { label: 'Held-Out Test Loss', value: '2.4181 nats / token' },
        { label: 'Test Perplexity', value: '11.22' },
        { label: 'Next-Token Accuracy', value: '46.29%' },
      ],
      results: [
        'Trained a 4.58M-parameter local model achieving 11.22 test perplexity and 46.29% next-token accuracy.',
        'Runs end-to-end on laptop CPU through a single FastAPI service serving compiled React assets.',
      ],
    },
  },
  {
    slug: 'offline-pdf-reader',
    aliases: ['pdf-reader', 'pdf'],
    mainCaseStudy: true,
    title: 'Offline PDF Reader & Companion',
    category: 'Mobile',
    year: '2026',
    shortDescription:
      'An offline PDF reader with OCR, document tools and on-device AI features.',
    technologies: ['Flutter', 'Dart', 'SQLite', 'llama.cpp'],
    image: '/projects/pdf-reader.png',
    imageFit: 'contain',
    isAppIcon: true,
    imageAlt: 'Offline PDF Reader & Companion editorial book icon',
    githubUrl: 'https://github.com/princevyas01/pdf',
    liveUrl: null,
    gallery: [
      {
        src: '/projects/pdf-reader.png',
        alt: 'Offline PDF Reader & Companion visual mark',
        caption: 'Editorial icon for Offline PDF Reader & Study Companion',
        isChart: true,
      },
    ],
    caseStudy: {
      overview:
        'An Android offline document reader and study studio combining distraction-free reading, PDF manipulation tools, OCR, and on-device GGUF model inference.',
      whatIBuilt: [
        'Multi-theme editorial PDF viewer with highlights, freehand annotations, signatures, bookmarks, and text-to-speech.',
        'On-device PDF utilities: merge, split, page deletion, target-size compression, encryption, and document diffing.',
        'Google ML Kit Latin OCR scanner for converting camera captures and scanned pages into searchable text.',
        'Local AI assistant powered by llama.cpp and Qwen3 GGUF models with page-grounded document Q&A.',
      ],
      technology: [
        { name: 'Flutter & Dart', role: 'Android reader UI, annotation canvas, and state management' },
        { name: 'llama.cpp', role: 'On-device GGUF LLM inference (Qwen3 0.6B / 1.7B)' },
        { name: 'Google ML Kit', role: 'Offline document scanning and Latin OCR' },
        { name: 'SQLite', role: 'Persistent local annotations, metadata, and OCR caching' },
      ],
      interestingTechnicalWork: [
        'Implemented chunked resumable model downloads verified with SHA-256 digests and automatic unloading to protect device RAM.',
        'Added a deterministic local fallback extractor so grounded summaries and Q&A work even without downloaded LLM weights.',
        'Integrated a lightweight floating study companion overlay positioned to avoid blocking touch reading gestures.',
      ],
      results: [
        'Delivers full PDF viewing, editing, OCR, TTS, and RAG-grounded Q&A completely offline on Android (API 26+).',
      ],
    },
  },
  {
    slug: 'nudge-2',
    aliases: ['nudge', 'nudge-2-0'],
    mainCaseStudy: true,
    title: 'Nudge 2.0',
    category: 'Mobile',
    year: '2026',
    shortDescription:
      'A reminder application with native Android alarms, widgets and encrypted backups.',
    technologies: ['Flutter', 'Dart', 'SQLite', 'Android'],
    image: '/projects/nudge-home-dark.png',
    imageFit: 'contain',
    imageAlt: 'Nudge 2.0 dark mode mobile reminder home interface',
    githubUrl: 'https://github.com/princevyas01/nudge',
    liveUrl: null,
    gallery: [
      {
        src: '/projects/nudge-home-dark.png',
        alt: 'Nudge 2.0 dark mode home screen showing upcoming nudges and categories',
        caption: 'Dark mode home overview and category cards',
        isChart: true,
      },
      {
        src: '/projects/nudge-alarm-dark.png',
        alt: 'Nudge 2.0 full-screen morning alarm screen with snooze and dismiss controls',
        caption: 'Native alarm ringing screen design',
        isChart: true,
      },
      {
        src: '/projects/nudge-app-icon.png',
        alt: 'Nudge 2.0 application icon',
        caption: 'Nudge 2.0 app icon',
        isChart: true,
      },
    ],
    caseStudy: {
      overview:
        'An offline-first Android reminder and habit reinforcement application combining exact native alarms, home-screen widgets, todos, and encrypted local backups.',
      whatIBuilt: [
        'Reminder and recurrence engine backed by SQLite tables for reminders, occurrences, history, todos, and freeform notes.',
        'Native Android alarm platform bridge with full-screen ringing UI, snooze handling, and custom alarm sounds.',
        'Android home-screen widget synchronization (`home_widget`) and calendar/folder organization.',
        'Password-derived encrypted backup export and import with conflict resolution policies.',
      ],
      technology: [
        { name: 'Flutter & Provider', role: 'Multi-controller mobile UI and reactive state updates' },
        { name: 'SQLite (sqflite)', role: 'Relational storage for occurrences, todos, and history' },
        { name: 'Android Alarm Bridge', role: 'Reliable native scheduling and notification channels' },
        { name: 'PBKDF2 & AES Encryption', role: 'Encrypted offline backup archives and conflict policies' },
      ],
      interestingTechnicalWork: [
        'Isolated exact native Android alarms from optional gentle todo notifications so productivity additions never disrupt alarm reliability.',
        'Built PBKDF2 key derivation and conflict-aware restore policies (`skip`, `replace`, `keep`, `importAsCopy`) inside `BackupManager`.',
      ],
      results: [
        'Provides deterministic offline scheduling, home widgets, and portable encrypted backups without cloud accounts.',
      ],
    },
  },
  {
    slug: 'spinwave',
    aliases: ['spinwave-music-player', 'music-player'],
    mainCaseStudy: true,
    title: 'SpinWave',
    category: 'Mobile',
    year: '2026',
    shortDescription:
      'An offline music player with queue controls and audio enhancements.',
    technologies: ['Flutter', 'Dart', 'Hive', 'just_audio'],
    image: '/projects/spinwave.png',
    imageFit: 'contain',
    isAppIcon: true,
    imageAlt: 'SpinWave offline music player vinyl and note emblem',
    githubUrl: 'https://github.com/princevyas01/Music-Player',
    liveUrl: null,
    gallery: [
      {
        src: '/projects/spinwave.png',
        alt: 'SpinWave Offline Music Player application emblem',
        caption: 'SpinWave application visual',
        isChart: true,
      },
    ],
    caseStudy: {
      overview:
        'An offline Android audio player built with Flutter, pairing background media service playback with deterministic queue management, equalizer controls, and listening analytics.',
      whatIBuilt: [
        'Foreground Android media playback service (`audio_service` + `just_audio`) with lock-screen and notification controls.',
        'Synchronized playback queue supporting persistent shuffle state, loop modes, smart playlists, and adaptive queueing.',
        'Android Equalizer and loudness enhancer integration persisted locally via Hive.',
        'Local playback history tracking weekly and monthly listening durations with completion vs skip differentiation.',
      ],
      technology: [
        { name: 'Flutter & Riverpod', role: 'Reactive player, queue, and library state providers' },
        { name: 'just_audio & audio_service', role: 'Gapless audio engine and Android background session' },
        { name: 'Hive', role: 'Fast local storage for playlists, queue restoration, and EQ settings' },
        { name: 'Android Audio Effects', role: 'Multi-band equalizer and loudness gain adjustments' },
      ],
      interestingTechnicalWork: [
        'Resolved shuffle-mode track desynchronization by matching `sequenceState.currentSource` tag IDs directly against the source playlist.',
        'Added daily date-bucketed listen duration logs so weekly and monthly analytics reflect true recent playback windows.',
      ],
      results: [
        'Verified across 71 automated unit and integration tests covering queue restoration, sequence sync, and period analytics.',
      ],
    },
  },
  {
    slug: 'desktop-companion-pet',
    aliases: ['desktop-companion', 'companion'],
    mainCaseStudy: true,
    title: 'Desktop Companion Pet',
    category: 'Desktop',
    year: '2026',
    shortDescription:
      'A desktop companion with interactive characters, moods and productivity tools.',
    technologies: ['Python', 'PyQt5', 'QPainter', 'Win32 API'],
    image: '/projects/companion-dashboard.png',
    imageFit: 'cover',
    imageAlt: 'Companion Control Center web dashboard for Desktop Companion Pet',
    githubUrl: 'https://github.com/princevyas01/companion',
    liveUrl: null,
    gallery: [
      {
        src: '/projects/companion-dashboard.png',
        alt: 'Companion Control Center HTML5 dashboard showing active profile, settings, and Pomodoro timer',
        caption: 'Local HTML5 Companion Control Center dashboard',
        isChart: false,
      },
      {
        src: '/projects/companion-luffy.png',
        alt: 'Chibi Luffy desktop companion character sprite',
        caption: 'Luffy companion character asset',
        isChart: true,
      },
      {
        src: '/projects/companion-hamster.png',
        alt: 'White Meme Hamster companion sprite expression',
        caption: 'White Hamster reaction sprite',
        isChart: true,
      },
    ],
    caseStudy: {
      overview:
        'A Windows desktop companion application built with Python and PyQt5 QPainter vector rendering, combining animated screen pets, mood state machines, and built-in productivity tools.',
      whatIBuilt: [
        'Transparent always-on-top desktop overlay supporting 14 characters including Dragon, Puppy, Luffy, Cats, and procedural Chibi animals.',
        'Autonomous behavior engine handling idle breathing, wandering, dragging physics, eating, sleeping, and focus states.',
        'Integrated Pomodoro timer, typing reaction engine, and automatic video-playback sleep detection.',
        'Local HTTP server and HTML5 Control Center (`dashboard.html`) to switch profiles and manage timers.',
      ],
      technology: [
        { name: 'Python 3.13', role: 'Core state machine, mood model, and local web server' },
        { name: 'PyQt5 & QPainter', role: 'Resolution-independent vector rendering and sprite animators' },
        { name: 'Windows Win32 API', role: 'Active window awareness and desktop positioning' },
        { name: 'HTML5 Control Center', role: 'Browser dashboard for settings, chat, and Pomodoro control' },
      ],
      interestingTechnicalWork: [
        'Built pure QPainter vector animators alongside sprite-based character engines so characters remain crisp across high-DPI Windows displays.',
        'Packaged the runtime as a standalone Windows executable using PyInstaller with single-instance locking.',
      ],
      results: [
        'Supports 14 interactive companions, Pomodoro focus sessions, and real-time control via a local REST dashboard.',
      ],
    },
  },
  {
    slug: 'carbonlens',
    aliases: ['prithvi', 'carbon-lens'],
    mainCaseStudy: false,
    title: 'CarbonLens',
    category: 'Web',
    year: '2026',
    shortDescription:
      'A carbon-footprint tracking project focused on understanding everyday environmental impact.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Recharts'],
    image: '/projects/carbonlens-dashboard.png',
    imageFit: 'cover',
    imageAlt: 'CarbonLens web dashboard showing monthly CO2 footprint and Eco Score',
    githubUrl: 'https://github.com/princevyas01/Carbon-Footprint-Awareness-Platform',
    liveUrl: 'https://carbon-footprint-awareness-platforsdfsdfsd2736m-omega.vercel.app/',
    gallery: [
      {
        src: '/projects/carbonlens-dashboard.png',
        alt: 'CarbonLens dashboard displaying monthly footprint, category breakdown, and India average comparison',
        caption: 'Live CarbonLens dashboard',
        isChart: false,
      },
    ],
    caseStudy: {
      overview:
        'An offline-first carbon footprint platform tailored to India, combining state-level electricity emission factors with interactive logging, analytics, and Gemini-assisted mitigation tips.',
      whatIBuilt: [
        'Multi-category carbon emission logging for regional electricity grids, transport, food, and travel.',
        'Interactive analytics dashboard comparing monthly footprint against Indian averages with Recharts.',
        'Eco Score XP and streak system paired with offset calculators and shareable PNG impact cards.',
      ],
      technology: [
        { name: 'Next.js 14 & TypeScript', role: 'App Router pages, client storage, and API routes' },
        { name: 'Recharts', role: 'Trend charts, donut breakdowns, and regional comparisons' },
        { name: 'Tailwind CSS', role: 'Responsive desktop sidebar and mobile tab layouts' },
        { name: 'Gemini 2.0 Flash', role: 'Rate-limited localized suggestions with offline mock fallback' },
      ],
      interestingTechnicalWork: [
        'Grounded grid calculations in the Central Electricity Authority (CEA) CO2 Baseline Database for Indian states instead of generic global averages.',
        'Added PWA offline support and client-side PNG impact card export (`dom-to-image-more`).',
      ],
      results: [
        'Deployed live on Vercel with full offline browser persistence and localized emission benchmarks.',
      ],
    },
  },
  {
    slug: 'lexiguard',
    aliases: ['lexi-guard'],
    mainCaseStudy: false,
    title: 'LexiGuard',
    category: 'Web',
    year: '2026',
    shortDescription:
      'A contract-review prototype that identifies potentially risky clauses with supporting text.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Zod'],
    image: '/projects/lexiguard-ui.png',
    imageFit: 'cover',
    imageAlt: 'LexiGuard contract review interface displaying SaaS agreement risk summary',
    githubUrl: 'https://github.com/princevyas01/LexiGuard-',
    liveUrl: null,
    gallery: [
      {
        src: '/projects/lexiguard-ui.png',
        alt: 'LexiGuard SaaS agreement overview with risk counters and action plan triggers',
        caption: 'Contract overview and verbatim evidence dashboard',
        isChart: false,
      },
    ],
    caseStudy: {
      overview:
        'An evidence-first legal document prototype engineered to surface risky clauses, obligations, and deadlines while grounding every finding to exact quoted text offsets.',
      whatIBuilt: [
        'Five review workflows: plain-language overview, 17-category risk inspection, contract diffing, grounded Q&A, and action checklists.',
        'Deterministic document parser and BM25 lexical retriever supporting PDF, DOCX, TXT, and 1-click offline demo fixtures.',
        'Security boundary enforcing magic-byte file verification, ZIP-bomb bounds, CSP headers, and prompt delimiter isolation.',
      ],
      technology: [
        { name: 'Next.js 14 & TypeScript', role: 'Accessible multi-tab review UI and API endpoints' },
        { name: 'Zod & DOMPurify', role: 'Strict schema validation and untrusted input sanitization' },
        { name: 'BM25 & EvidenceVerifier', role: 'Clause retrieval and verbatim character-offset matching' },
        { name: 'Gemini API / Mock Port', role: 'Swappable LLM adapter with offline synthetic fixture mode' },
      ],
      interestingTechnicalWork: [
        'Built a 6-layer evidence verification pipeline that rejects or downgrades any AI assertion whose `exactQuotedText` does not match the source document.',
        'Treated uploaded contracts as untrusted inputs wrapped in XML containment tags to resist prompt injection.',
      ],
      results: [
        'Ships with deterministic offline demo fixtures, OWASP-aligned file validation, and Vitest/Playwright/axe test suites.',
      ],
    },
  },
  {
    slug: 'stadiumpulse-ai',
    aliases: ['stadiumpulse', 'stadium-pulse'],
    mainCaseStudy: false,
    title: 'StadiumPulse AI',
    category: 'Web',
    year: '2026',
    shortDescription:
      'An event-platform concept with separate experiences for fans, organizers and operations teams.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Gemini API'],
    image: '/projects/stadiumpulse-portal.png',
    imageFit: 'cover',
    imageAlt: 'StadiumPulse AI portal selector for Fan Portal, Ops Command, and Organizer views',
    githubUrl: 'https://github.com/princevyas01/stadiumpulse-ai',
    liveUrl: null,
    gallery: [
      {
        src: '/projects/stadiumpulse-portal.png',
        alt: 'StadiumPulse AI role selector screen',
        caption: 'Role-scoped portal entry screen',
        isChart: false,
      },
      {
        src: '/projects/stadiumpulse-fan.png',
        alt: 'StadiumPulse AI Fan Portal showing Wayfinder, Live Crowd Density, Transit ETA, and Sustainability',
        caption: 'Fan Portal with wayfinding, crowd density, and transit ETAs',
        isChart: false,
      },
    ],
    caseStudy: {
      overview:
        'A three-portal stadium coordination concept built for large sporting events, separating live workflows across Fans, Venue Operations, and Tournament Organizers.',
      whatIBuilt: [
        'Fan Portal featuring AI wayfinding, live crowd density map, shuttle/transit ETA guidance, sustainability stats, and multilingual chat.',
        'Ops Command Center with live incident feed, AI shift briefings, and an Incident Advisor response checklist.',
        'Organizer Command View surfacing tournament-wide KPIs, executive briefings, and gate resource allocation flags.',
      ],
      technology: [
        { name: 'Next.js 14 App Router', role: 'Role-scoped routes (`/fan`, `/ops`, `/organizer`) and API handlers' },
        { name: 'TypeScript & Zod', role: 'Request validation, rate limiting, and input sanitization' },
        { name: 'Gemini 2.0 Flash', role: 'Natural-language wayfinding, briefings, and multilingual support' },
        { name: 'Tailwind CSS & Recharts', role: 'High-contrast accessibility mode and live metrics visualization' },
      ],
      interestingTechnicalWork: [
        'Added a cross-portal Accessibility Mode with screen-reader optimization and automated `jest-axe` accessibility assertions.',
        'Bounded every `/api/*` GenAI endpoint with Zod schema checks, sanitization, and rate limiting.',
      ],
      results: [
        'Delivers three distinct operational views unified around accessibility and validated AI assistance.',
      ],
    },
  },
]

export function getProjectBySlug(slug) {
  if (!slug) return null
  const normalized = slug.toLowerCase()
  return (
    projects.find(
      (project) =>
        project.slug === normalized ||
        (project.aliases && project.aliases.includes(normalized))
    ) || null
  )
}
