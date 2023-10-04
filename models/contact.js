const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
// const { schemas } = require("../schemas/contacts");
const Joi = require('joi');
const contactSсhema  = new Schema(
    {
    name: {type: String,required: [true,"Set name for contact"],},
    email: {type: String,
      required: [true, "Set email for contact"],
    },
    phone: {
      type: String,
      required: [true, "Set phone for contact"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);
contactSсhema.post("save", handleMongooseError);

const Contact = model("contact", contactSсhema);

const FavoriteSchema = Joi.object({
  favorite: Joi.boolean().required()
.messages({ "any.required": `Missing field favorite` }),
});

module.exports = { Contact,FavoriteSchema};