const mongoose = require('mongoose');
const {Schema} = mongoose;
const Thread = require('./../../../models/Thread');
const ThreadComment = require('./../../../models/ThreadComment');

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
                console.log(threads)

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
            console.log(threads)

        }).catch(err => reject(err))

    })
}

exports.deleteThread = (id) => {
    console.log('promise delete')
    var idThread = mongoose.Types.ObjectId(id)

    return new Promise((resolve, reject) => {

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Thread.findOneAndRemove({ _id: idThread })

        }).then(() => {

            resolve(true)

        }).catch(err => reject(err))

    })
} 


exports.addThread = (title, body) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log("1")
            let thread = new Thread({
                title: title,
                body: body

            })
            let firstContent = new ThreadComment({
                body:body
            })
            firstContent.save();
            thread.initContent = firstContent._id;

            console.log("before insert")
            return thread.save()

        })
    })
}