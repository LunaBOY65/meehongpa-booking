# Meeting Room Booking System - Frontend Client

Frontend client scaffolded with Next.js App Router (TypeScript) for the Meeting Room Booking platform.

---

## Complete Directory Tree (`client/src/`)

```text
client/src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── bookings/
│   │   │   └── page.tsx
│   │   ├── rooms/
│   │   │   └── page.tsx
│   │   └── users/
│   │       └── page.tsx
│   ├── bookings/
│   │   ├── check-in/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── rooms/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── analytics/
│   │   ├── AnalyticsSummaryCards.tsx
│   │   ├── RoomUtilizationChart.tsx
│   │   └── UserLockoutTable.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── bookings/
│   │   ├── BookingApprovalTable.tsx
│   │   ├── BookingApproveModal.tsx
│   │   ├── BookingCalendar.tsx
│   │   ├── BookingCancelModal.tsx
│   │   ├── BookingDetailModal.tsx
│   │   ├── BookingForm.tsx
│   │   ├── BookingList.tsx
│   │   ├── BookingRejectModal.tsx
│   │   └── CheckInForm.tsx
│   ├── layout/
│   │   ├── AuthProvider.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── rooms/
│   │   ├── RoomDeleteDialog.tsx
│   │   ├── RoomDetailCard.tsx
│   │   ├── RoomFilter.tsx
│   │   ├── RoomFormModal.tsx
│   │   └── RoomList.tsx
│   ├── users/
│   │   ├── UserDeleteDialog.tsx
│   │   ├── UserEditModal.tsx
│   │   ├── UserProfileCard.tsx
│   │   └── UserTable.tsx
│   └── index.ts
├── services/
│   ├── analytics.service.ts
│   ├── api-client.ts
│   ├── auth.service.ts
│   ├── booking.service.ts
│   ├── index.ts
│   ├── room.service.ts
│   └── user.service.ts
└── types/
    ├── analytics.ts
    ├── auth.ts
    ├── booking.ts
    ├── index.ts
    ├── room.ts
    └── user.ts
```

---

## Page & Component to Backend API Mapping

The table below maps each Page (Route) and Component to its purpose and corresponding backend API endpoints.

### 1. App Routes (Pages)

| Route / Page | File Path | Purpose | Backend API Endpoints |
| :--- | :--- | :--- | :--- |
| **Home / Portal** | `src/app/page.tsx` | Main portal landing page with navigation overview | N/A |
| **Login** | `src/app/(auth)/login/page.tsx` | User authentication screen | `POST /auth/login` |
| **Register** | `src/app/(auth)/register/page.tsx` | User registration screen | `POST /auth/register` |
| **User Profile** | `src/app/profile/page.tsx` | Displays current logged-in user details and status | `GET /users/me` |
| **Rooms Catalog** | `src/app/rooms/page.tsx` | Lists available meeting rooms with search and filters | `GET /rooms` |
| **Room Detail & Booking** | `src/app/rooms/[id]/page.tsx` | View room details, availability schedule, and reserve | `GET /rooms/{id}`<br>`GET /bookings/availability`<br>`POST /bookings` |
| **My Bookings** | `src/app/bookings/page.tsx` | View personal reservation history and cancel bookings | `GET /bookings`<br>`GET /bookings/{id}`<br>`POST /bookings/{id}/cancel` |
| **Check-In Kiosk** | `src/app/bookings/check-in/page.tsx` | Kiosk / web check-in with 6-digit access PIN | `POST /bookings/check-in` |
| **Admin Rooms** | `src/app/admin/rooms/page.tsx` | Admin management console for creating, updating, deleting rooms | `GET /rooms`<br>`POST /rooms`<br>`PATCH /rooms/{id}`<br>`DELETE /rooms/{id}` |
| **Admin Bookings** | `src/app/admin/bookings/page.tsx` | Admin approval queue to approve or reject pending reservations | `GET /bookings`<br>`POST /bookings/{id}/approve`<br>`POST /bookings/{id}/reject` |
| **Admin Users** | `src/app/admin/users/page.tsx` | Admin user directory, role assignments, and account unlock | `GET /users`<br>`GET /users/{id}`<br>`PATCH /users/{id}`<br>`DELETE /users/{id}` |
| **Admin Analytics** | `src/app/admin/analytics/page.tsx` | Reporting dashboard for utilization, summary stats, lockouts | `GET /analytics/summary`<br>`GET /analytics/room-utilization`<br>`GET /analytics/user-lockouts` |

---

### Role-based access

The frontend loads the authenticated user's profile through `AuthProvider` and shares it with the navigation and page layout:

- **MEMBER** is the default role assigned during registration. Members can browse rooms, create bookings, view or cancel their own bookings, and view their own profile. The sidebar does not show Administration links.
- **ADMIN** can use the administration pages for room management, booking approvals, user management, and analytics. The sidebar shows Administration links only after the user's role has been verified.
- `src/app/admin/layout.tsx` redirects unauthenticated users to sign in and non-admin users to the workspace home page. This is a frontend navigation guard, not the security boundary.
- The backend independently enforces authorization. Members cannot use booking or user profile endpoints to read another member's records, and administrative user-management, booking-approval, and analytics endpoints require the ADMIN role. The room availability endpoint returns occupied time ranges and statuses, not booking titles or other booking details.
- The check-in form uses the kiosk check-in endpoint; its response includes only the check-in result and does not return the booking's access PIN.

Do not rely on hidden links or frontend redirects to secure data. The API must continue to enforce role and record ownership for every protected operation.

### 2. Components

| Component | File Path | Purpose | Backend API Endpoints |
| :--- | :--- | :--- | :--- |
| **LoginForm** | `src/components/auth/LoginForm.tsx` | Handles credentials submission and JWT token reception | `POST /auth/login` |
| **RegisterForm** | `src/components/auth/RegisterForm.tsx` | Collects registration details to create a member account | `POST /auth/register` |
| **UserProfileCard** | `src/components/users/UserProfileCard.tsx` | Renders user profile information, role, and no-show counter | `GET /users/me` |
| **UserTable** | `src/components/users/UserTable.tsx` | Displays user list with filtering by department, status, role | `GET /users`<br>`GET /users/{id}` |
| **UserEditModal** | `src/components/users/UserEditModal.tsx` | Form modal to edit user attributes or unlock accounts | `PATCH /users/{id}` |
| **UserDeleteDialog** | `src/components/users/UserDeleteDialog.tsx` | Confirmation dialog to delete a user record | `DELETE /users/{id}` |
| **RoomList** | `src/components/rooms/RoomList.tsx` | Grid/list view displaying available meeting rooms | `GET /rooms` |
| **RoomFilter** | `src/components/rooms/RoomFilter.tsx` | Filter bar for building, floor, min capacity, and active status | `GET /rooms` |
| **RoomDetailCard** | `src/components/rooms/RoomDetailCard.tsx` | Detailed view card showing room specifications and rules | `GET /rooms/{id}` |
| **RoomFormModal** | `src/components/rooms/RoomFormModal.tsx` | Form modal for creating a new room or updating existing room | `POST /rooms`<br>`PATCH /rooms/{id}` |
| **RoomDeleteDialog** | `src/components/rooms/RoomDeleteDialog.tsx` | Confirmation dialog to remove or archive a meeting room | `DELETE /rooms/{id}` |
| **BookingList** | `src/components/bookings/BookingList.tsx` | List of user's reservations with status tags | `GET /bookings` |
| **BookingCalendar** | `src/components/bookings/BookingCalendar.tsx` | Calendar schedule timeline rendering occupied time ranges without exposing booking details | `GET /bookings/availability` |
| **BookingDetailModal** | `src/components/bookings/BookingDetailModal.tsx` | Modal presenting reservation details and access PIN if approved | `GET /bookings/{id}` |
| **BookingForm** | `src/components/bookings/BookingForm.tsx` | Reservation creation form with start/end time validation | `POST /bookings` |
| **BookingApprovalTable** | `src/components/bookings/BookingApprovalTable.tsx` | Admin table displaying pending bookings awaiting approval | `GET /bookings` |
| **BookingApproveModal** | `src/components/bookings/BookingApproveModal.tsx` | Admin confirmation modal to approve booking and issue PIN | `POST /bookings/{id}/approve` |
| **BookingRejectModal** | `src/components/bookings/BookingRejectModal.tsx` | Admin modal to reject booking with mandatory reason input | `POST /bookings/{id}/reject` |
| **BookingCancelModal** | `src/components/bookings/BookingCancelModal.tsx` | Modal allowing user to cancel reservation with reason | `POST /bookings/{id}/cancel` |
| **CheckInForm** | `src/components/bookings/CheckInForm.tsx` | PIN check-in form to confirm attendance and prevent no-show | `POST /bookings/check-in` |
| **AnalyticsSummaryCards** | `src/components/analytics/AnalyticsSummaryCards.tsx` | Summary KPI cards (total reservations, check-ins, cancellations) | `GET /analytics/summary` |
| **RoomUtilizationChart** | `src/components/analytics/RoomUtilizationChart.tsx` | Room utilization chart visualizer per room and month | `GET /analytics/room-utilization` |
| **UserLockoutTable** | `src/components/analytics/UserLockoutTable.tsx` | Table of accounts locked or flagged with high no-show counts | `GET /analytics/user-lockouts` |
| **Navbar** | `src/components/layout/Navbar.tsx` | Top navigation bar with user menu and auth state | N/A |
| **Sidebar** | `src/components/layout/Sidebar.tsx` | Side navigation menu for regular and admin routes | N/A |

---

## Core API Endpoints Coverage Checklist

The frontend integrates the core endpoints below, including the room availability endpoint:

1. [x] `POST /auth/login` &rarr; `auth.service.ts` &bull; `LoginForm.tsx` &bull; `src/app/(auth)/login/page.tsx`
2. [x] `POST /auth/register` &rarr; `auth.service.ts` &bull; `RegisterForm.tsx` &bull; `src/app/(auth)/register/page.tsx`
3. [x] `GET /users/me` &rarr; `user.service.ts` &bull; `UserProfileCard.tsx` &bull; `src/app/profile/page.tsx`
4. [x] `GET /users` &rarr; `user.service.ts` &bull; `UserTable.tsx` &bull; `src/app/admin/users/page.tsx`
5. [x] `GET /users/{id}` &rarr; `user.service.ts` &bull; `UserTable.tsx` &bull; `src/app/admin/users/page.tsx`
6. [x] `PATCH /users/{id}` &rarr; `user.service.ts` &bull; `UserEditModal.tsx` &bull; `src/app/admin/users/page.tsx`
7. [x] `DELETE /users/{id}` &rarr; `user.service.ts` &bull; `UserDeleteDialog.tsx` &bull; `src/app/admin/users/page.tsx`
8. [x] `GET /rooms` &rarr; `room.service.ts` &bull; `RoomList.tsx`, `RoomFilter.tsx` &bull; `src/app/rooms/page.tsx`, `src/app/admin/rooms/page.tsx`
9. [x] `GET /rooms/{id}` &rarr; `room.service.ts` &bull; `RoomDetailCard.tsx` &bull; `src/app/rooms/[id]/page.tsx`
10. [x] `POST /rooms` &rarr; `room.service.ts` &bull; `RoomFormModal.tsx` &bull; `src/app/admin/rooms/page.tsx`
11. [x] `PATCH /rooms/{id}` &rarr; `room.service.ts` &bull; `RoomFormModal.tsx` &bull; `src/app/admin/rooms/page.tsx`
12. [x] `DELETE /rooms/{id}` &rarr; `room.service.ts` &bull; `RoomDeleteDialog.tsx` &bull; `src/app/admin/rooms/page.tsx`
13. [x] `GET /bookings` &rarr; `booking.service.ts` &bull; `BookingList.tsx`, `BookingApprovalTable.tsx` &bull; `src/app/bookings/page.tsx`, `src/app/admin/bookings/page.tsx`
14. [x] `GET /bookings/availability` &rarr; `booking.service.ts` &bull; `BookingCalendar.tsx` &bull; `src/app/rooms/[id]/page.tsx`
15. [x] `GET /bookings/{id}` &rarr; `booking.service.ts` &bull; `BookingDetailModal.tsx` &bull; `src/app/bookings/page.tsx`
16. [x] `POST /bookings` &rarr; `booking.service.ts` &bull; `BookingForm.tsx` &bull; `src/app/rooms/[id]/page.tsx`
17. [x] `POST /bookings/{id}/approve` &rarr; `booking.service.ts` &bull; `BookingApproveModal.tsx` &bull; `src/app/admin/bookings/page.tsx`
18. [x] `POST /bookings/{id}/reject` &rarr; `booking.service.ts` &bull; `BookingRejectModal.tsx` &bull; `src/app/admin/bookings/page.tsx`
19. [x] `POST /bookings/{id}/cancel` &rarr; `booking.service.ts` &bull; `BookingCancelModal.tsx` &bull; `src/app/bookings/page.tsx`
20. [x] `POST /bookings/check-in` &rarr; `booking.service.ts` &bull; `CheckInForm.tsx` &bull; `src/app/bookings/check-in/page.tsx`
21. [x] `GET /analytics/summary` &rarr; `analytics.service.ts` &bull; `AnalyticsSummaryCards.tsx` &bull; `src/app/admin/analytics/page.tsx`
22. [x] `GET /analytics/room-utilization` &rarr; `analytics.service.ts` &bull; `RoomUtilizationChart.tsx` &bull; `src/app/admin/analytics/page.tsx`
23. [x] `GET /analytics/user-lockouts` &rarr; `analytics.service.ts` &bull; `UserLockoutTable.tsx` &bull; `src/app/admin/analytics/page.tsx`
