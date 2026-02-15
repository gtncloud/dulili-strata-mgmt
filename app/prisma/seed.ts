import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Clear existing data
    await prisma.sustainabilityChallenge.deleteMany();
    await prisma.sustainabilityMetric.deleteMany();
    await prisma.neighborConnection.deleteMany();
    await prisma.neighborProfile.deleteMany();
    await prisma.localBusinessReview.deleteMany();
    await prisma.localBusiness.deleteMany();
    await prisma.surveyQuestionAnswer.deleteMany();
    await prisma.surveyResponse.deleteMany();
    await prisma.surveyQuestion.deleteMany();
    await prisma.survey.deleteMany();
    await prisma.marketplaceMessage.deleteMany();
    await prisma.marketplaceListing.deleteMany();
    await prisma.chatMessageReply.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.chatChannelMember.deleteMany();
    await prisma.chatChannel.deleteMany();
    await prisma.amenityBooking.deleteMany();
    await prisma.amenity.deleteMany();
    await prisma.maintenanceWorkLog.deleteMany();
    await prisma.vote.deleteMany();
    await prisma.motion.deleteMany();
    await prisma.meeting.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.levy.deleteMany();
    await prisma.document.deleteMany();
    await prisma.announcement.deleteMany();
    await prisma.maintenancePhoto.deleteMany();
    await prisma.maintenanceRequest.deleteMany();
    await prisma.buildingMembership.deleteMany();
    await prisma.lot.deleteMany();
    await prisma.building.deleteMany();
    await prisma.user.deleteMany();

    console.log("✅ Cleared existing data");

    // Create Users
    const password = await bcrypt.hash("password123", 10);

    const adminUser = await prisma.user.create({
        data: {
            email: "admin@dulili.com.au",
            name: "Admin User",
            password,
            role: "admin",
        },
    });

    const managerUser = await prisma.user.create({
        data: {
            email: "manager@dulili.com.au",
            name: "Sarah Manager",
            password,
            role: "manager",
        },
    });

    const ownerUser = await prisma.user.create({
        data: {
            email: "owner@example.com",
            name: "John Owner",
            password,
            role: "owner",
        },
    });

    const tenantUser = await prisma.user.create({
        data: {
            email: "tenant@example.com",
            name: "Jane Tenant",
            password,
            role: "tenant",
        },
    });

    const maintenanceUser = await prisma.user.create({
        data: {
            email: "maintenance@dulili.com.au",
            name: "Mike Maintenance",
            password,
            role: "maintenance_staff",
        },
    });

    console.log("✅ Created users");

    // Create Building
    const building = await prisma.building.create({
        data: {
            name: "Sunset Towers",
            address: "123 Main Street",
            suburb: "Sydney",
            state: "NSW",
            postcode: "2000",
            strataPlanNumber: "SP12345",
            totalLots: 50,
            adminFundBalance: 50000,
            capitalWorksBalance: 100000,
            insuranceExpiry: new Date("2026-12-31"),
        },
    });

    console.log("✅ Created building:", building.name);

    // Create Lots
    const lot1 = await prisma.lot.create({
        data: {
            buildingId: building.id,
            lotNumber: 402,
            unitNumber: "402",
            floor: 4,
            unitEntitlement: 1.0,
        },
    });

    const lot2 = await prisma.lot.create({
        data: {
            buildingId: building.id,
            lotNumber: 403,
            unitNumber: "403",
            floor: 4,
            unitEntitlement: 1.0,
        },
    });

    console.log("✅ Created lots");

    // Create Memberships
    await prisma.buildingMembership.create({
        data: {
            userId: managerUser.id,
            buildingId: building.id,
            role: "manager",
            status: "active",
        },
    });

    await prisma.buildingMembership.create({
        data: {
            userId: maintenanceUser.id,
            buildingId: building.id,
            role: "maintenance_staff",
            status: "active",
        },
    });

    await prisma.buildingMembership.create({
        data: {
            userId: ownerUser.id,
            buildingId: building.id,
            lotId: lot1.id,
            role: "owner",
            status: "active",
        },
    });

    await prisma.buildingMembership.create({
        data: {
            userId: tenantUser.id,
            buildingId: building.id,
            lotId: lot2.id,
            role: "tenant",
            status: "active",
        },
    });

    console.log("✅ Created memberships");

    // Create Announcements
    await prisma.announcement.create({
        data: {
            buildingId: building.id,
            authorId: managerUser.id,
            title: "Window Cleaning - Tuesday 15th",
            content: "The window cleaning team will be visiting the building on Tuesday, March 15th between 9am and 5pm. Please ensure balcony doors are accessible.",
            isPinned: true,
            targetAudience: "all",
            publishedAt: new Date(),
        },
    });

    await prisma.announcement.create({
        data: {
            buildingId: building.id,
            authorId: managerUser.id,
            title: "AGM Notice",
            content: "The Annual General Meeting will be held on April 20th at 6pm in the community room. All owners are encouraged to attend.",
            isPinned: false,
            targetAudience: "owners",
            publishedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
        },
    });

    console.log("✅ Created announcements");

    // Create Maintenance Requests
    const maintenanceRequest = await prisma.maintenanceRequest.create({
        data: {
            buildingId: building.id,
            submittedById: ownerUser.id,
            assignedToId: maintenanceUser.id,
            title: "Leaking pipe in Unit 402",
            description: "Water is leaking from the ceiling in the bathroom. Appears to be coming from the unit above.",
            category: "plumbing",
            priority: "high",
            status: "in_progress",
            location: "Unit 402, Bathroom",
            workNotes: "Inspected the issue. Need to access Unit 403 to fix the pipe connection.",
            estimatedHours: 3,
        },
    });

    await prisma.maintenanceRequest.create({
        data: {
            buildingId: building.id,
            submittedById: tenantUser.id,
            title: "Broken elevator button",
            description: "The button for floor 4 in the main elevator is not working.",
            category: "other",
            priority: "medium",
            status: "submitted",
            location: "Main Elevator",
        },
    });

    console.log("✅ Created maintenance requests");

    // Create Documents
    await prisma.document.create({
        data: {
            buildingId: building.id,
            uploadedBy: managerUser.id,
            name: "Building Insurance Policy 2026.pdf",
            category: "insurance",
            fileUrl: "https://example.com/insurance.pdf",
            fileSize: 2500000,
            expiresAt: new Date("2026-12-31"),
        },
    });

    await prisma.document.create({
        data: {
            buildingId: building.id,
            uploadedBy: managerUser.id,
            name: "AGM Minutes - March 2025.pdf",
            category: "minutes",
            fileUrl: "https://example.com/minutes.pdf",
            fileSize: 1200000,
        },
    });

    console.log("✅ Created documents");

    // Create Amenities
    const gym = await prisma.amenity.create({
        data: {
            buildingId: building.id,
            name: "Fitness Centre",
            type: "gym",
            description: "Fully equipped gym with cardio and weight training equipment",
            capacity: 15,
            bookingFee: 0,
            depositRequired: 0,
            minBookingHours: 1,
            maxBookingHours: 2,
            advanceBookingDays: 7,
            isActive: true,
            rules: "Please bring your own towel. Clean equipment after use.",
        },
    });

    const pool = await prisma.amenity.create({
        data: {
            buildingId: building.id,
            name: "Swimming Pool",
            type: "pool",
            description: "Heated outdoor pool with spa",
            capacity: 20,
            bookingFee: 0,
            depositRequired: 0,
            minBookingHours: 1,
            maxBookingHours: 3,
            advanceBookingDays: 14,
            isActive: true,
            rules: "No glass containers. Children must be supervised.",
        },
    });

    const bbq = await prisma.amenity.create({
        data: {
            buildingId: building.id,
            name: "BBQ Area",
            type: "bbq",
            description: "Outdoor BBQ area with seating for 12",
            capacity: 12,
            bookingFee: 25,
            depositRequired: 50,
            minBookingHours: 2,
            maxBookingHours: 4,
            advanceBookingDays: 30,
            isActive: true,
            rules: "Clean BBQ after use. Return deposit will be processed within 48 hours.",
        },
    });

    const partyRoom = await prisma.amenity.create({
        data: {
            buildingId: building.id,
            name: "Community Room",
            type: "party_room",
            description: "Large function room with kitchen facilities",
            capacity: 40,
            bookingFee: 100,
            depositRequired: 200,
            minBookingHours: 3,
            maxBookingHours: 6,
            advanceBookingDays: 60,
            isActive: true,
            rules: "No smoking. Music must end by 10pm. Clean and return keys by 11pm.",
        },
    });

    const guestSuite = await prisma.amenity.create({
        data: {
            buildingId: building.id,
            name: "Guest Suite",
            type: "guest_suite",
            description: "One bedroom apartment for visiting guests",
            capacity: 2,
            bookingFee: 80,
            depositRequired: 100,
            minBookingHours: 24,
            maxBookingHours: 72,
            advanceBookingDays: 90,
            isActive: true,
            rules: "Check-in after 2pm. Check-out by 10am. No pets allowed.",
        },
    });

    console.log("✅ Created amenities");

    // Create Sample Bookings
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(20, 0, 0, 0);

    await prisma.amenityBooking.create({
        data: {
            amenityId: bbq.id,
            userId: ownerUser.id,
            buildingId: building.id,
            startTime: tomorrow,
            endTime: tomorrowEnd,
            status: "confirmed",
            purpose: "Family BBQ",
            guestCount: 8,
            totalFee: 25,
            depositPaid: 50,
            paymentStatus: "paid",
        },
    });

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(10, 0, 0, 0);

    const nextWeekEnd = new Date(nextWeek);
    nextWeekEnd.setHours(12, 0, 0, 0);

    await prisma.amenityBooking.create({
        data: {
            amenityId: gym.id,
            userId: tenantUser.id,
            buildingId: building.id,
            startTime: nextWeek,
            endTime: nextWeekEnd,
            status: "confirmed",
            purpose: "Personal training session",
            paymentStatus: "paid",
        },
    });

    console.log("✅ Created sample bookings");

    // Create Chat Channels
    const generalChannel = await prisma.chatChannel.create({
        data: {
            buildingId: building.id,
            name: "General Discussion",
            description: "General community chat for all residents",
            type: "general",
            isPrivate: false,
            createdBy: managerUser.id,
        },
    });

    const maintenanceChannel = await prisma.chatChannel.create({
        data: {
            buildingId: building.id,
            name: "Maintenance & Repairs",
            description: "Discuss building maintenance issues",
            type: "maintenance",
            isPrivate: false,
            createdBy: managerUser.id,
        },
    });

    const socialChannel = await prisma.chatChannel.create({
        data: {
            buildingId: building.id,
            name: "Social Events",
            description: "Plan community events and gatherings",
            type: "social",
            isPrivate: false,
            createdBy: ownerUser.id,
        },
    });

    console.log("✅ Created chat channels");

    // Add members to channels
    await prisma.chatChannelMember.createMany({
        data: [
            { channelId: generalChannel.id, userId: managerUser.id, role: "moderator" },
            { channelId: generalChannel.id, userId: ownerUser.id },
            { channelId: generalChannel.id, userId: tenantUser.id },
            { channelId: maintenanceChannel.id, userId: managerUser.id, role: "moderator" },
            { channelId: maintenanceChannel.id, userId: ownerUser.id },
            { channelId: maintenanceChannel.id, userId: tenantUser.id },
            { channelId: socialChannel.id, userId: ownerUser.id, role: "moderator" },
            { channelId: socialChannel.id, userId: tenantUser.id },
        ],
    });

    console.log("✅ Added channel members");

    // Create sample messages
    await prisma.chatMessage.create({
        data: {
            channelId: generalChannel.id,
            userId: managerUser.id,
            content: "Welcome to Sunset Towers community chat! Feel free to discuss anything related to our building here.",
        },
    });

    await prisma.chatMessage.create({
        data: {
            channelId: maintenanceChannel.id,
            userId: ownerUser.id,
            content: "Has anyone else noticed the elevator making strange noises lately?",
        },
    });

    await prisma.chatMessage.create({
        data: {
            channelId: socialChannel.id,
            userId: ownerUser.id,
            content: "Anyone interested in organizing a BBQ for the building next month?",
        },
    });

    console.log("✅ Created sample messages");

    // Create Work Logs
    await prisma.maintenanceWorkLog.create({
        data: {
            maintenanceRequestId: maintenanceRequest.id,
            userId: maintenanceUser.id,
            action: "assigned",
            notes: "Assigned to maintenance team for inspection",
            oldStatus: "submitted",
            newStatus: "reviewed",
        },
    });

    await prisma.maintenanceWorkLog.create({
        data: {
            maintenanceRequestId: maintenanceRequest.id,
            userId: maintenanceUser.id,
            action: "started",
            notes: "Started work on the leaking pipe. Inspected Unit 402 and identified source.",
            oldStatus: "reviewed",
            newStatus: "in_progress",
            hoursWorked: 0.5,
        },
    });

    console.log("✅ Created work logs");

    // Create Surveys
    const inspectionSurvey = await prisma.survey.create({
        data: {
            buildingId: building.id,
            createdBy: managerUser.id,
            title: "Annual Building Inspection - Date Selection",
            description: "Please vote for your preferred date for the annual building inspection. The inspection will take approximately 2-3 hours.",
            type: "poll",
            status: "active",
            isAnonymous: false,
            endDate: new Date(Date.now() + 14 * 86400000), // 14 days from now
            questions: {
                create: [
                    {
                        question: "Which date works best for you?",
                        type: "single_choice",
                        options: ["March 15, 2026", "March 22, 2026", "March 29, 2026", "April 5, 2026"],
                        isRequired: true,
                        order: 0,
                    },
                ],
            },
        },
    });

    const pestControlSurvey = await prisma.survey.create({
        data: {
            buildingId: building.id,
            createdBy: managerUser.id,
            title: "Pest Control Service Feedback",
            description: "We recently completed pest control treatment. Your feedback helps us improve our services.",
            type: "survey",
            status: "active",
            isAnonymous: false,
            questions: {
                create: [
                    {
                        question: "How satisfied are you with the recent pest control service?",
                        type: "rating",
                        options: [],
                        isRequired: true,
                        order: 0,
                    },
                    {
                        question: "Did you notice any pest issues after the treatment?",
                        type: "yes_no",
                        options: [],
                        isRequired: true,
                        order: 1,
                    },
                    {
                        question: "Additional comments or suggestions",
                        type: "text",
                        options: [],
                        isRequired: false,
                        order: 2,
                    },
                ],
            },
        },
    });

    const agmSurvey = await prisma.survey.create({
        data: {
            buildingId: building.id,
            createdBy: managerUser.id,
            title: "AGM Meeting Format Preference",
            description: "Help us plan the upcoming Annual General Meeting by sharing your preferences.",
            type: "poll",
            status: "active",
            isAnonymous: false,
            endDate: new Date(Date.now() + 21 * 86400000), // 21 days from now
            questions: {
                create: [
                    {
                        question: "What is your preferred meeting format?",
                        type: "single_choice",
                        options: ["In-person only", "Virtual (Zoom)", "Hybrid (both options)"],
                        isRequired: true,
                        order: 0,
                    },
                    {
                        question: "Which day of the week works best?",
                        type: "single_choice",
                        options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        isRequired: true,
                        order: 1,
                    },
                    {
                        question: "Preferred time of day",
                        type: "single_choice",
                        options: ["Morning (9am-12pm)", "Afternoon (1pm-5pm)", "Evening (6pm-8pm)"],
                        isRequired: true,
                        order: 2,
                    },
                ],
            },
        },
    });

    console.log("✅ Created surveys");

    // Add some sample responses
    await prisma.surveyResponse.create({
        data: {
            surveyId: inspectionSurvey.id,
            userId: ownerUser.id,
            answers: {
                create: [
                    {
                        questionId: (await prisma.surveyQuestion.findFirst({
                            where: { surveyId: inspectionSurvey.id },
                        }))!.id,
                        answer: JSON.stringify("March 22, 2026"),
                    },
                ],
            },
        },
    });

    await prisma.surveyResponse.create({
        data: {
            surveyId: inspectionSurvey.id,
            userId: tenantUser.id,
            answers: {
                create: [
                    {
                        questionId: (await prisma.surveyQuestion.findFirst({
                            where: { surveyId: inspectionSurvey.id },
                        }))!.id,
                        answer: JSON.stringify("March 22, 2026"),
                    },
                ],
            },
        },
    });

    console.log("✅ Created sample survey responses");

    // Create Marketplace Listings
    await prisma.marketplaceListing.create({
        data: {
            buildingId: building.id,
            userId: ownerUser.id,
            category: "sale",
            title: "IKEA Bookshelf - Excellent Condition",
            description: "Barely used IKEA Billy bookshelf in white. Moving out and need to sell quickly. Dimensions: 80cm wide x 202cm tall. Easy to disassemble.",
            price: 50,
            images: [],
            status: "active",
            location: "Unit 402",
        },
    });

    await prisma.marketplaceListing.create({
        data: {
            buildingId: building.id,
            userId: tenantUser.id,
            category: "free",
            title: "Moving Boxes - Free to Collect",
            description: "20 sturdy moving boxes in various sizes. All in good condition. Free to anyone who needs them. Must collect from Unit 403.",
            price: null,
            images: [],
            status: "active",
            location: "Unit 403",
        },
    });

    await prisma.marketplaceListing.create({
        data: {
            buildingId: building.id,
            userId: ownerUser.id,
            category: "service",
            title: "Dog Walking Service",
            description: "Experienced dog walker available for weekday walks. $15 per 30-minute walk. I live in the building and love dogs! References available.",
            price: 15,
            images: [],
            status: "active",
            contactInfo: "Call or text: 0412 345 678",
        },
    });

    await prisma.marketplaceListing.create({
        data: {
            buildingId: building.id,
            userId: tenantUser.id,
            category: "wanted",
            title: "Looking for Babysitter",
            description: "Seeking reliable babysitter for Friday nights. Two kids aged 5 and 7. Would prefer someone in the building. $25/hour.",
            price: 25,
            images: [],
            status: "active",
        },
    });

    await prisma.marketplaceListing.create({
        data: {
            buildingId: building.id,
            userId: ownerUser.id,
            category: "lending",
            title: "Power Drill - Free to Borrow",
            description: "Cordless power drill with various bits. Free to borrow for building residents. Please return within 3 days. Contact me to arrange pickup.",
            price: null,
            images: [],
            status: "active",
            location: "Unit 402",
        },
    });

    await prisma.marketplaceListing.create({
        data: {
            buildingId: building.id,
            userId: tenantUser.id,
            category: "trade",
            title: "Kids Books - Trade for Adult Fiction",
            description: "Have about 15 children's books (ages 3-8) in excellent condition. Looking to trade for adult fiction books. Open to any genre!",
            price: null,
            images: [],
            status: "active",
        },
    });

    await prisma.marketplaceListing.create({
        data: {
            buildingId: building.id,
            userId: ownerUser.id,
            category: "sale",
            title: "Mountain Bike - $200",
            description: "Giant mountain bike in excellent condition. 21-speed, 26-inch wheels. Recently serviced. Perfect for weekend rides. Helmet included.",
            price: 200,
            images: [],
            status: "active",
            location: "Unit 402",
        },
    });

    await prisma.marketplaceListing.create({
        data: {
            buildingId: building.id,
            userId: tenantUser.id,
            category: "service",
            title: "Math Tutoring - High School Level",
            description: "Qualified math teacher offering tutoring for high school students. $30/hour. Can help with homework, exam prep, and general understanding. Available weekday evenings.",
            price: 30,
            images: [],
            status: "active",
            contactInfo: "Email: jane.tenant@example.com",
        },
    });

    console.log("✅ Created marketplace listings");

    // Create Local Businesses
    await prisma.localBusiness.create({
        data: {
            buildingId: building.id,
            name: "Quick Fix Plumbing",
            category: "trades",
            description: "24/7 emergency plumbing services. Licensed and insured. Specializing in residential repairs.",
            phone: "0412 345 678",
            email: "info@quickfixplumbing.com.au",
            website: "https://quickfixplumbing.com.au",
            hours: "24/7 Emergency Service",
            isVerified: true,
            isEmergency: true,
            addedBy: managerUser.id,
        },
    });

    await prisma.localBusiness.create({
        data: {
            buildingId: building.id,
            name: "Sparkle Clean Services",
            category: "services",
            description: "Professional cleaning services for apartments and common areas. Eco-friendly products.",
            phone: "0423 456 789",
            email: "hello@sparkleclean.com.au",
            hours: "Mon-Fri 8am-6pm, Sat 9am-2pm",
            isVerified: true,
            isEmergency: false,
            addedBy: ownerUser.id,
        },
    });

    await prisma.localBusiness.create({
        data: {
            buildingId: building.id,
            name: "Luigi's Italian Restaurant",
            category: "restaurants",
            description: "Authentic Italian cuisine. Dine-in and takeaway available. 10% discount for building residents!",
            phone: "02 9876 5432",
            address: "125 Main Street, Sydney",
            hours: "Tue-Sun 5pm-10pm",
            isVerified: true,
            isEmergency: false,
            addedBy: tenantUser.id,
        },
    });

    await prisma.localBusiness.create({
        data: {
            buildingId: building.id,
            name: "24/7 Locksmith Sydney",
            category: "emergency",
            description: "Emergency locksmith services. Fast response time. All types of locks.",
            phone: "1300 LOCKSMITH",
            hours: "24/7 Emergency Service",
            isVerified: true,
            isEmergency: true,
            addedBy: managerUser.id,
        },
    });

    await prisma.localBusiness.create({
        data: {
            buildingId: building.id,
            name: "Green Thumb Gardening",
            category: "services",
            description: "Garden maintenance, landscaping, and plant care. Balcony gardens a specialty.",
            phone: "0434 567 890",
            email: "contact@greenthumb.com.au",
            hours: "Mon-Sat 7am-5pm",
            isVerified: false,
            isEmergency: false,
            addedBy: ownerUser.id,
        },
    });

    console.log("✅ Created local businesses");

    // Create Neighbor Profiles
    await prisma.neighborProfile.create({
        data: {
            userId: ownerUser.id,
            bio: "Love cooking and hosting dinner parties. Always happy to help neighbors!",
            interests: ["cooking", "reading", "yoga", "gardening"],
            lookingFor: ["friends", "book club", "yoga buddy"],
            visibility: "building",
        },
    });

    await prisma.neighborProfile.create({
        data: {
            userId: tenantUser.id,
            bio: "New to the building. Work from home as a graphic designer. Have a friendly dog!",
            interests: ["design", "photography", "hiking", "dogs"],
            lookingFor: ["dog walker", "friends", "hiking buddy"],
            visibility: "building",
        },
    });

    console.log("✅ Created neighbor profiles");

    // Create Sustainability Metrics
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    await prisma.sustainabilityMetric.createMany({
        data: [
            {
                buildingId: building.id,
                metricType: "energy",
                value: 12500,
                unit: "kWh",
                period: currentMonth,
                notes: "Monthly electricity consumption",
            },
            {
                buildingId: building.id,
                metricType: "water",
                value: 850,
                unit: "kL",
                period: currentMonth,
                notes: "Monthly water usage",
            },
            {
                buildingId: building.id,
                metricType: "waste",
                value: 2400,
                unit: "kg",
                period: currentMonth,
                notes: "General waste to landfill",
            },
            {
                buildingId: building.id,
                metricType: "recycling",
                value: 1200,
                unit: "kg",
                period: currentMonth,
                notes: "Recycling collected",
            },
        ],
    });

    // Create Sustainability Challenge
    const challengeStart = new Date();
    const challengeEnd = new Date();
    challengeEnd.setMonth(challengeEnd.getMonth() + 1);

    await prisma.sustainabilityChallenge.create({
        data: {
            buildingId: building.id,
            title: "Reduce Waste by 10%",
            description: "Let's work together to reduce our building's waste by 10% this month. Focus on recycling and composting!",
            goal: 2160, // 10% reduction from 2400kg
            current: 2400,
            unit: "kg",
            startDate: challengeStart,
            endDate: challengeEnd,
            participants: 15,
        },
    });

    console.log("✅ Created sustainability data");

    // ============================================
    // PHASE 2: EMERGENCY RESPONSE SYSTEM
    // ============================================
    console.log("\n🚨 Creating emergency response data...");

    // Emergency contacts
    await prisma.emergencyContact.createMany({
        data: [
            {
                buildingId: building.id,
                name: "Fire & Rescue NSW",
                role: "fire",
                phone: "000",
                isEmergency: true,
                isPrimary: true,
            },
            {
                buildingId: building.id,
                name: "NSW Police",
                role: "police",
                phone: "000",
                isEmergency: true,
                isPrimary: true,
            },
            {
                buildingId: building.id,
                name: "NSW Ambulance",
                role: "ambulance",
                phone: "000",
                isEmergency: true,
                isPrimary: true,
            },
            {
                buildingId: building.id,
                name: "Building Manager - Sarah Chen",
                role: "building_manager",
                phone: "+61 2 9876 5432",
                email: "manager@dulili.com.au",
                isPrimary: true,
            },
            {
                buildingId: building.id,
                name: "24/7 Security",
                role: "security",
                phone: "+61 2 9876 5433",
                email: "security@dulili.com.au",
            },
            {
                buildingId: building.id,
                name: "Emergency Maintenance",
                role: "maintenance",
                phone: "+61 2 9876 5434",
                email: "maintenance@dulili.com.au",
            },
        ],
    });

    console.log("✅ Created emergency contacts");

    // ============================================
    // PHASE 2: AI PREDICTIVE MAINTENANCE
    // ============================================
    console.log("\n🤖 Creating AI predictive maintenance data...");

    // Equipment
    const hvacSystem = await prisma.equipment.create({
        data: {
            buildingId: building.id,
            name: "Main HVAC System",
            type: "hvac",
            location: "Rooftop - Level 12",
            manufacturer: "Daikin",
            modelNumber: "VRV-IV-S",
            serialNumber: "HVAC-2019-001",
            installDate: new Date("2019-03-15"),
            warrantyExpiry: new Date("2024-03-15"),
            lastService: new Date("2026-01-15"),
            nextService: new Date("2026-04-15"),
            status: "operational",
        },
    });

    const elevator1 = await prisma.equipment.create({
        data: {
            buildingId: building.id,
            name: "Elevator 1 (Main)",
            type: "elevator",
            location: "Lobby",
            manufacturer: "Otis",
            modelNumber: "Gen2",
            serialNumber: "ELEV-2018-001",
            installDate: new Date("2018-06-01"),
            lastService: new Date("2026-02-01"),
            nextService: new Date("2026-03-01"),
            status: "operational",
        },
    });

    const waterPump = await prisma.equipment.create({
        data: {
            buildingId: building.id,
            name: "Main Water Pump",
            type: "pump",
            location: "Basement - Pump Room",
            manufacturer: "Grundfos",
            modelNumber: "CR-64",
            serialNumber: "PUMP-2019-001",
            installDate: new Date("2019-01-10"),
            lastService: new Date("2026-01-20"),
            nextService: new Date("2026-07-20"),
            status: "maintenance_needed",
            notes: "Unusual vibration detected",
        },
    });

    // Sensors
    const hvacTempSensor = await prisma.equipmentSensor.create({
        data: {
            equipmentId: hvacSystem.id,
            sensorType: "temperature",
            unit: "celsius",
            minNormal: 18,
            maxNormal: 26,
        },
    });

    const hvacVibrationSensor = await prisma.equipmentSensor.create({
        data: {
            equipmentId: hvacSystem.id,
            sensorType: "vibration",
            unit: "hz",
            minNormal: 0,
            maxNormal: 5,
        },
    });

    const pumpPressureSensor = await prisma.equipmentSensor.create({
        data: {
            equipmentId: waterPump.id,
            sensorType: "pressure",
            unit: "psi",
            minNormal: 40,
            maxNormal: 60,
        },
    });

    const pumpVibrationSensor = await prisma.equipmentSensor.create({
        data: {
            equipmentId: waterPump.id,
            sensorType: "vibration",
            unit: "hz",
            minNormal: 0,
            maxNormal: 3,
        },
    });

    // Recent sensor readings (last 24 hours)
    const now = new Date();
    const readings = [];
    for (let i = 0; i < 24; i++) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        
        // HVAC temperature (normal)
        readings.push({
            sensorId: hvacTempSensor.id,
            value: 22 + Math.random() * 2,
            timestamp,
        });

        // HVAC vibration (normal)
        readings.push({
            sensorId: hvacVibrationSensor.id,
            value: 1 + Math.random() * 2,
            timestamp,
        });

        // Pump pressure (slightly high)
        readings.push({
            sensorId: pumpPressureSensor.id,
            value: 55 + Math.random() * 8,
            isAnomaly: Math.random() > 0.7,
            timestamp,
        });

        // Pump vibration (high - anomaly)
        readings.push({
            sensorId: pumpVibrationSensor.id,
            value: 4 + Math.random() * 3,
            isAnomaly: true,
            timestamp,
        });
    }

    await prisma.sensorReading.createMany({ data: readings });

    // AI Predictions
    await prisma.maintenancePrediction.create({
        data: {
            equipmentId: waterPump.id,
            predictedIssue: "Bearing Failure",
            description: "Elevated vibration levels detected. Bearing wear likely causing increased friction and noise.",
            probability: 0.78,
            confidence: 0.85,
            estimatedDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
            severity: "high",
            recommendedAction: "Schedule bearing replacement within 2 weeks. Order parts: Bearing SKF 6308-2RS1. Estimated downtime: 4 hours.",
            estimatedCost: 2500,
            estimatedDowntime: 4,
            status: "pending",
        },
    });

    await prisma.maintenancePrediction.create({
        data: {
            equipmentId: hvacSystem.id,
            predictedIssue: "Filter Replacement Due",
            description: "Air filter efficiency declining based on airflow patterns. Replacement recommended.",
            probability: 0.92,
            confidence: 0.95,
            estimatedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month
            severity: "medium",
            recommendedAction: "Schedule routine filter replacement. Order 4x MERV 13 filters.",
            estimatedCost: 450,
            estimatedDowntime: 2,
            status: "pending",
        },
    });

    await prisma.maintenancePrediction.create({
        data: {
            equipmentId: elevator1.id,
            predictedIssue: "Cable Inspection Required",
            description: "Routine inspection due based on usage patterns and manufacturer recommendations.",
            probability: 0.65,
            confidence: 0.70,
            estimatedDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 1.5 months
            severity: "low",
            recommendedAction: "Schedule certified elevator technician for cable inspection.",
            estimatedCost: 800,
            estimatedDowntime: 3,
            status: "pending",
        },
    });

    // Service history
    await prisma.equipmentServiceHistory.createMany({
        data: [
            {
                equipmentId: hvacSystem.id,
                serviceType: "routine",
                description: "Quarterly maintenance - cleaned coils, checked refrigerant levels, replaced filters",
                performedBy: "HVAC Solutions Pty Ltd",
                cost: 850,
                hoursSpent: 3,
                serviceDate: new Date("2026-01-15"),
            },
            {
                equipmentId: elevator1.id,
                serviceType: "inspection",
                description: "Annual safety inspection - all systems operational",
                performedBy: "Otis Elevator Service",
                cost: 1200,
                hoursSpent: 4,
                serviceDate: new Date("2026-02-01"),
            },
            {
                equipmentId: waterPump.id,
                serviceType: "repair",
                description: "Replaced worn seal, adjusted pressure settings",
                performedBy: "Pump Specialists",
                cost: 650,
                hoursSpent: 2,
                serviceDate: new Date("2026-01-20"),
            },
        ],
    });

    console.log("✅ Created AI predictive maintenance data");

    // ============================================
    // PHASE 2: IOT DASHBOARD
    // ============================================
    console.log("\n📡 Creating IoT dashboard data...");

    // IoT Devices
    const thermostat1 = await prisma.ioTDevice.create({
        data: {
            buildingId: building.id,
            name: "Lobby Thermostat",
            deviceType: "thermostat",
            category: "climate",
            location: "Ground Floor Lobby",
            manufacturer: "Nest",
            model: "Learning Thermostat 3rd Gen",
            status: "online",
            lastSeen: new Date(),
        },
    });

    const smartLock1 = await prisma.ioTDevice.create({
        data: {
            buildingId: building.id,
            name: "Main Entrance Lock",
            deviceType: "lock",
            category: "access",
            location: "Main Entrance",
            manufacturer: "August",
            model: "Smart Lock Pro",
            status: "online",
            lastSeen: new Date(),
        },
    });

    const energyMeter = await prisma.ioTDevice.create({
        data: {
            buildingId: building.id,
            name: "Building Energy Meter",
            deviceType: "meter",
            category: "energy",
            location: "Electrical Room",
            manufacturer: "Schneider Electric",
            model: "PowerLogic PM8000",
            status: "online",
            lastSeen: new Date(),
        },
    });

    const waterMeter = await prisma.ioTDevice.create({
        data: {
            buildingId: building.id,
            name: "Main Water Meter",
            deviceType: "meter",
            category: "water",
            location: "Basement",
            manufacturer: "Sensus",
            model: "iPERL",
            status: "online",
            lastSeen: new Date(),
        },
    });

    const airQualitySensor = await prisma.ioTDevice.create({
        data: {
            buildingId: building.id,
            name: "Lobby Air Quality Sensor",
            deviceType: "sensor",
            category: "other",
            location: "Ground Floor Lobby",
            manufacturer: "Awair",
            model: "Element",
            status: "online",
            lastSeen: new Date(),
        },
    });

    // IoT Device Metrics (last 24 hours)
    const iotMetrics = [];
    for (let i = 0; i < 24; i++) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        
        // Temperature
        iotMetrics.push({
            deviceId: thermostat1.id,
            metricType: "temperature",
            value: 21 + Math.random() * 3,
            unit: "celsius",
            timestamp,
        });

        // Energy consumption (kWh per hour)
        iotMetrics.push({
            deviceId: energyMeter.id,
            metricType: "energy",
            value: 150 + Math.random() * 50,
            unit: "kWh",
            timestamp,
        });

        // Water usage (liters per hour)
        iotMetrics.push({
            deviceId: waterMeter.id,
            metricType: "water",
            value: 500 + Math.random() * 200,
            unit: "liters",
            timestamp,
        });

        // Air quality (CO2 ppm)
        iotMetrics.push({
            deviceId: airQualitySensor.id,
            metricType: "air_quality",
            value: 400 + Math.random() * 200,
            unit: "ppm",
            timestamp,
        });
    }

    await prisma.ioTDeviceMetric.createMany({ data: iotMetrics });

    // Building-level metrics
    const buildingMetrics = [];
    for (let i = 0; i < 24; i++) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        
        buildingMetrics.push({
            buildingId: building.id,
            metricType: "energy_consumption",
            value: 150 + Math.random() * 50,
            unit: "kWh",
            period: "hourly",
            timestamp,
        });

        buildingMetrics.push({
            buildingId: building.id,
            metricType: "water_usage",
            value: 500 + Math.random() * 200,
            unit: "liters",
            period: "hourly",
            timestamp,
        });

        buildingMetrics.push({
            buildingId: building.id,
            metricType: "occupancy",
            value: Math.floor(40 + Math.random() * 30),
            unit: "percent",
            period: "hourly",
            timestamp,
        });
    }

    await prisma.buildingMetric.createMany({ data: buildingMetrics });

    console.log("✅ Created IoT dashboard data");

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📝 Test credentials:");
    console.log("Manager: manager@dulili.com.au / password123");
    console.log("Owner: owner@example.com / password123");
    console.log("Tenant: tenant@example.com / password123");
    console.log("Maintenance: maintenance@dulili.com.au / password123");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
