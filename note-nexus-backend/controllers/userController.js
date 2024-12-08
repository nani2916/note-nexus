const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const Note = require('../models/Note');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  const { name, email, mobile, uname, password } = req.body;

  try {

    const existingUser = await User.findOne({ uname });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobile,
      uname,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const signin = async (req, res) => {
  const { uname, password } = req.body;

  try {
    const user = await User.findOne({ uname });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ Error: 'Username Not Found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); 
    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ Error: 'Wrong Password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(StatusCodes.OK).json({ token, name: user.name, username: user.uname, message: "Login Successfull!!"  }); 
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ Error: 'Error signing in', error });
  }
};

const add_note = async (req, res) => {
  try {

    const { title, content, visibility } = req.body;
    
    const owner = req.body.owner ;
    const uname = req.body.uname ;

    if (!title || !content || !visibility) {
      return res.status(400).json({ message: "Missing required fields: title, content, visibility" });
    }

    if (!owner || !uname) {
      return res.status(400).json({ message: "Owner or Username is missing" });
    }

    const newNote = new Note({
      title,
      content,
      owner,
      owner_username: uname,
      visibility, 
      lastEditedBy: owner
    });

    const savedNote = await newNote.save();

    res.status(201).json({
      message: 'Note added successfully',
      note: savedNote,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error adding note',
      error: error.message,
      stack: error.stack, 
    });
  }
};

const view_notes = async (req, res) => {
  try {
    const uname = req.query.username; 
    
    const notes = await Note.find({
      $or: [
        { visibility: 'public' }, 
        { owner_username: uname },
      ]
    });

    res.status(200).json({ notes, message: "Fetched All Notes!" });
  } catch (error) {
    res.status(500).json({ error: "Error fetching notes" });
  }
};


const view_note_by_id = async (req, res) => {
  const { noteid } = req.params;

  try {
    const note = await Note.findOne({ _id: noteid });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ note, message: 'Note fetched successfully' });
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const edit_note = async (req, res) => {
  const { id, title, content, lastEditedBy, visibility } = req.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content, lastEditedBy, visibility}, 
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    return res.status(200).json({ 
      message: 'Note updated successfully.', 
      note: updatedNote 
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({ message: 'Error updating note.', error: error.message });
  }
};

const delete_note = async (req, res) => {
  const { id } = req.params; 
  const { username } = req.query;

  try {
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: true,
        message: "Note not found",
      });
    }

    if (note.owner_username !== username) {
      return res.status(403).json({
        success: true,
        message: "You are not authorized to delete this note",
      });
    }

    await Note.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Note successfully deleted",
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error. Could not delete note",
    });
  }
};


const getUserProfile = async (req, res) => {
  try {
    const { uname } = req.params; 

    const user = await User.findOne({ uname });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      uname: user.uname,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user profile", error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  const { uname } = req.params; 
  const { name, email, mobile, newUname } = req.body; 

   
  try {
    const user = await User.findOne({ uname });

    const oname = user.name;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (newUname) {
      const existingUser = await User.findOne({ uname: newUname });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (newUname) user.uname = newUname;

    const updatedUser = await user.save();

    const updatedName = name || user.name; 
    const updatedUsername = newUname || uname; 

    await Note.updateMany(
      { owner_username: uname }, 
      {
        $set: {
          owner: updatedName,
          owner_username: updatedUsername,
        },
      }
    );

    await Note.updateMany(
      {
        $or: [
          { lastEditedBy: oname }, 
          { lastEditedBy: null }, 
        ],
      },
      {
        $set: {
          lastEditedBy: updatedName, 
        },
      }
    );
   
    return res.status(200).json({
      message: 'Profile and related notes updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      message: 'Error updating profile',
      error: error.message,
    });
  }
};


const updatePassword = async (req, res) => {
  try {
    const { uname } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findOne({ uname });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating password", error: error.message });
  }
};


module.exports = { signup, signin, add_note, view_notes, view_note_by_id, edit_note, delete_note, getUserProfile, updatePassword, updateUserProfile};
