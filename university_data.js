// ==========================================
// UASD INFORMATICS CURRICULUM (Dynamic Data from User JSON)
// ==========================================

const UASD_CURRICULUM = [
  {
    "semester": 1,
    "name": "Primer Semestre",
    "subjects": [
      {
        "id": "BIO-0170",
        "name": "Biología Básica",
        "cr": 2,
        "ht": 2,
        "hp": 0,
        "prereqs": []
      },
      {
        "id": "BIO-0180",
        "name": "Laboratorio de Biología Básica",
        "cr": 1,
        "ht": 0,
        "hp": 2,
        "prereqs": [
          "BIO-0170"
        ]
      },
      {
        "id": "BIO-2105",
        "name": "Bioética Aplic a la Tecnología",
        "cr": 2,
        "ht": 2,
        "hp": 1,
        "prereqs": []
      },
      {
        "id": "EFI-0120",
        "name": "Educación Física",
        "cr": 2,
        "ht": 1,
        "hp": 2,
        "prereqs": []
      },
      {
        "id": "HIS-0110",
        "name": "Fund de Hist Social Dominicana",
        "cr": 3,
        "ht": 3,
        "hp": 0,
        "prereqs": []
      },
      {
        "id": "LET-0110",
        "name": "Lengua Española Básica I",
        "cr": 3,
        "ht": 3,
        "hp": 1,
        "prereqs": []
      },
      {
        "id": "MAT-0140",
        "name": "Matemática Básica",
        "cr": 4,
        "ht": 4,
        "hp": 0,
        "prereqs": []
      },
      {
        "id": "OSI-0310",
        "name": "Orientación Instituc y Académ",
        "cr": 2,
        "ht": 2,
        "hp": 0,
        "prereqs": []
      },
      {
        "id": "SOC-0100",
        "name": "Introd A Las Ciencias Sociales",
        "cr": 3,
        "ht": 3,
        "hp": 0,
        "prereqs": []
      }
    ]
  },
  {
    "semester": 2,
    "name": "Segundo Semestre",
    "subjects": [
      {
        "id": "FIL-0110",
        "name": "Int a la Filosofía",
        "cr": 3,
        "ht": 3,
        "hp": 0,
        "prereqs": []
      },
      {
        "id": "FIS-0180",
        "name": "Física Básica",
        "cr": 3,
        "ht": 3,
        "hp": 0,
        "prereqs": []
      },
      {
        "id": "FIS-0200",
        "name": "Laboratorio de Física Básica",
        "cr": 1,
        "ht": 0,
        "hp": 3,
        "prereqs": [
          "FIS-0180"
        ]
      },
      {
        "id": "IDI-1113",
        "name": "Inglés Técnico Para Inf",
        "cr": 4,
        "ht": 3,
        "hp": 2,
        "prereqs": []
      },
      {
        "id": "INF-2062",
        "name": "Computación Esencial",
        "cr": 4,
        "ht": 4,
        "hp": 0,
        "prereqs": []
      },
      {
        "id": "INF-2072",
        "name": "Lab de Computación Esencial",
        "cr": 1,
        "ht": 0,
        "hp": 2,
        "prereqs": [
          "INF-2062"
        ]
      },
      {
        "id": "LET-0120",
        "name": "Lengua Española Básica II",
        "cr": 3,
        "ht": 3,
        "hp": 1,
        "prereqs": [
          "LET-0110"
        ]
      },
      {
        "id": "MAT-2332",
        "name": "Álgebra Superior",
        "cr": 5,
        "ht": 4,
        "hp": 2,
        "prereqs": [
          "MAT-0140"
        ]
      }
    ]
  },
  {
    "semester": 3,
    "name": "Tercer Semestre",
    "subjects": [
      {
        "id": "FIS-1153",
        "name": "Física Para Informática",
        "cr": 3,
        "ht": 0,
        "hp": 3,
        "prereqs": [
          "FIS-0180",
          "FIS-0200"
        ]
      },
      {
        "id": "FIS-1163",
        "name": "Lab De Física Para Inf",
        "cr": 1,
        "ht": 0,
        "hp": 3,
        "prereqs": [
          "FIS-0180",
          "FIS-0200"
        ]
      },
      {
        "id": "INF-2084",
        "name": "Organiz y Arq del Computador",
        "cr": 4,
        "ht": 3,
        "hp": 2,
        "prereqs": [
          "INF-2062"
        ]
      },
      {
        "id": "INF-2113",
        "name": "Introd a la Programación",
        "cr": 4,
        "ht": 4,
        "hp": 0,
        "prereqs": [
          "INF-2062"
        ]
      },
      {
        "id": "INF-2123",
        "name": "Lab Introd a la Programación",
        "cr": 1,
        "ht": 0,
        "hp": 2,
        "prereqs": [
          "INF-2072"
        ]
      },
      {
        "id": "MAT-2511",
        "name": "Cálculo y Geom Analítica I",
        "cr": 6,
        "ht": 5,
        "hp": 2,
        "prereqs": [
          "MAT-2332"
        ]
      },
      {
        "id": "QUI-0140",
        "name": "Química Básica",
        "cr": 3,
        "ht": 2,
        "hp": 3,
        "prereqs": []
      }
    ]
  },
  {
    "semester": 4,
    "name": "Cuarto Semestre",
    "subjects": [
      {
        "id": "CON-1112",
        "name": "Fundamentos de Contabilidad",
        "cr": 4,
        "ht": 3,
        "hp": 2,
        "prereqs": [
          "MAT-0140"
        ]
      },
      {
        "id": "INF-2124",
        "name": "Lenguaje de Programación I",
        "cr": 4,
        "ht": 4,
        "hp": 0,
        "prereqs": [
          "INF-2113"
        ]
      },
      {
        "id": "INF-2134",
        "name": "Lab de Lenguaje de Program I",
        "cr": 1,
        "ht": 0,
        "hp": 2,
        "prereqs": [
          "INF-2123"
        ]
      },
      {
        "id": "INF-3244",
        "name": "Sistemas Operativos",
        "cr": 4,
        "ht": 3,
        "hp": 2,
        "prereqs": [
          "INF-2062",
          "INF-2084"
        ]
      },
      {
        "id": "MAT-2956",
        "name": "Matemática Discr para Computac",
        "cr": 4,
        "ht": 3,
        "hp": 2,
        "prereqs": [
          "MAT-0140"
        ]
      },
      {
        "id": "MAT-3512",
        "name": "Cálculo y Geom Analítica II",
        "cr": 6,
        "ht": 5,
        "hp": 2,
        "prereqs": [
          "MAT-2511"
        ]
      }
    ]
  },
  {
    "semester": 5,
    "name": "Quinto Semestre",
    "subjects": [
      {
        "id": "INF-2125",
        "name": "Lenguaje de Programación II",
        "cr": 4,
        "ht": 4,
        "hp": 0,
        "prereqs": [
          "INF-2124"
        ]
      },
      {
        "id": "INF-2135",
        "name": "Lab de Lenguaje Programació II",
        "cr": 1,
        "ht": 0,
        "hp": 2,
        "prereqs": [
          "INF-2134"
        ]
      },
      {
        "id": "INF-2137",
        "name": "Estructura de Datos",
        "cr": 4,
        "ht": 3,
        "hp": 2,
        "prereqs": [
          "INF-2113"
        ]
      },
      {
        "id": "INF-2264",
        "name": "Algoritmos Computacionales",
        "cr": 5,
        "ht": 4,
        "hp": 2,
        "prereqs": [
          "INF-2113",
          "MAT-3512"
        ]
      },
      {
        "id": "INF-2266",
        "name": "Base de Datos I",
        "cr": 5,
        "ht": 4,
        "hp": 2,
        "prereqs": [
          "INF-2113"
        ]
      },
      {
        "id": "MAT-1404",
        "name": "Matemática Financiera",
        "cr": 5,
        "ht": 4,
        "hp": 2,
        "prereqs": [
          "MAT-0140"
        ]
      }
    ]
  },
  {
    "semester": 6,
    "name": "Sexto Semestre",
    "subjects": [
      {
        "id": "EST-1131",
        "name": "Estadística Descriptiva",
        "cr": 4,
        "ht": 3,
        "hp": 2,
        "prereqs": [
          "MAT-0140"
        ]
      },
      {
        "id": "INF-2126",
        "name": "Lenguaje de Programación III",
        "cr": 4,
        "ht": 4,
        "hp": 0,
        "prereqs": [
          "INF-2125"
        ]
      },
      {
        "id": "INF-2136",
        "name": "Lab Lenguaje de Programaci III",
        "cr": 1,
        "ht": 0,
        "hp": 2,
        "prereqs": [
          "INF-2135"
        ]
      },
      {
        "id": "INF-2256",
        "name": "Redes de Proc de Datos",
        "cr": 4,
        "ht": 3,
        "hp": 2,
        "prereqs": [
          "INF-2264",
          "INF-3244"
        ]
      },
      {
        "id": "INF-2346",
        "name": "Análisis y Diseño de Sistemas",
        "cr": 4,
        "ht": 3,
        "hp": 2,
        "prereqs": [
          "INF-2266"
        ]
      },
      {
        "id": "OPT-6A",
        "name": "Asignatura Optativa 6to",
        "cr": 3,
        "ht": 0,
        "hp": 0,
        "prereqs": []
      }
    ]
  },
  {
    "semester": 7,
    "name": "Séptimo Semestre",
    "subjects": [
      {
        "id": "INF-2227",
        "name": "Ingeniería de Software I",
        "cr": 4,
        "ht": 3,
        "hp": 2,
        "prereqs": [
          "INF-2126",
          "INF-2266"
        ]
      },
      {
        "id": "INF-2247",
        "name": "Teleproceso",
        "cr": 4,
        "ht": 3,
        "hp": 2,
        "prereqs": [
          "INF-3244"
        ]
      },
      {
        "id": "INF-2267",
        "name": "Base de Datos II",
        "cr": 5,
        "ht": 4,
        "hp": 2,
        "prereqs": [
          "INF-2266"
        ]
      },
      {
        "id": "INF-2424",
        "name": "Inteligencia Artificial",
        "cr": 5,
        "ht": 4,
        "hp": 2,
        "prereqs": [
          "INF-2264"
        ]
      },
      {
        "id": "OPT-7A",
        "name": "Asignatura Optativa 7mo",
        "cr": 4,
        "ht": 0,
        "hp": 0,
        "prereqs": []
      }
    ]
  },
  {
    "semester": 8,
    "name": "Octavo Semestre",
    "subjects": [
      {
        "id": "INF-2028",
        "name": "Seguridad Informática",
        "cr": 5,
        "ht": 4,
        "hp": 2,
        "prereqs": [
          "INF-3244",
          "INF-2256"
        ]
      },
      {
        "id": "INF-2228",
        "name": "Ingeniería de Software II",
        "cr": 4,
        "ht": 3,
        "hp": 2,
        "prereqs": [
          "INF-2227"
        ]
      },
      {
        "id": "INF-2238",
        "name": "Auditoria Sist Informáticos",
        "cr": 4,
        "ht": 3,
        "hp": 2,
        "prereqs": [
          "INF-3244",
          "INF-2227"
        ]
      },
      {
        "id": "INF-3248",
        "name": "Gestión de Centros de Cómputos",
        "cr": 4,
        "ht": 3,
        "hp": 2,
        "prereqs": [
          "INF-2256",
          "INF-3244"
        ]
      },
      {
        "id": "OPT-8A",
        "name": "Asignatura Optativa 8vo",
        "cr": 5,
        "ht": 0,
        "hp": 0,
        "prereqs": []
      },
      {
        "id": "MAT-3477",
        "name": "Métodos de Optimización",
        "cr": 5,
        "ht": 4,
        "hp": 2,
        "prereqs": [
          "MAT-3512"
        ]
      }
    ]
  },
  {
    "semester": 9,
    "name": "Tesis de Grado",
    "subjects": [
      {
        "id": "INF-6891",
        "name": "Tesis de Grado o Curso Equival",
        "cr": 8,
        "ht": 0,
        "hp": 0,
        "prereqs": []
      }
    ]
  }
];

const UASD_ECONOMIA_CURRICULUM = [
  {
    "semester": 1,
    "name": "Primer Semestre",
    "subjects": [
      { "id": "ECN-2111", "name": "Principios de Economía", "cr": 4, "ht": 3, "hp": 2, "prereqs": [] },
      { "id": "FIL-0110", "name": "Int a la Filosofía", "cr": 3, "ht": 3, "hp": 0, "prereqs": [] },
      { "id": "FIS-0180", "name": "Física Básica", "cr": 3, "ht": 3, "hp": 0, "prereqs": [] },
      { "id": "FIS-0200", "name": "Laboratorio de Física Básica", "cr": 1, "ht": 0, "hp": 3, "prereqs": ["FIS-0180"] },
      { "id": "HIS-0110", "name": "Fund de Hist Social Dominicana", "cr": 3, "ht": 3, "hp": 0, "prereqs": [] },
      { "id": "LET-0110", "name": "Lengua Española Básica I", "cr": 3, "ht": 3, "hp": 1, "prereqs": [] },
      { "id": "MAT-0140", "name": "Matemática Básica", "cr": 4, "ht": 4, "hp": 0, "prereqs": [] },
      { "id": "OSI-0310", "name": "Orientación Instituc y Académ", "cr": 2, "ht": 2, "hp": 0, "prereqs": [] },
      { "id": "SOC-0100", "name": "Introd A Las Ciencias Sociales", "cr": 3, "ht": 3, "hp": 0, "prereqs": [] }
    ]
  },
  {
    "semester": 2,
    "name": "Segundo Semestre",
    "subjects": [
      { "id": "ADM-1128", "name": "Principios de Administración", "cr": 4, "ht": 3, "hp": 2, "prereqs": [] },
      { "id": "BIO-0170", "name": "Biología Básica", "cr": 2, "ht": 2, "hp": 0, "prereqs": [] },
      { "id": "BIO-0180", "name": "Laboratorio de Biología Básica", "cr": 1, "ht": 0, "hp": 2, "prereqs": ["BIO-0170"] },
      { "id": "CON-1112", "name": "Fundamentos de Contabilidad", "cr": 4, "ht": 3, "hp": 2, "prereqs": [] },
      { "id": "ECN-3112", "name": "Historia Económica", "cr": 3, "ht": 2, "hp": 2, "prereqs": ["ECN-2111"] },
      { "id": "ECN-3122", "name": "Met Y Tec De Invest Económica", "cr": 3, "ht": 2, "hp": 2, "prereqs": ["ECN-2111"] },
      { "id": "EFI-0120", "name": "Educación Física", "cr": 2, "ht": 1, "hp": 2, "prereqs": [] },
      { "id": "LET-0120", "name": "Lengua Española Básica II", "cr": 3, "ht": 3, "hp": 1, "prereqs": ["LET-0110"] },
      { "id": "MAT-2501", "name": "Cálculo y Analítica I", "cr": 5, "ht": 5, "hp": 2, "prereqs": ["MAT-0140"] }
    ]
  },
  {
    "semester": 3,
    "name": "Tercer Semestre",
    "subjects": [
      { "id": "CON-3323", "name": "Fund de Contabilidad de Costos", "cr": 4, "ht": 3, "hp": 2, "prereqs": ["CON-1112"] },
      { "id": "ECN-3113", "name": "Microeconomía", "cr": 4, "ht": 3, "hp": 2, "prereqs": ["ECN-2111"] },
      { "id": "ECN-3123", "name": "Técnica De Invest Económica", "cr": 3, "ht": 2, "hp": 2, "prereqs": ["ECN-2111", "ECN-3122"] },
      { "id": "ECN-3212", "name": "Economía Matemática", "cr": 4, "ht": 3, "hp": 2, "prereqs": ["MAT-2501", "ECN-2111"] },
      { "id": "EST-1131", "name": "Estadística Descriptiva", "cr": 4, "ht": 3, "hp": 2, "prereqs": ["MAT-0140"] },
      { "id": "QUI-0140", "name": "Química Básica", "cr": 3, "ht": 2, "hp": 3, "prereqs": [] },
      { "id": "SOC-2202", "name": "Fund Sociología General", "cr": 4, "ht": 3, "hp": 2, "prereqs": ["SOC-0100"] }
    ]
  },
  {
    "semester": 4,
    "name": "Cuarto Semestre",
    "subjects": [
      { "id": "ECN-3104", "name": "Macroeconomía", "cr": 4, "ht": 3, "hp": 2, "prereqs": ["ECN-2111", "ECN-3113"] },
      { "id": "ECN-3124", "name": "Microeconomía Avanzada", "cr": 4, "ht": 3, "hp": 2, "prereqs": ["ECN-3113"] },
      { "id": "ECN-3134", "name": "Economía Regulatoria", "cr": 3, "ht": 2, "hp": 2, "prereqs": ["ECN-3113"] },
      { "id": "ECN-3144", "name": "Economía de la Seguridad Social", "cr": 3, "ht": 2, "hp": 2, "prereqs": ["ECN-3113"] },
      { "id": "ECN-3214", "name": "Pensamiento Económico", "cr": 3, "ht": 2, "hp": 2, "prereqs": ["ECN-3112", "ECN-3113"] },
      { "id": "EST-2221", "name": "Estadística Inferencial", "cr": 4, "ht": 3, "hp": 2, "prereqs": ["EST-1131"] },
      { "id": "MER-2124", "name": "Fundamentos de Mercadotecnia", "cr": 4, "ht": 3, "hp": 2, "prereqs": [] }
    ]
  },
  {
    "semester": 5,
    "name": "Quinto Semestre",
    "subjects": [
      { "id": "DER-1635", "name": "Derecho Aplicado A La Economía", "cr": 3, "ht": 2, "hp": 2, "prereqs": [] },
      { "id": "ECN-3125", "name": "Macroeconomía Avanzada", "cr": 4, "ht": 3, "hp": 2, "prereqs": ["ECN-3104"] },
      { "id": "ECN-3235", "name": "Economía Política", "cr": 5, "ht": 4, "hp": 2, "prereqs": ["ECN-3124", "ECN-2111"] },
      { "id": "ECN-3305", "name": "Desarrollo Económico", "cr": 3, "ht": 2, "hp": 2, "prereqs": ["ECN-3124"] },
      { "id": "ECN-3315", "name": "Cuentas Nacionales", "cr": 3, "ht": 2, "hp": 2, "prereqs": ["ECN-3104"] },
      { "id": "MAT-1404", "name": "Matemática Financiera", "cr": 5, "ht": 4, "hp": 2, "prereqs": ["MAT-2501"] }
    ]
  },
  {
    "semester": 6,
    "name": "Sexto Semestre",
    "subjects": [
      { "id": "ECN-3206", "name": "Desarrollo Económico Avanzado", "cr": 3, "ht": 2, "hp": 2, "prereqs": ["ECN-3305"] },
      { "id": "ECN-3246", "name": "Economía Dominicana", "cr": 4, "ht": 3, "hp": 2, "prereqs": ["ECN-3235", "ECN-3104"] },
      { "id": "ECN-3307", "name": "Economía Agrícola", "cr": 4, "ht": 3, "hp": 2, "prereqs": ["ECN-3104"] },
      { "id": "ECN-3316", "name": "Economía Monetaria y Bancaria", "cr": 4, "ht": 3, "hp": 2, "prereqs": ["ECN-3125"] },
      { "id": "ECN-3326", "name": "Econometría", "cr": 4, "ht": 3, "hp": 2, "prereqs": ["ECN-3125", "EST-2221"] },
      { "id": "GEO-1435", "name": "Geografía Económica", "cr": 3, "ht": 2, "hp": 2, "prereqs": [] }
    ]
  },
  {
    "semester": 7,
    "name": "Séptimo Semestre",
    "subjects": [
      { "id": "ECN-2297", "name": "Programación Y Planificación", "cr": 4, "ht": 3, "hp": 2, "prereqs": ["ECN-3307"] },
      { "id": "ECN-3317", "name": "Economía Industrial", "cr": 4, "ht": 3, "hp": 2, "prereqs": ["ECN-3104"] },
      { "id": "ECN-3327", "name": "Ecn y Cooperac Internacional", "cr": 4, "ht": 3, "hp": 2, "prereqs": ["ECN-3104"] },
      { "id": "ECN-3337", "name": "Investigación Ecn Operacional", "cr": 3, "ht": 2, "hp": 2, "prereqs": ["ECN-3104"] },
      { "id": "ECN-3347", "name": "Política Económica", "cr": 4, "ht": 3, "hp": 2, "prereqs": ["ECN-3125", "ECN-3104"] },
      { "id": "EST-3503", "name": "Demografía I", "cr": 3, "ht": 2, "hp": 2, "prereqs": [] }
    ]
  },
  {
    "semester": 8,
    "name": "Octavo Semestre",
    "subjects": [
      { "id": "ECN-3108", "name": "Finanzas Públicas y Legisl Fis", "cr": 4, "ht": 3, "hp": 2, "prereqs": ["ECN-3125", "ECN-3347"] },
      { "id": "ECN-3218", "name": "Formul y Evaluac De Proyectos", "cr": 4, "ht": 3, "hp": 2, "prereqs": ["ECN-3347", "ECN-3337", "ECN-3125"] },
      { "id": "ECN-3318", "name": "Seminario de Investigación", "cr": 3, "ht": 2, "hp": 2, "prereqs": ["ECN-3123", "ECN-3327", "ECN-3347"] },
      { "id": "ECN-3328", "name": "Economía Dominicana Y Contemp", "cr": 3, "ht": 2, "hp": 2, "prereqs": ["ECN-3246"] },
      { "id": "ECN-4348", "name": "Pasantía en Invest Socioeconóm", "cr": 5, "ht": 0, "hp": 10, "prereqs": [] },
      { "id": "SOC-1104", "name": "Género y Corresponsabilidad", "cr": 1, "ht": 0, "hp": 2, "prereqs": ["SOC-2202"] }
    ]
  },
  {
    "semester": 9,
    "name": "Noveno Semestre",
    "subjects": [
      { "id": "ECN-6360", "name": "Tesis De Grado O Curso Equival", "cr": 8, "ht": 0, "hp": 0, "prereqs": [] }
    ]
  }
];

const UNIVERSITY_CATALOG = [
  {
    "id": "uasd",
    "name": "Universidad Autónoma de Santo Domingo",
    "careers": [
      {
        "id": "uasd-informatica",
        "code": "LINF",
        "name": "Licenciatura en Informática",
        "plan": "Plan actual",
        "curriculum": UASD_CURRICULUM
      },
      {
        "id": "uasd-economia",
        "code": "LECO",
        "name": "Licenciatura en Economía",
        "plan": "Plan 202510",
        "curriculum": UASD_ECONOMIA_CURRICULUM
      }
    ]
  }
];

window.UNIVERSITY_CATALOG = UNIVERSITY_CATALOG;

function getUasdPoints(grade) {
  if (grade >= 90) return 4.0;
  if (grade >= 80) return 3.0;
  if (grade >= 70) return 2.0;
  return 0.0;
}
