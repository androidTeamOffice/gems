## Backend API Documentation

This document provides an overview of the backend APIs developed for the project.

## TODO
- create new file .env and add the followng code in the file:
`REACT_APP_BASE_URL="http://localhost:3216"`


## Features
**1. User Management**

* **API:** `/api/login` (POST)
    * **Description:** Authenticates a user using username and password.
    * **Request Body:**
        * `username`: Username of the user (string)
        * `password`: Password of the user (string)
    * **Response:**
        * On successful login:
            * `token`: JWT token for authorization (string)
        * On failure:
            * `message`: Error message indicating the reason for failure (string)
* **API:** `/api/register` (POST)
    * **Description:** Creates a new user account.
    * **Request Body:**
        * `username`: Username for the new user (string)
        * `password`: Password for the new user (string)
        * (Optional) `role`: User role (e.g., "user", "manager") (string)
    * **Response:**
        * On successful registration:
            * `message`: Success message indicating account creation (string)
        * On failure:
            * `message`: Error message indicating the reason for failure (string)
* **API:** `/api/users` (GET) **(Protected)**
    * **Description:** Retrieves a list of all users. Requires authorization.
    * **Authorization:** Valid JWT token in the request header.
    * **Response:**
        * On success:
            * `users`: Array of user objects containing user information (e.g., ID, username, role)
        * On failure:
            * `message`: Error message indicating the reason for failure (string)

**2. User Authentication**

* **Middleware:** `authMiddleware` (Function)
    * **Description:** Verifies the validity of a JWT token included in the request header.
    * **Functionality:**
        * Checks for the presence and format of the authorization header.
        * Verifies the token signature using the JWT secret.
        * Attaches decoded user information to the request object if valid.
        * Rejects requests with invalid or missing tokens.

**3. Password Reset (Manager Only)**

* **API:** `/api/reset-password` (POST) **(Protected)**
    * **Description:** Resets the password of a user to a default value ("1234"). Requires manager authorization.
    * **Authorization:** Valid JWT token and manager role check in middleware.
    * **Request Body:**
        * `username`: Username of the user whose password needs to be reset (string)
    * **Response:**
        * On success:
            * `message`: Success message indicating password reset (string)
        * On failure:
            * `message`: Error message indicating the reason for failure (string)

**4. Logout**

* **API:** `/api/logout` (GET)
    * **Description:** Logs out the user by potentially invalidating their token on the server-side (depending on implementation).
    * **Request:** No request body required.
    * **Response:**
        * On success:
            * `message`: Success message indicating successful logout (string)

**Notes:**

* All APIs except `/api/login` and `/api/register` require a valid JWT token for authorization.
* Error messages in responses provide details about the failure reason.
* This documentation serves as a general guide. Specific details like request parameters and response structures might vary depending on the implementation.
* Security considerations like proper error handling and input validation are not explicitly mentioned but should be implemented in the actual code.
