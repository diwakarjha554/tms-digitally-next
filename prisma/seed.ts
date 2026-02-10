import { prisma } from '@/lib/prisma';
import { hashSync } from 'bcrypt-ts';

async function main() {
  console.log('Starting seed...\n');
  const password = hashSync('diwakar1234', 10);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'diwakarjha@digitallynext.com' },
    update: {},
    create: {
      email: 'diwakarjha@digitallynext.com',
      name: 'Diwakar Jha',
      password,
      role: 'ADMIN',
    },
  });
  console.log('Admin created:', {
    name: admin.name,
    email: admin.email,
    role: admin.role,
    password: 'diwakar1234',
  });

  // Create Project Managers
  const projectManagers = [
    {
      email: 'manish.singh@digitallynext.com',
      name: 'Manish Singh',
    },
    {
      email: 'satyam.singh@digitallynext.com',
      name: 'Satyam Singh',
    },
  ];

  console.log('\n Creating Project Managers...');
  for (const pm of projectManagers) {
    const projectManager = await prisma.user.upsert({
      where: { email: pm.email },
      update: {},
      create: {
        email: pm.email,
        name: pm.name,
        password,
        role: 'PROJECT_MANAGER',
      },
    });
    console.log('Project Manager created:', {
      name: projectManager.name,
      email: projectManager.email,
      role: projectManager.role,
      password: 'diwakar1234',
    });
  }

  // Create Team Members (Employees)
  const members = [
    {
      email: 'rishika.singh@digitallynext.com',
      name: 'Rishika singh',
    },
    {
      email: 'gulshan.yadav@digitallynext.com',
      name: 'Gulshan Yadav',
    },
    {
      email: 'kapil.sinha@digitallynext.com',
      name: 'Kapil Sinha',
    },
    {
      email: 'gaurav.singh@digitallynext.com',
      name: 'Gaurav Kushwaha',
    },
    {
      email: 'priya.yadav@digitallynext.com',
      name: 'Priya Yadav',
    },
    {
      email: 'kalpana.chauhan@digitallynext.com',
      name: 'kalpana Chauhan',
    },
  ];

  console.log('\n Creating Team Members...');
  for (const member of members) {
    const teamMember = await prisma.user.upsert({
      where: { email: member.email },
      update: {},
      create: {
        email: member.email,
        name: member.name,
        password,
        role: 'MEMBER',
      },
    });
    console.log('Team Member created:', {
      name: teamMember.name,
      email: teamMember.email,
      role: teamMember.role,
      password: 'diwakar1234',
    });
  }

  console.log('\n Seed completed successfully!');
  console.log('\n Summary:');
  console.log('   - 1 Admin');
  console.log('   - 2 Project Managers');
  console.log('   - 6 Team Members');
  console.log('   - Total: 9 users\n');
  console.log('All users have password: diwakar1234\n');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
