# API Documentation

This document provides details on the API endpoints for the application.

## Authentication

### Register

*   **Endpoint:** `/register`
*   **Method:** `POST`
*   **Description:** Registers a new user.
*   **Request Body:**

    ```json
    {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123",
        "phone": "1234567890",
        "flat_number": "101",
        "building_name": "Test Building"
    }
    ```

*   **Response:**

    *   **Success (201):**
        ```json
        {
            "message": "User registered successfully"
        }
        ```
    *   **Error (400):**
        ```json
        {
            "error": "Invalid data provided"
        }
        ```

### Login

*   **Endpoint:** `/login`
*   **Method:** `POST`
*   **Description:** Logs in a user and returns access and refresh tokens.
*   **Request Body:**

    ```json
    {
        "identifier": "test@example.com",
        "password": "password123"
    }
    ```

*   **Response:**

    *   **Success (200):**
        ```json
        {
            "access_token": "your_access_token",
            "refresh_token": "your_refresh_token"
        }
        ```
    *   **Error (401):**
        ```json
        {
            "error": "Invalid credentials"
        }
        ```

### Logout

*   **Endpoint:** `/logout`
*   **Method:** `POST`
*   **Description:** Logs out the user by revoking the refresh token.
*   **Authorization:** `Bearer <access_token>`
*   **Response:**

    *   **Success (200):**
        ```json
        {
            "message": "Successfully logged out"
        }
        ```

### Refresh Token

*   **Endpoint:** `/refresh`
*   **Method:** `POST`
*   **Description:** Refreshes the access token using a refresh token.
*   **Authorization:** `Bearer <refresh_token>`
*   **Response:**

    *   **Success (200):**
        ```json
        {
            "access_token": "new_access_token"
        }
        ```

## User

### Get User Details

*   **Endpoint:** `/user`
*   **Method:** `GET`
*   **Description:** Retrieves the details of the currently logged-in user.
*   **Authorization:** `Bearer <access_token>`
*   **Response:**

    *   **Success (200):**
        ```json
        {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "1234567890",
            "flat_number": "101",
            "building_name": "Test Building",
            "user_id": "user_id"
        }
        ```

### Update Password

*   **Endpoint:** `/updatePassword`
*   **Method:** `POST`
*   **Description:** Updates the user's password.
*   **Request Body:**

    ```json
    {
        "email": "test@example.com",
        "user_id": "userid",
        "phone": "1234567890",
        "new_password": "newpassword"
    }
    ```

*   **Response:**

    *   **Success (200):**
        ```json
        {
            "message": "Password updated successfully"
        }