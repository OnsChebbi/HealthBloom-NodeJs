const { Db } = require('mongodb');
const mongoose = require('mongoose');
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
                console.log(threadComments)

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
            console.log(threadComments)

        }).catch(err => reject(err))

    })
}

exports.deleteThreadComment = (id) => {
    console.log('promise delete')
    var idThreadComment = mongoose.Types.ObjectId(id)

    return new Promise((resolve, reject) => {

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return ThreadComment.findOneAndRemove({ _id: idThreadComment })

        }).then(() => {

            resolve(true)

        }).catch(err => reject(err))

    })
} 


exports.addCommentToThread =  async (body, threadId) => {

    let newId = mongoose.Types.ObjectId(threadId)
    let thrObj = await Thread.findById(newId);
    console.log(thrObj)

    return new Promise((resolve, reject) => {
        
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log("1")
            let threadComment = new ThreadComment({
                _id: new mongoose.Types.ObjectId(),
                body: body

            })
            console.log("before insert")
            let thComObj = threadComment.save().then((data) => {
                thrObj.comments.push(data._id);
                thrObj.save();
            });
            
            return thComObj;
        })
    })
}