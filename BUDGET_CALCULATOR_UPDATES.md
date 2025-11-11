# Budget Calculator Updates

## Overview
Added comprehensive budget calculation functionality with add/subtract operations for each budget category. Users can now input specific amounts for each category and see real-time calculations comparing their grant amount vs expenses.

---

## Content-Types Updates (va-hybrid-types)

### Update `BudgetEstimateData` type in contentTypes.ts:

```typescript
type BudgetEstimateData = {
  id?: string;
  userId?: string;
  destination: string;
  grantAmount: number; // Monthly grant amount
  categories: Record<string, {
    estimatedCost: number;
    notes?: string;
  }>;
  totalEstimate?: number; // Sum of all category costs
  balance?: number; // grantAmount - totalEstimate
  currency: string;
  createdAt?: string;
  updatedAt?: string;
};
```

**Changes:**
- Added `grantAmount: number` field to store the monthly grant amount
- Added `balance?: number` field for calculated difference
- `totalEstimate` now represents sum of all category costs

---

## Backend API Updates

### Endpoint: `POST /profile/budget-estimate`

**Purpose:** Save or update user's budget estimate

**Request Body:**
```typescript
{
  destination: string;
  grantAmount: number;
  categories: {
    matkakulut: { estimatedCost: number; notes?: string };
    vakuutukset: { estimatedCost: number; notes?: string };
    asuminen: { estimatedCost: number; notes?: string };
    "ruoka ja arki": { estimatedCost: number; notes?: string };
    opintovalineet: { estimatedCost: number; notes?: string };
  };
  currency: string; // Default: "EUR"
}
```

**Response:**
```typescript
{
  id: string;
  userId: string;
  destination: string;
  grantAmount: number;
  categories: { ... };
  totalEstimate: number; // Calculated: sum of all category costs
  balance: number; // Calculated: grantAmount - totalEstimate
  currency: string;
  createdAt: string;
  updatedAt: string;
}
```

**Implementation Notes:**
1. Calculate `totalEstimate` by summing all `categories[key].estimatedCost` values
2. Calculate `balance` as `grantAmount - totalEstimate`
3. Store in database with userId from authenticated user
4. If record exists for userId, update it; otherwise create new

---

### Endpoint: `GET /profile/budget-estimate`

**Purpose:** Retrieve user's budget estimate

**Response:**
```typescript
{
  id: string;
  userId: string;
  destination: string;
  grantAmount: number;
  categories: {
    matkakulut: { estimatedCost: number; notes?: string };
    vakuutukset: { estimatedCost: number; notes?: string };
    asuminen: { estimatedCost: number; notes?: string };
    "ruoka ja arki": { estimatedCost: number; notes?: string };
    opintovalineet: { estimatedCost: number; notes?: string };
  };
  totalEstimate: number;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}
```

**If no estimate exists:** Return `404` or empty object with default values:
```typescript
{
  grantAmount: 0,
  categories: {
    matkakulut: { estimatedCost: 0 },
    vakuutukset: { estimatedCost: 0 },
    asuminen: { estimatedCost: 0 },
    "ruoka ja arki": { estimatedCost: 0 },
    opintovalineet: { estimatedCost: 0 }
  },
  totalEstimate: 0,
  balance: 0,
  currency: "EUR"
}
```

---

## Database Schema

### Collection/Table: `budget_estimates`

```typescript
{
  _id: ObjectId,
  userId: string, // Reference to user
  destination: string,
  grantAmount: number,
  categories: {
    matkakulut: {
      estimatedCost: number,
      notes: string?
    },
    vakuutukset: {
      estimatedCost: number,
      notes: string?
    },
    asuminen: {
      estimatedCost: number,
      notes: string?
    },
    "ruoka ja arki": {
      estimatedCost: number,
      notes: string?
    },
    opintovalineet: {
      estimatedCost: number,
      notes: string?
    }
  },
  totalEstimate: number, // Calculated field
  balance: number, // Calculated field
  currency: string,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId` (unique) - One budget estimate per user
- `updatedAt` - For sorting/filtering

---

## Frontend Integration (Already Implemented)

The frontend now includes:

1. **Grant Amount Slider**: Set monthly grant amount (0-10,000€)
2. **Category Budgets**: Each category has:
   - Current amount display
   - -50€ button (decrease)
   - +50€ button (increase)
   - Direct input field
   - Notes textarea
3. **Real-time Summary**:
   - Grant amount
   - Total expenses (sum of all categories)
   - Balance (grant - expenses) with color coding:
     - Green if positive
     - Red if negative

---

## Future Enhancements (Optional)

1. **Save/Load Functionality**: Connect to backend endpoints to persist data
2. **Multiple Destinations**: Support budget estimates for different exchange destinations
3. **Currency Conversion**: Support multiple currencies with conversion rates
4. **Budget Templates**: Pre-filled templates based on destination country
5. **Export**: Generate PDF report of budget estimate
6. **Historical Tracking**: View budget changes over time
