import bcrypt from 'bcryptjs';

import { User } from '../models/User.js';
import { logger } from '../utils/logger.js';

export async function ensureSeedAdmin() {
  const [existingAdmin, existingStaff, existingManager] = await Promise.all([
    User.findOne({ role: 'admin' }),
    User.findOne({ email: 'staff@pulsecare.com' }),
    User.findOne({ email: 'manager@pulsecare.com' })
  ]);

  if (!existingAdmin) {
    const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
    await User.create({
      name: 'Dr. Areeba Faheem',
      email: 'admin@pulsecare.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      department: 'Administration'
    });
    logger.info('Seeded default admin user (admin@pulsecare.com / Admin@123)');
  }

  if (!existingStaff) {
    const staffPasswordHash = await bcrypt.hash('Staff@123', 10);
    await User.create({
      name: 'Nurse Sana Abbas',
      email: 'staff@pulsecare.com',
      passwordHash: staffPasswordHash,
      role: 'staff',
      department: 'Emergency Medicine'
    });
    logger.info('Seeded default staff user (staff@pulsecare.com / Staff@123)');
  }

  if (!existingManager) {
    const managerPasswordHash = await bcrypt.hash('Manager@123', 10);
    await User.create({
      name: 'Mr. Hassan Raza',
      email: 'manager@pulsecare.com',
      passwordHash: managerPasswordHash,
      role: 'manager',
      department: 'Operations'
    });
    logger.info('Seeded default manager user (manager@pulsecare.com / Manager@123)');
  }
}
