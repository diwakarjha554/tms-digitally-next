import { hashSync } from 'bcrypt-ts';
import { prisma } from '@/lib/prisma';

async function main() {
    console.log('Starting database seed...\n');

    await prisma.task.deleteMany();
    await prisma.projectMembership.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    // Admin User
    const adminPassword = hashSync('admin123', 10);
    const admin = await prisma.user.create({
        data: {
            email: 'diwakarjha@digitallynext.com',
            name: 'Diwakar Jha',
            password: adminPassword,
            role: 'ADMIN',
            image: 'https://lh3.googleusercontent.com/a/ACg8ocI-WCEkvn2QEagOAh7IgHWrdnOeIFcHPYLha9_uAWaKEDSdhwE=s288-c-no',
        },
    });

    // Member Users
    const memberPassword = hashSync('member123', 10);

    const member1 = await prisma.user.create({
        data: {
            email: 'john@digitallynext.com',
            name: 'John Doe',
            password: memberPassword,
            role: 'MEMBER',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
        },
    });

    const member2 = await prisma.user.create({
        data: {
            email: 'jane@digitallynext.com',
            name: 'Jane Smith',
            password: memberPassword,
            role: 'MEMBER',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
        },
    });

    const member3 = await prisma.user.create({
        data: {
            email: 'mike@digitallynext.com',
            name: 'Mike Wilson',
            password: memberPassword,
            role: 'MEMBER',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
        },
    });

    const project1 = await prisma.project.create({
        data: {
            name: 'Task Management System',
            description: 'Building a comprehensive task management platform with Next.js, Prisma, and PostgreSQL. Features include role-based access, project collaboration, and real-time updates.',
            status: 'ACTIVE',
            ownerId: admin.id,
        },
    });

    const project2 = await prisma.project.create({
        data: {
            name: 'E-commerce Platform',
            description: 'Modern e-commerce solution with product catalog, shopping cart, payment integration, and order management.',
            status: 'ACTIVE',
            ownerId: admin.id,
        },
    });

    const project3 = await prisma.project.create({
        data: {
            name: 'Mobile App Backend',
            description: 'RESTful API backend for mobile application with authentication, push notifications, and data synchronization.',
            status: 'ACTIVE',
            ownerId: member1.id,
        },
    });

    const project4 = await prisma.project.create({
        data: {
            name: 'Marketing Website Redesign',
            description: 'Complete redesign of corporate marketing website with modern UI/UX and improved performance.',
            status: 'ON_HOLD',
            ownerId: member2.id,
        },
    });

    const project5 = await prisma.project.create({
        data: {
            name: 'Internal Dashboard',
            description: 'Analytics dashboard for internal team metrics and KPI tracking.',
            status: 'COMPLETED',
            ownerId: admin.id,
        },
    });

    await prisma.projectMembership.createMany({
        data: [
            // Project 1 - TMS (Admin's project)
            { userId: member1.id, projectId: project1.id, role: 'ADMIN' },
            { userId: member2.id, projectId: project1.id, role: 'MEMBER' },
            { userId: member3.id, projectId: project1.id, role: 'MEMBER' },

            // Project 2 - E-commerce (Admin's project)
            { userId: member1.id, projectId: project2.id, role: 'MEMBER' },
            { userId: member2.id, projectId: project2.id, role: 'ADMIN' },

            // Project 3 - Mobile Backend (Member1's project)
            { userId: admin.id, projectId: project3.id, role: 'ADMIN' },
            { userId: member3.id, projectId: project3.id, role: 'MEMBER' },

            // Project 4 - Marketing (Member2's project)
            { userId: member1.id, projectId: project4.id, role: 'MEMBER' },
            { userId: member3.id, projectId: project4.id, role: 'MEMBER' },

            // Project 5 - Dashboard (Completed - Admin's)
            { userId: member1.id, projectId: project5.id, role: 'MEMBER' },
        ],
    });

    // Helper function for date
    const addDays = (days: number) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date;
    };

    // Tasks for Project 1 - TMS
    const tmsTasksData = [
        {
            title: 'Setup Database Schema',
            description: 'Design and implement Prisma schema with all necessary models, relations, and indexes. Use UUID for IDs and snake_case for database columns.',
            priority: 'HIGH' as const,
            status: 'DONE' as const,
            projectId: project1.id,
            assigneeId: admin.id,
            createdById: admin.id,
            order: 1,
            dueDate: addDays(-5),
        },
        {
            title: 'Implement Authentication System',
            description: 'Setup NextAuth with credentials provider, JWT sessions, and role-based access control. Include middleware for route protection.',
            priority: 'HIGH' as const,
            status: 'IN_PROGRESS' as const,
            projectId: project1.id,
            assigneeId: member1.id,
            createdById: admin.id,
            order: 2,
            dueDate: addDays(2),
        },
        {
            title: 'Build Project Management UI',
            description: 'Create pages for project listing, creation, editing, and member management with responsive design.',
            priority: 'HIGH' as const,
            status: 'IN_PROGRESS' as const,
            projectId: project1.id,
            assigneeId: member2.id,
            createdById: admin.id,
            order: 3,
            dueDate: addDays(5),
        },
        {
            title: 'Task CRUD Operations',
            description: 'Implement create, read, update, delete operations for tasks with filtering and sorting capabilities.',
            priority: 'MEDIUM' as const,
            status: 'TODO' as const,
            projectId: project1.id,
            assigneeId: member3.id,
            createdById: admin.id,
            order: 4,
            dueDate: addDays(7),
        },
        {
            title: 'Dashboard with Analytics',
            description: 'Build main dashboard showing task statistics, project overview, and user activity metrics.',
            priority: 'MEDIUM' as const,
            status: 'TODO' as const,
            projectId: project1.id,
            assigneeId: member1.id,
            createdById: admin.id,
            order: 5,
            dueDate: addDays(10),
        },
        {
            title: 'Add Animations with GSAP',
            description: 'Implement smooth animations and transitions using GSAP and Lenis for better user experience.',
            priority: 'LOW' as const,
            status: 'TODO' as const,
            projectId: project1.id,
            assigneeId: member2.id,
            createdById: admin.id,
            order: 6,
            dueDate: addDays(12),
        },
        {
            title: 'Write Documentation',
            description: 'Complete README with setup instructions, architecture explanation, API documentation, and deployment guide.',
            priority: 'MEDIUM' as const,
            status: 'TODO' as const,
            projectId: project1.id,
            assigneeId: admin.id,
            createdById: admin.id,
            order: 7,
            dueDate: addDays(14),
        },
    ];

    const ecommerceTasksData = [
        {
            title: 'Product Catalog Setup',
            description: 'Create database models and API endpoints for products, categories, and inventory management.',
            priority: 'HIGH' as const,
            status: 'IN_PROGRESS' as const,
            projectId: project2.id,
            assigneeId: member2.id,
            createdById: admin.id,
            order: 1,
            dueDate: addDays(3),
        },
        {
            title: 'Shopping Cart Implementation',
            description: 'Build shopping cart functionality with add/remove items, quantity updates, and price calculations.',
            priority: 'HIGH' as const,
            status: 'TODO' as const,
            projectId: project2.id,
            assigneeId: member1.id,
            createdById: admin.id,
            order: 2,
            dueDate: addDays(6),
        },
        {
            title: 'Payment Gateway Integration',
            description: 'Integrate Stripe/Razorpay for payment processing with webhooks and order confirmation.',
            priority: 'HIGH' as const,
            status: 'TODO' as const,
            projectId: project2.id,
            assigneeId: member2.id,
            createdById: admin.id,
            order: 3,
            dueDate: addDays(9),
        },
        {
            title: 'Order Management System',
            description: 'Create admin panel for managing orders, tracking shipments, and handling returns.',
            priority: 'MEDIUM' as const,
            status: 'TODO' as const,
            projectId: project2.id,
            assigneeId: member1.id,
            createdById: admin.id,
            order: 4,
        },
    ];

    const mobileTasksData = [
        {
            title: 'API Architecture Design',
            description: 'Design RESTful API structure with versioning, error handling, and response format standards.',
            priority: 'HIGH' as const,
            status: 'DONE' as const,
            projectId: project3.id,
            assigneeId: member1.id,
            createdById: member1.id,
            order: 1,
            dueDate: addDays(-3),
        },
        {
            title: 'User Authentication Endpoints',
            description: 'Implement signup, login, logout, password reset, and token refresh endpoints.',
            priority: 'HIGH' as const,
            status: 'IN_PROGRESS' as const,
            projectId: project3.id,
            assigneeId: member3.id,
            createdById: member1.id,
            order: 2,
            dueDate: addDays(4),
        },
        {
            title: 'Push Notification Service',
            description: 'Setup Firebase Cloud Messaging for push notifications to mobile devices.',
            priority: 'MEDIUM' as const,
            status: 'TODO' as const,
            projectId: project3.id,
            assigneeId: admin.id,
            createdById: member1.id,
            order: 3,
            dueDate: addDays(8),
        },
    ];

    const marketingTasksData = [
        {
            title: 'Design Mockups Review',
            description: 'Review and finalize UI/UX design mockups from design team.',
            priority: 'LOW' as const,
            status: 'TODO' as const,
            projectId: project4.id,
            assigneeId: member1.id,
            createdById: member2.id,
            order: 1,
        },
    ];

    const dashboardTasksData = [
        {
            title: 'Setup Analytics Integration',
            description: 'Integrate Google Analytics and custom event tracking.',
            priority: 'HIGH' as const,
            status: 'DONE' as const,
            projectId: project5.id,
            assigneeId: member1.id,
            createdById: admin.id,
            order: 1,
            dueDate: addDays(-10),
        },
        {
            title: 'Build Chart Components',
            description: 'Create reusable chart components for displaying metrics.',
            priority: 'MEDIUM' as const,
            status: 'DONE' as const,
            projectId: project5.id,
            assigneeId: member1.id,
            createdById: admin.id,
            order: 2,
            dueDate: addDays(-7),
        },
    ];

    await prisma.task.createMany({
        data: [
            ...tmsTasksData,
            ...ecommerceTasksData,
            ...mobileTasksData,
            ...marketingTasksData,
            ...dashboardTasksData,
        ],
    });

    const stats = {
        users: await prisma.user.count(),
        projects: await prisma.project.count(),
        memberships: await prisma.projectMembership.count(),
        tasks: await prisma.task.count(),
        tasksByStatus: {
            todo: await prisma.task.count({ where: { status: 'TODO' } }),
            inProgress: await prisma.task.count({ where: { status: 'IN_PROGRESS' } }),
            done: await prisma.task.count({ where: { status: 'DONE' } }),
        },
    };
}

main()
    .catch((e) => {
        console.error('\n SEED FAILED:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
