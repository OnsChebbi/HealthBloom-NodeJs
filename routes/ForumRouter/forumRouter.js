const forumSectionController= require('../../controllers/ForumController/ForumController');


const router= require('express').Router()

router.post('/add-section',forumSectionController.addForumSection);
router.get('/get-sections',forumSectionController.getAllForumSections);
router.get('/get-section-threads',forumSectionController.getAllForumSections);
router.post('/create-thread',forumSectionController.addThread);
router.get('/get-threads',forumSectionController.getAllThreads);
router.get('/get-thread/:id',forumSectionController.getOneThread);
router.post('/add-comment-to-thread',forumSectionController.addCommentToThread);


module.exports = router;
