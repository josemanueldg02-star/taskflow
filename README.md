# TaskFlow

A full-stack project and task management application (Kanban-style), built as a
portfolio project to demonstrate production-style backend and frontend development.

> 🚧 Work in progress — actively under development.

## Tech Stack

**Backend**
- Java 25
- Spring Boot 4
- Spring Data JPA
- Spring Security
- PostgreSQL

**Infrastructure**
- Docker / Docker Compose

**Frontend** (coming soon)
- React + Vite

## Getting Started

### Prerequisites
- JDK 25
- Docker Desktop

### Running locally

1. Create a `.env` file in the project root based on `.env.example`.
2. Start the database:
```bash
   docker compose up -d
```
3. Run the backend from your IDE using the provided run configuration
   (which loads the variables from `.env`), or set those variables in your shell
   and run `./mvnw spring-boot:run` inside the `backend` folder.

The API runs on `http://localhost:8080`.