const mongoose = require("mongoose");
const Place    = require("../models/place");
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
    places: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place"
    }],
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

userSchema.methods.joinPlace = function(newPlace) {
  Place.findOne({ 'googleID': newPlace.googleID }, (err, place) => {
    if (err) {
      // return res.status(500).json({message: err});
    }
    if (!place) {
      Place.createInstance(newPlace, this._id);
    } else {
      console.log("Existe el sitio");
    }
  });
  // console.log(place);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
