const { Db } = require('mongodb');
const mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var nodemailer = require('nodemailer');
const User = require('./User');

const current = new Date();
const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

let schemaArticle = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    dateCreation: {
        type: String,
        default: date
    },
    nbLikes: {
        type: Number,
        default: 0
    },
    nbComments: {
        type: Number,
        default: 0
    },
    promoted: {
        type: Boolean,
        default: false
    },
})



let Article = mongoose.model('article', schemaArticle)
let url = 'mongodb+srv://nosnos:healthbloompw@healthbloom.b38oy.mongodb.net/healthbloom';


//Retrieve All Articles
exports.getAllArticles = () => {

    return new Promise((resolve, reject) => {
        console.log("new promise")
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(
            () => {
                console.log("databse connected")
                //Find all articles
                return Article.find();
            }
        )
            .then(articles => {
                //resolve the result of the promise
                resolve(articles)
                console.log(articles)

            })
            //catches errors
            .catch(err => reject(err))

    })

}

exports.getOneArticleDetails = (id) => {
    return new Promise((resolve, reject) => {
        var idArticle = mongoose.Types.ObjectId(id)
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Article.findById(idArticle);

        }).then(articles => {
            resolve(articles)
            console.log(articles)

        }).catch(err => reject(err))

    })

}

exports.getAuthorDetails = (id) => {
    return new Promise((resolve, reject) => {
        var idUser = mongoose.Types.ObjectId(id)
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return User.findById(idUser);

        }).then(author => {
            resolve(author)

        }).catch(err => reject(err))

    })

}



exports.deleteArticle = (id) => {
    console.log('promise delete')
    var idArticle = mongoose.Types.ObjectId(id)

    return new Promise((resolve, reject) => {

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Article.findOneAndRemove({ _id: idArticle })

        }).then(() => {

            resolve(true)

        }).catch(err => reject(err))

    })

}

exports.likeArticle = (id) => {
    var ida = mongoose.Types.ObjectId(id)

    console.log('promise like')

    return new Promise((resolve, reject) => {

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Article.findOneAndUpdate({ _id: ida }, { $inc: { nbLikes: 1 } })

        }).then(() => {

            resolve(true)

        }).catch(err => reject(err))

    })

}

exports.unlikeArticle = (id) => {
    var ida = mongoose.Types.ObjectId(id)


    return new Promise((resolve, reject) => {

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Article.findOneAndUpdate({ _id: ida }, { $inc: { nbLikes: -1 } })

        }).then(() => {

            resolve(true)

        }).catch(err => reject(err))

    })

}

exports.promoteArticle = (id) => {
    var ida = mongoose.Types.ObjectId(id)


    return new Promise((resolve, reject) => {

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Article.findOneAndUpdate({ _id: ida }, { promoted: true})

        }).then(() => {

            resolve(true)

        }).catch(err => reject(err))

    })

}

exports.updateArticle = (id,title,description,image) => {
    var ida = mongoose.Types.ObjectId(id)


    return new Promise((resolve, reject) => {

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Article.findOneAndUpdate({ _id: ida }, { title: title, description:description,image:image})

        }).then(() => {

            resolve(true)

        }).catch(err => reject(err))

    })

}

exports.incrementComments = (id) => {
    var ida = mongoose.Types.ObjectId(id)

    console.log('promise like')

    return new Promise((resolve, reject) => {

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Article.findOneAndUpdate({ _id: ida }, { $inc: { nbComments: 1 } })

        }).then(() => {

            resolve(true)

        }).catch(err => reject(err))

    })

}

exports.decrementComments = (id) => {
    var ida = mongoose.Types.ObjectId(id)

    console.log('promise like')

    return new Promise((resolve, reject) => {

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Article.findOneAndUpdate({ _id: ida }, { $inc: { nbComments: -1 } })

        }).then(() => {

            resolve(true)

        }).catch(err => reject(err))

    })

}

exports.addArticle = (title, description, author, image) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log("1")
            let article = new Article({
                title: title,
                description: description,
                author: author,
                image: image

            })
            var mailOptions = {
                from: 'ons.chebbi@esprit.tn',
                to:"ons.chebbi@esprit.tn",
                subject: 'A new article has been added!',
                text: title+ "Read more.."
              };
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'ons.chebbi@esprit.tn',
                    pass: '4twintwin'
                }
              });
              
             
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
              return article.save()

        })
    })




}

exports.best = () => {

    return new Promise((resolve, reject) => {
        console.log("new promise")
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(
            () => {
                console.log("databse connected")
                //Find all articles
                return Article.find().sort({nbLikes:-1}).limit(3);
            }
        )
            .then(articles => {
                //resolve the result of the promise
                resolve(articles)
                console.log(articles)

            })
            //catches errors
            .catch(err => reject(err))

    })

}

exports.subscribeNewsLetter = (id) => {
    var ida = mongoose.Types.ObjectId(id)

    return new Promise((resolve, reject) => {

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return User.findOneAndUpdate({ _id: ida }, { newsLetter: true})

        }).then(() => {

            resolve(true)

        }).catch(err => reject(err))

    })

}


