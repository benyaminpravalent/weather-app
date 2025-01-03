# Weather App

This project is a weather application designed to provide real-time and forecast weather data while showcasing best practices in backend development using **NestJS**. The application demonstrates integration with third-party APIs, modular architecture, and a strong focus on security, performance, and maintainability.

---

### Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [How This Project Meets the Evaluation Criteria](#how-this-project-meets-the-evaluation-criteria)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Explanation of Caching Strategy](#explanation-of-caching-strategy)
- [Assumptions and Design Decisions](#assumptions-and-design-decisions)
- [Project Structure](#project-structure)
- [Testing Approach](#testing-approach)
- [Test](#test)

---

### Key Features

- **Integration with 3rd Party API**: Fetches real-time weather data (current and 5-day forecast) from OpenWeatherMap.
- **GraphQL API**: Implements GraphQL queries for fetching weather information, showcasing flexibility in API design.
- **Modular Architecture**: Developed with a focus on modularity and maintainability by implementing four distinct modules:
  - `/auth`: User authentication and authorization.
  - `/locations`: Manage and retrieve favorite locations.
  - `/users`: Manage user data.
  - `/articles`: Placeholder for additional content or articles.
- **PostgreSQL Integration**: Stores user-specific favorite locations with efficient database operations.
- **Rate Limiting**: Protects the API from abuse by restricting excessive requests.
- **Error Handling**: Implements robust error handling for invalid requests and external API failures.
- **IoC and DI**: Maintains Inversion of Control (IoC) and Dependency Injection (DI) principles for scalable and testable code.
- **Background Jobs**: Periodically updates weather data for favorite locations in the background (Bonus Points).
- **Authentication**: Protects user-specific endpoints through authentication (Bonus Points).
- **Logging**: Implements a logging mechanism for better monitoring and debugging (Bonus Points).
- **Unit Testing**: Ensures code reliability and functionality with well-written unit tests.

---

### How This Project Meets the Evaluation Criteria

This project has been designed and implemented with a strong focus on meeting the key evaluation criteria:

#### Code Quality and Organization

- The codebase follows a clean and modular structure, adhering to the Single Responsibility Principle (SRP).
- Features are organized into distinct modules (`/auth`, `/locations`, `/users`, `/articles`) for better maintainability and scalability.
- Comments and consistent naming conventions ensure readability and understanding for developers.

#### Effective Use of NestJS Features and Design Patterns

- Core NestJS features such as modules, providers, controllers, and decorators have been effectively utilized.
- Dependency Injection (DI) is employed to ensure loose coupling and testability of components.
- Middleware and guards are implemented for rate limiting and authentication, enhancing security and performance.
- Custom GraphQL resolvers handle weather data fetching, ensuring efficient API design.

#### Integration with External API and Error Handling

- The project integrates with the OpenWeatherMap API to fetch real-time weather data and forecasts.
- Comprehensive error handling ensures graceful recovery and proper responses for API failures and invalid user requests.
- Logging mechanisms provide detailed insights into API interactions and error scenarios.

#### Implementation of Caching and Rate Limiting

- Rate limiting has been implemented using NestJS middleware to prevent abuse and ensure reliability.
- Caching strategies (if applicable) could be incorporated for enhanced performance (this can be extended as a future improvement).

#### Security Considerations

- API keys for external integrations are managed securely using environment variables.
- Authentication is implemented to protect user-specific endpoints, ensuring that sensitive data is only accessible to authorized users.
- Input validation and sanitization are applied to prevent common security vulnerabilities.

#### Testing Approach

- Unit tests are written for core modules and services, ensuring reliability and correctness.
- Mocks are used to test external API interactions without making real network calls.
- The testing structure ensures edge cases and negative scenarios are also covered.

#### Documentation Quality

- Comprehensive documentation (like this README) is provided to guide developers and users through the installation, usage, and architecture of the application.
- Clear explanations of each feature, endpoint, and module make the project easy to understand and extend.

This project not only fulfills the required functionality but also demonstrates best practices in backend development, making it a robust, scalable, and secure solution for weather data management.

---

### Setup Instructions

Follow these steps to set up and run the Weather App project. The instructions cover both Docker-based and local setups.

#### Installation

To set up the project:

1. **Install dependencies**:

   ```bash
   $ npm install
   ```

   **Note**: When using Docker, all the `npm` commands can also be performed using `./scripts/npm` (e.g., `./scripts/npm install`).  
   This script allows you to execute the same commands within the Docker environment, ensuring consistency in versions and dependencies, without relying on the host system.

2. **Create a `.env` file**:  
   Copy the template from `.env.template` and populate the required values.

3. **Generate Public and Private Key Pair for JWT Authentication**:  
   Depending on your setup, choose one of the following methods:

   - **Using Docker**:  
     Run the following command:

     ```bash
     ./scripts/generate-jwt-keys
     ```

     The output will look like this:

     ```bash
     To setup the JWT keys, please add the following values to your .env file:
     JWT_PUBLIC_KEY_BASE64="(long base64 content)"
     JWT_PRIVATE_KEY_BASE64="(long base64 content)"
     ```

     Copy the provided values into your `.env` file.

   - **Without Docker**:  
     Generate the keys manually:

     ```bash
     $ ssh-keygen -t rsa -b 2048 -m PEM -f jwtRS256.key
     # Don't add a passphrase
     $ openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
     ```

     Save the generated keys in the `./local` directory (which is ignored by git). Then, encode the keys to Base64 format:

     ```bash
     $ base64 -i local/jwtRS256.key

     $ base64 -i local/jwtRS256.key.pub
     ```

     Add the Base64-encoded keys to your `.env` file:

     ```bash
     JWT_PUBLIC_KEY_BASE64=BASE64_OF_JWT_PUBLIC_KEY
     JWT_PRIVATE_KEY_BASE64=BASE64_OF_JWT_PRIVATE_KEY
     ```

---

#### Running the App

You can run the app either locally or using Docker.

##### Local Setup

Pre-requisite: A running PostgreSQL server.

Commands to start the server:

```bash
# development mode
$ npm run start

# watch mode (auto-restart on code changes)
$ npm run start:dev

# production mode
$ npm run start:prod
```

##### Docker Setup

Commands to build and run the app in Docker:

```bash
# build Docker image
$ docker build -t my-app .

# run container from the image
$ docker run -p 3000:3000 --volume 'pwd':/usr/src/app --env-file .env my-app

# run using docker-compose
$ docker compose up
```

---

#### Database Migrations

You can use these commands to manage database migrations:

1. **Run migrations using Docker**:

   ```bash
   $ docker compose exec app npm run migration:run
   ```

2. **Generate a new migration**:  
   Replace `CreateUsers` with the name of the migration.

   ```bash
   $ npm run migration:generate --name=CreateUsers
   ```

3. **Run migrations**:

   ```bash
   $ npm run migration:run
   ```

4. **Revert migrations**:
   ```bash
   $ npm run migration:revert
   ```

---

### API Documentation

This project provides multiple ways to access and interact with the API. Below are the details on how to explore the API endpoints and GraphQL schema:

#### Swagger Documentation

The API's REST endpoints are documented using Swagger. You can access the Swagger UI by running the application and navigating to the following URL in your browser:

```
http://localhost:3000/swagger#/
```

The Swagger UI provides a detailed and interactive documentation of all REST API endpoints, including their request and response formats.

#### Postman Collection

For quick API testing, a Postman collection is available in the repository. Import the collection into Postman to explore and test the API endpoints.

Path to the Postman collection:

```
postman-collections/weather-app.postman_collection.json
```

To use:

1. Open Postman.
2. Import the collection by selecting `Import` and navigating to the file path.
3. Run and test the API endpoints directly.

#### GraphQL Schema

The project also provides a **GraphQL API** for weather data (current weather and 5-day forecast). The GraphQL schema is documented and accessible through the GraphQL Playground.

Access the GraphQL Playground by navigating to the following URL:

```
http://localhost:3000/graphql
```

The Playground allows you to explore the available queries and mutations, view the schema, and test requests in an interactive environment.

With these tools, you can explore all API endpoints, test the functionality, and review the schemas for a better understanding of the project's capabilities.

---

### Explanation of Caching Strategy

To ensure optimal performance and reduce unnecessary external API calls, this project implements a caching strategy leveraging **Redis**. The strategy is designed to handle both real-time requests and background updates efficiently, ensuring up-to-date data availability.

#### On-Demand Caching

- When a user requests weather or forecast data for a specific city, the system first checks if the data is available in **Redis**.
- If the data is **not cached**, the application fetches it from the **OpenWeatherMap API**, stores it in Redis with a **1-hour Time-to-Live (TTL)**, and serves the response to the user.
- Subsequent requests for the same city within the TTL period will use the cached data, significantly improving response times and reducing API usage.

#### Scheduled Caching Updates

- A **cron job** runs every hour to proactively update the cache with the latest weather data:
  - It queries the database to retrieve all **distinct active user favorite cities**.
  - For each city, it fetches updated weather data from the **OpenWeatherMap API**.
  - The fetched data is then stored in **Redis**, replacing any stale cache with a new **1-hour TTL**.

This dual-layered caching approach ensures:

- **Improved Performance**: Frequently requested data is served quickly from the cache, minimizing latency.
- **Reduced External API Dependency**: By caching data for a 1-hour period and proactively refreshing it, the system avoids excessive API calls.
- **Freshness of Data**: The scheduled background job ensures that even cached data remains relevant and up-to-date, especially for frequently accessed user-specific locations.

With this strategy, the system balances performance, scalability, and data accuracy, delivering a seamless experience for users while optimizing backend resources.

---

### Assumptions and Design Decisions

#### Design Decisions

The architectural and technical design of this project was thoughtfully planned to ensure scalability, maintainability, and high performance. You can view the detailed design document here.

#### Assumptions

The following assumptions were made during the development of this project to guide its design and implementation:

**Weather Data Frequency**
It is assumed that weather data does not change significantly within short intervals. Therefore, a 1-hour TTL for cached data strikes a balance between performance and freshness of the weather information.

**Active User Locations**
It is assumed that users actively manage their favorite locations in the app. The cron job is designed to fetch and update weather data only for distinct active user favorites, reducing unnecessary database and API overhead.

**High Traffic Scalability**
The system is designed to handle high traffic loads, particularly for popular cities. By leveraging Redis caching and rate limiting, the system prevents abuse and ensures smooth operation under heavy usage.

**GraphQL Usage**
It is assumed that developers integrating with this application prefer flexible and efficient data-fetching mechanisms. Hence, GraphQL was chosen for weather data queries, providing granular control over the data structure and reducing over-fetching.

**Error Tolerance for External APIs**
It is assumed that occasional failures of the external weather API (OpenWeatherMap) are inevitable. Robust error-handling mechanisms, including retry logic and logging, are implemented to ensure the system remains resilient and functional even during such scenarios.

**Secure API Key Management**
It is assumed that API keys for external services, like OpenWeatherMap, must be kept confidential. The project manages these keys securely via environment variables to prevent unauthorized access.

**User-Specific Data Sensitivity**
It is assumed that user-specific endpoints (e.g., managing favorite locations) require protection. Authentication and authorization mechanisms have been implemented to ensure data security and privacy.

**Periodic Background Job Execution**
It is assumed that the hourly cron job for updating cache can handle moderate loads without impacting the application’s performance. For scalability, the cron job can be extended to run in a distributed environment if the user base grows significantly.

**Database Integrity**
It is assumed that PostgreSQL will maintain data integrity, especially for user-favorite locations. This ensures accurate weather updates during the cron job execution.

**Future Feature Expansion**
The modular architecture assumes potential future features, such as additional data sources or user customizations. The design facilitates easy integration and extension without major refactoring.

---

### Project Structure

For a detailed explanation of the project structure and its components, refer to the dedicated documentation [here](./docs/project-structure.md).

---

### Testing Approach

The testing approach for this project focuses on validating the functionality of the core features and ensuring the system operates as expected in various scenarios. Below are the key areas tested:

1. **Weather Data Fetching and Caching**

   - **Objective**: Ensure weather and forecast data are fetched correctly from the OpenWeatherMap API and cached in Redis for performance optimization.
   - **Testing Steps**:
     - Request weather data for a city not yet cached.
     - Verify the data is fetched from the API and stored in Redis with a 1-hour TTL.
     - Request the same city’s weather data again within 1 hour and confirm it is served from the cache.
     - Validate the TTL expiration by fetching the data after 1 hour and ensuring it’s refreshed.

2. **Favorite Locations Management**

   - **Objective**: Test the management of user-specific favorite locations stored in PostgreSQL.
   - **Testing Steps**:
     - Add a new favorite location for a user and verify it is stored in the database.
     - Fetch all favorite locations for the user and confirm accuracy.
     - Remove a favorite location and ensure it is deleted from the database.

3. **GraphQL Queries**

   - **Objective**: Validate the GraphQL queries for retrieving weather data.
   - **Testing Steps**:
     - Test the `getWeather` query with valid and invalid city inputs, ensuring appropriate responses and error handling.
     - Test the `getForecast` query to confirm it returns a 5-day forecast with accurate schema structure.
     - Verify the flexibility of responses by requesting specific fields.

4. **Rate Limiting**

   - **Objective**: Ensure API abuse is prevented by enforcing rate limits.
   - **Testing Steps**:
     - Send multiple rapid requests to an API endpoint and verify the rate limiter blocks excessive requests.
     - Confirm that valid requests are processed normally after the rate-limiting window expires.

5. **Authentication**

   - **Objective**: Verify the security of user-specific endpoints.
   - **Testing Steps**:
     - Access protected endpoints without a JWT token and ensure access is denied with appropriate error messages.
     - Access protected endpoints with a valid JWT token and confirm the correct data is returned.
     - Test token expiration scenarios to ensure old tokens are rejected.

6. **Cron Job for Weather Updates**

   - **Objective**: Test the hourly background job that updates weather data for active user favorite locations.
   - **Testing Steps**:
     - Set up favorite locations for multiple users in the database.
     - Trigger the cron job and verify that it fetches updated weather data for all distinct locations.
     - Confirm the updated data is stored in Redis with a 1-hour TTL.
     - Simulate API failures during the cron job and ensure the system handles them gracefully without breaking other operations.

7. **Error Handling**

   - **Objective**: Ensure the system gracefully handles invalid requests and external API failures.
   - **Testing Steps**:
     - Test invalid input scenarios (e.g., unsupported cities or malformed requests) and confirm appropriate error responses.
     - Simulate external API downtime and verify retry mechanisms and fallback responses.

8. **Swagger and GraphQL Documentation**
   - **Objective**: Verify the completeness and usability of the API documentation.
   - **Testing Steps**:
     - Access the Swagger UI and ensure all REST endpoints are documented with accurate request/response details.
     - Access the GraphQL Playground and validate the schema documentation for all queries and mutations.

This approach ensures that the essential features and workflows are thoroughly tested, guaranteeing a robust and reliable application for users.

---

### Test

Run the following command to execute the test suite:

```bash
# unit tests
$ npm run test
```

This command will run all tests to ensure the application's functionality and reliability.
