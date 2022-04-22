const { Db } = require('mongodb');
const mongoose = require('mongoose');

let schemaForumSection = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    }
})

let ForumSection = mongoose.model('forumSection', schemaForumSection)

module.exports = ForumSection;