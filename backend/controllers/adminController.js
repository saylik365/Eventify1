const User = require('../models/User');
const Event = require('../models/Event');

exports.listUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

exports.promoteUser = async (req, res) => {
  const { userId, role } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!user.roles.includes(role)) user.roles.push(role);
  await user.save();
  res.json(user);
};

exports.listEvents = async (req, res) => {
  const events = await Event.find();
  res.json(events);
};
