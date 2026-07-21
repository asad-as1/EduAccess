const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const pdfParse = require('pdf-parse');
const gTTS = require('gtts'); // Add Google Text-to-Speech package
const tesseract = require('tesseract.js');
const fs = require('fs');


dotenv.config();

const app = express();
app.use(express.json());  // Middleware to parse JSON bodies
const port =  5000;

// Middleware setup
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log('Database connected');
  } catch (error) {
    console.error('Error while connecting to the database', error);
  }
};
connectDB();

// File upload setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
app.get('/', (req, res) => {
  res.send('Server is running');
});

const userRouter = require('./src/routes/user');
const qaRoutes = require('./src/routes/QnA');
const noteRouter = require('./src/routes/notes');
const shortNoteRouter = require('./src/routes/shortNotes');
const eventRouter = require('./src/routes/event');
const activityRouter = require('./src/routes/activity');
const geminiRouter = require('./src/routes/gemini');
const cloudinaryRouter = require('./src/routes/cloudinary');

app.use("/user", userRouter);
app.use('/qna', qaRoutes);
app.use("/notes", noteRouter);
app.use("/mynotes", shortNoteRouter);
app.use("/events", eventRouter);
app.use("/activity", activityRouter);
app.use("/api", geminiRouter);
app.use('/cloudinary', cloudinaryRouter);




app.post('/textreader', upload.single('file'), (req, res) => {
  const fileBuffer = req.file.buffer;
  const fileExtension = path.extname(req.file.originalname).toLowerCase();

  if (fileExtension === '.pdf') {
    pdfParse(fileBuffer)
      .then(data => res.json({ text: data.text }))
      .catch(err => res.status(500).send('Error reading PDF file'));
  } else if (['.png', '.jpg', '.jpeg'].includes(fileExtension)) {
    tesseract.recognize(fileBuffer, 'eng', { logger: (m) => console.log(m) })
      .then(({ data: { text } }) => res.json({ text }))
      .catch(err => res.status(500).send('Error reading image file'));
  } else if (fileExtension === '.txt') {
    const text = fileBuffer.toString('utf-8');
    res.json({ text });
  } else {
    res.status(400).send('Unsupported file type');
  }
});

// Route to handle text-to-speech conversion and send audio file
app.post('/generate-audio', (req, res) => {
  console.log(req.body);  // Logs the incoming request body
  const { text } = req.body;  // Get text from frontend
  
  if (!text) {
    return res.status(400).send('No text provided for audio generation');
  }

  const gtts = new gTTS(text, 'en');  // Initialize Google Text-to-Speech (English)
  const audioPath = path.join(__dirname, 'audio.mp3');

  gtts.save(audioPath, (err, result) => {
    if (err) {
      return res.status(500).send('Error generating audio');
    }

    // Send the generated audio file to the client
    res.sendFile(audioPath, (err) => {
      if (err) {
        return res.status(500).send('Error sending audio file');
      }

      // Optionally, delete the audio file after sending it to the client
      fs.unlinkSync(audioPath);
    });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;