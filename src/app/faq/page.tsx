"use client";
import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaSearch, FaBook, FaPlane, FaFileAlt, FaMoneyBillWave } from "react-icons/fa";

interface FAQItem {
  id: string;
  category: "Yleistä" | "Hakeminen" | "Apurahat" | "Dokumentit" | "Matkustaminen";
  question: string;
  answer: string;
  links?: { title: string; url: string }[];
}

const faqData: FAQItem[] = [
  {
    id: "1",
    category: "Yleistä",
    question: "Mikä on opiskelijavaihto?",
    answer: "Opiskelijavaihto on mahdollisuus opiskella lukukauden tai lukuvuoden ulkomaisessa partneriyliopistossa osana tutkinto-opintojasi. Voit suorittaa pää- tai sivuainettasi tai suorittaa paikallisia kielikursseja. Tärkeintä on, että kurssivalinnat tukevat tutkintoasi ja ne voidaan hyväksilukea.",
  },
  {
    id: "2",
    category: "Hakeminen",
    question: "Milloin kannattaa aloittaa suunnittelu?",
    answer: "Aloita suunnittelu hyvissä ajoin miettimällä miksi, minne ja milloin haluat lähteä. Hakuprosessit voivat kestää useita kuukausia. Valitse kohdekoulu ja kurssit niin, että ne tukevat Suomessa suoritettuja opintojasi.",
  },
  {
    id: "3",
    category: "Hakeminen",
    question: "Mitä hakeminen edellyttää?",
    answer: "Hakuprosessiin kuuluu yleensä hakulomakkeen täyttäminen ja mahdollinen haastattelu. Motivaatiosi, opintomenestys ja terveydentilasi vaikuttavat valintaan. Opintojesi tulee liittyä tutkintoosi ja niitä tulee voida hyväksilukea. Yliopistoissa vaaditaan usein tietty määrä suoritettuja opintopisteitä.",
  },
  {
    id: "4",
    category: "Hakeminen",
    question: "Mitä dokumentteja tarvitsen?",
    answer: "Tyypillisesti tarvitset:\n• Vapaamuotoinen hakemus\n• Motivaatiokirje\n• Opintosuoritusote (Transcript of Records)\n• Kielitaitotodistus\n• CV (jos vaaditaan)\n\nTarkat vaatimukset riippuvat kohdeyliopistosta.",
  },
  {
    id: "5",
    category: "Apurahat",
    question: "Mitä apurahoja voin saada?",
    answer: "Yleisimmät apurahat:\n• Erasmus+ -apuraha (EU-maat)\n• Kela opintotuki ulkomaille\n• Korkeakoulusi omat apurahat\n• Ulkopuoliset säätiöapurahat\n\nVoit hakea useita apurahoja yhtä aikaa! Voit saada opintotukea, jos vaihto-opintosi hyväksytään osaksi Suomessa suoritettavia opintojasi.",
    links: [
      { title: "Erasmus+ apuraha", url: "https://erasmus-plus.ec.europa.eu" },
      { title: "Kelan opintotuki", url: "https://www.kela.fi/opintotuki-ulkomailla" }
    ]
  },
  {
    id: "6",
    category: "Apurahat",
    question: "Mitä vaihto-opiskelu maksaa?",
    answer: "Hinnat vaihtelevat vaihdon pituuden ja kohdemaan mukaan. Yhden lukukauden mittainen vaihto voi maksaa jopa 6000 euroa. Osa vaihto-ohjelmista on ilmaisia, osassa on ohjelmamaksuja.\n\nLisäkustannuksia:\n• Lentoliput\n• Vakuutukset\n• Taskuraha ja elinkustannukset\n\nErasmus+ -apurahan määrä:\n• Korkeat elinkustannukset: ~540-600€/kk\n• Keskihintaiset: ~490€/kk\n• Edulliset: ~450€/kk",
  },
  {
    id: "7",
    category: "Dokumentit",
    question: "Mikä on Learning Agreement?",
    answer: "Learning Agreement on sopimus sinun, kotikorkeakoulusi ja kohdeyliopiston välillä. Siinä sovitaan, mitä opintojaksoja suoritat vaihdossa ja miten ne hyväksiluetaan. Dokumentti täytetään ennen vaihtoa ja päivitetään tarvittaessa vaihdon aikana.",
  },
  {
    id: "8",
    category: "Dokumentit",
    question: "Tarvitsenko viisumia?",
    answer: "Riippuu kohdemaasta:\n• EU/ETA-maat: Ei viisumia, henkilöllisyystodistus/passi riittää\n• Muut maat: Todennäköisesti opiskeluviisumi\n\nTarkista kohdemaan vaatimukset hyvissä ajoin, viisumiprosessi voi kestää kuukausia!",
  },
  {
    id: "9",
    category: "Matkustaminen",
    question: "Tarvitsenko matkavakuutuksen?",
    answer: "Kyllä! Tarvitset vaihdon ajaksi asianmukaisen vakuutuksen. Vakuutuksen tulee kattaa:\n• Sairauskulut\n• Tapaturmat\n• Vastuuvakuutus\n• Matkatavaravakuutus (suositus)\n\nMonet korkeakoulut tarjoavat opiskelijoille ryhmävakuutuksen.",
  },
  {
    id: "10",
    category: "Matkustaminen",
    question: "Milloin kannattaa varata lennot?",
    answer: "Suositus:\n• Varaa lennot vasta kun olet saanut virallisen hyväksynnän kohdeyliopistosta\n• 2-3 kuukautta etukäteen yleensä hyvä aika\n• Tarkista lentoyhtiön peruutusehdot\n• Muista matkavakuutus!",
  },
  {
    id: "11",
    category: "Yleistä",
    question: "Voiko vaihtoon lähteä kaverin kanssa?",
    answer: "Kyllä voi! Voit lähteä vaihtoon kaverin kanssa, mutta todennäköisesti päädytte eri majoituksiin. Vaihto on henkilökohtainen kokemus, joka tarjoaa mahdollisuuden tutustua uusiin ihmisiin ja kulttuureihin.",
  },
  {
    id: "12",
    category: "Yleistä",
    question: "Mikä on kielitaitovaatimus?",
    answer: "Vaadittu kielitaito riippuu vaihto-ohjelmasta ja kohdemaasta. Opintosi voi suorittaa eri kielillä (englanti, saksa, ranska jne.), mutta kielitaito voi vaikuttaa valintoihisi. Monissa kohteissa vaaditaan kielitaitotodistus (esim. TOEFL, IELTS).",
  },
  {
    id: "13",
    category: "Yleistä",
    question: "Mitä teen jos tarvitsen tukea vaihdon aikana?",
    answer: "Vaihdon aikana:\n• Ota yhteyttä vaihto-ohjelman vastuuhenkilöön ongelmatilanteissa\n• Kotikorkeakoulusi kv-palvelut auttavat etänä\n• Kohdeyliopiston tukipalvelut ovat käytettävissäsi\n\nPalatessa takaisin:\n• Keskustele opintoneuvojasi kanssa, miten paluu sujuu\n• Vaihto-opintojen hyväksiluku hoidetaan kotikorkeakoulussa",
  }
];

const categoryIcons = {
  "Yleistä": FaBook,
  "Hakeminen": FaFileAlt,
  "Apurahat": FaMoneyBillWave,
  "Dokumentit": FaFileAlt,
  "Matkustaminen": FaPlane
};

export default function FAQPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Kaikki");

  const categories = ["Kaikki", ...Array.from(new Set(faqData.map(item => item.category)))];

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Kaikki" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-3">Usein kysytyt kysymykset</h1>
          <p className="text-lg text-white/90">
            Löydä vastaukset yleisimpiin kysymyksiin opiskelijavaihdosta
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Etsi kysymyksiä..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-[#FF5722] text-white"
                  : "bg-white text-gray-700 border hover:border-[#FF5722]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Ei tuloksia haulla &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFAQs.map((item) => {
              const Icon = categoryIcons[item.category];
              const isExpanded = expandedId === item.id;

              return (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="w-full px-6 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors"
                  >
                    <Icon className="text-[#FF5722] mt-1 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.question}</h3>
                      <span className="text-xs text-gray-500">{item.category}</span>
                    </div>
                    {isExpanded ? (
                      <FaChevronUp className="text-gray-400 mt-1 flex-shrink-0" />
                    ) : (
                      <FaChevronDown className="text-gray-400 mt-1 flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-4 pt-2 border-t bg-gray-50">
                      <p className="text-gray-700 whitespace-pre-line mb-3">{item.answer}</p>
                      {item.links && item.links.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-semibold text-gray-600 mb-2">📚 Hyödyllisiä linkkejä:</p>
                          <div className="space-y-1">
                            {item.links.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-sm text-[#FF5722] hover:underline"
                              >
                                → {link.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Contact Card */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <h3 className="font-bold text-gray-900 mb-2">Etkö löytänyt vastausta?</h3>
          <p className="text-gray-700 mb-4">
            Kysy kysymyksesi AI-chatilta tai ota yhteyttä kansainvälisiin palveluihin.
          </p>
          <div className="flex gap-3">
            <a
              href="/ai-chat"
              className="px-4 py-2 bg-[#FF5722] text-white rounded-lg hover:bg-[#E64A19]"
            >
              AI Chat
            </a>
            <a
              href="/contact"
              className="px-4 py-2 bg-white text-gray-700 rounded-lg border hover:bg-gray-50"
            >
              Ota yhteyttä
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
