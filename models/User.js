const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email : {type : String, unique: true},
    password: { type: String},
    username: {type:String, required:false},
    googleId: { type: String, unique: true, sparse: true }, // Unique Google ID
    googleDisplayName: { type: String }, // Google display name
    googleEmail: { type: String }, // Google email
});

module.exports = mongoose.model('User', userSchema);