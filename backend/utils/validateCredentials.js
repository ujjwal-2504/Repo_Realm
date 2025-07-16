// utils/validatePassword.js

/**
 * Checks if a password meets these rules:
 * - At least 8 characters
 * - Contains at least one lowercase letter
 * - Contains at least one uppercase letter
 * - Contains at least one number
 *
 * @param {string} password - The password to validate
 * @returns {boolean} - true if valid, false otherwise
 */

function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Checks if a string is a valid email format.
 * @param {string} email
 * @returns {boolean}
 */

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = { validatePassword, validateEmail };
