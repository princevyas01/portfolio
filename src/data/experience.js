/**
 * Verified academic background in chronological order.
 *
 * `semesters` schema supports verified semester-wise SGPA records when available:
 * { semester: 'Sem 1', sgpa: 0.00, scale: 10, verified: true }
 * SGPA is strictly separated from CGPA and is never derived from CGPA.
 */
export const educationTimeline = [
  {
    id: 'ssc-2022',
    year: '2022',
    period: 'Completed 2022',
    degree: 'Secondary Education (10th SSC)',
    institution: 'Shri P. B. Jog English Medium School, Pune',
    summary:
      'Completed secondary education with a strong academic foundation in mathematics and science.',
    scores: [
      {
        id: 'ssc-score',
        label: '10th SSC',
        value: 88.2,
        decimals: 2,
        suffix: '%',
        scale: '',
      },
    ],
    semesters: [],
  },
  {
    id: 'hsc-2024',
    year: '2024',
    period: 'Completed 2024',
    degree: 'Higher Secondary Education (12th HSC)',
    institution: 'Dr. Kalmadi Shamarao Junior College, Pune',
    summary:
      'Completed higher secondary coursework in the Science stream focused on physics, chemistry, and mathematics.',
    scores: [
      {
        id: 'hsc-score',
        label: '12th HSC',
        value: 67.67,
        decimals: 2,
        suffix: '%',
        scale: '',
      },
    ],
    semesters: [],
  },
  {
    id: 'btech-2024-2028',
    year: '2024 — 2028',
    period: '2024 — 2028',
    degree: 'B.Tech in Computer Engineering',
    institution: "Marathwada Mitra Mandal's College of Engineering, Pune",
    summary:
      'Undergraduate coursework covering programming, data structures, databases, operating systems, and applied machine learning.',
    scores: [
      {
        id: 'fy-cgpa',
        label: 'First Year CGPA',
        value: 8.59,
        decimals: 2,
        suffix: '',
        scale: 'CGPA / 10',
      },
      {
        id: 'sy-cgpa',
        label: 'Second Year CGPA',
        value: 7.76,
        decimals: 2,
        suffix: '',
        scale: 'CGPA / 10',
      },
    ],
    // Verified semester-wise SGPA values can be appended here when official transcripts are added.
    semesters: [],
  },
]
