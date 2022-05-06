const forumSectionController= require('../../controllers/ForumController/ForumController');


const router= require('express').Router()

router.post('/add-section',forumSectionController.addForumSection);
router.get('/get-sections',forumSectionController.getAllForumSections);
router.get('/get-section-by-id/:id',forumSectionController.getOneForumSection);

router.post('/create-thread',forumSectionController.addThread);
router.get('/get-threads',forumSectionController.getAllThreads);
router.get('/get-threads-by-section/:sectionId',forumSectionController.getAllThreadsBySection);
router.get('/get-thread/:id',forumSectionController.getOneThread);
router.delete('/delete-thread/:id',forumSectionController.deleteThread);
router.post('/add-comment-to-thread',forumSectionController.addCommentToThread);
router.put('/edit-comment',forumSectionController.editComment);
router.delete('/delete-comment-from-thread/:id',forumSectionController.deleteCommentFromThread);

router.post('/add-like-to-comment',forumSectionController.addLikeToComment);
router.delete('/delete-like-from-comment/:userId/:commentId',forumSectionController.deleteLikeFromComment);


module.exports = router;
