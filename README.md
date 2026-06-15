# PAMS — Local Setup & Admin Seeding Guide

A complete reference for getting the Peer Assessment Management System running locally, seeding admin users, and managing data.

---

## What is PAMS?

PAMS (Peer Assessment Management System) is a Java REST API backend built with:

- **Micronaut 2.4.2** — lightweight Java framework (similar to Spring Boot)
- **MongoDB 4.4** — NoSQL database for storing users, groups, and evaluations
- **JWT** — JSON Web Tokens for authentication (you log in and get a token, then pass it with every request)
- **SendGrid** — for sending emails (grade notifications and reminders)
- **Docker** — everything runs in containers so you don't need Java installed locally

The API runs on **http://localhost:8808** and MongoDB is exposed on **localhost:27018**.

---

## Prerequisites

You only need one thing installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — make sure it's running before you start

Optional but recommended:
- [Postman](https://www.postman.com/) — import the `pams_postman_collection.json` file to have all endpoints ready to use
- [Studio 3T](https://studio3t.com/) or any MongoDB GUI — connect to `mongodb://localhost:27018` (no username/password needed) to inspect and edit data directly

---

## Step 1 — Start the Services

Create a folder anywhere on your machine and save the `docker-compose.yaml` file inside it. Then open a terminal in that folder and run:

```bash
docker compose up
```

This starts two containers:
- `pams_service` — the Java API (port 8808)
- `mongo_db` — MongoDB (port 27018)

Wait until you see Micronaut log output saying the server has started. Leave this terminal running.

To stop everything later:
```bash
docker compose down
```

To stop AND wipe the database (full reset):
```bash
docker compose down -v
```

---

## Step 2 — Connect to MongoDB (for manual data management)

### Via Studio 3T / MongoDB Compass
- **Host:** `localhost`
- **Port:** `27018`
- **Authentication:** None
- **Mode:** Direct Connection

> ⚠️ Do NOT use `mongo_db:27017` — that hostname only works inside Docker's internal network. From your machine, always use `localhost:27018`.

### Via Docker terminal (mongo shell)
```bash
docker exec -it $(docker ps -qf "ancestor=mongo:4.4.3") mongo pams_db
```

This drops you into a MongoDB shell connected to the `pams_db` database. Use this whenever you need to inspect or manually edit data.

---

## Step 3 — Seed the First Admin (Tutor) User

This is the most important part. The database starts completely empty, and the `/pams/user` endpoint that creates tutors requires a JWT token to access — which you can't get without a user existing yet. This is a chicken-and-egg problem.

The solution is a 3-step workaround:

### 3a. Insert a student group directly into MongoDB

The student registration endpoint is public (no token needed), but it requires a student group to already exist. So first, open the mongo shell and insert one:

```bash
docker exec -it $(docker ps -qf "ancestor=mongo:4.4.3") mongo pams_db
```

```javascript
db.student_group.insertOne({
  "group": "admin",
  "assignedTutors": ["tutor@example.com"],
  "groupStatus": "ACTIVE"
})
```

Type `exit` to leave the shell.

### 3b. Register a student using that group

This step uses the public registration endpoint, which handles password encryption automatically. Run:

```bash
curl -X POST http://localhost:8808/pams/student/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "Tutor",
    "email": "tutor@example.com",
    "password": "password123",
    "studentGroup": "admin"
  }'
```

> ℹ️ You may get an error response mentioning SendGrid or "user not found" — this is expected. The app registers the user successfully but then tries to send a welcome email via SendGrid, which fails because the API keys in the docker-compose are expired. The user document is still created in the database.

Verify the user was created by running in the mongo shell:
```javascript
db.user.find().pretty()
```

You should see the document. Note the exact value of the `email` field from the output — you'll need it in the next step.

### 3c. Patch the user's role to TUTOR

Find the document and update it using the exact email field value from the output above:

```javascript
db.user.updateOne(
  { "email": "tutor@example.com" },
  { $set: { "userRole": "ROLE_TUTOR", "userStatus": "ACTIVATED" } }
)
```

You should see `matchedCount: 1, modifiedCount: 1`. If you see `matchedCount: 0`, run `db.user.find().pretty()` again and check the exact email field name and value in the stored document — copy it exactly.

---

## Step 4 — Log In and Get Your JWT Token

```bash
curl -X POST http://localhost:8808/pams/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "tutor@example.com",
    "password": "password123"
  }'
```

Successful response:
```json
{
  "username": "tutor@example.com",
  "access_token": "eyJhbGciOiJSUzI1NiJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

Copy the `access_token` value. This is your JWT — you'll pass it as a `Bearer` token in the `Authorization` header on every protected endpoint.

> If you're using Postman, the Login request has a test script that automatically saves the token to a `pams.token` environment variable, so all other requests pick it up automatically.

---

## Step 5 — Create Real Student Groups (as Tutor)

Now that you have a token, you can create groups properly through the API:

```bash
curl -X POST http://localhost:8808/pams/student-group \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "group": "group1",
    "assignedTutors": ["tutor@example.com"]
  }'
```

Repeat for as many groups as you need (e.g. `group2`, `group3`, etc.).

---

## Step 6 — Register Students

Students register themselves via the public endpoint (no token needed). They just need to know their group name:

```bash
curl -X POST http://localhost:8808/pams/student/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "password": "password123",
    "studentGroup": "group1"
  }'
```

> Same as before — you may get a SendGrid-related error response but the student will be created in the database.

---

## Full API Reference

All endpoints are prefixed with `http://localhost:8808/pams`. Endpoints marked 🔒 require a `Bearer` token in the `Authorization` header.

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/login` | None | Login, returns JWT access_token |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/user` | 🔒 Bearer | Create a tutor/admin user |
| POST | `/student/register` | None | Register a new student |

### Student Groups
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/student-group` | 🔒 Bearer | Create a new group |
| GET | `/student-group` | 🔒 Bearer | List all groups |
| PATCH | `/student-group/{group}/status/ACTIVE` | 🔒 Bearer | Update a group's status |

### Group Members
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/student-group-member/{group}` | 🔒 Bearer | List members in a group |
| GET | `/student-group-member/{group}/access` | 🔒 Bearer | Get accessible members |
| PATCH | `/student-group-member/{group}/email/{email}` | 🔒 Bearer | Add member to group |
| DELETE | `/student-group-member/{group}/email/{email}` | 🔒 Bearer | Remove member from group |

### Peer Evaluations
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/student-group-evaluation` | 🔒 Bearer | Submit a peer evaluation |
| GET | `/student-group-evaluation/{group}?memberTo=X&memberFrom=Y` | 🔒 Bearer | Get an evaluation |
| PUT | `/student-group-evaluation` | 🔒 Bearer | Update an evaluation |
| DELETE | `/student-group-evaluation/{group}?memberTo=X&memberFrom=Y` | 🔒 Bearer | Delete an evaluation |
| GET | `/student-group-evaluation/{group}/calculate-overall-grade` | 🔒 Bearer | Calculate group grades |
| GET | `/student-group-evaluation/{group}/calculate-overall-grade/{email}/member` | 🔒 Bearer | Calculate grade for one member |

### Evaluation payload example:
```json
{
  "memberTo": "jane.smith@example.com",
  "memberFrom": "john.doe@example.com",
  "comment": "Contributed well to the project",
  "studentGroup": "group1",
  "grade": 8,
  "evaluationStatus": "PROVISIONED"
}
```

`evaluationStatus` can be `PROVISIONED` (saved/editable) or `FINALISED` (locked, counted in grade calculation).

---

## MongoDB Collections Reference

| Collection | Purpose |
|------------|---------|
| `user` | All users (students and tutors). Key fields: `email`, `password` (encrypted), `userRole` (`ROLE_STUDENT` / `ROLE_TUTOR`), `userStatus` (`ACTIVATED` / `PENDING`) |
| `student_group` | Groups. Key fields: `group` (name/ID), `assignedTutors` (array of emails), `groupStatus` |

---

## Common Problems & Fixes

### "matchedCount: 0" when updating a user
The email in your query doesn't match what's stored. Always run `db.user.find().pretty()` first and copy the exact value from the document.

### SendGrid errors on registration
Expected — the API keys in docker-compose are expired. The user is still created. Check `db.user.find().pretty()` to confirm.

### Studio 3T "Unknown host: mongo_db"
You're using the wrong connection string. Use `localhost:27018`, not `mongo_db:27017`. Delete the old connection and create a new one.

### PAMS_002 error on `/pams/user`
This endpoint requires a Bearer token. Follow the seeding steps above to create the first admin without it.

### App container keeps restarting
MongoDB might not have finished starting before the app tried to connect. Run `docker compose down` then `docker compose up` again and wait a few more seconds.

---

## Quick Reset (Start Fresh)

If you want to wipe everything and start over:

```bash
docker compose down -v
docker compose up
```

Then repeat from Step 3 to re-seed the admin user.