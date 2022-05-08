const { Db } = require('mongodb');
const mongoose=require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId; 

const current = new Date();
const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()} At ${current.getHours()}:${current.getMinutes()}`;

let schemaComment=mongoose.Schema({
   
    content:{
        type: String,
        required: true
      },
    idArticle:{
        type: String,
        required: true
      },
     idUser: {
        type:String,
        required: false
      },
    dateTime: {
        type:String,
        default: date
      },
      emailUser:{
        type: String,
        required: true
      },
   
})



let Comment=mongoose.model('comment',schemaComment)
let url='mongodb+srv://nosnos:healthbloompw@healthbloom.b38oy.mongodb.net/healthbloom';

//Retrieve All Comments
exports.getAllComments=(id)=>{

    return new Promise((resolve, reject)=>{
console.log("new promise")
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(
            ()=>{
                console.log("databse connected")
               //Find all Comments
               return Comment.find({idArticle:id});
            }
        )
        .then(Comments => {
            //resolve the result of the promise
            resolve(Comments)
            console.log(Comments)
    
        })
        //catches errors
        .catch(err=>reject(err))

    })
    
}


exports.addComment=(content,idArticle,idUser,emailUser)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
        console.log("1")
            let comment=new Comment({
                content:content,
                idArticle:idArticle,
                idUser: idUser,
                emailUser: emailUser 
                
            })
           return comment.save()

        })
    })

}


exports.deleteComment = (id) => {
    var idComment = mongoose.Types.ObjectId(id)

    return new Promise((resolve, reject) => {

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Comment.findOneAndRemove({ _id: idComment })

        }).then(() => {

            resolve(true)

        }).catch(err => reject(err))

    })

}



exports.getOneComment = (id) => {
    return new Promise((resolve, reject) => {
        var idComment = mongoose.Types.ObjectId(id)
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Comment.findById(idComment);

        }).then(comment => {
            resolve(comment)

        }).catch(err => reject(err))

    })

}
