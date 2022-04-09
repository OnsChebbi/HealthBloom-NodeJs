const Article=  require('../../models/Article')
const Comment= require('../../models/Comment')



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

exports.getAllArticlesController=async (request,response)=>{
    try{
        let articles= await Article.getAllArticles()
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
    try{
        Article.addArticle(title,description,author,image);
        response.json({success:true,message:"Article added successfully"});

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
    
   let id=request.params.id;
    
    try{
        Article.likeArticle(id)
        response.json({success:true,message:"Article liked successfully"});

    }
    catch(error){
        response.json({success:false,message:error});
    
    }


}

exports.unlikeArticle=async (request,response)=>{
    
    let id=request.params.id;
     
     try{
         Article.unlikeArticle(id)
         response.json({success:true,message:"Article unliked successfully"});
 
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
