const articleController= require('../../controllers/MagazineController/ArticleController.js');
const router= require('express').Router()


router.get('/',articleController.getAllArticlesController);
router.get('/bestArticles',articleController.topArticlesController);
router.get('/:id',articleController.getOneArticleController);
router.get('/delete/:id',articleController.deleteArticle);
router.post('/addArticle',articleController.addArticleController);
router.get('/comments/:id',articleController.getComments);
router.post('/addComment',articleController.addCommentToArticle);
router.put('/likeArticle/:id',articleController.likeArticle);

module.exports = router;
