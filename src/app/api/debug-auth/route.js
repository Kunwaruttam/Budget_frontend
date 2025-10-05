import { NextResponse } from 'next/server'

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  
  try {
    // This is a server-side test to check API responses
    const response = await fetch(`${apiUrl}/auth/me`, {
      headers: {
        'Authorization': 'Bearer test-token', // You'll need to replace with actual token
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      return NextResponse.json({
        error: 'API request failed',
        status: response.status,
        statusText: response.statusText
      })
    }
    
    const userData = await response.json()
    
    return NextResponse.json({
      success: true,
      userData,
      hasUserObject: !!userData,
      hasTutorialCompleted: 'tutorial_completed' in userData,
      tutorialCompletedValue: userData.tutorial_completed,
      allFields: Object.keys(userData)
    })
    
  } catch (error) {
    return NextResponse.json({
      error: 'Network error',
      message: error.message
    })
  }
}