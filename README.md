# Giftogram Messaging API – Take-Home Assignment
**Alioune Blondin Gyamera**

## Overview
This project implements a simple REST API for user registration, authentication, and messaging between users. The API allows users to create accounts, log in, send messages to other users, and retrieve message history between two users.
The project is implemented using **Node.js with Express and MySQL**, and follows a simple layered structure separating routes, controllers, and database configuration. The API is implemented using the following technologies.

## Development Process

To complete this assignment, I first reviewed the requirements and identified the core functionality needed for the API, including user registration, authentication, messaging, and retrieving conversation history as well as a list of users. I then designed the database schema using two tables, `users` and `messages`, to model user accounts and message relationships. After setting up the Node.js project with Express, I implemented the controllers and routes for authentication, user listing, and messaging functionality. Passwords were securely hashed using bcrypt before being stored in the database.
Throughout the implementation, I added input validation and structured error responses to ensure consistent API behavior, including checks for missing fields, invalid email formats, and empty message content. Finally, I tested each endpoint using Postman to verify correct functionality and edge cases, and documented the design decisions and setup instructions in this README.

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
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate a user |
| GET | `/list_all_users` | List all users excluding requester |
| POST | `/send_message` | Send a message |
| GET | `/view_messages` | Retrieve conversation history |

---

## Register User
**POST `/register**

Creates a new user account.

Validation:
- All required fields must be present
- Email must be unique
- Email must have a valid format

If validation succeeds, the password is hashed and the user is inserted into the database.

---

## Login
**POST `/login`**

Authenticates a user using email and password.

Steps:
1. Validate request fields
2. Ensure Email format is valid
3. Check if the user exists
4. Compare the provided password with the stored password hash
5. Return a successful response if authentication succeeds

---

## List Users
**GET /list_all_users**

Returns a list of users **excluding the requesting user**.

The endpoint expects the requesting user's id as a request parameter. This ensures that the user does not appear in their own list of available users.

---

## Send Message
**POST /send_message`**

Allows one user to send a message to another.

Validation steps include:

- verifying required fields
- confirming that both sender and receiver users exist
- Checking that the message body is not empty

Once validated, the message is inserted into the `messages` table.

---

## View Message History
**GET /view_messages`**

Returns the full conversation history between two users.

Messages are retrieved where:

- user 1 is the sender and user 2 is the receiver
- OR user 2 is the sender and user 1 is the receiver  

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


This structure helps separate routing logic, business logic and database configuration which improves maintainability and readability.

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

## Observations on Endpoint Structure

While implementing the API, I noticed that some endpoints use action-based naming such as `/send_message` and `/view_messages`. In many REST-style APIs, endpoints are often organized around resources (for example `/messages`) rather than actions. Structuring endpoints this way can sometimes make APIs easier to extend and maintain.

Another potential improvement would be supporting pagination when retrieving message histories. As conversations grow, returning large numbers of messages in a single response could become inefficient, so pagination could help improve performance and usability.

## Possible Improvements

While the current implementation fulfills the requirements of the assignment, several improvements could be made in a production environment.

### Authentication
Currently the API assumes the client provides a valid user ID when making requests. In a real-world application, authentication would likely be added so that users can securely identify themselves instead of manually passing their user ID.

### Input Validation
Additional validation could be implemented to enforce stronger constraints on input data (for example stronger password constraints or limiting message length).

### Performance Optimization
As the number of messages grows, additional database optimizations such as indexing could improve query performance for retrieving message history.

### Testing
Unit and integration tests could be added to ensure that endpoint behavior remains correct as the application evolves.
