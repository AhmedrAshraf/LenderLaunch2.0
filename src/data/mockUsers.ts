import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const mockUsers: User[] = [
  {
    id: uuidv4(),
    username: 'admin',
    password: 'LenderLaunch2025^%$', // Updated password with special characters
    isAdmin: true,
    createdAt: new Date()
  }
];