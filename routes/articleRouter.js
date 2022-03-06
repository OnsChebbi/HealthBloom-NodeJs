const articleController= require('../controllers/articleController');
const router= require('express').Router()


router.get('/',articleController.getAllArticlesController);
router.get('/:id',articleController.getOneArticleController);
router.get('/delete/:id',articleController.deleteArticle);
router.post('/addArticle',articleController.addArticleController);
module.exports = router;
