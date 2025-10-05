const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 

// Helper function to make API requests with automatic token refresh
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Get valid token (will refresh if needed)
  const token = await tokenManager.getValidToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, config)
    
    // Handle 401 Unauthorized - token might be expired
    if (response.status === 401) {
      
      try {
        // Try to refresh the token
        const newToken = await tokenManager.refreshAccessToken()
        
        // Retry the request with new token
        config.headers.Authorization = `Bearer ${newToken}`
        const retryResponse = await fetch(url, config)
        
        if (retryResponse.ok) {
          const retryData = await retryResponse.json()
          return { success: true, data: retryData }
        } else {
          throw new Error(`Retry request failed: ${retryResponse.status}`)
        }
      } catch (refreshError) {
        // Clear tokens and throw error to trigger login
        tokenManager.clearAll()
        throw {
          status: 401,
          statusText: 'Unauthorized',
          message: 'Session expired. Please log in again.',
          needsLogin: true
        }
      }
    }
    
    const data = await response.json()

    if (!response.ok) {
      throw {
        status: response.status,
        statusText: response.statusText,
        message: data?.detail || data?.message || `HTTP ${response.status}: ${response.statusText}`,
        data: data
      }
    }

    return { success: true, data }
  } catch (error) {
    
    if (error.status) {
      return { 
        success: false, 
        error: error.data || { 
          message: error.message || `Request failed with status ${error.status}`,
          status: error.status,
          statusText: error.statusText
        }
      }
    }
    
    // Handle network errors or other non-HTTP errors
    return {
      success: false,
      error: {
        message: error.message || 'Network error or server unavailable',
        type: 'NETWORK_ERROR'
      }
    }
  }
}

// Auth API functions - matches your backend exactly
export const authAPI = {
  // POST /auth/register
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  // POST /auth/login
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  // POST /auth/verify-email
  verifyEmail: async (token) => {
    return apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
  },

  // POST /auth/resend-verification
  resendVerification: async (email) => {
    return apiRequest('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  // GET /auth/me
  getCurrentUser: async () => {
    return apiRequest('/auth/me')
  },

  // POST /auth/logout
  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    })
  },

  // POST /auth/forgot-password
  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  // POST /auth/reset-password
  resetPassword: async (token, newPassword, confirmPassword) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ 
        token, 
        new_password: newPassword,
        confirm_password: confirmPassword 
      }),
    })
  },

  // POST /auth/change-password
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    return apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ 
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword 
      }),
    })
  },

  // POST /auth/refresh - Refresh access token
  refreshToken: async (refreshToken) => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
  }
}

// Budget Categories API functions - matches your backend exactly
export const budgetAPI = {
  // GET /budget/categories/
  getCategories: async () => {
    return apiRequest('/budget/categories/')
  },

  // POST /budget/categories/
  createCategory: async (categoryData) => {
    return apiRequest('/budget/categories/', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    })
  },

  // GET /budget/categories/{category_id}
  getCategory: async (categoryId) => {
    return apiRequest(`/budget/categories/${categoryId}`)
  },

  // PUT /budget/categories/{category_id}
  updateCategory: async (categoryId, categoryData) => {
    return apiRequest(`/budget/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    })
  },

  // DELETE /budget/categories/{category_id}
  deleteCategory: async (categoryId) => {
    return apiRequest(`/budget/categories/${categoryId}`, {
      method: 'DELETE',
    })
  },

  // GET /budget/categories/summary/overview
  getBudgetSummary: async () => {
    return apiRequest('/budget/categories/summary/overview')
  }
}

// Expenses API functions - matches your backend exactly
export const expenseAPI = {
  // POST /budget/expenses/
  createExpense: async (expenseData) => {
    return apiRequest('/budget/expenses/', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    })
  },

  // GET /budget/expenses/
  getExpenses: async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.profile_id) queryParams.append('profile_id', params.profile_id)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.skip) queryParams.append('skip', params.skip)
    if (params.offset) queryParams.append('offset', params.offset)
    if (params.category_id) queryParams.append('category_id', params.category_id)
    if (params.start_date) queryParams.append('start_date', params.start_date)
    if (params.end_date) queryParams.append('end_date', params.end_date)
    
    const queryString = queryParams.toString()
    const endpoint = `/budget/expenses/${queryString ? `?${queryString}` : ''}`
    
    return apiRequest(endpoint)
  },

  // GET /budget/expenses/{expense_id}
  getExpense: async (expenseId) => {
    return apiRequest(`/budget/expenses/${expenseId}`)
  },

  // PUT /budget/expenses/{expense_id}
  updateExpense: async (expenseId, expenseData) => {
    return apiRequest(`/budget/expenses/${expenseId}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData),
    })
  },

  // DELETE /budget/expenses/{expense_id}
  deleteExpense: async (expenseId) => {
    return apiRequest(`/budget/expenses/${expenseId}`, {
      method: 'DELETE',
    })
  }
}

// Reports API functions - matches your backend exactly
export const reportsAPI = {
  // GET /reports/summary/
  getSummary: async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.period) queryParams.append('period', params.period)
    
    const queryString = queryParams.toString()
    const endpoint = `/reports/summary/${queryString ? `?${queryString}` : ''}`
    
    return apiRequest(endpoint)
  },
  // Alias for backward compatibility
  getFinancialSummary: async () => {
    return apiRequest('/reports/summary/')
  },

  // GET /reports/trends/
  getTrends: async (params = {}) => {
    // Build query string from params
    const queryParams = new URLSearchParams()
    if (params.period) queryParams.append('period', params.period)
    if (params.months) queryParams.append('months', params.months)
    if (params.weeks) queryParams.append('weeks', params.weeks)
    
    const queryString = queryParams.toString()
    const endpoint = `/reports/trends/${queryString ? `?${queryString}` : ''}`
    
    return apiRequest(endpoint)
  },
  // Alias for backward compatibility
  getSpendingTrends: async () => {
    return apiRequest('/reports/trends/')
  },

  // GET /reports/categories/
  getCategoryBreakdown: async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.period) queryParams.append('period', params.period)
    
    const queryString = queryParams.toString()
    const endpoint = `/reports/categories/${queryString ? `?${queryString}` : ''}`
    
    return apiRequest(endpoint)
  },

  // GET /reports/recent-expenses/
  getRecentExpenses: async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.period) queryParams.append('period', params.period)
    if (params.limit) queryParams.append('limit', params.limit)
    
    const queryString = queryParams.toString()
    const endpoint = `/reports/recent-expenses/${queryString ? `?${queryString}` : ''}`
    
    return apiRequest(endpoint)
  },

  // GET /reports/insights/
  getInsights: async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.period) queryParams.append('period', params.period)
    
    const queryString = queryParams.toString()
    const endpoint = `/reports/insights/${queryString ? `?${queryString}` : ''}`
    
    return apiRequest(endpoint)
  },
  // Alias for backward compatibility
  getFinancialInsights: async () => {
    return apiRequest('/reports/insights/')
  },

  // GET /reports/export/ - Special handling for file download
  exportReport: async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.format) queryParams.append('format', params.format)
    if (params.period) queryParams.append('period', params.period)
    if (params.start_date) queryParams.append('start_date', params.start_date)
    if (params.end_date) queryParams.append('end_date', params.end_date)
    if (params.profile_id) queryParams.append('profile_id', params.profile_id)
    
    const queryString = queryParams.toString()
    const endpoint = `/reports/export/${queryString ? `?${queryString}` : ''}`
    const url = `${API_BASE_URL}${endpoint}`
    
    // Get valid token
    const token = await tokenManager.getValidToken()
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        }
      })
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`)
      }
      
      // Return blob and filename for download
      const blob = await response.blob()
      const contentDisposition = response.headers.get('content-disposition')
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `expenses_${params.period || 'report'}_${new Date().toISOString().split('T')[0]}.csv`
      
      return { success: true, blob, filename }
      
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
  // Alias for backward compatibility
  exportReportData: async () => {
    return apiRequest('/reports/export/')
  }
}

// Tutorial API functions - matches your backend exactly
export const tutorialAPI = {
  // GET /tutorial/overview
  getOverview: async () => {
    return apiRequest('/tutorial/overview')
  },

  // GET /tutorial/steps
  getAllSteps: async () => {
    return apiRequest('/tutorial/steps')
  },

  // POST /tutorial/steps/{step_id}/start
  startStep: async (stepId) => {
    return apiRequest(`/tutorial/steps/${stepId}/start`, {
      method: 'POST',
    })
  },

  // POST /tutorial/steps/{step_id}/complete
  completeStep: async (stepId, actionData = {}) => {
    return apiRequest(`/tutorial/steps/${stepId}/complete`, {
      method: 'POST',
      body: JSON.stringify({
        step_id: stepId,
        action_data: actionData
      }),
    })
  },

  // GET /tutorial/game-data
  getGameData: async () => {
    return apiRequest('/tutorial/game-data')
  },

  // POST /tutorial/skip
  skipTutorial: async () => {
    return apiRequest('/tutorial/skip', {
      method: 'POST',
    })
  },

  // POST /tutorial/reset
  resetTutorial: async () => {
    return apiRequest('/tutorial/reset', {
      method: 'POST',
    })
  }
}

// Root endpoint
export const rootAPI = {
  // GET /
  getRoot: async () => {
    return apiRequest('/')
  }
}

// Enhanced Token management utility with automatic refresh
export const tokenManager = {
  // Store tokens after login
  setTokens: (tokenData) => {
    const expiresAt = Date.now() + (tokenData.expires_in * 1000) // Convert to milliseconds
    
    localStorage.setItem('budget_token', tokenData.access_token)
    localStorage.setItem('budget_refresh_token', tokenData.refresh_token)
    localStorage.setItem('budget_token_expires_at', expiresAt.toString())
    
    // Also store user data
    if (tokenData.user) {
      localStorage.setItem('budget_user', JSON.stringify(tokenData.user))
    }
  },
  
  // Legacy method for backward compatibility
  setToken: (token) => {
    localStorage.setItem('budget_token', token)
  },
  
  getToken: () => {
    return localStorage.getItem('budget_token')
  },
  
  getRefreshToken: () => {
    return localStorage.getItem('budget_refresh_token')
  },
  
  // Check if token is expired or will expire soon (5 minutes before)
  isTokenExpired: () => {
    const expiresAt = localStorage.getItem('budget_token_expires_at')
    if (!expiresAt) return true
    
    const now = Date.now()
    const expiryTime = parseInt(expiresAt)
    const fiveMinutesFromNow = now + (5 * 60 * 1000) // 5 minutes in milliseconds
    
    return expiryTime <= fiveMinutesFromNow
  },
  
  // Refresh the access token using refresh token
  refreshAccessToken: async () => {
    const refreshToken = localStorage.getItem('budget_refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to refresh token`)
      }
      
      const data = await response.json()
      
      // Store the new tokens (data should contain access_token, refresh_token, expires_in, user)
      tokenManager.setTokens(data)
      
      return data.access_token
      
    } catch (error) {
      // Clear all tokens and throw error to trigger login
      tokenManager.clearAll()
      throw error
    }
  },
  
  // Get valid token (refresh if needed)
  getValidToken: async () => {
    const token = tokenManager.getToken()
    if (!token) return null
    
    // Check if token needs refresh
    if (tokenManager.isTokenExpired()) {
      try {
        return await tokenManager.refreshAccessToken()
      } catch (error) {
        return null
      }
    }
    
    return token
  },
  
  removeToken: () => {
    localStorage.removeItem('budget_token')
  },
  
  removeRefreshToken: () => {
    localStorage.removeItem('budget_refresh_token')
  },
  
  // Clear all authentication data
  clearAll: () => {
    localStorage.removeItem('budget_token')
    localStorage.removeItem('budget_refresh_token')  
    localStorage.removeItem('budget_token_expires_at')
    localStorage.removeItem('budget_user')
  },
  
  setUser: (user) => {
    localStorage.setItem('budget_user', JSON.stringify(user))
  },
  
  getUser: () => {
    const userData = localStorage.getItem('budget_user')
    return userData ? JSON.parse(userData) : null
  },
  
  removeUser: () => {
    localStorage.removeItem('budget_user')
  }
}
