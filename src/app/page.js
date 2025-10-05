'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  FaChartPie, 
  FaDollarSign, 
  FaUsers, 
  FaShieldAlt,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaStar
} from 'react-icons/fa'
import { 
  MdDashboard, 
  MdAnalytics, 
  MdAccountBalance 
} from 'react-icons/md'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('budget_token')
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <MdAccountBalance className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">Budget Tracker</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login"
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Smart Budget Management
            <span className="block text-primary">for Modern Organizations</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Hierarchical budget tracking with role-based access, real-time analytics, 
            and intelligent expense management for teams of all sizes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/auth/register"
              className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-medium hover:bg-primary/90 transition-colors focus-ring"
            >
              Start Free Trial
              <FaArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/auth/login"
              className="inline-flex items-center px-8 py-4 border border-border text-foreground rounded-lg text-lg font-medium hover:bg-muted transition-colors focus-ring"
            >
              Sign In
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-6 text-muted-foreground">
            <div className="flex items-center space-x-1">
              <FaCheckCircle className="h-5 w-5 text-green-500" />
              <span>30-day free trial</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaShieldAlt className="h-5 w-5 text-blue-500" />
              <span>Bank-level security</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaStar className="h-5 w-5 text-yellow-500" />
              <span>5-star rated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything you need to manage budgets
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for organizations that need professional budget management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-lg shadow-card p-8 hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-6">
                <FaChartPie className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Hierarchical Management</h3>
              <p className="text-muted-foreground">
                Organize budgets across multiple organizational levels with role-based access control and approval workflows.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg shadow-card p-8 hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-6">
                <FaDollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Real-time Tracking</h3>
              <p className="text-muted-foreground">
                Monitor expenses and budget utilization in real-time with instant notifications and automated alerts.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg shadow-card p-8 hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-6">
                <MdAnalytics className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Advanced Analytics</h3>
              <p className="text-muted-foreground">
                Generate comprehensive reports and insights with customizable dashboards and data visualization.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg shadow-card p-8 hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-6">
                <FaUsers className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Enable seamless collaboration with multi-user access, shared budgets, and team-based workflows.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg shadow-card p-8 hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mb-6">
                <FaClock className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Automated Workflows</h3>
              <p className="text-muted-foreground">
                Streamline budget processes with automated approvals, recurring budgets, and smart categorization.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg shadow-card p-8 hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mb-6">
                <FaShieldAlt className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Enterprise Security</h3>
              <p className="text-muted-foreground">
                Bank-level security with encryption, audit trails, and compliance features for enterprise needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to take control of your budget?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of organizations using Budget Tracker to manage their finances more effectively.
          </p>
          
          <div className="bg-card border border-border rounded-xl shadow-card p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-foreground mb-4">Start your free trial</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <FaCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    30-day free trial
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    No credit card required
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Full feature access
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Cancel anytime
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <Link 
                  href="/auth/register"
                  className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors block text-center text-lg"
                >
                  Create Account
                </Link>
                
                <Link 
                  href="/auth/login"
                  className="w-full border border-border text-foreground px-6 py-4 rounded-lg font-medium hover:bg-muted transition-colors block text-center"
                >
                  Sign In
                </Link>
                
                <p className="text-sm text-muted-foreground">
                  Already have an account? <Link href="/auth/login" className="text-primary hover:underline">Sign in here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <MdAccountBalance className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">Budget Tracker</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Budget Tracker. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
