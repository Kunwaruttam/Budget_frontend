export const APP_CONFIG = {
  APP_NAME: 'Budget Tracker',
  VERSION: '1.0.0',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  TOKEN_STORAGE_KEY: 'budget_token',
  USER_STORAGE_KEY: 'budget_user',
  THEME_STORAGE_KEY: 'budget_theme',
} as const

export const USER_ROLES = {
  REGULAR_USER: { level: 1, name: 'REGULAR_USER' as const },
} as const

export const BUDGET_PERIODS = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY', 
  MONTHLY: 'MONTHLY',
  QUARTERLY: 'QUARTERLY',
} as const

export const NOTIFICATION_TYPES = {
  budget_amount_WARNING: 'budget_amount_WARNING',
  BUDGET_REALLOCATION: 'BUDGET_REALLOCATION',
  USER_INACTIVE: 'USER_INACTIVE',
  EXPENSE_ADDED: 'EXPENSE_ADDED',
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  EXPENSES: '/expenses',
  BUDGET: '/budget',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
} as const

export const EXPENSE_CATEGORIES_DEFAULT = [
  'Office Supplies',
  'Software Licenses',
  'Travel & Accommodation',
  'Marketing Materials',
  'Equipment',
  'Food & Dining',
  'Transportation',
  'Utilities',
  'Professional Services',
  'Training & Development',
] as const
