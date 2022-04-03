const { Db } = require('mongodb');
const mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

const current = new Date();
const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

let schemaThread = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
})

let Thread = mongoose.model('thread', schemaThread)
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
            return Thread.findById(idThread);

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
            console.log("before insert")
            return thread.save()

        })
    })
}