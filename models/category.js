const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const categorySchema = Schema({
    name: {
        required: true,
        type: String
    },
    icon: {
        required: true,
        type: String,
    },
    color: {
        type: String,
        default: ''
    },

});
module.exports = mongoose.model('Category', categorySchema);