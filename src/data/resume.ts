/**
 * Résumé content. The /resume page renders whatever is listed here and shows an
 * "in preparation" row for any section that is still empty.
 *
 * Roles and bullets follow the résumé dated 13 Nov 2025. Two dates are taken from
 * LinkedIn instead, because that record is more recent and more specific: Accenture
 * runs through July 2024, and Sep 2019 — Aug 2021 is Exadatum (Zerogons) followed by
 * Fractal after the acquisition. The BSc years are from LinkedIn; the percentage is
 * from the résumé. The home address and phone number on the PDF are not published.
 */

export interface ResumeEntry {
  /** Role, degree or publication title. */
  title: string;
  /** Employer, institution or venue. */
  organization: string;
  /** Free-form period, e.g. "2022 — Present". */
  period: string;
  location?: string;
  summary?: string;
  highlights?: string[];
  href?: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Resume {
  /** Path or URL to a downloadable PDF, e.g. "/ranjeet-dhumal-resume.pdf" in `public/`. */
  pdf?: string;
  experience: ResumeEntry[];
  education: ResumeEntry[];
  publications: ResumeEntry[];
  skills: SkillGroup[];
}

export const resume: Resume = {
  pdf: undefined,
  experience: [
    {
      title: 'Senior Data Scientist',
      organization: 'Wolters Kluwer',
      period: 'Jun 2024 — Present',
      location: 'Pune',
      summary:
        'Document understanding for Basecone, a product used in the Netherlands and Belgium that processes over six million invoices and receipts a month.',
      highlights: [
        'Built document-split algorithms that separate files containing more than one invoice.',
        'Built receipt classification and field recognition with Gemini 2.5 Flash, reading totals, tax, vendor and related fields.',
        'Fine-tuned LLaMA and Phi models with supervised fine-tuning, PEFT and LoRA for invoice field extraction.',
        'Built outlier detection so anomalous extracted fields can be caught before they are booked.',
      ],
    },
    {
      title: 'Data Science Consultant',
      organization: 'Accenture',
      period: 'Aug 2021 — Jul 2024',
      location: 'Pune',
      highlights: [
        'Led data-science teams for Skills.ai and New Workforce Solution, on AWS, Azure and Python.',
        'Delivered work for T-Mobile, John Deere, McDonald’s and China Petroleum.',
        'Built a BERT model that estimated employee benefits and loyalty from reviews on Indeed and AmbitionBox.',
        'Built a retrieval-augmented chatbot on Azure OpenAI, grounded in documents and a database, and shipped it as a Flask and React application.',
      ],
    },
    {
      title: 'Data Scientist',
      organization: 'Exadatum (Zerogons), then Fractal Analytics',
      period: 'Sep 2019 — Aug 2021',
      location: 'Pune',
      summary:
        'Joined Exadatum (Zerogons) in September 2019. Fractal acquired Zerogons, and the role continued there until August 2021.',
      highlights: [
        'Led a team building drift detection, interpretability and visualization for the Streamflux platform.',
        'Designed language pipelines for entity recognition, document summarization and résumé recommendation.',
        'Delivered computer-vision proofs of concept, including baggage counting and a handwritten-math solver, and mentored interns.',
      ],
    },
    {
      title: 'Data Scientist',
      organization: 'KPIT Technologies',
      period: 'Jul 2018 — Sep 2019',
      location: 'Pune',
      highlights: [
        'Built machine-learning and GIS telematics for Journey Risk Management, in the Connected Mobility division.',
        'Automated analytics pipelines, cutting operational cost by 60%.',
        'Predicted vehicle stoppages, fuel theft, routes and arrival times, and deployed the pipelines on AWS Lambda.',
      ],
    },
    {
      title: 'Data Scientist',
      organization: 'Asquared IoT',
      period: 'Feb 2017 — Jul 2018',
      location: 'Pune',
      highlights: [
        'Built non-intrusive process monitoring from industrial sound, including models that estimate overall equipment effectiveness.',
        'Automated streaming and synchronization on AWS.',
        'The monitoring work was published as WO2019097412A1.',
      ],
    },
    {
      title: 'Research Assistant, Computational Physics',
      organization: 'Center for Modeling and Simulation, Savitribai Phule Pune University',
      period: 'Sep 2015 — Feb 2017',
      location: 'Pune',
      summary:
        'Computational physics, including density-functional theory, and automated data workflows written as shell scripts.',
    },
    {
      title: 'Associate Teacher, Physics',
      organization: 'RLMSS',
      period: 'Jul 2015 — Apr 2016',
      location: 'Pune',
      summary: 'Taught physics to grades 11 and 12.',
    },
  ],
  education: [
    {
      title: 'MSc in Physics (Quantum Mechanics)',
      organization: 'Department of Physics, Savitribai Phule Pune University',
      period: '2013 — 2015',
      location: 'Pune',
      summary: 'CGPA 3.55/5.',
    },
    {
      title: 'BSc in Physics',
      organization: 'Fergusson College',
      period: '2010 — 2013',
      location: 'Pune',
      summary: '79.41%.',
    },
  ],
  publications: [
    {
      title:
        "India's Semiconductor Strategy: A Quantitative Assessment of Fab Economics, Infrastructure Constraints, and the Global Supply Chain Window",
      organization: 'SSRN',
      period: '2026',
      summary:
        'Working paper, posted 14 November 2026. Compares India’s semiconductor incentives with peer industrial policies and asks which process nodes that cost structure can support.',
      href: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7688084',
    },
    {
      title: 'System and method for multimedia-based performance monitoring of an equipment',
      organization: 'WO2019097412A1',
      period: '2019',
      summary:
        'International publication, with Sanjay Singh, Aniruddha Pant and Anand Deshpande. Asquared IoT filed it on 14 Nov 2018; it was published on 23 May 2019. It claims priority from Indian application 201721040616, filed 14 Nov 2017. Google Patents lists it as ceased. It did not enter the European national phase.',
      href: 'https://patents.google.com/patent/WO2019097412A1/en',
    },
  ],
  skills: [
    {
      label: 'Practice',
      items: [
        'Machine learning',
        'Deep learning',
        'Generative AI',
        'Natural language processing',
        'Computer vision',
        'Sound analytics',
        'Predictive modeling',
        'Statistics',
      ],
    },
    {
      label: 'Generative AI',
      items: [
        'LLM fine-tuning',
        'Retrieval-augmented generation',
        'Prompt engineering',
        'LangChain',
        'Hugging Face',
        'OpenAI',
        'FAISS',
        'Pinecone',
        'Chroma',
        'Knowledge graphs',
      ],
    },
    { label: 'Programming', items: ['Python', 'SQL', 'Shell'] },
    {
      label: 'Libraries',
      items: [
        'PyTorch',
        'TensorFlow',
        'scikit-learn',
        'Keras',
        'spaCy',
        'NLTK',
        'Rasa',
        'Featuretools',
        'FastAPI',
        'Streamlit',
      ],
    },
    { label: 'Cloud', items: ['AWS', 'Azure', 'Docker', 'SageMaker', 'CI/CD'] },
    {
      label: 'Data',
      items: ['PostgreSQL', 'MySQL', 'Redshift', 'MongoDB', 'Cassandra', 'SQLite', 'Trino', 'Power BI'],
    },
  ],
};
