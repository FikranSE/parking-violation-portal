# Parking Violation Portal

This repository contains the solution for the Senior Full-Stack Software Architect assignment. It includes a modular monolith backend written in Go and a frontend portal written in Next.js.

## Running the Application Locally

### Prerequisites
- Docker & Docker Compose (for the database)
- Go 1.21+ (if running the backend manually)
- Node.js 18+ (if running the frontend manually)

### Quick Start (Native)
1. **Start the Backend:**
   ```bash
   cd backend
   go mod tidy
   go run cmd/server/main.go
   ```
   *The API Gateway will start on `http://localhost:8080`*

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The Next.js App will start on `http://localhost:3000`*

## Architectural Decisions & Trade-offs

1. **Modular Monolith over Microservices**
   - *Decision:* The backend is structured as a Modular Monolith (`internal/modules/...`).
   - *Rationale:* Given the scope of the project, introducing Kubernetes, gRPC, and message brokers for independent microservices would add unnecessary operational overhead and latency. A modular monolith provides the same strict boundaries and separation of concerns (violating domain logic cannot bleed into the payment domain) but maintains the deployment simplicity of a single binary. It can be easily split into microservices later if scale demands it.

2. **Database Schema & Versioned Rules**
   - *Decision:* Slowly Changing Dimension Type 2 for `fine_rules`.
   - *Rationale:* Financial and regulatory records must be immutable. By versioning the rules table and tying each `violation` explicitly to a `rule_version_id`, recalculations will always produce the exact same historical fine amount, even if the city changes the multipliers tomorrow.

3. **Assumptions Made**
   - Officer authentication is mocked out; the Next.js frontend uses a simple state toggle to switch roles for demonstration purposes.
   - Images are not uploaded to an S3 bucket in this iteration; the system expects a mock image URL.

## What I Would Improve With More Time

- **Message Queue Integration:** Introduce RabbitMQ or Kafka to handle the "Fine Calculation" and "Payment Processing" asynchronously.
- **Caching Layer:** Add Redis to cache the currently active rule version, as this is a high-read/low-write query executed on every single violation submission.
- **Authentication:** Implement JWT-based RBAC (Role-Based Access Control) using Keycloak or Auth0.
