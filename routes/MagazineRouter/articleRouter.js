const articleController= require('../../controllers/MagazineController/ArticleController.js');
const router= require('express').Router()


router.get('/',articleController.getAllArticlesController);
router.get('/bestArticles',articleController.topArticlesController);
router.get('/:id',articleController.getOneArticleController);
router.get('/Author/:id',articleController.getOneAuthorController);
router.get('/delete/:id',articleController.deleteArticle);
router.get('/deleteComment/:id',articleController.deleteComment);
router.post('/addArticle',articleController.addArticleController);
router.get('/comments/:id',articleController.getComments);
router.post('/addComment',articleController.addCommentToArticle);
router.put('/updateArticle',articleController.updateArticleController);
router.put('/subscribe/:id',articleController.subscribe);
router.put('/likeArticle/:id',articleController.likeArticle);
router.put('/unlikeArticle/:id',articleController.unlikeArticle);
router.put('/promoteArticle/:id',articleController.promoteArticle);
module.exports = router;
