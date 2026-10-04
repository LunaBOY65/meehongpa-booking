### Database Schema (PostgreSQL Target)

```SQL
CREATE TABLE users (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
email VARCHAR(255) UNIQUE NOT NULL,
password_hash VARCHAR(255) NOT NULL,
full_name VARCHAR(150) NOT NULL,
department VARCHAR(100),
role VARCHAR(20) DEFAULT 'MEMBER' CHECK (role IN ('MEMBER', 'ADMIN')),
no_show_count INT DEFAULT 0,
is_locked BOOLEAN DEFAULT FALSE,
created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rooms (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(100) NOT NULL,
capacity INT NOT NULL,
building VARCHAR(50) NOT NULL,
floor VARCHAR(20) NOT NULL,
requires_approval BOOLEAN DEFAULT FALSE,
is_active BOOLEAN DEFAULT TRUE,
image_url VARCHAR,
created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bookings (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
title VARCHAR(150) NOT NULL,
start_time TIMESTAMPTZ NOT NULL,
end_time TIMESTAMPTZ NOT NULL,
status VARCHAR(20) DEFAULT 'APPROVED' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'CHECKED_IN')),
check_in_pin VARCHAR(6),
checked_in_at TIMESTAMPTZ,
rejection_reason TEXT,
cancellation_reason TEXT,
created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_time ON bookings (room_id, start_time, end_time);
```

### Target Architecture

- **Frontend**: Next.js 14+
- **Backend**: FastAPI
- **Database**: PostgreSQL

```
┌──────────────────────────────────────────────────────────┐
│                   Next.js                                │
└────────────────────────────┬─────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────┐
│                     FastAPI (Python)                     │
└────────────────────────────┬─────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────┐
│                  PostgreSQL (Supabase)                   │
└──────────────────────────────────────────────────────────┘
```

---

### Core API Endpoints

#### 1. Authentication & Users

- `POST /auth/login`
  - **Description:** Authenticates credentials and returns a JWT access token with basic user claims.
  - **Payload:** `{ "email": "string", "password": "string" }`
- `POST /auth/register`
  - **Description:** Registers a new user account in the `users` table.
  - **Payload:** `{ "email": "string", "password": "string", "full_name": "string", "department": "string" }`
- `GET /users/me`
  - **Description:** Retrieves the profile of the currently authenticated user based on the Bearer token.
- `GET /users`
  - **Description:** _(Admin)_ Retrieves a list of users with optional filtering.
  - **Query Parameters:** `?department=IT&is_locked=false&role=MEMBER`
- `GET /users/{id}`
  - **Description:** Retrieves detailed information for a specific user.
- `PATCH /users/{id}`
  - **Description:** _(Admin)_ Updates user profile, department, or unlocks an account (`is_locked: false`, `no_show_count: 0`).
  - **Payload:** Partial user fields.
- `DELETE /users/{id}`
  - **Description:** _(Admin)_ Removes a user record from the system.

#### 2. Rooms & Facilities

- `GET /rooms`
  - **Description:** Retrieves all available meeting rooms with optional filters.
  - **Query Parameters:** `?building=TowerA&floor=4&min_capacity=8&is_active=true`
- `GET /rooms/{id}`
  - **Description:** Retrieves details for a specific room.
- `POST /rooms`
  - **Description:** _(Admin)_ Creates a new room.
  - **Payload:** `{ "name": "string", "capacity": 10, "building": "string", "floor": "string", "requires_approval": false }`
- `PATCH /rooms/{id}`
  - **Description:** _(Admin)_ Updates room attributes or toggles availability (`is_active`).
  - **Payload:** Partial room fields.
- `PUT /rooms/{id}/image`
  - **Description:** _(Admin)_ Uploads or replaces a room photo (JPG, PNG, GIF, or WEBP; maximum 5 MB). The room response includes its `image_url`; the image is served from `/uploads/{filename}`.
  - **Request:** Raw image bytes with the matching `Content-Type` header (for example, `image/jpeg`).
- `DELETE /rooms/{id}`
  - **Description:** _(Admin)_ Deletes or archives a room record.

Room image files are stored in `server/uploads/`. Keep this directory on persistent storage in deployments; an ephemeral application filesystem will lose uploaded photos when the instance is replaced.

#### 3. Bookings & Lifecycle Management

- `GET /bookings`
  - **Description:** Retrieves reservations based on query filters for dashboard or calendar rendering.
  - **Query Parameters:**
    - `?user_id={id}` : My bookings
    - `?room_id={id}&date=YYYY-MM-DD` : Room calendar schedule
    - `?status=PENDING` : Pending requests requiring review
- `GET /bookings/{id}`
  - **Description:** Retrieves details for a specific reservation.
- `POST /bookings`
  - **Description:** Reserves a room with server-side time overlap validation.
  - **Payload:** `{ "room_id": "UUID", "title": "string", "start_time": "ISO8601", "end_time": "ISO8601" }`
- `POST /bookings/{id}/approve`
  - **Description:** _(Admin)_ Approves a pending booking, sets status to `APPROVED`, and generates a 6-digit access PIN.
- `POST /bookings/{id}/reject`
  - **Description:** _(Admin)_ Rejects a reservation and records the reason.
  - **Payload:** `{ "reason": "string" }`
- `POST /bookings/{id}/cancel`
  - **Description:** Cancels an upcoming reservation within the allowed window.
  - **Payload:** `{ "reason": "string" }`
- `POST /bookings/check-in`
  - **Description:** Checks into the room using the 6-digit PIN. Updates status to `CHECKED_IN` and records `checked_in_at`.
  - **Payload:** `{ "booking_id": "UUID", "pin": "string" }`

#### 4. Analytics & Reports

- `GET /analytics/summary`
  - **Description:** Returns monthly aggregate totals for reservations, completed check-ins, and cancellations.
  - **Query Parameters:** `?month=9&year=2026`
- `GET /analytics/room-utilization`
  - **Description:** Returns daily utilization data per room for chart visualization.
  - **Query Parameters:** `?room_id={id}&month=9&year=2026`
- `GET /analytics/user-lockouts`
  - **Description:** Lists users currently locked out or flagged with high no-show frequencies.
