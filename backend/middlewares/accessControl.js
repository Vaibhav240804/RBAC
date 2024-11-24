exports.hasPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userPermissions = req.user.roles
      .flatMap((role) => role.permissions)
      .map((perm) => perm.name);

    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
