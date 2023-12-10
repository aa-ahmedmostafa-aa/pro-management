import config from "./config";
export const swaggerDocument = {
  swagger: "2.0",
  info: {
    version: "1.0.0",
    title: config.PRODUCT_NAME,
    description: "Service to manage and prepare Project",
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  host:
    config.NODE_ENV === "production" || config.NODE_ENV === "prod"
      ? `${config.DEPLOYMENT_HOST}:${config.PORT}`
      : `localhost:${config.PORT}`,
  tags: [
    {
      name: "Ping",
      description: "Check the availablity of the application",
    },
  ],
  paths: {
    "/api/v1/Misc/Ping": {
      get: {
        tags: ["Ping"],
        summary: "Checks if the service is working",
        responses: {
          "200": {
            description: "success",
          },
        },
      },
    },

    "/api/v1/Users/Login": {
      post: {
        tags: ["Users"],
        consumes: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "Login",
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                },
                password: {
                  type: "string",
                },
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "ok",
          },
          "400": {
            description: "bad request",
          },
          "401": {
            description: "Un Authorized",
          },
          "403": {
            description: "Forbidden",
          },

          "404": {
            description: "Not Found",
          },
          "500": {
            description: "internal server error",
          },
        },
      },
    },

    "/api/v1/Users/Register": {
      post: {
        tags: ["Users"],
        summary: "Register employee",
        consumes: ["multipart/form-data"],
        parameters: [
          {
            in: "formData",
            type: "string",
            required: true,
            name: "userName",
          },
          {
            in: "formData",
            type: "string",
            required: true,
            name: "email",
          },
          {
            in: "formData",
            type: "string",
            required: true,
            name: "country",
          },
          {
            in: "formData",
            type: "string",
            required: true,
            name: "phoneNumber",
          },
          {
            in: "formData",
            type: "file",
            name: "profileImage",
          },
          {
            in: "formData",
            type: "string",
            required: true,
            name: "password",
          },
          {
            in: "formData",
            type: "string",
            required: true,
            name: "confirmPassword",
          },
        ],
        responses: {
          "200": {
            description: "ok",
          },
          "400": {
            description: "bad request",
          },
          "401": {
            description: "Un Authorized",
          },
          "403": {
            description: "Forbidden",
          },

          "404": {
            description: "Not Found",
          },
          "500": {
            description: "internal server error",
          },
        },
      },
    },

    "/api/v1/Users/Create": {
      post: {
        tags: ["Users"],
        summary: "Create an manager",
        consumes: ["multipart/form-data"],
        parameters: [
          {
            in: "formData",
            type: "string",
            required: true,
            name: "userName",
          },
          {
            in: "formData",
            type: "string",
            required: true,
            name: "email",
          },
          {
            in: "formData",
            type: "string",
            required: true,
            name: "country",
          },
          {
            name: "phoneNumber",
            required: true,
            in: "formData",
            type: "string",
          },
          {
            in: "formData",
            type: "file",
            name: "profileImage",
          },
          {
            in: "formData",
            type: "string",
            required: true,
            name: "password",
          },
          {
            in: "formData",
            type: "string",
            required: true,
            name: "confirmPassword",
          },
        ],
        responses: {
          "201": {
            description: "created",
          },
          "400": {
            description: "bad request",
          },
          "401": {
            description: "Un Authorized",
          },
          "403": {
            description: "Forbidden",
          },

          "404": {
            description: "Not Found",
          },
          "500": {
            description: "internal server error",
          },
        },
      },
    },

    "/api/v1/Users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by id",
        parameters: [
          {
            name: "id",
            required: true,
            in: "path",
            type: "integer",
          },
        ],
        responses: {
          "200": {
            description: "ok",
          },
          "400": {
            description: "bad request",
          },
          "401": {
            description: "Un Authorized",
          },
          "403": {
            description: "Forbidden",
          },

          "404": {
            description: "Not Found",
          },
          "500": {
            description: "internal server error",
          },
        },
      },
      put: {
        tags: ["Users"],
        summary: "toggle activated employee",
        parameters: [
          {
            name: "id",
            required: true,
            in: "path",
            type: "integer",
          },
        ],
        responses: {
          "200": {
            description: "ok",
          },
          "400": {
            description: "bad request",
          },
          "401": {
            description: "Un Authorized",
          },
          "403": {
            description: "Forbidden",
          },

          "404": {
            description: "Not Found",
          },
          "500": {
            description: "internal server error",
          },
        },
      },
    },

    "/api/v1/Users/verify": {
      put: {
        tags: ["Users"],
        summary: "verify user account",
        parameters: [
          {
            in: "body",
            name: "verify account",
            schema: {
              type: "object",
              required: ["email", "code"],
              properties: {
                email: {
                  type: "string",
                },
                code: {
                  type: "string",
                },
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "ok",
          },
          "400": {
            description: "bad request",
          },
          "401": {
            description: "Un Authorized",
          },
          "403": {
            description: "Forbidden",
          },
          "404": {
            description: "Not Found",
          },
          "500": {
            description: "internal server error",
          },
        },
      },
    },

    "/api/v1/Users/currentUser": {
      get: {
        tags: ["Users"],
        summary: "Get current user",
        responses: {
          "200": {
            description: "ok",
          },
          "400": {
            description: "bad request",
          },
          "401": {
            description: "Un Authorized",
          },
          "403": {
            description: "Forbidden",
          },
          "404": {
            description: "Not Found",
          },
          "500": {
            description: "internal server error",
          },
        },
      },
    },

    "/api/v1/Users/": {
      get: {
        tags: ["Users"],
        summary: "Get and filter users logged in user",
        parameters: [
          {
            name: "userName",
            in: "query",
            schema: {
              type: "string",
            },
          },
          {
            name: "email",
            in: "query",
            type: "string",
          },
          {
            name: "country",
            in: "query",
            type: "string",
          },
          {
            name: "groups",
            in: "query",
            type: "array",
            description: "Write 1 for group admin, 2 for system user",
            items: {
              type: "integer",
            },
          },
          {
            name: "pageSize",
            required: true,
            in: "query",
            description: "One based input",
            schema: {
              type: "integer",
              minimum: 5,
            },
          },
          {
            name: "pageNumber",
            required: true,
            in: "query",
            description: "One based input",
            schema: {
              type: "integer",
              minimum: 0,
            },
          },
        ],
        responses: {
          "200": {
            description: "ok",
          },
          "400": {
            description: "bad request",
          },
          "401": {
            description: "Un Authorized",
          },
          "403": {
            description: "Forbidden",
          },

          "404": {
            description: "Not Found",
          },
          "500": {
            description: "internal server error",
          },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update my current profile",
        parameters: [
          {
            in: "formData",
            type: "string",
            name: "userName",
          },
          {
            in: "formData",
            type: "string",
            name: "email",
          },
          {
            in: "formData",
            type: "string",
            name: "country",
          },
          {
            name: "phoneNumber",
            in: "formData",
            type: "string",
          },
          {
            in: "formData",
            type: "file",
            name: "profileImage",
          },
          {
            in: "formData",
            type: "string",
            name: "confirmPassword",
          },
        ],
        responses: {
          "200": {
            description: "ok",
          },
          "400": {
            description: "bad request",
          },
          "401": {
            description: "Un Authorized",
          },
          "403": {
            description: "Forbidden",
          },
          "404": {
            description: "Not Found",
          },
          "500": {
            description: "internal server error",
          },
        },
      },
    },

    "/api/v1/Users/ChangePassword": {
      put: {
        tags: ["Users"],
        summary: "Update user password",
        consumes: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "ChangePassword",
            schema: {
              type: "object",
              required: ["oldPassword", "newPassword", "confirmNewPassword"],
              properties: {
                oldPassword: {
                  type: "string",
                },
                newPassword: {
                  type: "string",
                },
                confirmNewPassword: {
                  type: "string",
                },
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "ok",
          },
          "400": {
            description: "bad request",
          },
          "401": {
            description: "Un Authorized",
          },
          "403": {
            description: "Forbidden",
          },

          "404": {
            description: "Not Found",
          },
          "500": {
            description: "internal server error",
          },
        },
      },
    },

    "/api/v1/Users/Reset/Request": {
      post: {
        tags: ["Users"],
        summary: "Request a password reset if the user forgot his password",
        parameters: [
          {
            in: "body",
            name: "ResetRequest",
            schema: {
              type: "object",
              required: ["email"],
              properties: {
                email: {
                  type: "string",
                },
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "ok",
          },
          "400": {
            description: "bad request",
          },
          "401": {
            description: "Un Authorized",
          },
          "403": {
            description: "Forbidden",
          },

          "404": {
            description: "Not Found",
          },
          "500": {
            description: "internal server error",
          },
        },
      },
    },

    "/api/v1/Users/Reset": {
      post: {
        tags: ["Users"],
        summary: "Reset the user password",
        parameters: [
          {
            in: "body",
            name: "ResetPassword",
            schema: {
              type: "object",
              required: ["email", "password", "confirmPassword", "seed"],
              properties: {
                email: {
                  type: "string",
                },
                password: {
                  type: "string",
                },
                confirmPassword: {
                  type: "string",
                },
                seed: {
                  type: "string",
                },
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "ok",
          },
          "400": {
            description: "bad request",
          },
          "401": {
            description: "Un Authorized",
          },
          "403": {
            description: "Forbidden",
          },

          "404": {
            description: "Not Found",
          },
          "500": {
            description: "internal server error",
          },
        },
      },
    },

  },
  securityDefinitions: {
    bearerAuth: {
      name: "Authorization",
      in: "header",
      type: "apiKey",
      description: "JWT Authorization header",
    },
  },
  security: [{ bearerAuth: [] }],
};