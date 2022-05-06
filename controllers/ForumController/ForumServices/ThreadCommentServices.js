const { Db } = require('mongodb');
const mongoose = require('mongoose');
const ThreadCommentLike = require('../../../models/ThreadCommentLike');
const Thread = require('./../../../models/Thread');
const ThreadComment = require('./../../../models/ThreadComment');


let url = 'mongodb+srv://nosnos:healthbloompw@healthbloom.b38oy.mongodb.net/healthbloom';


//Retrieve All ThreadComments
exports.getAllThreadComments = () => {

    return new Promise((resolve, reject) => {
        console.log("new promise")
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(
            () => {
                console.log("databse connected")
                //Find all threadComments
                return ThreadComment.find();
            }
        )
            .then(threadComments => {
                //resolve the result of the promise
                resolve(threadComments)
                //console.log(threadComments)

            })
            //catches errors
            .catch(err => reject(err))

    })
}


exports.getOneThreadComment = (id) => {
    return new Promise((resolve, reject) => {
        var idThreadComment = mongoose.Types.ObjectId(id)
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return ThreadComment.findById(idThreadComment);

        }).then(threadComments => {
            resolve(threadComments)
            //console.log(threadComments)

        }).catch(err => reject(err))

    })
}

exports.deleteThreadComment = async (id) => {
 
    var idThreadComment = mongoose.Types.ObjectId(id)
    let thrComment = await ThreadComment.findById(idThreadComment)

    return new Promise((resolve, reject) => {

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            
            thrComment.likes.forEach(element => {
                ThreadCommentLike.findOneAndRemove({_id: mongoose.Types.ObjectId(element)}).exec()
            });

            return ThreadComment.findOneAndRemove({ _id: idThreadComment })

        }).then(() => {

            resolve(true)

        }).catch(err => reject(err))

    })
} 


exports.addCommentToThread =  async (body, threadId) => {

    let current = new Date();
    const date = `${current.getDate()}-${current.getMonth() + 1}-${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}`;
  
    let newId = mongoose.Types.ObjectId(threadId)
    let thrObj = await Thread.findById(newId);
    //console.log(thrObj)

    return new Promise((resolve, reject) => {
        
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {

            let threadComment = new ThreadComment({
                _id: new mongoose.Types.ObjectId(),
                body: body,
                dateCreated: date
            })
            
            return threadComment.save().then((data) => {
                thrObj.comments.push(data._id);
                thrObj.save();
                 
            thComObj = {_id : data._id, body:data.body }

            
            resolve(thComObj)

            });

        })
    })
}

exports.editComment =  async (body, commentId) => {
 
    let newId = mongoose.Types.ObjectId(commentId)
    let commObj = await ThreadComment.findById(newId);
    //console.log(thrObj)

    return new Promise((resolve, reject) => {
        
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {

            commObj.body = body
            
            return commObj.save().then((data) => {                 
                thComObj = {_id : data._id, body:data.body }

            
                resolve(thComObj)

            });

        })
    })
}