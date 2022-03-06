const mongoose=require('mongoose');


let schemaArticle=mongoose.Schema({
    _id:String,
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
let url='mongodb://localhost:27017/test'


//Retrieve All Articles
exports.getAllArticles=()=>{

    return new Promise((resolve, reject)=>{
console.log("new promise")
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(
            ()=>{
                console.log("databse connected")

               //Find all articles
               return Article.find({});
            }
        )
        .then(articles => {
            mongoose.disconnect();
            //resolve the result of the promise
            resolve(articles)
    
        })
        //catches errors
        .catch(err=>reject(err))

    })
    
}

exports.getOneArticleDetails=(id)=>{
    return new Promise((resolve,reject)=>{
    console.log(id)
     mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
         return Article.findById(id)
   
       }).then(articles=>{
           mongoose.disconnect()
           resolve(articles)
           console.log(articles)
   
       }).catch(err=>reject(err))

    })

}


exports.deleteArticle=(id)=>{
    console.log('promise delete')
    return new Promise((resolve,reject)=>{
    
     mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
         return Article.deleteOne({_id:id})
   
       }).then(articles=>{
           mongoose.disconnect()
           resolve(true)
   
       }).catch(err=>reject(err))
 
    })
 
}


exports.addArticle=(title,subject,author,description,image)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
        console.log("1")
            let article=new Article({
                title:title,
                subject:subject,
                author:author,
                description:description,
                image:image,
                dateCreation: new Date(),
                nbLikes: 0,
                nbComments: 0,
                promoted:false
            })
            console.log("before insert")
           return Article.insertOne(article, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
           
          });

        }).then(()=>{
            mongoose.disconnect()
            resolve('added !')
        }).catch((err)=>{
            mongoose.disconnect()
            reject(err)
        })
    })




}
