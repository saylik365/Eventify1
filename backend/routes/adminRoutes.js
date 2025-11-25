const router = require('express').Router();
const adminCtrl = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.get('/users', auth, role(['admin']), adminCtrl.listUsers);
router.get('/events', auth, role(['admin']), adminCtrl.listEvents);
router.post('/promote', auth, role(['admin']), adminCtrl.promoteUser);

module.exports = router;
