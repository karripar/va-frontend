import { ApplicationPhase } from "va-hybrid-types/contentTypes";

interface TaskDocument {
  id: string;
  label: string;
  required: boolean;
}

interface TaskTile {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  documents: TaskDocument[];
  reminderTitle?: string;
  reminderText?: string;
  reminderLink?: string;
  reminderLinkText?: string;
}

export const phaseTasksTranslations: Record<string, Record<ApplicationPhase, TaskTile[]>> = {
  fi: {
    esihaku: [
      {
        id: "sisainen-hakemus",
        title: "Metropolian sisäinen hakemus",
        subtitle: "Täytä online-hakemus Mobility Onlinessa",
        description: "Täytä online-hakemus. Hakuajat: Syyslukukausi ja koko lukuvuosi: 15.3. - 1.5. (suositeltu määräaika EU:n ulkopuolisille opiskelijoille: 1.4.). Kevätlukukausi: 15.9. - 1.11. (suositeltu määräaika EU:n ulkopuolisille opiskelijoille: 1.10.). Vaadittavat dokumentit: Virallinen opintosuoritusote englanniksi ja Learning Agreement.",
        icon: "📝",
        color: "blue",
        documents: [
          { id: "transcript-of-records", label: "Virallinen opintosuoritusote (englanniksi)", required: true },
          { id: "learning-agreement", label: "Learning Agreement", required: true },
        ],
        reminderTitle: "Muista lähettää hakemus Mobility Onlinessa!",
        reminderText: "Hakuajat: Syyslukukausi ja koko lukuvuosi: 15.3. - 1.5. Kevätlukukausi: 15.9. - 1.11. Varmista että olet valmistellut kaikki vaaditut dokumentit.",
        reminderLink: "https://www.service4mobility.com/europe/MessageServlet?msg=No+application+possible+at+the+moment.+The+application+period+has+expired%21%3Cbr%3E%3Cbr%3EThe+application+period+was+15.09.2025+00%3A00%3A00+-+01.11.2025+23%3A59%3A00&msgButtonURL=close&isClearScrolled=1&msgButtonLabel=Close+window",
        reminderLinkText: "Avaa Mobility Online hakemus"
      },
      {
        id: "hakuinfot",
        title: "Osallistu hakuinfoihin",
        subtitle: "Alakohtaiset infotilaisuudet",
        description: "Osallistu alakohtaisiin hakuinfoihin ja tutustu U!REKA-allianssin mahdollisuuksiin. Lue vaihtoraportit OMASta ja valmistaudu hakuprosessiin.",
        icon: "🎓",
        color: "purple",
        documents: [
          { id: "infotilaisuus-muistiinpanot", label: "Infotilaisuuden muistiinpanot", required: false },
        ],
        reminderTitle: "Valmistaudu huolellisesti",
        reminderText: "Valinnassa painotetaan: opintomenestys, motivaatio, kielitaito ja kv-aktiivisuus. Varmista että täytät kriteerit: vähintään 60 op suoritettu."
      }
    ],
    nomination: [
      {
        id: "vahvistus",
        title: "Vahvista vaihtopaikka",
        subtitle: "7 päivän sisällä hyväksynnästä",
        description: "Kun saat hyväksynnän Metropolian sisäisestä hausta, vahvista paikka 7 päivän sisällä. Tämä on pakollista vaihtopaikan säilyttämiseksi.",
        icon: "✅",
        color: "green",
        documents: [
          { id: "hyvaksymiskirje", label: "Hyväksymiskirje Metropolialta", required: true },
          { id: "vahvistus-dokumentti", label: "Vahvistusdokumentti", required: true },
        ],
        reminderTitle: "Toimita vahvistus ajoissa!",
        reminderText: "Muista vahvistaa paikkasi 7 päivän sisällä. Lähetä vahvistus kv-asiantuntijalle.",
        reminderLink: "https://oma.metropolia.fi/",
        reminderLinkText: "Siirry OMAan"
      },
      {
        id: "kohdekoulun-hakemus",
        title: "Kohdekoulun hakemus",
        subtitle: "Dokumentit kohdekoululle",
        description: "Selvitä kohdekoulun hakuprosessi ja aikataulu. Valmistele tarvittavat dokumentit: opintosuoritusote, CV, motivaatiokirje ja vakuutustodistus.",
        icon: "🌍",
        color: "blue",
        documents: [
          { id: "opintosuoritusote", label: "Opintosuoritusote (Transcript of Records)", required: true },
          { id: "cv", label: "CV (englanniksi)", required: true },
          { id: "motivaatiokirje", label: "Motivaatiokirje", required: true },
          { id: "vakuutustodistus", label: "Vakuutustodistus", required: false },
          { id: "ols-kielitesti", label: "OLS-kielitesti", required: false },
        ],
        reminderTitle: "Lähetä dokumentit kohdekoululle",
        reminderText: "Kun kaikki dokumentit on valmiina, lähetä ne kohdekoulusi hakuportaaliin tai kv-koordinaattorille heidän ohjeidensa mukaisesti."
      },
      {
        id: "orientaatio",
        title: "Vaihto-orientaatiot",
        subtitle: "Pakolliset infotilaisuudet",
        description: "Osallistu pakollisiin vaihto-orientaatioihin. Saat tärkeää tietoa hakuprosessista, dokumenteista ja käytännön asioista.",
        icon: "📚",
        color: "orange",
        documents: [
          { id: "orientaatio-todistus", label: "Osallistumistodistus", required: false },
        ],
        reminderTitle: "Osallistu orientaatioon",
        reminderText: "Orientaatiot ovat pakollisia. Merkitse kalenteriisi ja osallistu!"
      }
    ],
    apurahat: [
      {
        id: "erasmus-apuraha",
        title: "Erasmus+ Apuraha",
        subtitle: "EU-maiden vaihto",
        description: "Hae Erasmus+-apurahaa jos vaihto on EU/ETA-maahan. Apurahan määrä riippuu kohdemaasta (450-600€/kk). Täytä hakemus ja toimita tarvittavat dokumentit.",
        icon: "💶",
        color: "blue",
        documents: [
          { id: "erasmus-hakemus", label: "Erasmus+-hakemus", required: true },
          { id: "learning-agreement-apuraha", label: "Learning Agreement", required: true },
          { id: "hyvaksymiskirje-apuraha", label: "Hyväksymiskirje", required: true },
        ],
        reminderTitle: "Erasmus+ apuraha",
        reminderText: "Muista hakea Erasmus+-apurahaa ajoissa. Apuraha maksetaan kahdessa erässä: 80% alussa, 20% lopussa.",
        reminderLink: "https://erasmus-plus.ec.europa.eu",
        reminderLinkText: "Erasmus+ tiedot"
      },
      {
        id: "kela-opintotuki",
        title: "Kela Opintotuki",
        subtitle: "Opintotuki ulkomailla",
        description: "Hae Kelan opintotukea vaihto-opintojasi varten. Voit saada opintotukea jos vaihto-opinnot hyväksytään osaksi Suomessa suoritettavia opintojasi.",
        icon: "🏠",
        color: "green",
        documents: [
          { id: "kela-todistus", label: "Todistus korkeakoulusta", required: true },
          { id: "kela-hakemus", label: "Kelan opintotukihakemus", required: true },
        ],
        reminderTitle: "Kelan opintotuki",
        reminderText: "Hae opintotukea hyvissä ajoin ennen lähtöä.",
        reminderLink: "https://www.kela.fi/opintotuki-ulkomailla",
        reminderLinkText: "Kelan opintotuki"
      },
      {
        id: "vihrean-matkustamisen-tuki",
        title: "Vihreän matkustamisen tuki",
        subtitle: "Lisätuki ympäristöystävällisestä matkustamisesta",
        description: "Jos matkustat kohteeseen ympäristöystävällisesti (juna, bussi, linja-auto), voit hakea lisätukea. Tuki on 50€ ylimääräistä apurahaa.",
        icon: "🌱",
        color: "emerald",
        documents: [
          { id: "vihrean-matkustamisen-todiste", label: "Matkalippu/todiste", required: true },
        ],
        reminderTitle: "Vihreä matkustaminen",
        reminderText: "Säästä matkalippu todisteeksi vihreän matkustamisen tuesta."
      }
    ],
    vaihdon_jalkeen: [
      {
        id: "transcript-of-records-vaihto",
        title: "Transcript of Records",
        subtitle: "Opintosuoritusten vahvistus",
        description: "Pyydä Transcript of Records kohdeyliopistolta vaihdon päätyttyä. Tarvitset sen opintojen hyväksilukua varten.",
        icon: "📜",
        color: "blue",
        documents: [
          { id: "tor-kohdeyliopistosta", label: "Transcript of Records (kohdekoulusta)", required: true },
        ],
        reminderTitle: "Pyydä Transcript of Records",
        reminderText: "Muista pyytää virallinen Transcript of Records ennen kotiinpaluuta tai heti sen jälkeen."
      },
      {
        id: "hyv aksiluku",
        title: "Opintojen hyväksiluku",
        subtitle: "Siirtä opinnot Metropoliaan",
        description: "Toimita Transcript of Records opintoneuvojallesi ja hae opintojen hyväksilukua. Varmista että vaihto-opinnot sisältyvät tutkintoosi.",
        icon: "✓",
        color: "green",
        documents: [
          { id: "hyvaksiluku-hakemus", label: "Hyväksilukuhakemus", required: true },
          { id: "tor-hyvaksiluku", label: "Transcript of Records", required: true },
        ],
        reminderTitle: "Hae hyväksilukua",
        reminderText: "Ota yhteyttä opintoneuvojaan ja hae vaihto-opintojen hyväksilukua."
      },
      {
        id: "loppuraportti",
        title: "Vaihdon loppuraportti",
        subtitle: "Kerro kokemuksistasi",
        description: "Kirjoita loppuraportti vaihtokokemuksestasi. Raportti auttaa tulevia vaihto-opiskelijoita ja on pakollinen osa vaihtoprosessia.",
        icon: "📝",
        color: "purple",
        documents: [
          { id: "loppuraportti-dokumentti", label: "Loppuraportti", required: true },
        ],
        reminderTitle: "Kirjoita loppuraportti",
        reminderText: "Kirjoita loppuraportti kokemuksistasi. Jaa vinkkejä tuleville vaihto-opiskelijoille!"
      }
    ]
  },
  en: {
    esihaku: [
      {
        id: "sisainen-hakemus",
        title: "Metropolia Internal Application",
        subtitle: "Fill in online application in Mobility Online",
        description: "Fill in the online application. Application periods: Autumn Semester and Full Academic Year: March 15 - May 1 (recommended deadline for non-EU students: April 1). Spring Semester: September 15 - November 1 (recommended deadline for non-EU students: October 1). Required documents: Official Transcript of Records in English and Learning Agreement.",
        icon: "📝",
        color: "blue",
        documents: [
          { id: "transcript-of-records", label: "Official Transcript of Records (English)", required: true },
          { id: "learning-agreement", label: "Learning Agreement", required: true },
        ],
        reminderTitle: "Remember to submit your application in Mobility Online!",
        reminderText: "Application periods: Autumn Semester and Full Academic Year: March 15 - May 1. Spring Semester: September 15 - November 1. Make sure you have prepared all required documents.",
        reminderLink: "https://www.service4mobility.com/europe/MessageServlet?msg=No+application+possible+at+the+moment.+The+application+period+has+expired%21%3Cbr%3E%3Cbr%3EThe+application+period+was+15.09.2025+00%3A00%3A00+-+01.11.2025+23%3A59%3A00&msgButtonURL=close&isClearScrolled=1&msgButtonLabel=Close+window",
        reminderLinkText: "Open Mobility Online application"
      },
      {
        id: "hakuinfot",
        title: "Attend Application Info Sessions",
        subtitle: "Field-specific information sessions",
        description: "Attend field-specific application info sessions and learn about U!REKA alliance opportunities. Read exchange reports from OMA and prepare for the application process.",
        icon: "🎓",
        color: "purple",
        documents: [
          { id: "infotilaisuus-muistiinpanot", label: "Info session notes", required: false },
        ],
        reminderTitle: "Prepare carefully",
        reminderText: "Selection emphasizes: academic performance, motivation, language skills and international activity. Make sure you meet the criteria: at least 60 ECTS completed."
      }
    ],
    nomination: [
      {
        id: "vahvistus",
        title: "Confirm Exchange Place",
        subtitle: "Within 7 days of acceptance",
        description: "When you receive acceptance from Metropolia's internal application, confirm your place within 7 days. This is mandatory to keep your exchange place.",
        icon: "✅",
        color: "green",
        documents: [
          { id: "hyvaksymiskirje", label: "Acceptance letter from Metropolia", required: true },
          { id: "vahvistus-dokumentti", label: "Confirmation document", required: true },
        ],
        reminderTitle: "Submit confirmation on time!",
        reminderText: "Remember to confirm your place within 7 days. Send confirmation to the international services specialist.",
        reminderLink: "https://oma.metropolia.fi/",
        reminderLinkText: "Go to OMA"
      },
      {
        id: "kohdekoulun-hakemus",
        title: "Host University Application",
        subtitle: "Documents for host university",
        description: "Find out your host university's application process and timeline. Prepare required documents: transcript of records, CV, motivation letter and insurance certificate.",
        icon: "🌍",
        color: "blue",
        documents: [
          { id: "opintosuoritusote", label: "Transcript of Records", required: true },
          { id: "cv", label: "CV (in English)", required: true },
          { id: "motivaatiokirje", label: "Motivation letter", required: true },
          { id: "vakuutustodistus", label: "Insurance certificate", required: false },
          { id: "ols-kielitesti", label: "OLS language test", required: false },
        ],
        reminderTitle: "Send documents to host university",
        reminderText: "When all documents are ready, send them to your host university's application portal or international coordinator according to their instructions."
      },
      {
        id: "orientaatio",
        title: "Exchange Orientations",
        subtitle: "Mandatory info sessions",
        description: "Attend mandatory exchange orientations. You will receive important information about the application process, documents and practical matters.",
        icon: "📚",
        color: "orange",
        documents: [
          { id: "orientaatio-todistus", label: "Participation certificate", required: false },
        ],
        reminderTitle: "Attend orientation",
        reminderText: "Orientations are mandatory. Mark your calendar and participate!"
      }
    ],
    apurahat: [
      {
        id: "erasmus-apuraha",
        title: "Erasmus+ Grant",
        subtitle: "EU country exchange",
        description: "Apply for Erasmus+ grant if your exchange is to an EU/EEA country. Grant amount depends on the destination country (450-600€/month). Fill in the application and submit required documents.",
        icon: "💶",
        color: "blue",
        documents: [
          { id: "erasmus-hakemus", label: "Erasmus+ application", required: true },
          { id: "learning-agreement-apuraha", label: "Learning Agreement", required: true },
          { id: "hyvaksymiskirje-apuraha", label: "Acceptance letter", required: true },
        ],
        reminderTitle: "Erasmus+ grant",
        reminderText: "Remember to apply for Erasmus+ grant on time. Grant is paid in two installments: 80% at the beginning, 20% at the end.",
        reminderLink: "https://erasmus-plus.ec.europa.eu",
        reminderLinkText: "Erasmus+ information"
      },
      {
        id: "kela-opintotuki",
        title: "Kela Study Grant",
        subtitle: "Study grant abroad",
        description: "Apply for Kela study grant for your exchange studies. You can receive study grant if your exchange studies are approved as part of your studies in Finland.",
        icon: "🏠",
        color: "green",
        documents: [
          { id: "kela-todistus", label: "Certificate from university", required: true },
          { id: "kela-hakemus", label: "Kela study grant application", required: true },
        ],
        reminderTitle: "Kela study grant",
        reminderText: "Apply for study grant well in advance before departure.",
        reminderLink: "https://www.kela.fi/opintotuki-ulkomailla",
        reminderLinkText: "Kela study grant"
      },
      {
        id: "vihrean-matkustamisen-tuki",
        title: "Green Travel Support",
        subtitle: "Additional support for eco-friendly travel",
        description: "If you travel to your destination in an environmentally friendly way (train, bus, coach), you can apply for additional support. The support is an extra €50 grant.",
        icon: "🌱",
        color: "emerald",
        documents: [
          { id: "vihrean-matkustamisen-todiste", label: "Travel ticket/proof", required: true },
        ],
        reminderTitle: "Green travel",
        reminderText: "Save your travel ticket as proof for green travel support."
      }
    ],
    vaihdon_jalkeen: [
      {
        id: "transcript-of-records-vaihto",
        title: "Transcript of Records",
        subtitle: "Confirmation of study achievements",
        description: "Request a Transcript of Records from your host university after the exchange ends. You need it for credit transfer.",
        icon: "📜",
        color: "blue",
        documents: [
          { id: "tor-kohdeyliopistosta", label: "Transcript of Records (from host university)", required: true },
        ],
        reminderTitle: "Request Transcript of Records",
        reminderText: "Remember to request an official Transcript of Records before returning home or immediately after."
      },
      {
        id: "hyvaksiluku",
        title: "Credit Transfer",
        subtitle: "Transfer studies to Metropolia",
        description: "Submit the Transcript of Records to your study advisor and apply for credit transfer. Make sure your exchange studies are included in your degree.",
        icon: "✓",
        color: "green",
        documents: [
          { id: "hyvaksiluku-hakemus", label: "Credit transfer application", required: true },
          { id: "tor-hyvaksiluku", label: "Transcript of Records", required: true },
        ],
        reminderTitle: "Apply for credit transfer",
        reminderText: "Contact your study advisor and apply for credit transfer of exchange studies."
      },
      {
        id: "loppuraportti",
        title: "Final Exchange Report",
        subtitle: "Share your experiences",
        description: "Write a final report about your exchange experience. The report helps future exchange students and is a mandatory part of the exchange process.",
        icon: "📝",
        color: "purple",
        documents: [
          { id: "loppuraportti-dokumentti", label: "Final report", required: true },
        ],
        reminderTitle: "Write final report",
        reminderText: "Write a final report about your experiences. Share tips for future exchange students!"
      }
    ]
  }
};
