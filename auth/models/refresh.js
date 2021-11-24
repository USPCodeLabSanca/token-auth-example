const mongoose = require('mongoose');

let RefreshSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    token: String,
    createdAt: { type: Date, expires: 7 * 24 * 60 * 60, default: Date.now}
}, {_id: false});

module.exports = mongoose.model('Refresh', RefreshSchema);