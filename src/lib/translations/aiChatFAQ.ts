export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  links?: Array<{ title: string; url: string }>;
}

export const faqTranslations: Record<string, FAQItem[]> = {
  fi: [
    {
      id: "1",
      category: "Yleistä",
      question: "Mikä on opiskelijavaihto?",
      answer:
        "Opiskelijavaihto on mahdollisuus opiskella lukukausi tai -vuosi ulkomaisessa partneriyliopistossa osana tutkinto-opintojasi. \n\n Voit suorittaa pää- tai sivuainettasi tai suorittaa paikallisia kielikursseja. \n\n Tärkeintä on, että kurssivalinnat tukevat tutkintoasi ja ne voidaan hyväksilukea.",
    },
    {
      id: "2",
      category: "Hakeminen",
      question: "Milloin kannattaa aloittaa suunnittelu?",
      answer:
        "Aloita suunnittelu hyvissä ajoin miettimällä miksi, minne ja milloin haluat lähteä. \n\n Hakuprosessit voivat kestää useita kuukausia. \n\n Valitse kohdekoulu ja kurssit niin, että ne tukevat Suomessa suoritettuja opintojasi.",
    },
    {
      id: "3",
      category: "Hakeminen",
      question: "Mitä hakeminen edellyttää?",
      answer:
        "Hakuprosessiin kuuluu yleensä hakulomakkeen täyttäminen ja mahdollinen haastattelu. \n\n Motivaatiosi, opintomenestys ja terveydentilasi vaikuttavat valintaan. \n\n Opintojesi tulee liittyä tutkintoosi ja niitä tulee voida hyväksilukea. Yliopistoissa vaaditaan usein tietty määrä suoritettuja opintopisteitä.",
    },
    {
      id: "4",
      category: "Hakeminen",
      question: "Mitä dokumentteja tarvitsen?",
      answer:
        "Tyypillisesti tarvitset:\n• Vapaamuotoinen hakemus\n• Motivaatiokirje\n• Opintosuoritusote (Transcript of Records)\n• Kielitaitotodistus\n• CV (jos vaaditaan)\n\nTarkat vaatimukset riippuvat kohdeyliopistosta.",
    },
    {
      id: "5",
      category: "Apurahat",
      question: "Mitä apurahoja voin saada?",
      answer:
        "Yleisimmät apurahat:\n• Erasmus+ -apuraha (EU-maat)\n• Kela opintotuki ulkomaille\n• Korkeakoulusi omat apurahat\n• Ulkopuoliset säätiöapurahat\n\nVoit hakea useita apurahoja yhtä aikaa! \n\nVoit saada opintotukea, jos vaihto-opintosi hyväksytään osaksi Suomessa suoritettavia opintojasi.",
      links: [
        { title: "Erasmus+ apuraha", url: "https://erasmus-plus.ec.europa.eu" },
        {
          title: "Kelan opintotuki",
          url: "https://www.kela.fi/opintotuki-ulkomailla",
        },
      ],
    },
    {
      id: "6",
      category: "Apurahat",
      question: "Mitä vaihto-opiskelu maksaa?",
      answer:
        "Kustannukset vaihtelevat vaihdon pituuden ja kohdemaan mukaan. Budjetti suunnittelu kannattaa aloittaa hyvissä ajoin. \n\n Osa vaihto-ohjelmista on ilmaisia, osassa on ohjelmamaksuja.\n\nLisäkustannuksia:\n• Lentoliput\n• Vakuutukset\n• Taskuraha ja elinkustannukset\n\nErasmus+ -apurahan määrä:\n• Korkeat elinkustannukset: ~540-600€/kk\n• Keskihintaiset: ~490€/kk\n• Edulliset: ~450€/kk",
    },
    {
      id: "7",
      category: "Dokumentit",
      question: "Mikä on Learning Agreement?",
      answer:
        "Learning Agreement on sopimus sinun, kotikorkeakoulusi ja kohdeyliopiston välillä. Siinä sovitaan, mitä opintojaksoja suoritat vaihdossa ja miten ne hyväksiluetaan.\n\n Dokumentti täytetään ennen vaihtoa ja päivitetään tarvittaessa vaihdon aikana.",
    },
    {
      id: "8",
      category: "Dokumentit",
      question: "Tarvitsenko viisumia?",
      answer:
        "Riippuu kohdemaasta:\n\n• EU/ETA-maat: Ei viisumia, henkilöllisyystodistus/passi riittää\n• Muut maat: Todennäköisesti opiskeluviisumi\n\nTarkista kohdemaan vaatimukset hyvissä ajoin, viisumiprosessi voi kestää kuukausia!",
    },
    {
      id: "9",
      category: "Matkustaminen",
      question: "Tarvitsenko matkavakuutuksen?",
      answer:
        "Kyllä! Tarvitset vaihdon ajaksi asianmukaisen vakuutuksen. \n\nVakuutuksen tulee kattaa:\n• Sairauskulut\n• Tapaturmat\n• Vastuuvakuutus\n• Matkatavaravakuutus (suositus)\n\nMonet korkeakoulut tarjoavat opiskelijoille ryhmävakuutuksen.",
    },
    {
      id: "10",
      category: "Matkustaminen",
      question: "Milloin kannattaa varata lennot?",
      answer:
        "Suositus:\n• Varaa lennot vasta kun olet saanut virallisen hyväksynnän kohdeyliopistosta\n• 2-3 kuukautta etukäteen yleensä hyvä aika\n• Tarkista lentoyhtiön peruutusehdot\n• Muista matkavakuutus!",
    },
    {
      id: "11",
      category: "Yleistä",
      question: "Voiko vaihtoon lähteä kaverin kanssa?",
      answer:
        "Kyllä voi! Voit lähteä vaihtoon kaverin kanssa, mutta todennäköisesti päädytte eri majoituksiin. \n\nVaihto on henkilökohtainen kokemus, joka tarjoaa mahdollisuuden tutustua uusiin ihmisiin ja kulttuureihin.",
    },
    {
      id: "12",
      category: "Yleistä",
      question: "Mikä on kielitaitovaatimus?",
      answer:
        "Vaadittu kielitaito riippuu vaihto-ohjelmasta ja kohdemaasta.\n\n Opintosi voi suorittaa eri kielillä (englanti, saksa, ranska jne.), mutta kielitaito voi vaikuttaa valintoihisi. \n\nMonissa kohteissa vaaditaan kielitaitotodistus (esim. TOEFL, IELTS).",
    },
    {
      id: "13",
      category: "Yleistä",
      question: "Mitä teen jos tarvitsen tukea vaihdon aikana?",
      answer:
        "Vaihdon aikana:\n• Ota yhteyttä vaihto-ohjelman vastuuhenkilöön ongelmatilanteissa\n• Kotikorkeakoulusi kv-palvelut auttavat etänä\n• Kohdeyliopiston tukipalvelut ovat käytettävissäsi\n\nPalatessa takaisin:\n• Keskustele opintoneuvojasi kanssa, miten paluu sujuu\n• Vaihto-opintojen hyväksiluku hoidetaan kotikorkeakoulussa",
    },
  ],
  en: [
    {
      id: "1",
      category: "General",
      question: "What is student exchange?",
      answer:
        "Student exchange is an opportunity to study for a semester or year at a foreign partner university as part of your degree studies. \n\n You can complete your major or minor subjects or take local language courses. \n\n The most important thing is that your course selections support your degree and can be credited.",
    },
    {
      id: "2",
      category: "Applying",
      question: "When should I start planning?",
      answer:
        "Start planning well in advance by thinking about why, where and when you want to go. \n\n Application processes can take several months. \n\n Choose your host university and courses so that they support your studies in Finland.",
    },
    {
      id: "3",
      category: "Applying",
      question: "What does applying require?",
      answer:
        "The application process usually includes filling out an application form and possibly an interview. \n\n Your motivation, academic performance and health status affect the selection. \n\n Your studies must be related to your degree and must be possible to credit. Universities often require a certain number of completed credits.",
    },
    {
      id: "4",
      category: "Applying",
      question: "What documents do I need?",
      answer:
        "Typically you need:\n• Free-form application\n• Motivation letter\n• Transcript of Records\n• Language proficiency certificate\n• CV (if required)\n\nExact requirements depend on the host university.",
    },
    {
      id: "5",
      category: "Grants",
      question: "What grants can I get?",
      answer:
        "Most common grants:\n• Erasmus+ grant (EU countries)\n• Kela study grant abroad\n• Your university's own grants\n• External foundation grants\n\nYou can apply for several grants at once! \n\nYou can receive study grant if your exchange studies are approved as part of your studies in Finland.",
      links: [
        { title: "Erasmus+ grant", url: "https://erasmus-plus.ec.europa.eu" },
        {
          title: "Kela study grant",
          url: "https://www.kela.fi/opintotuki-ulkomailla",
        },
      ],
    },
    {
      id: "6",
      category: "Grants",
      question: "How much does exchange cost?",
      answer:
        "Costs vary depending on exchange duration and destination country. Budget planning should be started well in advance. \n\n Some exchange programs are free, some have program fees.\n\nAdditional costs:\n• Flight tickets\n• Insurance\n• Pocket money and living costs\n\nErasmus+ grant amount:\n• High living costs: ~540-600€/month\n• Medium prices: ~490€/month\n• Low cost: ~450€/month",
    },
    {
      id: "7",
      category: "Documents",
      question: "What is Learning Agreement?",
      answer:
        "Learning Agreement is a contract between you, your home university and the host university. It defines what courses you will complete during exchange and how they will be credited.\n\n The document is filled in before the exchange and updated if necessary during the exchange.",
    },
    {
      id: "8",
      category: "Documents",
      question: "Do I need a visa?",
      answer:
        "Depends on the destination country:\n\n• EU/EEA countries: No visa, ID card/passport is sufficient\n• Other countries: Probably a student visa\n\nCheck destination country requirements well in advance, visa process can take months!",
    },
    {
      id: "9",
      category: "Traveling",
      question: "Do I need travel insurance?",
      answer:
        "Yes! You need appropriate insurance for the exchange period. \n\nInsurance should cover:\n• Medical expenses\n• Accidents\n• Liability insurance\n• Travel insurance (recommended)\n\nMany universities offer group insurance for students.",
    },
    {
      id: "10",
      category: "Traveling",
      question: "When should I book flights?",
      answer:
        "Recommendation:\n• Book flights only after you have received official acceptance from the host university\n• 2-3 months in advance is usually a good time\n• Check airline cancellation terms\n• Remember travel insurance!",
    },
    {
      id: "11",
      category: "General",
      question: "Can I go on exchange with a friend?",
      answer:
        "Yes you can! You can go on exchange with a friend, but you will probably end up in different accommodation. \n\nExchange is a personal experience that offers an opportunity to meet new people and cultures.",
    },
    {
      id: "12",
      category: "General",
      question: "What is the language requirement?",
      answer:
        "Required language proficiency depends on the exchange program and destination country.\n\n You can complete your studies in different languages (English, German, French, etc.), but language skills may affect your choices. \n\nMany destinations require a language proficiency certificate (e.g. TOEFL, IELTS).",
    },
    {
      id: "13",
      category: "General",
      question: "What do I do if I need support during exchange?",
      answer:
        "During exchange:\n• Contact the exchange program coordinator in problem situations\n• Your home university international services help remotely\n• Host university support services are available\n\nAfter returning:\n• Discuss with your study advisor how the return goes\n• Credit transfer of exchange studies is handled at home university",
    },
  ],
};

export const categoryTranslations: Record<string, Record<string, string>> = {
  fi: {
    All: "Kaikki",
    General: "Yleistä",
    Applying: "Hakeminen",
    Grants: "Apurahat",
    Documents: "Dokumentit",
    Traveling: "Matkustaminen",
  },
  en: {
    All: "All",
    General: "General",
    Applying: "Applying",
    Grants: "Grants",
    Documents: "Documents",
    Traveling: "Traveling",
  },
};
