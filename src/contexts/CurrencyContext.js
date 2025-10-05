'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CurrencyContext = createContext(undefined)

// Currency mapping with symbols and locale info
export const CURRENCY_CONFIG = {
  USD: { symbol: '$', locale: 'en-US', name: 'US Dollar' },
  EUR: { symbol: '€', locale: 'de-DE', name: 'Euro' },
  GBP: { symbol: '£', locale: 'en-GB', name: 'British Pound' },
  JPY: { symbol: '¥', locale: 'ja-JP', name: 'Japanese Yen' },
  INR: { symbol: '₹', locale: 'en-IN', name: 'Indian Rupee' },
  CAD: { symbol: 'C$', locale: 'en-CA', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', locale: 'en-AU', name: 'Australian Dollar' },
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState('USD')
  const [mounted, setMounted] = useState(false)

  // Load currency from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCurrency = localStorage.getItem('budget_currency')
      if (storedCurrency && CURRENCY_CONFIG[storedCurrency]) {
        setCurrencyState(storedCurrency)
      }
    }
    setMounted(true)
  }, [])

  // Update localStorage when currency changes
  const setCurrency = (newCurrency) => {
    if (CURRENCY_CONFIG[newCurrency]) {
      setCurrencyState(newCurrency)
      if (typeof window !== 'undefined') {
        localStorage.setItem('budget_currency', newCurrency)
      }
    }
  }

  // Format currency with the selected currency
  const formatCurrency = (amount) => {
    const config = CURRENCY_CONFIG[currency]
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  // Get currency symbol
  const getCurrencySymbol = () => {
    return CURRENCY_CONFIG[currency]?.symbol || '$'
  }

  // Get currency config
  const getCurrencyConfig = () => {
    return CURRENCY_CONFIG[currency]
  }

  const value = {
    currency,
    setCurrency,
    formatCurrency,
    getCurrencySymbol,
    getCurrencyConfig,
    currencyConfig: CURRENCY_CONFIG,
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error(
      'useCurrency must be used within a CurrencyProvider. ' +
      'Make sure CurrencyProvider is wrapping your component in layout.js'
    )
  }
  return context
}
