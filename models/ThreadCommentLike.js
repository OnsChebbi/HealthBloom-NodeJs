const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const threadCommentLikeSchema = Schema(
    {
        user : {type: Schema.Types.ObjectId,ref:'user'}
    }
)

let ThreadCommentLike = mongoose.model('threadCommentLike', threadCommentLikeSchema)  

module.exports = ThreadCommentLike