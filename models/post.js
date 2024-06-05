const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {type: String, required: true, minLength: 1},
    text: {type: String, required: true, minLength: 1},
    author: {type: Schema.Types.ObjectId, ref: "User"},
    isPublished: {type: Boolean, default: false}
    
}, {timestamps: true})

// Virtual for post's URL
PostSchema.virtual("url").get(function() {
    return `/posts/${this._id}`;
});

module.exports = mongoose.model("Post", PostSchema);