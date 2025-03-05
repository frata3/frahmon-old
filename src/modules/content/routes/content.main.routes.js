const { Router } = require("express");
const categoryRoutes = require('./content.category.routes');
const contentController = require('../controllers/content.main.controller');

const router = Router();

// router.get('/', contentController);

router.use('/category', categoryRoutes);

module.exports = router;
  