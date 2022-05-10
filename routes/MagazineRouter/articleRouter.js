const articleController= require('../../controllers/MagazineController/ArticleController.js');
const router= require('express').Router()


router.get('/',articleController.getAllArticlesController);
router.get('/bestArticles',articleController.topArticlesController);
router.get('/:id',articleController.getOneArticleController);
router.get('/Author/:id',articleController.getOneAuthorController);
router.get('/subscribers',articleController.getAllSubscribersController);
router.get('/getLike/:article/:user',articleController.getLikeStatus);
router.get('/getArticleByCategory/:category',articleController.getArticlesByCategoryController);
router.get('/email',articleController.sendEmailToSubscribers);
router.get('/delete/:id',articleController.deleteArticle);
router.get('/deleteComment/:id',articleController.deleteComment);
router.post('/addArticle',articleController.addArticleController);
router.get('/comments/:id',articleController.getComments);
router.get('/subscribers',articleController.getAllSubscribersController);
router.get('/get',articleController.getAllSubscribersController)
router.post('/addComment',articleController.addCommentToArticle);
router.put('/updateArticle',articleController.updateArticleController);
router.put('/subscribe/:id',articleController.subscribe);
router.put('/unsubscribe/:id',articleController.unsubscribe);
router.post('/likeArticle/:article/:user',articleController.likeArticle);
router.delete('/unlikeArticle/:article/:user',articleController.unlikeArticle);
router.put('/promoteArticle/:id',articleController.promoteArticle);

module.exports = router;
