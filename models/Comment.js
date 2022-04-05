const { Db } = require('mongodb');
const mongoose=require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId; 

const current = new Date();

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
        type:Date,
        default: current
      }
   
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


exports.addComment=(content,idArticle)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
        console.log("1")
            let comment=new Comment({
                content:content,
                idArticle:idArticle
                
            })
           return comment.save()

        })
    })

}


