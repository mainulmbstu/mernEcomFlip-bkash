const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    replies: [{
      userName: String,
      msg: String,
      date:Date
    }],
  },
  { timestamps: true }
);

const ContactModel = mongoose.model("Contact", contactSchema);
//=============================
const contactReplySchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    reply: { type: String, required: true },
    msgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact", //collection name in mongoose.model('User', userSchema)
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //collection name in mongoose.model('User', userSchema)
      required: true,
    },
  },
  { timestamps: true }
);

const ContactReplyModel = mongoose.model("ContactReply", contactReplySchema);

module.exports = { ContactModel, ContactReplyModel };
