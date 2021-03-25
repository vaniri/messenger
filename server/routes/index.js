const router = require('express').Router();

router.use('/user', require('./user'));
router.use('/conversations', require('./conversations'));

module.exports = router;