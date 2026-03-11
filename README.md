# Giftogram Messaging API – Take-Home Assignment

## Overview
This project implements a simple REST API for user registration, authentication, and messaging between users. The API allows users to create accounts, log in, send messages to other users, and retrieve message history between two users.
The project is implemented using **Node.js with Express and MySQL**, and follows a simple layered structure separating routes, controllers, and database configuration. Below, I will begin by listing the tech stack used.

## Tech Stack
- Node.js
- Express
- MySQL
- bcrypt (password hashing)
## Database Design

The database consists of two main tables.

### Users
Stores basic user account information.
Fields:
- `id`
- `email`
- `first_name`
- `last_name`
- `password_hash`
- `created_at`

### Messages
Stores messages exchanged between users.
Fields:
- `id`
- `sender_id`
- `receiver_id`
- `message_body`
- `created_at`

### Design Decision

Messages were stored in a **separate table instead of inside the users table** because messages represent a relationship between two users, not an attribute of a single user.

During early design, I initially considered storing messages within the users table. However, this quickly became impractical because messages contain multiple attributes such as sender, receiver, content, and timestamp. Storing them directly within the users table would create unnecessary complexity and violate normalization principles.

Separating messages into their own table resulted in:

- cleaner schema design  
- better scalability  
- clearer relationships between entities  
Foreign key relationships ensure message senders and receivers correspond to valid users.

---

## API Endpoints

| Method | Endpoint | Description |
|------|------|------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate a user |
| GET | `/users` | List all users excluding requester |
| POST | `/messages` | Send a message |
| GET | `/messages/view_messages` | Retrieve conversation history |

---

## Register User
**POST `/auth/register`**

Creates a new user account.

Validation:
- All required fields must be present
- Email must be unique

If validation succeeds, the password is hashed and the user is inserted into the database.

---

## Login
**POST `/auth/login`**

Authenticates a user using email and password.

Steps:
1. Validate request fields
2. Check if the user exists
3. Compare the provided password with the stored password hash
4. Return a successful response if authentication succeeds

---

## List Users
**GET `/users`**

Returns a list of users **excluding the requesting user**.

The endpoint expects the requesting user's id as a request parameter. This ensures that the user does not appear in their own list of available users.

---

## Send Message
**POST `/messages`**

Allows one user to send a message to another.

Validation steps include:

- verifying required fields
- confirming that both sender and receiver users exist

Once validated, the message is inserted into the `messages` table.

---

## View Message History
**GET `/messages/view_messages`**

Returns the full conversation history between two users.

Messages are retrieved where:

- user 1 is the sender and user B is the receiver  
- OR user 2 is the sender and user A is the receiver  

Results are returned chronologically and include:

- message id
- sender id
- message content
- timestamp (returned as epoch)

---

## Error Handling

The API returns structured error responses containing:

- `error_code`
- `error_title`
- `error_message`

This ensures consistent and descriptive error responses for clients.

---

## Project Structure


src/
app.js
server.js

routes/
auth.routes.js
user.routes.js
message.routes.js

controllers/
auth.controller.js
user.controller.js
message.controller.js

db/
connection.js

sql/
schema.sql


This structure separates:

- routing logic
- business logic
- database configuration

which improves maintainability and readability.

---

## Setup Instructions

### 1. Install dependencies


npm install


### 2. Configure database connection

Update the database configuration in:


src/db/connection.js


### 3. Create database schema

Run the SQL script:


sql/schema.sql


### 4. Start the server


node src/server.js


The server will run on:


http://localhost:3000


---

## Notes and Assumptions

If the requesting user ID is not provided when listing users, the API returns a validation error. This was chosen as a defensive design decision since the endpoint explicitly requires excluding the requesting user.

---

## Time Spent

Approximately **6–8 hours**.

---

## Possible Improvements

While the current implementation fulfills the requirements of the assignment, several improvements could be made in a production environment.

### Authentication
Currently the API assumes the client provides a valid user ID when making requests. In a real-world application, authentication would likely be added so that users can securely identify themselves instead of manually passing their user ID.

### Input Validation
Additional validation could be implemented to enforce stronger constraints on input data (for example validating email format or limiting message length).

### Performance Optimization
As the number of messages grows, additional database optimizations such as indexing could improve query performance for retrieving message history.

### Testing
Unit and integration tests could be added to ensure that endpoint behavior r
