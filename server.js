const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/physio_clinic')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

function extractYouTubeId(url) {
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const videoSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  category:   { type: String, required: true },
  youtubeUrl: { type: String, required: true },
  youtubeId:  { type: String, required: true },
  createdAt:  { type: Date, default: Date.now }
});
const Video = mongoose.model('Video', videoSchema);

const bookingSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  phone:   { type: String, required: true },
  service: { type: String, required: true },
  date:    { type: String, required: true },
  time:    { type: String, required: true },
  message: { type: String, default: '' },
  status:  { type: String, enum: ['pending','confirmed','cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const Admin = mongoose.model('Admin', adminSchema);

const reviewSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  review:   { type: String, required: true },
  approved: { type: Boolean, default: false },
  createdAt:{ type: Date, default: Date.now }
});
const Review = mongoose.model('Review', reviewSchema);

async function seedAdmin() {
  const exists = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
  if (!exists) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Admin.create({ username: process.env.ADMIN_USERNAME, password: hashed });
    console.log(`Admin created  →  username: ${process.env.ADMIN_USERNAME}`);
  }
}
seedAdmin();

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET || 'physio_secret_key');
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/api/bookings', async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: admin._id, username }, process.env.JWT_SECRET || 'physio_secret_key', { expiresIn: '8h' });
  res.json({ token });
});

app.get('/api/admin/bookings', auth, async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json(bookings);
});

app.patch('/api/admin/bookings/:id', auth, async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(booking);
});

app.delete('/api/admin/bookings/:id', auth, async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.get('/api/videos', async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 });
  res.json(videos);
});

app.post('/api/admin/videos', auth, async (req, res) => {
  try {
    const { title, category, youtubeUrl } = req.body;
    const youtubeId = extractYouTubeId(youtubeUrl);
    if (!youtubeId) return res.status(400).json({ error: 'Invalid YouTube URL' });
    const video = await Video.create({ title, category, youtubeUrl, youtubeId });
    res.status(201).json({ success: true, video });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/videos/:id', auth, async (req, res) => {
  await Video.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.post('/api/reviews', async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/reviews', async (req, res) => {
  const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
  res.json(reviews);
});

app.get('/api/admin/reviews', auth, async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
});

app.patch('/api/admin/reviews/:id', auth, async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { approved: req.body.approved }, { new: true });
  res.json(review);
});

app.delete('/api/admin/reviews/:id', auth, async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running → http://localhost:${PORT}`));
