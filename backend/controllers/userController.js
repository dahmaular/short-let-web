import User from '../models/User.js';
import Booking from '../models/Booking.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favorites')
      .select('-password');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, dateOfBirth, address } = req.body;

    const user = await User.findById(req.user.id);

    if (user) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.phone = phone || user.phone;
      user.dateOfBirth = dateOfBirth || user.dateOfBirth;
      user.address = address || user.address;

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phone: updatedUser.phone,
          dateOfBirth: updatedUser.dateOfBirth,
          address: updatedUser.address,
          avatar: updatedUser.avatar,
          role: updatedUser.role
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user avatar
// @route   PUT /api/users/avatar
// @access  Private
export const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    const user = await User.findById(req.user.id);

    if (user) {
      user.avatar = avatar;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Avatar updated successfully',
        avatar: user.avatar
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add/remove property to/from favorites
// @route   POST /api/users/favorites/:propertyId
// @access  Private
export const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const propertyId = req.params.propertyId;

    const index = user.favorites.indexOf(propertyId);
    
    if (index > -1) {
      // Remove from favorites
      user.favorites.splice(index, 1);
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Removed from favorites',
        favorites: user.favorites
      });
    } else {
      // Add to favorites
      user.favorites.push(propertyId);
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Added to favorites',
        favorites: user.favorites
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');

    res.status(200).json({
      success: true,
      favorites: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/users/bookings
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('property')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
