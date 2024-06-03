const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema ({

    // we can just write title: String, but since we want to add more info we use objects.
    title: {type: String, required: true},
    description: {type: String, required: true},
    address: {type: String, required: true},
    location: {
        lat: {type: Number, required: true},
        lng: {type: Number, required: true},
    },
    image: {type: String, required: true},
    creator: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}
})

// This will name our Collections as places.
module.exports = mongoose.model('Place', placeSchema);