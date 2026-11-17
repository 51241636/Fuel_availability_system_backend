# PumpCheck – Fuel Availability System (Backend)

PumpCheck is a fuel availability management system designed to help customers find filling stations and view fuel availability in Sri Lanka. This repository contains the **backend REST API**, which handles application data, authentication, station and fuel management, file uploads and payment-related operations.

The backend is built with Node.js, Express.js, TypeScript and MongoDB. It provides API services consumed by the React frontend.

## Live API

- **Backend API:** https://fuel-availability-system-backend.enzonic.dev
- **Frontend application:** https://fuel-availability-system-frontend-z-two.vercel.app

> Confirm that these deployment URLs are still active before submitting the project.

## Related Repository

- [Frontend – Fuel Availability System](https://github.com/51241636/Fuel_availability_system_frontend)

## Technologies and Tools

| Technology / Tool | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| TypeScript | Type-safe backend development |
| MongoDB | Database |
| Mongoose | MongoDB object modelling |
| JSON Web Token (JWT) | Authentication and authorization |
| bcrypt / bcryptjs | Password hashing |
| Cookie Parser | Reading authentication cookies |
| CORS | Controlling cross-origin requests |
| Multer | Handling file and profile-image uploads |
| Nodemailer | Sending emails |
| dotenv | Loading environment variables |
| PayHere | Payment gateway integration |

## Main Responsibilities and Features

### Authentication and Authorization
- User registration and login endpoints.
- JWT-based authentication.
- Access-token and refresh-token handling.
- Refresh-token cookie support.
- Middleware for protecting routes.
- Role-based access control for Admin, Customer and Station Owner users.
- Logout functionality.

### User Management
- User account and profile operations.
- Password hashing before storing credentials.
- Profile-image upload support.
- Password-recovery and email-verification functionality, where configured.

### Filling-Station Management
- API operations for adding and maintaining filling-station information.
- Storage of station details such as station name, contact details, address and operating hours.
- Storage of geographic location information for map display.

### Fuel Management
- Fuel information associated with filling stations.
- Stock quantity and tank-capacity management.
- Fuel availability and price information.
- API operations used by station owners to update fuel stock.

### Payment Integration
- PayHere payment initiation for the registration payment process.
- Creation and tracking of payment records.
- Payment-notification endpoint.
- Backend-side verification of payment notification data before updating payment status.

### File Uploads
- Handles uploaded profile images using Multer.
- Makes uploaded files available through the configured static uploads route.

## Getting Started

### Prerequisites

Install the following:

- Node.js (LTS version recommended).
- npm.
- Git.
- MongoDB local server or a MongoDB Atlas database.
- Postman or another API client (recommended for testing).

### 1. Clone the repository

```bash
git clone https://github.com/51241636/Fuel_availability_system_backend.git
cd Fuel_availability_system_backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend root directory.

Example configuration template:

```env
PORT=3000

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_access_token_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES=7d

# Email configuration (use the exact names required by your source code)
# EMAIL_USER=
# EMAIL_PASS=

# PayHere configuration (use the exact names required by your source code)
# PAYHERE_MERCHANT_ID=
# PAYHERE_MERCHANT_SECRET=
# PAYHERE_RETURN_URL=
# PAYHERE_CANCEL_URL=
# PAYHERE_NOTIFY_URL=
```

> This is a template, not a guarantee of every environment-variable name used by the current code. Check the backend configuration and payment/email services for the exact names. Never commit your real `.env` file or expose database credentials, JWT secrets, email passwords or PayHere secrets in a public repository.

### 4. Run the backend in development mode

```bash
npm run dev
```

The backend uses port `3000` by default. If the server starts successfully, visit:

```text
http://localhost:3000/
```

The root endpoint should return the server's health-check response.

### 5. Build and run for production

```bash
npm run build
npm start
```

Use the scripts defined in `package.json` as the source of truth if the commands differ.

## Environment Configuration

The following configuration is important when running the complete system:

- **MongoDB:** Set `MONGO_URI` to a valid local or Atlas connection string.
- **JWT:** Use strong, unique access-token and refresh-token secrets.
- **CORS:** Allow the exact frontend origin, including the deployed Vercel URL.
- **PayHere:** Configure merchant credentials and valid return, cancel and notification URLs.
- **Email:** Configure the email provider credentials if email features are enabled.
- **Uploads:** Ensure the upload directory exists and that the hosting provider supports persistent file storage.

For production, configure environment variables in the backend hosting provider rather than uploading a `.env` file.

## Project Structure

The backend is written in TypeScript. Its high-level structure is:

```text
Fuel_availability_system_backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.ts
├── uploads/
├── package.json
├── package-lock.json
└── tsconfig.json
```

Refer to the repository for the exact current folder and file names.

## API Overview

The Express application registers route modules for the main backend functions, including:

| API area | Route module |
|---|---|
| User operations | `userRoutes` |
| Authentication | `authRoute` |
| Filling-station operations | `fuelStationRoute` |
| Fuel operations | `fuelRoute` |
| Logout | `logOutRoute` |
| Payment operations | `paymentRoute` |

The API is organized into route, controller, middleware and model layers. Refer to the source files for the exact endpoint paths, HTTP methods, request parameters, request bodies and response formats.

## Frontend Integration

The frontend repository communicates with this backend through HTTP requests.

- Frontend repository: https://github.com/51241636/Fuel_availability_system_frontend
- Local frontend development URL: `http://localhost:5173`
- Local backend development URL: `http://localhost:3000`

When developing locally, configure CORS to allow the frontend development origin. In production, allow the deployed frontend origin.

## Deployment

The backend is deployed on Enzonic.

Production API base URL:

```text
https://fuel-availability-system-backend.enzonic.dev
```

Deployment checklist:

1. Connect the backend GitHub repository to the hosting provider.
2. Configure the required build and start commands from `package.json`.
3. Add the production environment variables in the hosting dashboard.
4. Set the MongoDB Atlas connection string and verify database network access.
5. Configure CORS to allow the production frontend URL.
6. Configure the PayHere notification URL to use the public backend payment-notification endpoint.
7. Deploy and test the API endpoints using Postman and the frontend application.

> Some hosting platforms use temporary or non-persistent local filesystems. If uploaded profile images must remain available after redeployment, use persistent storage or an external object-storage service.

## Security Considerations

- Hash passwords before saving them.
- Protect private endpoints with authentication middleware.
- Apply role checks to role-restricted operations.
- Keep JWT secrets, database credentials and payment secrets on the server.
- Configure secure cookie options appropriately for production.
- Restrict CORS to trusted frontend origins.
- Verify payment notifications on the backend.
- Validate and safely handle uploaded files.

## Future Enhancements

- Expand automated unit and integration testing.
- Provide complete API documentation, for example with Swagger/OpenAPI.
- Improve monitoring and error logging.
- Add persistent cloud storage for uploaded images.
- Expand real-time stock notifications if the Socket.IO server and event workflow are enabled.

## Author

**Pasindu Induvara Sepala**

- GitHub: https://github.com/51241636

## Related Project

The frontend source code is available at:
https://github.com/51241636/Fuel_availability_system_frontend
