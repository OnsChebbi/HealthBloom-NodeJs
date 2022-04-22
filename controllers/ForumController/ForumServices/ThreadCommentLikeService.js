const mongoose = require('mongoose');
const ThreadComment = require('../../../models/ThreadComment');
const ThreadCommentLike = require('../../../models/ThreadCommentLike')

let url = 'mongodb+srv://nosnos:healthbloompw@healthbloom.b38oy.mongodb.net/healthbloom';


exports.addLikeToComment = async (userId,commentId) => {
    let userIdMong = mongoose.Types.ObjectId(userId)
    
    let commentIdMong = mongoose.Types.ObjectId(commentId)

    let newComment = await ThreadComment.findById(commentIdMong)

    console.log(newComment)
    /*let query = await ThreadCommentLike.find({userId : userIdMong,comment : commentIdMong}).exec()
    console.log(query)
    if(query.length > 0)
    {
        console.log('already added like');
        return;
    }*/

    if(newComment.likes.length > 0)
    {
        console.log('already added like');
        return;
    }
    

    return new Promise((resolve, reject) => {
        mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            let thComLike = new ThreadCommentLike({
                _id: new mongoose.Types.ObjectId(),

            })
            return thComLike.save()
            
        }).then((obj) => {
            /*obj.comment = newComment
            obj.save()*/
            newComment.likes.push(obj)
            newComment.save()
        })
    })

}


exports.deleteLikeFromComment = async (userId, commentId) => {
    console.log('promise delete')

    //let userIdMong = mongoose.Types.ObjectId(userId)
    let commentIdMong = mongoose.Types.ObjectId(commentId)

    let newComment = await ThreadComment.findById(commentIdMong)

    return new Promise((resolve, reject) => {
        let id=''
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            newComment.likes.forEach((element,index,object) => {
                //if(element._id === commentIdMong)
                {
                    id = element._id
                    console.log("found " + element._id)
                    object.splice(index,1)
                }
            });
            newComment.save();
            return ThreadCommentLike.findOneAndRemove({_id: id})

            /*return ThreadCommentLike.findOneAndRemove({ userId:userIdMong, commentId:commentIdMong })*/

        }).then(() => {

            resolve(true)

        }).catch(err => reject(err))

    })
} 
