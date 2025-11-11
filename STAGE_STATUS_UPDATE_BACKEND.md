# Application Stage Status Update - Backend API Documentation

## Overview
This document describes the backend API endpoint needed to update application stage status (e.g., marking stages as completed). This enables progress tracking across the 4 application phases.

---

## Endpoint: Update Stage Status

### HTTP Method & URL
```
PUT /profile/applications/stages/:stageId
```

### Description
Updates the status of a specific application stage. Used when users mark a stage as "completed" or change its status to "in_progress" or "pending_review".

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `stageId` | string | Yes | The unique identifier of the application stage |

### Request Headers
```
Content-Type: application/json
Authorization: Bearer <token>
```

### Request Body
```json
{
  "status": "completed"
}
```

#### Body Parameters
| Field | Type | Required | Valid Values | Description |
|-------|------|----------|--------------|-------------|
| `status` | string | Yes | `"not_started"`, `"in_progress"`, `"pending_review"`, `"completed"` | The new status for the stage |

### Response

#### Success Response (200 OK)
```json
{
  "id": "stage_123",
  "phase": "esihaku",
  "title": "Täytä esihakemus",
  "description": "Täytä kotikorkeakoulun esihakemuslomake",
  "status": "completed",
  "requiredDocuments": ["Motivaatiokirje", "Opintosuoritusote"],
  "optionalDocuments": ["CV"],
  "deadline": "2025-01-15T23:59:59Z",
  "completedAt": "2025-11-11T14:30:00Z",
  "updatedAt": "2025-11-11T14:30:00Z"
}
```

#### Error Responses

**400 Bad Request** - Invalid status value
```json
{
  "error": "Invalid status value",
  "message": "Status must be one of: not_started, in_progress, pending_review, completed"
}
```

**401 Unauthorized** - Missing or invalid authentication token
```json
{
  "error": "Unauthorized",
  "message": "Authentication token is missing or invalid"
}
```

**404 Not Found** - Stage not found
```json
{
  "error": "Stage not found",
  "message": "Application stage with ID 'stage_123' does not exist"
}
```

**500 Internal Server Error** - Server error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Database Schema

### Table: `application_stages`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(255) | PRIMARY KEY | Unique stage identifier |
| `user_id` | VARCHAR(255) | FOREIGN KEY | Reference to user |
| `phase` | VARCHAR(50) | NOT NULL | One of: esihaku, nomination, apurahat, vaihdon_jalkeen |
| `title` | VARCHAR(255) | NOT NULL | Stage title |
| `description` | TEXT | NOT NULL | Stage description |
| `status` | VARCHAR(50) | NOT NULL, DEFAULT 'not_started' | Current status |
| `required_documents` | JSON | NOT NULL | Array of required document names |
| `optional_documents` | JSON | - | Array of optional document names |
| `external_links` | JSON | - | Array of external service links |
| `deadline` | TIMESTAMP | - | Optional deadline for stage completion |
| `completed_at` | TIMESTAMP | - | When stage was marked as completed |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

### Indexes
```sql
CREATE INDEX idx_stages_user_id ON application_stages(user_id);
CREATE INDEX idx_stages_phase ON application_stages(phase);
CREATE INDEX idx_stages_status ON application_stages(status);
CREATE INDEX idx_stages_user_phase ON application_stages(user_id, phase);
```

---

## Business Logic

### Status Update Rules
1. **not_started → in_progress**: User starts working on a stage
2. **in_progress → pending_review**: User submits for review
3. **pending_review → completed**: Admin/system approves completion
4. **Any status → completed**: User marks as finished (auto-completion)

### Automatic Actions on Status Change

#### When status becomes "completed":
- Set `completed_at` timestamp to current time
- Update `updated_at` timestamp
- Calculate phase progress (completed stages / total stages)
- Send notification (optional)
- Update user's overall application progress

#### When status changes from "completed" to anything else:
- Clear `completed_at` timestamp
- Update `updated_at` timestamp
- Recalculate phase progress

---

## Frontend Integration

### Current Implementation
The frontend calls this endpoint when:
- User clicks "Merkitse valmiiksi" (Mark as complete) button in StageCard component
- Status: `"not_started"` or `"in_progress"` → `"completed"`

### Request Example (Frontend)
```typescript
const updateStageStatus = async (stageId: string, status: ApplicationStatus) => {
  const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
  
  const response = await fetch(`${apiUrl}/profile/applications/stages/${stageId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) throw new Error('Failed to update stage status');
  
  return await response.json();
};
```

---

## Testing Scenarios

### Test Case 1: Mark stage as completed
```bash
curl -X PUT "http://localhost:3000/profile/applications/stages/stage_123" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status": "completed"}'
```

Expected: Status 200, `completed_at` timestamp set, stage marked as completed

### Test Case 2: Invalid status value
```bash
curl -X PUT "http://localhost:3000/profile/applications/stages/stage_123" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status": "invalid_status"}'
```

Expected: Status 400, error message about invalid status

### Test Case 3: Unauthorized request
```bash
curl -X PUT "http://localhost:3000/profile/applications/stages/stage_123" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

Expected: Status 401, unauthorized error

### Test Case 4: Non-existent stage
```bash
curl -X PUT "http://localhost:3000/profile/applications/stages/nonexistent_id" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status": "completed"}'
```

Expected: Status 404, stage not found error

---

## Progress Calculation

The frontend automatically recalculates progress after status updates:

```typescript
// For each phase
const phaseStages = applicationStages.filter(s => s.phase === phase);
const completedStages = phaseStages.filter(s => s.status === "completed");
const progress = (completedStages.length / phaseStages.length) * 100;
```

Example:
- **Esihaku phase**: 3 stages total, 2 completed → 67% progress
- **Nomination phase**: 2 stages total, 0 completed → 0% progress
- **Apurahat phase**: 4 stages total, 4 completed → 100% progress
- **Vaihdon_jalkeen phase**: 1 stage total, 0 completed → 0% progress

**Overall progress**: (2+0+4+0) / (3+2+4+1) = 6/10 = 60%

---

## Related Endpoints

- `GET /profile/applications/stages` - Retrieve all stages for current user
- `GET /profile/applications/stages/:stageId` - Get single stage details
- `POST /profile/applications/documents` - Add documents to stages

---

## Notes for Backend Team

1. **Authentication**: Verify user owns the stage before allowing updates
2. **Validation**: Ensure status transitions are logical (optional business rules)
3. **Timestamps**: Auto-update `updated_at` on every change
4. **Completeness Check**: Only set `completed_at` when status = "completed"
5. **Data Integrity**: Use database transactions for status updates
6. **Audit Trail**: Consider logging all status changes for history
7. **Performance**: Index on `user_id` + `phase` for fast progress queries

---

## Implementation Priority
**HIGH** - This endpoint is critical for the progress tracking feature to work. Without it, users cannot mark stages as complete and progress will always show 0%.
