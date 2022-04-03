const { Db } = require('mongodb');
const mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

const current = new Date();
const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

let schemaThreadContent = mongoose.Schema({
    body: {
        type: String,
        required: true
    },

})

let ThreadContent = mongoose.model('threadContent', schemaThreadContent)
let url = 'mongodb+srv://nosnos:healthbloompw@healthbloom.b38oy.mongodb.net/healthbloom';


//Retrieve All Contents
exports.getAllThreadContents = () => {

    return new Promise((resolve, reject) => {
        console.log("new promise")
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(
            () => {
                console.log("databse connected")
                //Find all sections
                return ThreadContent.find();
            }
        )
            .then(sections => {
                //resolve the result of the promise
                resolve(sections)
                console.log(sections)

            })
            //catches errors
            .catch(err => reject(err))

    })
}


exports.getOneThreadContent = (id) => {
    return new Promise((resolve, reject) => {
        var idContent = mongoose.Types.ObjectId(id)
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return ThreadContent.findById(idContent);

        }).then(sections => {
            resolve(sections)
            console.log(sections)

        }).catch(err => reject(err))

    })
}

exports.deleteThreadContent = (id) => {
    console.log('promise delete')
    var idContent = mongoose.Types.ObjectId(id)

    return new Promise((resolve, reject) => {

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return ThreadContent.findOneAndRemove({ _id: idContent })

        }).then(() => {

            resolve(true)

        }).catch(err => reject(err))

    })
} 


exports.addThreadContent = (body) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log("1")
            let section = new ThreadContent({
                body:body

            })
            console.log("before insert")
            return section.save()

        })
    })
}