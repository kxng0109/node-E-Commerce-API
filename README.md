# Node E-Commerce API

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Swagger](https://img.shields.io/badge/docs-swagger-blue)](swagger.yaml)

A **RESTful E-Commerce API** built with Node.js and Express, featuring user authentication, product management, shopping cart functionality, and Stripe payment integration. This API is designed to serve as the backend for e-commerce applications, providing secure endpoints for users, products, carts, and checkout workflows. Project idea gotten from [here](https://roadmap.sh/projects/ecommerce-api).

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the App](#running-the-app)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Security & Middleware](#-security--middleware)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [License](#license)
- [Contact](#contact)

---

## 🔥 Features

- **User Auth**:  
  - Register & Login with JWT.
  - Bcrypt password hashing.
  - Role‑based (`customer` / `admin`) access control.  
- **Product Management**:  
  - CRUD for products (Product creation and deletion routes are protected and require a valid admin JWT token).  
  - JSON field for multiple image URLs.
  - Inventory tracking.
- **Cart System**:  
  - Add, update, remove, and clear cart items per user.
  - Composite unique constraint on `(user_id, product_id)`.
- **Payments**:  
  - Secure checkout sessions and webhook handling. 
  - Backend‑only flow via webhooks (`payment_intent.succeeded`).
- **API Docs**:  
  - OpenAPI (Swagger) spec in `swagger.yaml`.
  - Interactive UI via Swagger‑UI.
- **Error Handling**:  
  - Custom error classes (400, 401, 403, 404, 409, 422, 500).
  - Centralized error‑handling middleware.
- **Security**:  
  - HTTP headers via Helmet.
  - CORS, rate limiting, HPP.
  - Environment variable validation (dotenv‑safe compatible).

---
## Tech Stack

- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Database**: MySQL (via `mysql2`)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`)
- **Password Security**: `bcrypt`
- **Validation**: `validator`
- **Environment**: `dotenv-safe`
- **Payment Processing**: Stripe SDK
- **API Docs**: Swagger UI & YAML
- **Testing**: Jest

---

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [MySQL](https://www.mysql.com/) server
- [Stripe account](https://dashboard.stripe.com/) (for API keys)
- `npm` or `yarn` package manager

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/kxng0109/node-E-Commerce-API.git
   cd node-E-Commerce-API
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

---

## Configuration

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and set the variables.

3. Stripe CLI for Webhooks
To test webhooks locally, use the Stripe CLI:
First navigate [here](https://docs.stripe.com/stripe-cli?install-method=homebrew#install) to install the stripe CLI and also to login.
After a successful login, run:
	  ```bash
	  stripe listen --forward-to localhost:<PORT>/api/checkout/webhook
	  ```
	  Replace `<PORT>` with port number set in your `.env`.
Alternatively, you can configure a webhook endpoint in the Stripe Dashboard by setting the endpoint URL to <SERVER_URL>/api/checkout/webhook.

---

## Database Setup

Before running the application, you can create the necessary tables by executing the setup script (running `npm start` will also create the table as well as start the server):

```bash
node setupDatabases.js
```

This script will create the following tables if they do not exist:

- `users`
- `products`
- `cart_items`

You can also inspect or modify the SQL schema in `setupDatabases.js`.

---

## Running the App

### Development

```bash
npm run dev
# or
yarn dev
```

- Uses `nodemon` to watch for file changes.
- Server will restart automatically on changes.

### Production

```bash
npm start
# or
yarn start
```

- This will run `node setupDatabases.js` and then `node app.js`.
- Ensure environment variables are set.

---

## API Documentation

Interactive API docs are available via Swagger UI:

1. Start the server.
2. Navigate to: `http://localhost:<PORT>/api/v1/api-docs`

You can explore all endpoints, view request/response schemas, and test directly from the browser.

---

## API Endpoints

For detailed request and response schemas for all endpoints, please navigate to the [Swagger UI](http://localhost:<PORT>/api/v1/api-docs). Change <PORT> to the server's port.

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user and return JWT

### Products

- `GET /api/v1/products` - Get all products
- `GET /api/v1/product/:id` - Get a single product by ID
- `POST /api/product` - Create a new product (Admin only)
- `PATCH /api/product/:id` - Update a product (Admin only)
- `DELETE /api/product/:id` - Delete a product (Admin only)

> **Note**: These routes (`POST /api/product`, `PATCH /api/product/:id` and `DELETE /api/product/:id`) require a valid JWT token with an admin role. Access is controlled via the user’s role embedded in the token; no separate admin route is needed.

### Cart

- `GET /api/v1/cart` - Get current user's cart
- `POST /api/v1/cart` - Add an item to the cart
- `PATCH /api/v1/cart/:productId` - Update quantity of a product in the cart
- `DELETE /api/v1/cart/:productId` - Remove a product from the cart
- `DELETE /api/v1/cart` - Clear the entire cart

### Checkout

- `POST /api/v1/cart/checkout` - Create a Stripe checkout session
- `POST /api/v1/webhook/stripe` - Handle Stripe webhook events

---

## Error Handling

- Errors follow a consistent JSON structure, with a **dynamic error message** and an HTTP status code:

```json
{
  "success": false,
  "message": "Dynamic error message",
  "errCode": 400
}
```

- `errCode` corresponds to the HTTP status code returned.

---

## 🛡️ Security & Middleware

We use:

- **Helmet** – secure HTTP headers  
- **CORS** – restrict origins to your front‑end  
- **express-rate-limit** – brute‑force protection  
- **hpp** – HTTP parameter pollution
- **validator** – request validation  
- **JWT** – stateless auth
- **Stripe Webhook Signature** – verify events

---

## Project Structure

```
node-E-Commerce-API/
├── controllers/          # Logic for handling route requests
├── middlewares/          # Custom middleware functions
├── public/               # Success URL for stripe
├── errors/               # Custom errors
├── services/             # Contains stripe service
├── db/                   # Database queries and interactions
├── routes/               # Route definitions and bindings
├── tests/               # Test suites written with Jest
├── utils/                # Utility/helper functions
├── setupDatabases.js     # DB setup script
├── app.js                # Express app setup
├── server.js             # Entry point of the application
├── swagger.yaml          # API documentation source
└── .env.example          # Environment variable template
```

---

## Testing

The project now includes a comprehensive test suite written with Jest. All tests are located in the `tests/` directory and cover the functionality of controllers, routes, and utility functions.

### Run Tests

```bash
npm test
# or
yarn test
```
---

## License

This project is licensed under the **MIT License**. See the [LICENSE](/LICENSE) file for details.

---

## Contact
**@kxng0109**  
GitHub: [github.com/kxng0109](https://github.com/kxng0109) 

Feel free to open issues or reach out with questions and feedback!

