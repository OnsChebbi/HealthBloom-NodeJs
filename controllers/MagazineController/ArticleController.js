const Article=  require('../../models/Article')
const Comment= require('../../models/Comment')
const Articlelike= require('../../models/Articlelike')
const User= require('../../models/User')

exports.getOneArticleController=async (request,response)=>{
    let id=request.params.id;
    try{
        let article= await Article.getOneArticleDetails(id)
        response.send(article)
    }
    catch(error){
        response.json({success:false,message:error});
    
    }
}


exports.getOneAuthorController=async (request,response)=>{
    let id=request.params.id;
    try{
        let author= await Article.getAuthorDetails(id)
        response.send(author)
    }
    catch(error){
        response.json({success:false,message:error});
    
    }
}

exports.getArticlesByCategoryController=async (request,response)=>{
    let category= request.params.category;
    try{
        let articles= await Article.getArticleByCategory(category)
        response.send(articles)

    }
catch(error){
    response.json({success:false,message:error});


exports.getAllArticlesController=async (request,response)=>{
    try{
        let articles= await Article.getAllArticles()
        response.send(articles)

    }
catch(error){
    response.json({success:false,message:error});

}
}


exports.getAllSubscribersController=async (response)=>{
    console.log("subscribe")
    try{
        let articles= await Article.getSubscribers()
        response.send(articles)

    }
catch(error){
    response.json({success:false,message:error});

}
}

exports.topArticlesController=async (request,response)=>{
    try{
        let articles= await Article.best()
        response.send(articles)

    }
    catch(error){
        response.json({success:false,message:error});

    }
}


exports.deleteArticle=async (request,response)=>{
    let id=request.params.id;
    try{
         Article.deleteArticle(id)
         response.json({success:true,message:"Article deleted successfully"});
    }
    catch(error){
        response.json({success:false,message:error});
    
    }
}

exports.getComments=async (request,response)=>{
    let idArticle=request.params.id;

    try{
        let comments= await Comment.getAllComments(idArticle)
        response.send(comments)

    }
    catch(error){
        response.json({success:false,message:error});

    }
}

exports.addArticleController=async (request,response)=>{
    console.log(request.body)
    title=request.body.title;
    description=request.body.description;
    author=request.body.author;
    image= request.body.image;
    category=request.body.category;

    try{
        Article.addArticle(title,description,author,image,category);
        Article.getSubscribers(title);
        response.json({success:true,message:"Article added successfully"});

    }
    catch(error){
        response.json({success:false,message:error});
    
    }
}

exports.updateArticleController=async (request,response)=>{

    console.log(request.body)
    id=request.body.id
    title=request.body.title;
    description=request.body.description;
    image= request.body.image;
    try{
        Article.updateArticle(id,title,description,image);
        response.json({success:true,message:"Article updated successfully"});

    }
    catch(error){
        response.json({success:false,message:error});
    
    }


}

exports.addCommentToArticle=async (request,response)=>{
    console.log(request.body)
    content=request.body.content;
    idArticle=request.body.idArticle;
    idUser=request.body.idUser;
    emailUser= request.body.emailUser;
    try{
        Comment.addComment(content,idArticle,idUser,emailUser);
        Article.incrementComments(idArticle)
        response.json({success:true,message:"Comment added successfully"});

    }
    catch(error){
        response.json({success:false,message:error});
    
    }


}


exports.likeArticle=async (request,response)=>{
    
   let article=request.params.article;
   let user=request.params.user;
    try{
        Articlelike.addLike(article,user);
        Article.incrementLikes(article)    ;    
        response.json({success:true,message:"Article liked successfully"});

    }
    catch(error){
        response.json({success:false,message:error});
    
    }
}

exports.unlikeArticle=async (request,response)=>{
    
    let article=request.params.article;
    let user=request.params.user;     
     try{
        Articlelike.removeLike(article,user);
         Article.decrementLikes(article);

         response.json({success:true,message:"Article disliked successfully"});
 
     }
     catch(error){
         response.json({success:false,message:error});
     
     }
 
 
 }

 exports.sendEmailToSubscribers=async (request,response)=>{

    try{
        let articles= await Article.getSubscribers()

        for(var i in articles)
        {
             document.write(i);
        }
    }
catch(error){

    console.log("error")
}

}



exports.getLikeStatus=async (request,response)=>{
    let article=request.params.article;
    let user=request.params.user;
    try{
        let status= await Articlelike.getLike(article,user);
        if(status){
            response.send(true)
        }
        else if(!status){
            response.send(false)
        }

    }
    catch(error){

        response.json({success:false,message:error});

    }
} 

 exports.subscribe=async (request,response)=>{
    
    let id=request.params.id;
     
     try{
         Article.subscribeNewsLetter(id)
         let user= await Article.getAuthorDetails(id);
         Article.sendSubscriptionSMS(user.Phone,user.FirstName)
         response.json({success:true,message:"Subscribed successfully"});
 
     }
     catch(error){
         response.json({success:false,message:error});
     
     }
 }


 exports.unsubscribe=async (request,response)=>{
    
    let id=request.params.id;
     
     try{
         Article.unsubscribeNewsLetter(id)
         let user= await Article.getAuthorDetails(id);
         Article.sendUnubscriptionSMS(user.Phone,user.FirstName)
         response.json({success:true,message:"Unsubscribed successfully"});
 
     }
     catch(error){
         response.json({success:false,message:error});
     
     }
 }

exports.promoteArticle=async (request,response)=>{
    
    let id=request.params.id;
     
     try{
         Article.promoteArticle(id)
         response.json({success:true,message:"Article promoted successfully"});
 
     }
     catch(error){
         response.json({success:false,message:error});
     
     }
 
 
}


exports.deleteComment=async (request,response)=>{
    let id=request.params.id;
    let comment= await Comment.getOneComment(id)
    try{
         Comment.deleteComment(id)
         Article.decrementComments(comment.idArticle)
         response.json({success:true,message:"Comment deleted successfully"});
    }
    catch(error){
        response.json({success:false,message:error});
    
    }
}
