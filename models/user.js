const mongoose = require("mongoose");
const Place    = require("../models/place");
const Schema   = mongoose.Schema;

const languages = ["gb", "es", "fr", "de", "it", "gr", "ru", "pt"];

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
  that = this;
  Place.findOne({ 'googleID': newPlace.googleID }, (err, place) => {
    if (err) {
      // return res.status(500).json({message: err});
    }
    if (!place) {
      let placeID = Place.createInstance(newPlace, that._id);
      that.places.push(placeID);
    } else {
      that.places.push(place._id);
      place.users.push(that._id);
      console.log("Existe el sitio");
    }
  });
  // console.log(place);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
