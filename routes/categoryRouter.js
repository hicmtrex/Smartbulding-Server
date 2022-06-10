const router = require('express').Router();
const categoryCtrl = require('../controllers/categoryCtrl');
const auth = require('../middleware/auth');

router
  .route('/category')
  .post(auth, categoryCtrl.createCategory)
  .get(auth, categoryCtrl.getCategories);

router
  .route('/category/:id')
  .get(auth, categoryCtrl.getCategory)
  .delete(auth, categoryCtrl.deleteCategory);

module.exports = router;
