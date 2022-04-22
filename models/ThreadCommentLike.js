const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const threadCommentLikeSchema = Schema(
    {
        //userId : {

    }
)

let ThreadCommentLike = mongoose.model('threadCommentLike', threadCommentLikeSchema)  

module.exports = ThreadCommentLike