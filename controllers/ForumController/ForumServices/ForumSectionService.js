const mongoose = require('mongoose');
const {Schema} = mongoose;
const ForumSection = require('./../../../models/ForumSection');

let url = 'mongodb+srv://nosnos:healthbloompw@healthbloom.b38oy.mongodb.net/healthbloom';

//Retrieve All Sections
exports.getAllForumSections = () => {

    return new Promise((resolve, reject) => {
        console.log("new promise")
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(
            () => {
                console.log("databse connected")
                //Find all sections
                return ForumSection.find();
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


exports.getOneForumSection = (id) => {
    return new Promise((resolve, reject) => {
        var idSection = mongoose.Types.ObjectId(id)
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return ForumSection.findById(idSection);

        }).then(sections => {
            resolve(sections)
            console.log(sections)

        }).catch(err => reject(err))

    })
}

exports.deleteForumSection = (id) => {
    console.log('promise delete')
    var idSection = mongoose.Types.ObjectId(id)

    return new Promise((resolve, reject) => {

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return ForumSection.findOneAndRemove({ _id: idSection })

        }).then(() => {

            resolve(true)

        }).catch(err => reject(err))

    })
} 


exports.addForumSection = (title, description, image) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log("1")
            let section = new ForumSection({
                title: title,
                description: description,
                image: image

            })
            console.log("before insert")
            return section.save()

        })
    })
}