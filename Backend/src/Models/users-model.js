import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    fullname:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    salt: {
      type: String,
    },
    password:{
        type:String,
        required: true,
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function(){
    
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(this.password, salt);

    this.salt=salt
    this.password=hash
})


const users = model("users", userSchema);

export { users };
