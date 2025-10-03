// src/controllers/programController.js
import prisma from '../lib/prisma.js';

// @desc    Create a new program
// @route   POST /api/v1/programs
// @access  Private (Organization only)
export const createProgram = async (req, res) => {
    const { title, description, policy, minBounty, maxBounty, tags } = req.body;
    const orgUserId = req.user.id; // From authenticateToken middleware

    try {
        // Find the organization profile linked to the user
        const organization = await prisma.organization.findUnique({
            where: { userId: orgUserId },
        });

        if (!organization) {
             // First create an organization for this user
            const newOrganization = await prisma.organization.create({
                data: {
                    userId: orgUserId,
                    name: req.user.username, // Default name to username
                },
            });

            // Now create the program linked to the new organization
            const newProgram = await prisma.program.create({
                data: {
                    title,
                    description,
                    policy,
                    minBounty,
                    maxBounty,
                    tags,
                    organizationId: newOrganization.id,
                },
            });
            return res.status(201).json({ success: true, data: newProgram });
        }


        const program = await prisma.program.create({
            data: {
                title,
                description,
                policy,
                minBounty,
                maxBounty,
                tags,
                organizationId: organization.id,
            },
        });

        res.status(201).json({ success: true, data: program });
    } catch (error) {
        console.error('Create program error:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// @desc    Get all programs
// @route   GET /api/v1/programs
// @access  Private
export const getAllPrograms = async (req, res) => {
    try {
        const programs = await prisma.program.findMany({
            include: {
                organization: {
                    select: {
                        name: true,
                        logoUrl: true,
                    },
                },
            },
        });
        res.status(200).json({ success: true, data: programs });
    } catch (error) {
        console.error('Get programs error:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};