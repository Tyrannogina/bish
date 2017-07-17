const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const languages = ["en", "es", "fr", "de", "it", "el", "ru", "pt"];

const userSchema = new Schema({
  	username: String,
  	password: String,
    alias: String,
    description: String,
    languagesOffer: [{
      type: String,
      enum: languages,
      required: true
    }],
    languagesWant: [{
      type: String,
      enum: languages,
      required: true
    }],
    locations: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location"
    },
    lastLogin: {
      type: Date,
      default: Date.now
    }
  	// role: {
    // 	type: String,
    // 	enum : ['EDITOR', 'ADMIN'],
    // 	default : 'ADMIN'
  	// }
	}, {
  	timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
	}
);

userSchema.statics.login = function login(id, callback) {
   return this.findByIdAndUpdate(id, { $set : { 'lastLogin' : Date.now() }}, { new : true }, callback);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
