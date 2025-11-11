# Application Stages Backend API

## Overview
The application stages define the entire exchange application workflow with required documents, deadlines, and external resources. These should be stored in the backend and merged with user-specific progress data.

---

## Content-Types Updates (va-hybrid-types)

### Add `ApplicationStage` type:

```typescript
interface ApplicationStage {
  id: string;
  phase: ApplicationPhase;
  title: string;
  description: string;
  requiredDocuments: string[];
  optionalDocuments?: string[];
  externalLinks?: {
    title: string;
    url: string;
    description: string;
  }[];
  deadline?: string;
}
```

**Note:** The `status` and `completedAt` fields come from user's application progress, not the stage definition.

---

## Backend API

### Endpoint: `GET /profile/applications/stages`

**Purpose:** Get all application stages merged with user's progress

**Response:**
```typescript
{
  stages: [
    {
      id: "esihaku-1",
      phase: "esihaku",
      title: "Sisäinen esihaku",
      description: "Hae oman korkeakoulun sisällä vaihto-ohjelmaan",
      status: "in_progress", // From user's application data
      requiredDocuments: [
        "Vapaamuotoinen hakemus",
        "Motivaatiokirje",
        "Opintosuoritusote",
        "Kielitaitotodistus"
      ],
      deadline: "2025-12-28",
      completedAt: null // From user's application data
    },
    {
      id: "nomination-1",
      phase: "nomination",
      title: "Nomination partneriyliopistoon",
      description: "Kotikorkeakoulu ilmoittaa sinut kohdeyliopistoon",
      status: "not_started",
      requiredDocuments: [
        "Passikopio",
        "Virallinen opintosuoritusote (englanniksi)",
        "Final Learning Agreement"
      ],
      optionalDocuments: [
        "Asumishakemus",
        "Vakuutustodistus"
      ],
      completedAt: null
    },
    {
      id: "apurahat-1",
      phase: "apurahat",
      title: "Erasmus+ apuraha",
      description: "Hae Erasmus+ -apurahaa vaihtoon",
      status: "not_started",
      requiredDocuments: [
        "Erasmus+ Grant Agreement",
        "Learning Agreement"
      ],
      externalLinks: [
        {
          title: "Erasmus+ hakuportaali",
          url: "https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/studying-abroad?pk_source=website&pk_medium=link&pk_campaign=self&pk_content=self-student-exchange",
          description: "Virallinen Erasmus+ hakuportaali"
        }
      ],
      completedAt: null
    },
    {
      id: "apurahat-2",
      phase: "apurahat",
      title: "Kela-tuki",
      description: "Hae opintotukea ulkomaille Kelasta",
      status: "not_started",
      requiredDocuments: [
        "Todistus opiskelusta ulkomailla",
        "Kela-hakemus"
      ],
      externalLinks: [
        {
          title: "Kela",
          url: "https://www.kela.fi/henkiloasiakkaat",
          description: "Hae opintotukea ulkomaille"
        }
      ],
      completedAt: null
    },
    {
      id: "vaihdon-jalkeen-1",
      phase: "vaihdon_jalkeen",
      title: "Opintojen hyväksiluku",
      description: "Suorita vaihdon jälkeiset tehtävät",
      status: "not_started",
      requiredDocuments: [
        "Transcript of Records (virallinen)",
        "Vaihdon loppuraportti",
        "Hyväksilukuhakemus"
      ],
      completedAt: null
    }
  ]
}
```

---

## Database Schema

### Collection: `application_stages`

**Stage Definitions (Static Configuration):**
```typescript
{
  _id: ObjectId,
  id: string,
  phase: "esihaku" | "nomination" | "apurahat" | "vaihdon_jalkeen",
  title: string,
  description: string,
  requiredDocuments: string[],
  optionalDocuments: string[],
  externalLinks: [{
    title: string,
    url: string,
    description: string
  }],
  deadline: Date,
  order: number, // For sorting
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: `user_application_progress`

**User-Specific Progress:**
```typescript
{
  _id: ObjectId,
  userId: string,
  stageId: string, // Reference to application_stages.id
  status: "not_started" | "in_progress" | "completed" | "on_hold",
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId` + `stageId` (unique compound index)
- `stageId`

---

## Implementation Logic

1. **Fetch Stage Definitions:** Query `application_stages` collection
2. **Fetch User Progress:** Query `user_application_progress` for authenticated user
3. **Merge Data:** Combine stage definitions with user progress:
   - Default `status` to `"not_started"` if no progress record exists
   - Default `completedAt` to `null`
   - Include progress data where available
4. **Sort:** Order by `phase` and `order` field
5. **Return:** Combined array of stages with user-specific data

---

## Future Enhancements

1. **Dynamic Deadlines:** Calculate deadlines based on user's exchange start date
2. **Institution-Specific Stages:** Different stage configurations per institution
3. **Stage Dependencies:** Prevent progression until previous stages complete
4. **Notifications:** Alert users of upcoming deadlines
5. **Admin Panel:** UI for managing stage definitions without code changes
