const { Db } = require('mongodb');
const mongoose=require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId; 

let schemaArticle=mongoose.Schema({
    title:String,
    subject:String,
    author: String,
    description:String,
    image:String,
    dateCreation: Date,
    nbLikes: Number,
    nbComments: Number,
    promoted: Boolean
})


let Article=mongoose.model('article',schemaArticle)
let url='mongodb+srv://nosnos:healthbloompw@healthbloom.b38oy.mongodb.net/healthbloom';


//Retrieve All Articles
exports.getAllArticles=()=>{

    return new Promise((resolve, reject)=>{
console.log("new promise")
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(
            ()=>{
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
        .catch(err=>reject(err))

    })
    
}

exports.getOneArticleDetails=(id)=>{
    return new Promise((resolve,reject)=>{
        var idArticle=mongoose.Types.ObjectId(id)
        mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
         return Article.findById(idArticle);
   
       }).then(articles=>{
            resolve(articles)
           console.log(articles)
   
       }).catch(err=>reject(err))

    })

}


exports.deleteArticle=(id)=>{
    console.log('promise delete')
    var idArticle=mongoose.Types.ObjectId(id)

    return new Promise((resolve,reject)=>{
    
     mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
         return Article.findOneAndRemove({_id:idArticle})
   
       }).then(()=>{

        resolve(true)
   
       }).catch(err=>reject(err))
 
    })
 
}


exports.addArticle=(title,subject)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
        console.log("1")
            let article=new Article({
                title:title,
                subject:subject,
                
            })
            console.log("before insert")
           return article.save()

        })
    })




}
