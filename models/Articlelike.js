const { Db } = require('mongodb');
const mongoose = require('mongoose');
let schemaArticlelike = mongoose.Schema({
    article: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
    }
})

let Articlelike = mongoose.model('articlelike', schemaArticlelike)
let url = 'mongodb+srv://nosnos:healthbloompw@healthbloom.b38oy.mongodb.net/healthbloom';
exports.addLike = (article, user) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log("1")
            let articleLike = new Articlelike({
                article: article,
                user:user,
                status:true
            })
            
            return articleLike.save()
        })
    })

}

exports.removeLike = (article,user) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Articlelike.findOneAndRemove({ article:article, user:user })
        }).then(() => {
            resolve(true)
        }).catch(err => reject(err))
    })
}


exports.getLike = (article,user) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Articlelike.findOne({article:article, user:user});
        }).then(status => {
            resolve(status)
            console.log(status)
        }).catch(err => reject(err))
    })
}

