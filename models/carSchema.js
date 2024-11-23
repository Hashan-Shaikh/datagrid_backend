const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    Brand: { type: String, required: true },
    Model: { type: String, required: true },
    AccelSec: { type: Number, required: true },
    TopSpeed_KmH: { type: Number, required: true },
    Range_Km: { type: Number, required: true },
    Efficiency_WhKm: { type: Number, required: true },
    FastCharge_KmH: { type: Number, required: false, default: null },
    RapidCharge: { type: String, enum: ['Yes', 'No'], required: true },
    PowerTrain: { type: String, required: true },
    PlugType: { type: String, required: true },
    BodyStyle: { type: String, required: true },
    Segment: { type: String, required: true },
    Seats: { type: Number, required: true },
    PriceEuro: { type: Number, required: true },
    Date: { type: String, required: true },
});

carData = mongoose.model('carSchema', carSchema);
module.exports = carData;
