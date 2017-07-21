const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const placeSchema = new Schema({
  googleID: String,
  name: String,
  icon: String,
  location: {
    type: {type: String, default: "Point"},
    coordinates: [Number]
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
	}, {
  	timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
	}
);

placeSchema.index({location: '2dsphere'});

placeSchema.statics.createInstance = function (newPlace, userID) {
  // console.log("Voy a crear: ", newPlace);
  // console.log("Para: ", userID);
  var place = new this();
  place.googleID = newPlace.googleID;
  place.name = newPlace.name;
  place.icon = newPlace.icon;
  place.location.coordinates = [newPlace.lng, newPlace.lat];
  place.users.push(userID);
  place.save();
  return place._id;
};

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
