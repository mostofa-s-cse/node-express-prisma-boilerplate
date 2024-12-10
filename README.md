# Node.js Authentication API Boilerplate with Typescript

A Node.js server built using **Express.js**, **PostgreSQL**, and **Prisma ORM**, following the **MVC architecture**. This project includes user authentication with **email verification**, **OTP**, **JWT access tokens**, and **refresh tokens**, along with robust error handling.

## Features

- User Registration with OTP email verification
- Secure Login with hashed passwords
- Token-based authentication (Access and Refresh tokens)
- Resend OTP functionality
- Middleware for route protection
- Scalable and modular MVC architecture
- Error handling with centralized middleware
- errorLogger
- Image uploads use multer
- API Version control
- Cluster 
- Custom Role Permissions

---

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Prisma ORM**: Database access
- **PostgreSQL**: Database
- **JWT**: Token-based authentication
- **Nodemailer**: Email services
- **bcrypt**: Password hashing
- **multer**: Image upload

---

## Getting Started

### Prerequisites

- Node.js (v14 or above)
- PostgreSQL installed and running

### Installation

1. Clone the repository HTTPS:

    ```
   git clone https://github.com/mostofa-s-cse/node-express-prisma-boilerplate.git
   ```
   ```
   cd node-express-prisma-boilerplate
   ```
- ### Or

- Clone the repository SSH:

  ```
   git clone git@github.com:mostofa-s-cse/node-express-prisma-boilerplate.git
   ```

   ```
   cd node-express-prisma-boilerplate
   ```

2. Install dependencies:

   ```
    npm install
   ```
- ### or
   ```
   yarn install
   ```

3. Set up environment variables
   - Create .env file

       ```bash
       SERVER_URL=http://localhost
       PORT=5000

       DATABASE_URL=postgresql://root:password@localhost:5432
       JWT_SECRET=7e3f5c3f79dbf61a3d8a653adba556b02d64fe8b4d3582d9e091d19ad173f71c0239b99d440adf5981db37bfa1ee6d24c9b8b3b02b6e54f38788a54756dbe1c5
       JWT_REFRESH_SECRET=3921e3965702fa2e24508e2417a9a165d519a60b7a923d6b4a0044019f9f8b3ffdb4a68b97c5b365e5a46d8da720c44c04f230c4414c44243057fa6d4d19e563
       EMAIL_USER=mostofa.s.cse@gmail.com
       EMAIL_PASSWORD=cxbdtxtqkbdbkjkm

Make sure you replace your_jwt_secret, your_refresh_token_secret, your_postgres_connection_url, and other placeholders with your actual values.

4. Set up the PostgreSQL Database with Prisma

    1. Install the Prisma CLI:

     ```
   npm install @prisma/cli
   ```

   2.Run Prisma migrations to create the database schema:
   ```
    npx prisma migrate dev --name init
   ```

This will create the database tables based on the Prisma schema.

- Supper Admin Seed
  ```
    npx prisma db seed
   ```
- Prisma Studio run
  ```
    npx prisma studio
   ```

5. Compile TypeScript:
   ```bash
   npx tsc

6. Run the Application
   
   ```bash
   npm run dev

## API Endpoints
### Version 1
Base URL: http://localhost:5000/api/v1
### 1. Register a New User
- Endpoint: POST /auth/register
- Request Body:

   ```json
   {
    "name":"example",
    "email": "example@gmail.com",
    "password": "password123"
   }
- Response:
   ```json
   {
    "success": true,
    "data": {
        "message": "User registered successfully. Please verify your email."
    }


### 2. Verify User Email
- Endpoint: POST /auth/verify
- Request Body:

   ```json
   {
      "email": "user@example.com",
      "otp":"254627"
   }
- Response:
   ```json
   {
      "success": true,
      "message": "Email verified successfully."
   }

### 3.  Resend OTP
- Endpoint: POST /auth/resend-otp
- Request Body:

   ```json
   {
      "email": "user@example.com"
   }

- Response:
   ```json
   {
    "success": true,
    "data": {
        "message": "OTP sent successfully. Please check your email."
    }
   }


### 4.  Request Password Reset
- Endpoint: POST /auth/request-password-reset
- Request Body:

   ```json
   {
      "email": "user@example.com"
   }

- Response:
   ```json
   {
     "success": true,
     "message": "Password reset OTP has been sent to your email. Please check your inbox."
    }

### 5. Reset Password
- Endpoint: POST /auth/reset-password
  - Request Body:

     ```json
     {
      "email": "example@gmail.com",
      "otp":"379913",
      "newPassword": "password1234"
     }

- Response:
   ```json
   {
    "success": true,
    "message": "Your password has been reset successfully."
    }


### 6. User Login
- Endpoint: POST /auth/login
- Request Body
   ```json
   {
      "email": "user@example.com",
      "password": "password123"
   }
- Response:
   ```json
   {
   "success": true,
    message: "Login successful. Welcome back!",
    "data": { 
        "accessToken": "new_access_token_here",
        "refreshToken": "new_refresh_token_here"
    }
   }

### 7.  Refresh Token
- Endpoint: POST /auth/refresh
- Request Body
   ```json
   {
       "refreshToken": "your_refresh_token_here"
   }
- Response:
   ```json
   {
    "success": true,
    "data": {
        "accessToken": "new_access_token_here",
        "refreshToken": "new_refresh_token_here"
    }
   }


### User Management Endpoints
### 8. Get All Users
- Endpoint: GET /users
- Authorization: Bearer Token (Access Token)

- Response:
   ```json
   {
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
        {
            "id": 1,
            "email": "example@gmail.com",
            "name": "example",
            "createdAt": "2024-11-21T16:17:09.462Z",
            "updatedAt": "2024-11-21T16:18:14.701Z"
        }
     ]
   }

### 9. Update User

- Endpoint: PUT /users/:id
- Authorization: Bearer Token (Access Token)

- Request Body
   ```json
   {
     "name": "Updated Name",
     "email": "updated_email@example.com"
   }

- Response:
   ```json
   {
    "success": true,
    "message": "User updated successfully",
    "data": {
        "id": 3,
        "email": "updated_email@example.com",
        "name": "Updated Name",
        "createdAt": "2024-11-19T18:18:22.157Z",
        "updatedAt": "2024-11-20T16:41:52.917Z"
       }
     }

### 10. Delete User

- Endpoint: DELETE /users/:id
- Authorization: Bearer Token (Access Token)

- Response:
   ```json
   {
    "success": true,
    "message": "User deleted successfully"
   }


### Role Management Endpoints
### 11. Get All Role
- Endpoint: GET /roles
- Authorization: Bearer Token (Access Token)

  - Response:
     ```json
     {
          "success": true,
         "message": "Roles retrieved successfully",
          "data": [
              {
                  "id": "cm47a36t20009121vd8jufbn8",
                  "name": "Admin",
                  "createdAt": "2024-12-02T17:02:27.638Z",
                  "updatedAt": "2024-12-02T17:02:27.638Z"
              },
              {
                  "id": "cm47a36t6000a121vxtn8lsxk",
                  "name": "Editor",
                  "createdAt": "2024-12-02T17:02:27.642Z",
                  "updatedAt": "2024-12-02T17:02:27.642Z"
              },
              {
                  "id": "cm47a36t9000b121vrtqly6lq",
                  "name": "Viewer",
                  "createdAt": "2024-12-02T17:02:27.645Z",
                  "updatedAt": "2024-12-02T17:02:27.645Z"
              }
          ]
     }


### 12. Create Role
- Endpoint: POST /roles
- Authorization: Bearer Token (Access Token)

- Request Body
   ```json
   {
     "name": "New Role"
   }

- Response:
   ```json
   {
    "success": true,
    "message": "Role created successfully",
    "data": {
        "id": "cm4fogsfs0000tpecwibvbavt",
        "name": "New Role",
        "createdAt": "2024-12-08T14:07:06.232Z",
        "updatedAt": "2024-12-08T14:07:06.232Z"
    }
   }


### 13. Update Role
- Endpoint: PUT /roles/:id
- Authorization: Bearer Token (Access Token)

- Request Body
   ```json
   {
     "name": "Updated Role"
   }

- Response:
   ```json
   {
    "success": true,
    "message": "Role updated successfully",
    "data": {
        "id": "cm4fp2hhk0001tpecxdnjaad2",
        "name": "Updated Role",
        "createdAt": "2024-12-08T14:23:58.472Z",
        "updatedAt": "2024-12-08T14:24:15.244Z"
    }
   }

### 14. Delete Role

- Endpoint: DELETE /roles/:id
- Authorization: Bearer Token (Access Token)

- Response:
   ```json
   {
    "success": true,
    "message": "Role deleted successfully"
   }


### 15. Assign role to user
- Endpoint: POST /roles/assign-role
- Authorization: Bearer Token (Access Token)

- Request Body
   ```json
   {
    "userId": 3,
    "roleId": "cm4iojhp30000tmvm5p7q9ng1"
   }

- Response:
   ```json
   {
    "success": true,
    "message": "Role assigned to user successfully",
    "data": {
        "id": "cm4iosk5t00018l3cziii8ykx",
        "userId": 3,
        "roleId": "cm4iojhp30000tmvm5p7q9ng1"
    }
   }



### Permissions Management Endpoints
### 16. Get All Permissions
- Endpoint: GET /permissions
- Authorization: Bearer Token (Access Token)

    - Response:
       ```json
       {
           "success": true,
           "message": "Permissions retrieved successfully",
            "data": [
                 {
                    "id": "cm47a36sa0000121virekhxdv",
                    "name": "manage-roles",
                    "createdAt": "2024-12-02T17:02:27.610Z",
                    "updatedAt": "2024-12-02T17:02:27.610Z"
                },
                {
                    "id": "cm47a36sg0001121vgfe05mwt",
                    "name": "view-roles",
                    "createdAt": "2024-12-02T17:02:27.616Z",
                    "updatedAt": "2024-12-02T17:02:27.616Z"
                },
                {
                    "id": "cm47a36si0002121vaoy4msrm",
                    "name": "update-roles",
                    "createdAt": "2024-12-02T17:02:27.619Z",
                    "updatedAt": "2024-12-02T17:02:27.619Z"
                },
                {
                    "id": "cm47a36sl0003121vhu76galf",
                    "name": "delete-roles",
                    "createdAt": "2024-12-02T17:02:27.622Z",
                    "updatedAt": "2024-12-02T17:02:27.622Z"
                },
                {
                    "id": "cm47a36sn0004121vnsr5nu67",
                    "name": "create-permissions",
                    "createdAt": "2024-12-02T17:02:27.624Z",
                    "updatedAt": "2024-12-02T17:02:27.624Z"
                },
                {
                    "id": "cm47a36sq0005121vocit3h96",
                    "name": "view-permissions",
                    "createdAt": "2024-12-02T17:02:27.627Z",
                    "updatedAt": "2024-12-02T17:02:27.627Z"
                },
                {
                    "id": "cm47a36st0006121vrzfqh20u",
                    "name": "update-permissions",
                    "createdAt": "2024-12-02T17:02:27.630Z",
                    "updatedAt": "2024-12-02T17:02:27.630Z"
                },
                {
                    "id": "cm47a36sw0007121v5t6m8dl2",
                    "name": "delete-permissions",
                    "createdAt": "2024-12-02T17:02:27.632Z",
                    "updatedAt": "2024-12-02T17:02:27.632Z"
                },
                {
                    "id": "cm47a36sz0008121vypggupp3",
                    "name": "assign-permissions",
                    "createdAt": "2024-12-02T17:02:27.635Z",
                    "updatedAt": "2024-12-02T17:02:27.635Z"
                }
            ]
       }


### 17. Create Permission
- Endpoint: POST /permissions
- Authorization: Bearer Token (Access Token)

- Request Body
   ```json
   {
     "name": "edit-post"
   }

- Response:
   ```json
   {
    "success": true,
    "message": "Permission created successfully",
    "data": {
        "id": "cm4fox5lt000013zkhv31ymdw",
        "name": "edit-post",
        "createdAt": "2024-12-08T14:19:49.794Z",
        "updatedAt": "2024-12-08T14:19:49.794Z"
    }
   }


### 18. Update Permission
- Endpoint: PUT /permissions/:id
- Authorization: Bearer Token (Access Token)

- Request Body
   ```json
   {
     "name": "updated-post"
   }

- Response:
   ```json
   {
    "success": true,
    "message": "Permission update successfully",
    "data": {
         "id": "cm4fox5lt000013zkhv31ymdw",
        "name": "updated-post",
        "createdAt": "2024-12-08T14:19:49.794Z",
        "updatedAt": "2024-12-08T14:26:43.010Z"
    }
   }

### 19. Delete Permission

- Endpoint: DELETE /permissions/:id
- Authorization: Bearer Token (Access Token)

- Response:
   ```json
   {
    "success": true,
    "message": "Permissions deleted successfully"
   }




### 20. Assign permission to role
- Endpoint: POST /permissions/assign-permission
- Authorization: Bearer Token (Access Token)

- Request Body
   ```json
   {
    "roleId": "cm4iojhp30000tmvm5p7q9ng1",
    "permissionId":"cm4ha0hj80001ivb18540o7i1"
   }

- Response:
   ```json
   {
    "success": true,
    "message": "Permission assigned successfully"
   }

