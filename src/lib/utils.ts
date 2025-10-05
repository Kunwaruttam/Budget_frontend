import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency configuration
const CURRENCY_CONFIG: Record<string, { symbol: string; locale: string }> = {
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
  GBP: { symbol: '£', locale: 'en-GB' },
  JPY: { symbol: '¥', locale: 'ja-JP' },
  INR: { symbol: '₹', locale: 'en-IN' },
  CAD: { symbol: 'C$', locale: 'en-CA' },
  AUD: { symbol: 'A$', locale: 'en-AU' },
}

// Get currency from localStorage (server-safe)
export function getStoredCurrency(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('budget_currency') || 'USD'
  }
  return 'USD'
}

// Get currency symbol
export function getCurrencySymbol(currency?: string): string {
  const curr = currency || getStoredCurrency()
  return CURRENCY_CONFIG[curr]?.symbol || '$'
}

// Format currency with optional currency parameter
export function formatCurrency(amount: number, currency?: string): string {
  const curr = currency || getStoredCurrency()
  const config = CURRENCY_CONFIG[curr] || CURRENCY_CONFIG['USD']
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: curr,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function calculateBudgetUtilization(spent: number, budget: number): number {
  return budget > 0 ? (spent / budget) * 100 : 0
}

export function getBudgetStatus(utilization: number): 'success' | 'warning' | 'danger' {
  if (utilization < 75) return 'success'
  if (utilization < 90) return 'warning'
  return 'danger'
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return Date.now() >= payload.exp * 1000
  } catch {
    return true
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
