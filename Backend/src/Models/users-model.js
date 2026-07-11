import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'


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
