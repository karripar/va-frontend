# Exchange Stories Backend API

## Overview
Transform student exchange reports into engaging, Instagram-style story cards that inspire future exchange students. Features include photo galleries, highlights, tips, and ratings.

---

## Content-Types Updates (va-hybrid-types)

### Add `ExchangeStory` type:

```typescript
interface ExchangeStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  
  // Exchange details
  destination: string;
  country: string;
  university: string;
  duration: number; // months
  exchangeDate: string; // "2024-01" format
  
  // Story content
  title: string;
  summary: string; // 2-3 sentences
  highlights: string[]; // ["Amazing food culture", "Met lifelong friends"]
  challenges?: string[]; // ["Language barrier", "Housing search"]
  tips: string[]; // ["Book accommodation early", "Learn basic language"]
  
  // Media
  coverPhoto: string; // URL
  photos?: string[]; // Gallery URLs
  
  // Ratings (1-5)
  ratings: {
    overall: number;
    culture: number;
    academics: number;
    social: number;
    costOfLiving: number;
  };
  
  // Engagement
  likes: number;
  saves: number;
  
  // Metadata
  status: "draft" | "published" | "archived";
  tags: string[]; // ["budget-friendly", "erasmus", "asia"]
  createdAt: string;
  updatedAt: string;
}
```

### Add `StoryReaction` type:

```typescript
interface StoryReaction {
  id: string;
  userId: string;
  storyId: string;
  type: "like" | "save";
  createdAt: string;
}
```

---

## Backend API Endpoints

### 1. `GET /tips/stories`

**Purpose:** Get published exchange stories with filtering

**Query Parameters:**
- `country` - Filter by country
- `university` - Filter by university name
- `tags` - Comma-separated tags ("budget-friendly,erasmus")
- `minRating` - Minimum overall rating (1-5)
- `search` - Search in title, summary, university
- `sort` - "recent" | "popular" | "rating" (default: "recent")
- `limit` - Results per page (default: 12)
- `offset` - Pagination offset

**Response:**
```typescript
{
  stories: ExchangeStory[],
  total: number,
  hasMore: boolean
}
```

---

### 2. `GET /tips/stories/:id`

**Purpose:** Get single story details

**Response:**
```typescript
{
  story: ExchangeStory,
  userReaction?: { liked: boolean; saved: boolean }
}
```

---

### 3. `POST /tips/stories`

**Purpose:** Create new exchange story

**Request Body:**
```typescript
{
  destination: string;
  country: string;
  university: string;
  duration: number;
  exchangeDate: string;
  title: string;
  summary: string;
  highlights: string[];
  challenges?: string[];
  tips: string[];
  coverPhoto: string;
  photos?: string[];
  ratings: {
    overall: number;
    culture: number;
    academics: number;
    social: number;
    costOfLiving: number;
  };
  tags: string[];
  status: "draft" | "published";
}
```

**Response:** Created `ExchangeStory`

---

### 4. `PUT /tips/stories/:id`

**Purpose:** Update own story

**Request Body:** Same as POST (partial updates allowed)

**Response:** Updated `ExchangeStory`

---

### 5. `POST /tips/stories/:id/react`

**Purpose:** Like or save a story

**Request Body:**
```typescript
{
  type: "like" | "save";
  action: "add" | "remove"
}
```

**Response:**
```typescript
{
  likes: number;
  saves: number;
  userReaction: { liked: boolean; saved: boolean }
}
```

---

### 6. `GET /tips/featured`

**Purpose:** Get featured/curated stories (admin selected)

**Response:**
```typescript
{
  stories: ExchangeStory[] // Max 6 stories
}
```

---

## Database Schema

### Collection: `exchange_stories`

```typescript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to users
  userName: string,
  userAvatar: string,
  
  destination: string,
  country: string,
  university: string,
  duration: number,
  exchangeDate: string,
  
  title: string,
  summary: string,
  highlights: string[],
  challenges: string[],
  tips: string[],
  
  coverPhoto: string,
  photos: string[],
  
  ratings: {
    overall: number,
    culture: number,
    academics: number,
    social: number,
    costOfLiving: number
  },
  
  likes: number,
  saves: number,
  
  status: string,
  tags: string[],
  featured: boolean, // Admin flag
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId`
- `status` + `createdAt` (compound)
- `country`
- `tags`
- `featured` + `status` (compound)
- Text index on: `title`, `summary`, `university`

---

### Collection: `story_reactions`

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  storyId: ObjectId,
  type: "like" | "save",
  createdAt: Date
}
```

**Indexes:**
- `userId` + `storyId` + `type` (unique compound)
- `storyId`

---

## Implementation Notes

1. **Cover Photo Upload:** Use image upload service (Cloudinary, S3)
2. **Auto-tagging:** Generate tags from country, duration, budget
3. **Moderation:** Admin review before publishing
4. **Analytics:** Track views, click-through rates
5. **Recommendations:** Suggest similar stories based on destination

---

## Future Enhancements

1. **Comments:** Add discussion threads
2. **Verified Badge:** Mark officially reviewed stories
3. **Story Series:** Link multiple posts from same exchange
4. **Video Support:** Add short video clips
5. **Export:** Generate PDF report from story
