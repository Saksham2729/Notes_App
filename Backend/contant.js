// constants.js

const DB_NAME = "notesapp";

const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_COMPLEXITY: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?#&])[A-Za-z\d@$!%?#&]{8,}$/,
};

const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

const MESSAGES = {
  REQUIRED_FIELDS: "All fields are required",
  INVALID_EMAIL: "Invalid email format",
  PASSWORD_MISMATCH: "Passwords do not match",
  WEAK_PASSWORD:
    "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
  USER_EXISTS: "User already registered",
  USER_CREATED: "User registered successfully",
  LOGIN_REQUIRED: "Email and password are required",
  INVALID_CREDENTIALS: "Invalid email or password",
  LOGIN_SUCCESS: (name) => `Welcome ${name}`,
  SERVER_ERROR: "Server error",
};

const SUCCESS = {
  TRUE: true,
  FALSE: false,
};

module.exports = {
  DB_NAME,
  REGEX,
  STATUS_CODE,
  MESSAGES,
  SUCCESS,
};


// const consts = {
//   dbName: "notesapp",

//   regex: {
//     email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//     passwordComplexity: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?#&])[A-Za-z\d@$!%?#&]{8,}$/,
//   },

//   statusCode: {
//     ok: 200,
//     created: 201,
//     badRequest: 400,
//     unauthorized: 401,
//     conflict: 409,
//     serverError: 500,
//   },

//   messages: {
//     requiredFields: "All fields are required",
//     invalidEmail: "Invalid email format",
//     passwordMismatch: "Passwords do not match",
//     weakPassword:
//       "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
//     userExists: "User already registered",
//     userCreated: "User registered successfully",
//     loginRequired: "Email and password are required",
//     invalidCredentials: "Invalid email or password",
//     loginSuccess: (name) => `Welcome ${name}`,
//     serverError: "Server error",
//   },

//   success: {
//     true: true,
//     false: false,
//   },
// };

// export default consts; // Exporting as ES Module


