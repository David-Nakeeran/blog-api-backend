const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {type: String, required: true, maxLength: 100},
    surname: {type: String, required: true, maxLength: 100},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    admin: {type: Boolean, default: false},
})

// Full name
UserSchema.virtual("fullName").get(function() {
    return `${this.firstName} ${this.surname}`
})

// Enables virtuals in JSON and Object responses
UserSchema.set('toObject', {virtuals: true});
UserSchema.set('toJSON', {virtuals: true});
// UserSchema.virtual("url").get(function() {
//     return `/user/${this._id}`;
// });

module.exports = mongoose.model("User", UserSchema);