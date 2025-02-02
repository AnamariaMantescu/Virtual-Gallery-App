const { db } = require('../config/firebase');

const getAllUsers = async (req, res, next) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    usersSnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    next({ statusCode: 500, message: 'Error fetching users' });
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userDoc = await db.collection('users').doc(req.params.id).get();
    if (!userDoc.exists) {
      return next({ statusCode: 404, message: 'User not found' });
    }

    if (req.user.role !== 'admin' && req.user.uid !== req.params.id) {
      return next({ statusCode: 403, message: 'Forbidden: Access is denied' });
    }

    res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    console.error('Error fetching user:', error);
    next({ statusCode: 500, message: 'Error fetching user' });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;

    if (role && req.user.role !== 'admin') {
      return next({ statusCode: 403, message: 'Forbidden: Only admins can update roles' });
    }

    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
      'metadata.updatedAt': new Date().toISOString()
    };

    const userRef = db.collection('users').doc(req.params.id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return next({ statusCode: 404, message: 'User not found' });
    }

    await userRef.update(updateData);
    res.json({ id: req.params.id, ...updateData });
  } catch (error) {
    console.error('Error updating user:', error);
    next({ statusCode: 500, message: 'Error updating user' });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userRef = db.collection('users').doc(req.params.id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return next({ statusCode: 404, message: 'User not found' });
    }

    await userRef.delete();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    next({ statusCode: 500, message: 'Error deleting user' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
