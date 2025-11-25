const Event = require('../models/Event');
const User = require('../models/User');

// 🧱 Create event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, category, date, time, location } = req.body;
    const event = await Event.create({
      title, description, category, date, time, location,
      owner: req.user._id
    });

    // Assign 'owner' role if missing
    if (!req.user.roles.includes('owner')) {
      req.user.roles.push('owner');
      await req.user.save();
    }

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 Get all events
exports.getAllEvents = async (req, res) => {
  const events = await Event.find().populate('owner cohosts guests.user');
  res.json(events);
};

// 📄 Get single event
exports.getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id).populate('owner cohosts guests.user');
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
};

// ✏️ Update event
exports.updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const isOwner = event.owner.equals(req.user._id);
  const isAdmin = req.user.roles.includes('admin');
  if (!isOwner && !isAdmin)
    return res.status(403).json({ message: 'Forbidden' });

  Object.assign(event, req.body);
  await event.save();
  res.json(event);
};

// ❌ Delete event
exports.deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Not found' });

  const isOwner = event.owner.equals(req.user._id);
  const isAdmin = req.user.roles.includes('admin');
  if (!isOwner && !isAdmin)
    return res.status(403).json({ message: 'Forbidden' });

  await event.deleteOne();
  res.json({ message: 'Event deleted' });
};

// 🤝 Add cohost
exports.addCohost = async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  if (!event.owner.equals(req.user._id))
    return res.status(403).json({ message: 'Only owner can assign cohosts' });

  const { userId } = req.body;
  if (!event.cohosts.includes(userId)) event.cohosts.push(userId);
  await event.save();
  res.json(event);
};

// 🎫 Add guest
exports.addGuest = async (req, res) => {
  const { email, userId } = req.body;
  const event = await Event.findById(req.params.eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const isOwnerOrCohost =
    event.owner.equals(req.user._id) || event.cohosts.includes(req.user._id);
  if (!isOwnerOrCohost)
    return res.status(403).json({ message: 'No permission' });

  event.guests.push({ user: userId, email });
  await event.save();
  res.json(event);
};

// ⭐ Toggle VIP
exports.toggleVIP = async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  const guest = event.guests.id(req.params.guestId);
  if (!guest) return res.status(404).json({ message: 'Guest not found' });

  const isOwnerOrCohost =
    event.owner.equals(req.user._id) || event.cohosts.includes(req.user._id);
  if (!isOwnerOrCohost)
    return res.status(403).json({ message: 'No permission' });

  guest.isVIP = !guest.isVIP;
  await event.save();
  res.json(event);
};

// 🗳️ RSVP
exports.rsvp = async (req, res) => {
  const { rsvp } = req.body;
  const event = await Event.findById(req.params.eventId);

  let guest = event.guests.find(g =>
    String(g.user) === String(req.user._id) || g.email === req.user.email
  );
  if (!guest)
    event.guests.push({ user: req.user._id, email: req.user.email, rsvp });
  else guest.rsvp = rsvp;

  await event.save();
  res.json(event);
};



exports.recommendations = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Find events user has attended or RSVPed to
    const userEvents = await Event.find({ "guests.user": req.user._id }).lean();

    // Collect unique categories from those events
    const categories = [...new Set(userEvents.map(e => e.category).filter(Boolean))];

    // Fetch recommended events by those categories
    const recommendations = await Event.find({
      category: { $in: categories },
      "guests.user": { $ne: req.user._id }
    })
      .select("title description category date time location owner")
      .limit(10)
      .lean();

    // Return plain JSON
    res.status(200).json(recommendations.length ? recommendations : []);
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    res.status(500).json({ message: "Server error while fetching recommendations" });
  }
};

