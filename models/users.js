const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const emailRegexp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 2,
      required: [true, "Set name for user"],
      default: "Guest",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [emailRegexp, "Please fill a valid email address"],
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: [true, "Set password for user"],
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    subscription: Joi.string().required(),
});

const loginSchema = Joi.object({
   email: Joi.string().required(),
   password: Joi.string().required(),
});

const schemas = { registerSchema, loginSchema };

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

module.exports = { User, schemas };