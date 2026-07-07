import express from 'express';
import Note from '../models/Note.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { title, content, color } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });

    const newNote = new Note({
      title,
      content,
      color,
      user: req.user,
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, isPinned, color, isArchived, isTrashed } = req.body;
    
    const note = await Note.findOne({ _id: req.params.id, user: req.user });
    if (!note) return res.status(404).json({ message: 'Note not found or unauthorized' });

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, isPinned, color, isArchived, isTrashed },
      { new: true }
    );
    
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user });
    if (!note) return res.status(404).json({ message: 'Note not found or unauthorized' });

    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;