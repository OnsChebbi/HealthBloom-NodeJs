const Article=  require('../models/Article')

exports.getAllArticlesController=(req,res,next)=>{
    Article.getAllArticles().then(articles=>{
        res.render('articles',{articles:articles})
    })
}


exports.getOneArticleController=(req,res,next)=>{
    let id=req.params.id;
    Article.getOneArticleDetails(id).then(oneArticle=>{
        res.render('articleDetails',{oneArticle:oneArticle})
        
    })
}

exports.deleteArticle=(req,res,next)=>{
    let id= req.params.id;
    Article.deleteArticle(id).then((verif)=>{
        
        res.redirect('/magazine')
    }).catch((err)=>{
        console.log(err)
    })
}


exports.addArticleController=(req,res,next)=>{
    console.log(req.body)
    
    Article.addArticle(req.body.title,req.body.subject,req.body.description,req.body.image).then((msg)=>{
        console.log(msg)
        res.redirect('/magazine')
    }).catch((err)=>{
        console.log(err)
        res.redirect('/magazine')
    })

}
