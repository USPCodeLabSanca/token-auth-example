const mongoose = require('mongoose');

let RefreshSchema = mongoose.Schema({
    token: String
});

module.exports = mongoose.model('Refresh', RefreshSchema);