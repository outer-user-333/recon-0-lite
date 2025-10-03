// src/controllers/reportController.js
import prisma from "../lib/prisma.js";
import { cloudinary } from "../config/cloudinary.js"; // Import the cloudinary object

// Helper function to upload a file buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "recon0-attachments",
        resource_type: "auto", // <-- ADD THIS LINE
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const submitReport = async (req, res) => {
  const { programId, title, severity, description, stepsToReproduce, impact } =
    req.body;
  const reporterId = req.user.id;
  const files = req.files; // Files are now in memory buffers

  try {
    const uploadedAttachments = [];
    // 1. If there are files, upload them to Cloudinary first
    if (files && files.length > 0) {
      for (const file of files) {
        const uploadResult = await uploadToCloudinary(file.buffer);
        uploadedAttachments.push({
          fileUrl: uploadResult.secure_url,
          fileName: file.originalname,
          fileType: file.mimetype,
        });
      }
    }

    // 2. Now, create the report and its attachments in our database
    const newReport = await prisma.report.create({
      data: {
        programId,
        reporterId,
        title,
        severity,
        description,
        stepsToReproduce,
        impact,
        // Create related attachments at the same time
        attachments: {
          create: uploadedAttachments,
        },
      },
      include: {
        attachments: true, // Include the new attachments in the response
      },
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Report submitted successfully.",
        data: newReport,
      });
  } catch (error) {
    console.error("Detailed Submit Report Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      errorDetails: error.message,
    });
  }
};

// You can now delete the 'submitReportJson' and 'testUpload' functions if you want,
// as we no longer need them for debugging.


// Add these new functions to src/controllers/reportController.js

// @desc    Get all reports submitted by the logged-in hacker
// @route   GET /api/v1/reports/my-reports
// @access  Private (Hacker only)
export const getMyReports = async (req, res) => {
    const reporterId = req.user.id;

    try {
        const reports = await prisma.report.findMany({
            where: { reporterId: reporterId },
            orderBy: { createdAt: 'desc' },
            // Include the name of the program for context
            include: {
                program: {
                    select: { title: true },
                },
            },
        });
        res.status(200).json({ success: true, data: reports });
    } catch (error) {
        console.error("Get my reports error:", error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// @desc    Get a single report by its ID
// @route   GET /api/v1/reports/:id
// @access  Private (Reporter or relevant Organization only)
export const getReportById = async (req, res) => {
    const { id: reportId } = req.params;
    const { id: userId, role: userRole } = req.user;

    try {
        const report = await prisma.report.findUnique({
            where: { id: reportId },
            include: {
                attachments: true, // Include the report's attachments
                program: { // We need the program to check for organization ownership
                    include: {
                        organization: true,
                    },
                },
            },
        });

        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found.' });
        }

        // --- Authorization Check ---
        const isReporter = report.reporterId === userId;
        const isOrgOwner = userRole === 'organization' && report.program.organization.userId === userId;

        if (!isReporter && !isOrgOwner) {
            return res.status(403).json({ success: false, message: 'Forbidden: You do not have access to this report.' });
        }

        res.status(200).json({ success: true, data: report });
    } catch (error) {
        console.error("Get report by ID error:", error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};