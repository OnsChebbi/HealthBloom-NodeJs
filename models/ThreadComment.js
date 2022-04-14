const { Db } = require('mongodb');
const mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

const current = new Date();
const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

let schemaThreadComment = mongoose.Schema({
    
    body: {
        type: String,
        required: true
    }
})

let ThreadComment = mongoose.model('threadComment', schemaThreadComment)
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


exports.addThreadComment = (title, body) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log("1")
            let threadComment = new ThreadComment({
                body: body

            })
            console.log("before insert")
            return threadComment.save()

        })
    })
}

module.exports = ThreadComment