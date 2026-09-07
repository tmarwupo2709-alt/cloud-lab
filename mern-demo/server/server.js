const dns = require("node:dns");

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// MODEL SINH VIÊN
// ===============================
const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

const Student = mongoose.model("Student", studentSchema);

// ===============================
// API GET - LẤY DANH SÁCH
// ===============================
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error("GET students error:", error);
    res.status(500).json({
      message: error.message
    });
  }
});

// ===============================
// API POST - THÊM SINH VIÊN
// ===============================
app.post("/api/students", async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);

    res.status(201).json(newStudent);
  } catch (error) {
    console.error("POST student error:", error);

    res.status(400).json({
      message: error.message
    });
  }
});

// ===============================
// API PUT - SỬA SINH VIÊN
// ===============================
app.put("/api/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("PUT student error:", error);

    res.status(400).json({
      message: error.message
    });
  }
});

// ===============================
// API DELETE - XÓA SINH VIÊN
// ===============================
app.delete("/api/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(
      req.params.id
    );

    if (!deletedStudent) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student deleted successfully"
    });
  } catch (error) {
    console.error("DELETE student error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

// ===============================
// KẾT NỐI MONGODB RỒI MỚI CHẠY SERVER
// ===============================

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI chưa được cấu hình trong file .env");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("MongoDB Atlas connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:");
    console.error(error.message);
  }
}

startServer();