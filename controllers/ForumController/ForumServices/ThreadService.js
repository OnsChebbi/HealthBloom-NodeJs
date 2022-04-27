const mongoose = require('mongoose');
const {Schema} = mongoose;
const Thread = require('./../../../models/Thread');
const ThreadComment = require('./../../../models/ThreadComment');
const ForumSection = require('./../../../models/ForumSection');

const ThreadCommentService = require('./ThreadCommentServices')

let url = 'mongodb+srv://nosnos:healthbloompw@healthbloom.b38oy.mongodb.net/healthbloom';


//Retrieve All Threads
exports.getAllThreads = () => {

    return new Promise((resolve, reject) => {
        console.log("new promise")
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(
            () => {
                console.log("databse connected")
                //Find all threads
                return Thread.find();
            }
        )
            .then(threads => {
                //resolve the result of the promise
                resolve(threads)
                //console.log(threads)

            })
            //catches errors
            .catch(err => reject(err))

    })
}

exports.getAllThreadsBySection = (sectionId) => {
    
    return new Promise((resolve, reject) => {
        console.log("new promise")
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(
            () => {
                console.log("databse connected")
                //Find all threads
                return Thread.find({section:mongoose.Types.ObjectId(sectionId)}).populate('comments').exec();
            }
        )
            .then(threads => {
                //resolve the result of the promise
                resolve(threads)
                //console.log(threads)

            })
            //catches errors
            .catch(err => reject(err))

    })
}



exports.getOneThread = (id) => {
    return new Promise((resolve, reject) => {
        var idThread = mongoose.Types.ObjectId(id)
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Thread.findById(idThread).populate('comments').populate('initContent');

        }).then(threads => {
            resolve(threads)
            //console.log(threads)

        }).catch(err => reject(err))

    })
}

exports.deleteThread = async (id) => {
    console.log('promise delete')
    var idThread = mongoose.Types.ObjectId(id)
    let thr = await Thread.findById(idThread)

    return new Promise((resolve, reject) => {

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            
            ThreadComment.findOneAndRemove({_id: mongoose.Types.ObjectId(thr.initContent)}).exec()

            thr.comments.forEach(element => {
               ThreadCommentService.deleteThreadComment( mongoose.Types.ObjectId(element))
            });
            return Thread.findOneAndRemove({ _id: idThread })

        }).then(() => {

            resolve(true)

        }).catch(err => reject(err))

    })
} 


exports.addThread = (title, body,sectionId) => {
    
    let current = new Date();
    const date = `${current.getDate()}-${current.getMonth() + 1}-${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}`;

    let sectionIdMong = mongoose.Types.ObjectId(sectionId)

    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            
            let thread = new Thread({
                title: title,
                dateCreated: date
            })
            let firstContent = new ThreadComment({
                body:body,
                dateCreated: date
            })
            firstContent.save();
            thread.initContent = firstContent._id;
            thread.section = sectionIdMong;

            console.log("before insert")
            return thread.save()

        })
    })
}