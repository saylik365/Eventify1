// const router = require('express').Router();
// const eventCtrl = require('../controllers/eventController');
// const auth = require('../middleware/authMiddleware');

// router.get('/', auth, eventCtrl.getAllEvents);
// router.get('/:id', auth, eventCtrl.getEventById);
// router.post('/create', auth, eventCtrl.createEvent);
// router.put('/:id', auth, eventCtrl.updateEvent);
// router.delete('/:id', auth, eventCtrl.deleteEvent);

// router.post('/:eventId/add-cohost', auth, eventCtrl.addCohost);
// router.post('/:eventId/add-guest', auth, eventCtrl.addGuest);
// router.post('/:eventId/guest/:guestId/vip', auth, eventCtrl.toggleVIP);
// router.post('/:eventId/rsvp', auth, eventCtrl.rsvp);
// router.get('/recommendations', auth, eventCtrl.recommendations);

// module.exports = router;

const router = require('express').Router();
const eventCtrl = require('../controllers/eventController');
const auth = require('../middleware/authMiddleware');

// 🧠 Keep static/specific routes FIRST
router.get('/recommendations', auth, eventCtrl.recommendations);

// 🧱 CRUD routes
router.post('/create', auth, eventCtrl.createEvent);
router.get('/', auth, eventCtrl.getAllEvents);
router.get('/:id', auth, eventCtrl.getEventById);
router.put('/:id', auth, eventCtrl.updateEvent);
router.delete('/:id', auth, eventCtrl.deleteEvent);

// 👥 Guest, Cohost, and RSVP routes
router.post('/:eventId/add-cohost', auth, eventCtrl.addCohost);
router.post('/:eventId/add-guest', auth, eventCtrl.addGuest);
router.post('/:eventId/guest/:guestId/vip', auth, eventCtrl.toggleVIP);
router.post('/:eventId/rsvp', auth, eventCtrl.rsvp);

module.exports = router;

