# Admin Auth/Invite API Documentation

1. [Admin Login](#1-admin-login)
2. [Send Admin Invitation](#2-send-admin-invitation)
3. [Verify Admin Invitation](#3-verify-admin-invitation)
4. [Revoke Admin Invite](#4-revoke-admin-invite)

**Base URL:** `/api/v1/admin`

---

## 1. Admin Login

Authenticates an admin or superadmin and returns a JWT token.

- **Endpoint:** `POST /login`
- **Access:** Public (Admin/Superadmin only)
- **Authentication:** Not required

### Request Body

| Field      | Type     | Required | Description            |
| :--------- | :------- | :------- | :--------------------- |
| `email`    | `string` | **Yes**  | Admin's email address. |
| `password` | `string` | **Yes**  | Admin's password.      |

### Example Request

```json
{
  "email": "admin@ajani.ai",
  "password": "SecurePassword123!"
}
```

### Success Response (200 OK)

```json
{
  "message": "Admin logged in successfully",
  "data": {
    "_id": "65c123...",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@ajani.ai",
    "role": "superadmin",
    "isVerified": true,
    "isActive": true
  },
  "token": "eyJhbGciOiJIUzI1..."
}
```

### Error Responses

- **401 Unauthorized:** `"Invalid password"`.
- **404 Not Found:** `"Admin not found"` (if user does not exist or does not have admin/superadmin role).

---

## 2. Send Admin Invitation

Allows a **Superadmin** to invite a new administrator. The system creates a new user account with the `admin` role and sends an email containing an invitation link and code.

- **Endpoint:** `POST /invite`
- **Access:** Superadmin only
- **Authentication:** Required (Bearer Token)

### Request Body

| Field       | Type     | Required | Description                                         |
| :---------- | :------- | :------- | :-------------------------------------------------- |
| `email`     | `string` | **Yes**  | Must be unique. The email address of the new admin. |
| `firstName` | `string` | **Yes**  | The first name of the new admin.                    |
| `lastName`  | `string` | **Yes**  | The last name of the new admin.                     |

### Example Request

```json
{
  "email": "new.admin@ajani.ai",
  "firstName": "Alex",
  "lastName": "Rivera"
}
```

### Success Response (201 Created)

```json
{
  "message": "Admin invitation sent successfully",
  "data": {
    "email": "new.admin@ajani.ai",
    "firstName": "Alex",
    "lastName": "Rivera",
    "role": "admin",
    "isVerified": false,
    "admin": {
      "invitationCode": "123456",
      "invitationStatus": "pending",
      "invitationCodeExpires": "2024-02-11T10:00:00.000Z"
    },
    "_id": "65c123...",
    "createdAt": "2024-02-11T09:50:00.000Z"
  }
}
```

### Error Responses

- **400 Bad Request:** `"All fields are required"` or `"User with this email already exists"`.
- **403 Forbidden:** Requester is not a superadmin.

---

## 3. Verify Admin Invitation

Allows the invited admin to accept the invitation by setting their password. This matches the link sent via email.

- **Endpoint:** `POST /verify/:invitationCode/:email`
- **Access:** Public (Token/Code in URL proves identity)

### URL Parameters

| Parameter        | Type     | Description                                    |
| :--------------- | :------- | :--------------------------------------------- |
| `invitationCode` | `string` | The 6-digit OTP code sent in the invite email. |
| `email`          | `string` | The email address of the invited admin.        |

### Request Body

| Field      | Type     | Required | Description                             |
| :--------- | :------- | :------- | :-------------------------------------- |
| `password` | `string` | **Yes**  | The new password for the admin account. |

### Example Request

```json
{
  "password": "SecurePassword123!"
}
```

### Success Response (200 OK)

_Returns the user data and a JWT token, logging the user in immediately._

```json
{
  "message": "Admin invitation verified successfully",
  "data": {
    "_id": "65c123...",
    "email": "new.admin@ajani.ai",
    "role": "admin",
    "isVerified": true,
    "isActive": true,
    "admin": {
      "invitationStatus": "approved",
      "invitationCodeExpires": null
    }
  },
  "token": "eyJhbGciOiJIUzI1..."
}
```

### Error Responses

- **400 Bad Request:** `"Password is required"`, `"Invitation code is not valid"`, or `"Invitation code has expired"`.
- **404 Not Found:** `"Invalid invitation code"` (if user/code combination not found).

---

## 4. Revoke Admin Invite

Allows a **Superadmin** to revoke a pending invitation or remove an admin's access.

- **Endpoint:** `DELETE /:adminId`
- **Access:** Superadmin only

### Success Response (200 OK)

```json
{
  "message": "Admin invitation revoked successfully"
}
```
