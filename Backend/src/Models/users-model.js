import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

/**
 * User Schema — defines the shape of a user document in MongoDB.
 * Fields: fullname, email (unique), password
 * Timestamps: createdAt and updatedAt are added automatically
 */
const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

/**
 * Pre-save hook — runs automatically BEFORE saving a user to the database.
 * It hashes the password so we never store plain-text passwords.
 * The "isModified" check ensures we only hash when the password actually changed,
 * not every time we update any field on the user.
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = model('users', userSchema)

export { User }
