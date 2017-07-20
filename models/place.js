const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const placeSchema = new Schema({
  name: String,
  location: {
    type: {type: String},
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

placeSchema.statics.createInstance = function (place) {
    var newPlace = new this();
    newPlace.name = place.name;
    // location and first user
    newPlace.save();
    return newPlace;
};

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
