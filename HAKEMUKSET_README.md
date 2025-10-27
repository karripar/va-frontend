# Hakemusten hallinta - Application Management System

## Yleiskuvaus

Hakemusten hallinta on kattava järjestelmä vaihto-ohjelman hakuprosessin seuraamiseen ja hallintaan. Järjestelmä ohjaa opiskelijaa vaiheittain koko vaihtohaun läpi, aina esihakuvaiheesta vaihdon jälkeisiin tehtäviin.

## Vaiheet (Phases)

### 1. Esihaku / Sisäinen haku
- **Kuvaus**: Opiskelija hakee oman korkeakoulun sisällä vaihto-ohjelmaan
- **Toiminnot**:
  - Näytä "Esihaku käynnissä" -tila
  - Lataa lomakkeet (hakemus, motivaatiokirje, opintosuoritusote)
  - Lisää tiedostot "Dokumentit"-osioon
- **Pakolliset dokumentit**:
  - Vapaamuotoinen hakemus
  - Motivaatiokirje
  - Opintosuoritusote
  - Kielitaitotodistus

### 2. Varsinainen haku / Nomination
- **Kuvaus**: Kotikorkeakoulu ilmoittaa opiskelijan kohdeyliopistoon
- **Toiminnot**:
  - Näytä "Nomination lähetetty" -tila
  - Mahdollisuus lisätä: Passikopio, kielitodistus, final Learning Agreement, asumishakemus
- **Pakolliset dokumentit**:
  - Passikopio
  - Virallinen opintosuoritusote (englanniksi)
  - Final Learning Agreement
- **Valinnaiset dokumentit**:
  - Asumishakemus
  - Vakuutustodistus

### 3. Apuraha- ja tukihakemukset
- **Kuvaus**: Erasmus+ ja Kela-hakemukset
- **Toiminnot**:
  - Oma alakohta: "Apurahat ja tuet"
  - Linkit ulkoisiin palveluihin
  - Tallennus kuitteja ja apurahasopimuksia varten
- **Ulkoiset palvelut**:
  - Erasmus+ hakuportaali
  - Kela-palvelut

### 4. Vaihdon jälkeiset hakemukset
- **Kuvaus**: Opintojen hyväksiluku ja palaute
- **Toiminnot**:
  - Lisää "Vaihdon jälkeinen palaute"
  - Lataa Transcript of Records from host
  - Merkitse vaihto valmiiksi
- **Pakolliset dokumentit**:
  - Transcript of Records (virallinen)
  - Vaihdon loppuraportti
  - Hyväksilukuhakemus

## Toteutetut tiedostot

### Frontend-komponentit

1. **`/src/app/profile/hakemukset/page.tsx`**
   - Pääsivu hakemusten hallinnalle
   - Sisältää vaiheittaisen näkymän
   - Dokumenttien hallinta
   - Ulkoisten palveluiden linkit

2. **`/src/app/profile/hakemukset/overview.tsx`**
   - Kompaktimpi yleiskatsausnäkymä
   - Käyttää uusia komponentteja
   - Parempi käytettävyys

3. **`/src/components/applications/DocumentUpload.tsx`**
   - Dokumenttien latauskomponentti
   - Drag & drop -toiminnallisuus
   - Tiedostojen hallinta

4. **`/src/components/applications/ProgressStep.tsx`**
   - Edistymisen visualisointi
   - Vaihekohtainen navigointi
   - Tilaindikaattorit

### Backend-integraatio

5. **`/src/hooks/apiHooks.ts`** (päivitetty)
   - `useApplicationsData()` - Hakemusten tietojen hakeminen
   - `useApplicationDocuments()` - Dokumenttien hallinta
   - Väliaikaiset tyypit sisäänrakennettuina

### Tyypit ja dokumentaatio

6. **`/src/types/applications.ts`**
   - Kaikki tarvittavat TypeScript-tyypit
   - API-endpoints dokumentaatio
   - Lisättävä va-hybrid-types pakettiin

7. **`/src/examples/backend-router.ts`**
   - Esimerkki backend-reitittimestä
   - API-endpoints toteutus
   - Tiedostojen lataus ja hallinta

## Seuraavat askeleet

### va-hybrid-types päivitys
Lisää seuraavat tyypit `va-hybrid-types/contentTypes.ts` tiedostoon:

```typescript
// Kopioi sisältö tiedostosta /src/types/applications.ts
```

### Backend-toteutus
Toteuta seuraavat API-endpoints:

- `GET /api/applications` - Hae käyttäjän hakemukset
- `POST /api/applications/documents` - Lataa dokumentti
- `DELETE /api/applications/documents/:id` - Poista dokumentti
- `PUT /api/applications/:phase` - Päivitä hakemuksen vaihe
- `POST /api/applications/:phase/submit` - Lähetä hakemus

### Tietokanta
Luo seuraavat taulut:

- `applications` - Hakemusten perustiedot
- `application_documents` - Dokumenttien metadata
- `application_phases` - Vaiheiden tila ja tiedot

### Ominaisuuksien täydennys

1. **Notifikaatiot**
   - Sähköposti-ilmoitukset määräajoista
   - Push-notifikaatiot
   - Tilapäivitykset

2. **Validointi**
   - Dokumenttien automaattinen validointi
   - Tiedostotyppien tarkistus
   - Pakollisten kenttien validointi

3. **Raportointi**
   - Hakemuksen etenemisraportti
   - PDF-yhteenveto
   - Tilastot ja analytiikka

4. **Admin-paneeli**
   - Hakemusten hyväksyntä
   - Bulk-toiminnot
   - Käyttäjähallinta

## Käyttöönotto

1. Lisää tyypit va-hybrid-types pakettiin
2. Toteuta backend API-endpoints
3. Konfiguroi tiedostojen tallennuspalvelu (AWS S3, Google Cloud Storage)
4. Testaa komponentit kehitysympäristössä
5. Deploy tuotantoon

## Teknologiat

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express (esimerkki)
- **Tiedostojen tallennus**: Cloud Storage (AWS S3, Google Cloud)
- **Tietokanta**: PostgreSQL/MongoDB (riippuu backend-toteutuksesta)
- **Validointi**: Zod (suositus)
- **Testaus**: Jest, React Testing Library