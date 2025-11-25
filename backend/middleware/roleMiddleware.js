module.exports = function (allowedRoles = []) {
  return (req, res, next) => {
    const roles = req.user?.roles || [];
    const hasAccess = roles.some(r => allowedRoles.includes(r)) || roles.includes('admin');
    if (!hasAccess) return res.status(403).json({ message: 'Access denied' });
    next();
  };
};
