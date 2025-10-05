export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  lastLogin: string;
  currentProfileId: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  profileName: string;
  profileType: 'PERSONAL';
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdByUserId: string;
  scope: 'PERSONAL';
  createdAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  description: string;
  dateTime: string;
  createdByUserId: string;
  profileId: string;
  receiptUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'budget_amount_WARNING' | 'EXPENSE_ADDED';
  title: string;
  message: string;
  isRead: boolean;
  severity: 'INFO' | 'WARNING' | 'ERROR';
  relatedEntityId: string;
  relatedEntityType: 'USER' | 'EXPENSE';
  createdAt: string;
}

export interface DashboardStats {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  budgetUtilization: number;
  totalUsers: number;
  monthlyTrend: string;
  topCategories: Array<{
    categoryName: string;
    amount: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  isLoading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserRole {
  level: 1;
  name: 'REGULAR_USER';
  permissions: string[];
}
