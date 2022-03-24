const Article=  require('../../models/Article')

exports.getAllArticlesController=async (request,response)=>{
    try{
        let articles= await Article.getAllArticles()
        response.send(articles)

    }
catch(error){
    response.json({success:false,message:error});

}

}
exports.getOneArticleController=async (request,response)=>{
    let id=request.params.id;
    try{
        const article= Article.getOneArticleDetails(id)
        response.send(article)
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


exports.addArticleController=async (request,response)=>{
    console.log(request.body)
    title=request.body.title;
    subject=request.body.subject;
    try{
        Article.addArticle(title,subject);
        response.json({success:true,message:"Article added successfully"});

    }
    catch(error){
        response.json({success:false,message:error});
    
    }

}
