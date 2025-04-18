import mongoose from 'mongoose';

/**
 * Mongoose schema for a User.
 * Represents a user with a name, email, and password.
 */
const userSchema = new mongoose.Schema({
  /**
   * User's full name
   * @type {String}
   * @required
   */
  name: {
    type: String,
    required: true,
    trim: true
  },

  /**
   * User's email address
   * @type {String}
   * @required
   * @unique
   * @lowercase
   * @match {/\S+@\S+\.\S+/} Ensures valid email format
   */
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email format']
  },

  /**
   * User's password (hashed)
   * @type {String}
   * @required
   */
  password: {
    type: String,
    required: true
  }
});

/**
 * User model - represents a user in the database.
 */
const User = mongoose.model('User', userSchema);

export { User };
