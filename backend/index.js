require("dotenv").config();

const mongoose = require("mongoose");
const config = require("./config.json");

mongoose.connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error:"));
mongoose.connection.once("open", () => {
    console.log("MongoDB connected");
});

const User = require("./models/user.model");
const Note = require("./models/note.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: true, message: "No token provided" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: true, message: "Invalid token" });
        req.user = user.user; // Assuming the token payload structure includes `user`
        console.log("Authenticated user:", req.user); // Debugging log
        next();
    });
};

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
    res.json({ data: "Hello World" });
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});

app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    try {
        const isUser = await User.findOne({ email });
        if (isUser) {
            return res.status(400).json({ error: true, message: "User already exists" });
        }

        const user = new User({ fullName, email, password });
        await user.save();

        const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1000h" });
        return res.json({ error: false, user, accessToken, message: "User created successfully" });
    } catch (error) {
        console.error("Error creating account:", error);
        return res.status(500).json({ error: true, message: "Server error" });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: true, message: "Email and password are required" });
    }

    try {
        const userInfo = await User.findOne({ email });
        if (!userInfo) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        if (userInfo.password !== password) {
            return res.status(400).json({ error: true, message: "Invalid credentials" });
        }

        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10h" });
        return res.json({ error: false, message: "User logged in successfully", email, accessToken });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ error: true, message: "Server error" });
    }
});

//Get User
app.get("/get-user", authenticateToken, async (req, res) => {
    const user = req.user;
    const isUser = await User.findOne({ _id:user._id });

    if (!isUser) {
        return res.status(404).json({ error: true, message: "User not found" });
    }
    return res.json({
         user:{fullName: isUser.fullName, email: isUser.email,"_id": isUser._id,createdOn: isUser.createdOn},
         error: false,
         message: "User fetched successfully",
         });
}); 

// Add notes
app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const user = req.user;

    if (!title || !content) {
        return res.status(400).json({ error: true, message: "Title and content are required" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });

        await note.save();
    return res.json({ error: false, note, message: "Note added successfully" });
    } catch (error) {
        console.error("Error adding note:", error);
        return res.status(500).json({ error: true, message: "Something went wrong" });
    }
});

// Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const { noteId } = req.params;
    const { title, content, tags, isPinned } = req.body;
    const user = req.user;

    if (!title && !content && !tags && isPinned === undefined) {
        return res.status(400).json({ error: true, message: "No changes provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        // Update fields only if they are provided
        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if(isPinned){
            note.isPined = isPinned;
        }

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    } catch (error) {
        console.error("Error updating note:", error);
        return res.status(500).json({ error: true, message: "Something went wrong" });
    }
});

//Get all notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
    try {
        // Check if user is properly set by the authenticateToken middleware
        const user = req.user;

        if (!user || !user._id) {
            return res.status(401).json({
                error: true,
                message: "User not authenticated",
            });
        }

        // Fetch all notes for the authenticated user
        const notes = await Note.find({ userId: user._id });

        return res.json({
            error: false,
            notes,
            message: "Notes fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return res.status(500).json({
            error: true,
            message: "Something went wrong",
        });
    }
});

// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const user = req.user;

    if (!noteId) {
        return res.status(400).json({ error: true, message: "Note ID is required" });
    }

    if (!user || !user._id) {
        return res.status(401).json({ error: true, message: "User not authenticated" });
    }

    try {
        // Find the note to ensure it belongs to the authenticated user
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        // Delete the note
        await Note.deleteOne({ _id: noteId, userId: user._id });

        return res.json({ error: false, message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error deleting note:", error);
        return res.status(500).json({ error: true, message: "Something went wrong" });
    }
});

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const { noteId } = req.params;
    const { isPinned } = req.body; // Boolean indicating pin status
    const user = req.user;

    try{
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if(isPinned) note.isPined = isPinned || false;

        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note updated successfully",    
        });
    }catch(error){
        return res.status(500).json({
            error: true,
            message: "Something went wrong",
        })
    }
});





module.exports = app;
