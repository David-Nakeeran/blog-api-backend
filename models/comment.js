const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    text: {type: String, required: true, minLength: 1},
    author: {type: Schema.Types.ObjectId, ref: "User"},
    post: {type: Schema.Types.ObjectId, ref: "Post"}
    
}, {timestamps: true})

// Virtual for post's URL
CommentSchema.virtual("url").get(function() {
    return `/posts/${this._id}`;
});

module.exports = mongoose.model("Comment", CommentSchema);