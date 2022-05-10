const { Db } = require('mongodb');
const mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
const nodemailer = require('nodemailer')
const path = require('path')
const User = require('./User');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const accountSid = "ACe3c2b2afbf500ba39222e531455087db";
const authToken = "c8abaa21047c04d9c3209901c8099a23";
const client = require('twilio')(accountSid, authToken);
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
    category: {
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

exports.getArticleByCategory = (category) => {

    return new Promise((resolve, reject) => {
        console.log("new promise")
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(
            () => {

                return Article.find({category:category});
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


exports.getSubscribers = (title) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(
            () => {
                console.log("databse connected")
                //Find all articles
                return User.find({newsLetter:true});
            }
        )
            .then(articles => {
                //resolve the result of the promise
                articles.forEach(element => {

                    var mailOptions = {
                        from: 'HealthBloom',
                        to:element.Email,
                        subject: "New Article.",
                        html:"<!DOCTYPE html>"+
"<html>"+
"<head>"+
 "  <title>A new article has been added!</title>"+
"</head>"+
"<body>"+
  "<h2 >Hello "+ element.FirstName+" </h2>"+
  "<p>We first thank you for being a subscriber to our Newsletter.  </p>"+
  "<h5>A new article has been added to our medical magazine!</h5>"+
 " <h3>Take a look! </h3>"+
 " <h3><bold> Read More on : "+title+"</bold></h3>"+
"</body>"+
"</html>",



                      };
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'healthbloomapp@gmail.com',
                            pass: 'binarybrains'
                        }
                      });


                      transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                          console.log(error);
                        } else {
                          res.send({
                            status: "success",
                          });
                          console.log("Email sent: " + info.response);
                        }
                      });
                });
                resolve(articles)
                console.log(articles)
            })
            //catches errors
            .catch(err => reject(err))
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
            return Article.findOneAndUpdate({ _id: ida }, { promoted: true })

        }).then(() => {

            resolve(true)

        }).catch(err => reject(err))

    })

}

exports.updateArticle = (id, title, description, image) => {
    var ida = mongoose.Types.ObjectId(id)


    return new Promise((resolve, reject) => {

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Article.findOneAndUpdate({ _id: ida }, { title: title, description: description, image: image })

        }).then(() => {

            resolve(true)

        }).catch(err => reject(err))

    })

}
exports.incrementLikes = (id) => {
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

exports.decrementLikes = (id) => {
    var ida = mongoose.Types.ObjectId(id)

    console.log('promise like')

    return new Promise((resolve, reject) => {

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Article.findOneAndUpdate({ _id: ida }, { $inc: { nbLikes: -1 } })

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

exports.addArticle = (title, description, author, image, category) => {
    return new Promise((resolve, reject) => {
        const current = new Date();

        const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log("1")
            let article = new Article({
                title: title,
                description: description,
                author: author,
                image: image,
                category: category,
                dateCreation: date

            })
            var mailOptions = {
                from: 'HealthBloom',
                to: "ons.chebbi@esprit.tn",
                subject: 'A new article has been added!',
                text: title + " Read more.."
            };
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'healthbloomapp@gmail.com',
                    pass: 'binarybrains'
                }
            });


            transporter.sendMail(mailOptions, function (error, info) {
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
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(
            () => {
                console.log("databse connected")
                //Find all articles
                return Article.find().sort({ nbLikes: -1 }).limit(3);
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

            return User.findOneAndUpdate({ _id: ida }, { newsLetter: true })

        }).then(() => {

            resolve(true)


                .then(message => console.log(message.sid));

        }).catch(err => reject(err))

    })


}

exports.unsubscribeNewsLetter = (id) => {
    var ida = mongoose.Types.ObjectId(id)

    return new Promise((resolve, reject) => {

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return User.findOneAndUpdate({ _id: ida }, { newsLetter: false })

        }).then(() => {

            resolve(true)

        }).catch(err => reject(err))

    })

}

exports.sendSubscriptionSMS = (tel,name) => {
    const accountSid = "AC433124b95f3ca73156447265c0f0ca81";
    const authToken = "ff7d42068e0cbbd6a68a9fca2b30e41c";
    const client = require('twilio')(accountSid, authToken);

    client.messages
        .create({
            body: 'Welcome to HealthBloom! Congratulations '+name+'! You have been subscribed to our Newsletter! You will get a notification on you email account each time we add a new article!',
            from: '+12674406073',
            to: '+216' + tel
        })
}

exports.sendUnubscriptionSMS = (tel,name) => {
    const accountSid = "AC433124b95f3ca73156447265c0f0ca81";
    const authToken = "ff7d42068e0cbbd6a68a9fca2b30e41c";
    const client = require('twilio')(accountSid, authToken);

    client.messages
        .create({
            body: 'Welcome to HealthBloom '+name+'! You have been unsubscribed from our newsletter! Hope you will subscribe again soon .Our Articles are waiting for you',
            from: '+12674406073',
            to: '+216' + tel
        })
}