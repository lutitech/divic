# NestJS GraphQL Application

This is a sample NestJS application with GraphQL integration. It provides endpoints for user authentication and user management using GraphQL.

## Getting Started

### Prerequisites

Before running the application, ensure you have the following installed:

- Node.js and npm (or yarn)
- PostgreSQL (or any other supported database)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>

Install dependencies:

cd <project-folder>
npm install


### Configuration
Create a .env file in the root directory of the project.

Add the following environment variables to the .env file:

DATABASE_URL=postgres://<username>:<password>@localhost:5432/<database-name>
JWT_SECRET=your_jwt_secret_here

### Running the Application

1. Run database migration

npx prisma migrate dev

2. start the server

`npm run start`

The server should now be running at http://localhost:3000/graphql. You can access the GraphQL Playground to test the API.

### Usage

User Management

The application provides CRUD operations for managing users. You can use GraphQL queries and mutations to perform these operations. Here are some examples:

`mutation {
  createUser(input: {
    email: "newuser@example.com",
    password: "password123",
    biometricKey: "fingerprint"
  }) {
    id
    email
    biometricKey
  }
}`

Authentication
To authenticate a user, you can use the login mutation in GraphQL Playground:

Standard login:

`mutation {
  login(email: "example@example.com", password: "password")
}`

Biometric login:

`mutation {
  biometricLogin(biometricKey: "fingerprint") 
}`

This will return a JWT token, which can be used for further authenticated requests


Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

License
This project is licensed under the MIT License - see the LICENSE file for details.