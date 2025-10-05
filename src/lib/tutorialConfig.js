/**
 * Tutorial Configuration
 * This file defines the tutorial steps and their corresponding backend API mapping
 * 
 * Note: The actual tutorial steps are fetched from the backend API at /tutorial/steps
 * This file serves as documentation and reference for frontend developers
 */

export const TUTORIAL_STEPS_CONFIG = [
  {
    stepNumber: 1,
    title: "Welcome to Budget Tracker! 🎉",
    description: "Let's create your first budget and track your first expense",
    targetElement: ".welcome-container",
    position: "center",
    actionType: "info",
    actionData: { auto_advance: true, delay: 3000 },
    content: "Hi! I'll help you set up your first budget category and add your first expense. This will take just 2-3 minutes!",
    pointsReward: 10,
    badgeUnlock: "first_step",
    celebrationMessage: "🎉 Great start!",
    nextStepPreview: "Next: Let's create your first budget category"
  },
  {
    stepNumber: 2,
    title: "Let's Create Your First Budget 💰",
    description: "Go to budget management to start tracking your spending",
    targetElement: "#add-category-btn",
    position: "top",
    actionType: "click",
    content: "Click 'Manage Budget' to create your first spending category. We'll help you set up a 'Food & Dining' budget!",
    pointsReward: 15,
    nextStepPreview: "Next: Click 'Create Budget' to open the form"
  },
  {
    stepNumber: 3,
    title: "Open the Budget Creation Form 🎯",
    description: "Click to start creating your budget category",
    targetElement: "#create-budget-btn",
    position: "top",
    actionType: "click",
    content: "Perfect! Now click 'Create Budget' to open the form. We'll guide you through each field.",
    pointsReward: 15,
    nextStepPreview: "Next: Name your category 'Food & Dining'"
  },
  {
    stepNumber: 4,
    title: "Name Your Category 📝",
    description: "Every budget needs a clear, descriptive name",
    targetElement: "#budget-category-name",
    position: "top",
    actionType: "input",
    actionData: { value: "Food & Dining" },
    content: "Type 'Food & Dining' here. This will track all your restaurant meals, groceries, and snacks. You can also add an icon (like 🍔) and description below if you want - they're optional but help personalize your budget!",
    pointsReward: 15,
    nextStepPreview: "Next: Set your monthly budget limit"
  },
  {
    stepNumber: 5,
    title: "Set Your Monthly Budget 💵",
    description: "How much do you want to spend on food each month?",
    targetElement: "#budget-amount-input",
    position: "top",
    actionType: "input",
    actionData: { value: "400" },
    content: "Enter '400' as your monthly food budget. This includes groceries, restaurants, and coffee. You can always adjust this later based on your actual spending!",
    pointsReward: 15,
    nextStepPreview: "Next: Pick a color to identify this category"
  },
  {
    stepNumber: 6,
    title: "Choose Your Category Color 🎨",
    description: "Pick a color that represents food to you",
    targetElement: "#budget-color-picker",
    position: "top",
    actionType: "click",
    content: "Choose a color like orange or green that reminds you of food. This color will appear in your charts and make it easy to spot food expenses!",
    pointsReward: 10,
    nextStepPreview: "Next: Save your first budget category"
  },
  {
    stepNumber: 7,
    title: "Save Your Budget Category ✅",
    description: "Complete your first budget setup",
    targetElement: "#submit-budget-btn",
    position: "top",
    actionType: "click",
    content: "Excellent! Click 'Create Budget' to save your Food & Dining category. You've just taken your first step toward better financial control!",
    pointsReward: 20,
    nextStepPreview: "Next: Add your first real expense"
  },
  {
    stepNumber: 8,
    title: "Now Let's Track Real Spending 📊",
    description: "Time to add your first expense to see your budget in action",
    targetElement: "#add-expense-btn",
    position: "top",
    actionType: "click",
    content: "Great job creating your budget! Now let's add a real expense. Click 'Add Expense' and we'll help you record your last food purchase.",
    pointsReward: 20,
    nextStepPreview: "Next: Fill in your expense details"
  },
  {
    stepNumber: 9,
    title: "Record Your Expense Details 📝",
    description: "Let's add a real expense from your recent spending",
    targetElement: ".expense-form",
    position: "right",
    actionType: "input",
    content: "Think of your last food purchase - maybe lunch, groceries, or coffee. Enter the actual amount you spent, add a description like 'Lunch at cafe', and select your Food & Dining category. This is how you track real spending!",
    pointsReward: 15,
    nextStepPreview: "Next: See your budget in action"
  },
  {
    stepNumber: 10,
    title: "See Your Budget Progress! �",
    description: "Watch how your spending affects your budget",
    targetElement: ".budget-progress",
    position: "top",
    actionType: "navigation",
    actionData: { route: "/dashboard" },
    content: "Amazing! You can now see how much of your $400 food budget you've used. The progress bar shows your spending in real-time. Green means you're on track!",
    pointsReward: 10,
    nextStepPreview: "Next: Explore detailed reports"
  },
  {
    stepNumber: 11,
    title: "Discover Spending Insights �",
    description: "See where your money really goes",
    targetElement: "#reports-nav",
    position: "top",
    actionType: "click",
    content: "Click 'Reports' to see detailed breakdowns of your spending. You'll discover patterns like 'I spend more on weekends' or 'Coffee adds up quickly!' These insights help you make better financial decisions.",
    pointsReward: 15,
    nextStepPreview: "Next: Set up helpful alerts"
  },
  {
    stepNumber: 12,
    title: "Enable Smart Alerts 🔔",
    description: "Get notified before you overspend",
    targetElement: ".notifications-settings",
    position: "top",
    actionType: "click",
    content: "Turn on budget alerts to get warnings when you're spending too much. For example, get notified when you've spent 80% of your food budget - before you go over!",
    pointsReward: 10,
    nextStepPreview: "Final step: You're all set!"
  },
  {
    stepNumber: 13,
    title: "Congratulations! You're Ready! 🏆",
    description: "You've mastered the basics and created your first budget!",
    targetElement: ".completion-celebration",
    position: "center",
    actionType: "info",
    content: "Perfect! You now have a Food & Dining budget with real expense tracking. Continue adding expenses and create more categories like Transportation, Entertainment, or Housing. You're on your way to financial success!",
    pointsReward: 25,
    badgeUnlock: "tutorial_master",
    celebrationMessage: "🎉 Budget Master! 🎉",
    isFinalStep: true
  }
]

/**
 * Tutorial Element Selectors
 * These selectors must match the actual DOM elements in your components
 */
export const TUTORIAL_SELECTORS = {
  WELCOME_CONTAINER: '.welcome-container',
  ADD_CATEGORY_BTN: '#add-category-btn',
  BUDGET_AMOUNT_INPUT: '#budget-amount-input',
  CATEGORY_CUSTOMIZATION: '.category-customization',
  ADD_EXPENSE_BTN: '#add-expense-btn',
  EXPENSE_FORM: '.expense-form',
  BUDGET_PROGRESS: '.budget-progress',
  REPORTS_NAV: '#reports-nav',
  NOTIFICATIONS_SETTINGS: '.notifications-settings',
  COMPLETION_CELEBRATION: '.completion-celebration'
}

/**
 * Tutorial Action Types
 */
export const TUTORIAL_ACTION_TYPES = {
  INFO: 'info',        // Auto-advance or manual continue
  CLICK: 'click',      // User must click the target element
  INPUT: 'input',      // User must input specific value
  NAVIGATION: 'navigation' // User must navigate to specific route
}

/**
 * Tutorial Badges and Rewards
 */
export const TUTORIAL_BADGES = {
  FIRST_STEP: {
    id: 'first_step',
    title: 'First Steps',
    description: 'Completed your first tutorial step!',
    icon: '🎯'
  },
  BUDGET_CREATOR: {
    id: 'budget_creator',
    title: 'Budget Creator',
    description: 'Created your first budget category!',
    icon: '💰'
  },
  EXPENSE_TRACKER: {
    id: 'expense_tracker',
    title: 'Expense Tracker',
    description: 'Added your first expense!',
    icon: '✍️'
  },
  TUTORIAL_MASTER: {
    id: 'tutorial_master',
    title: 'Tutorial Master',
    description: 'Completed the entire tutorial!',
    icon: '🏆'
  }
}

/**
 * Tutorial Completion Celebration
 */
export const TUTORIAL_COMPLETION = {
  title: "🎉 Tutorial Master! 🎉",
  message: "Congratulations! You've completed the entire tutorial and learned how to use Budget Tracker effectively!",
  badge: "Tutorial Master",
  badgeIcon: "🏆",
  bonusPoints: 50,
  achievements: [
    "✅ Created your first budget category",
    "✅ Set budget limits and customization",
    "✅ Added and tracked expenses",
    "✅ Explored reports and insights",
    "✅ Configured budget alerts"
  ],
  nextSteps: [
    "Start creating real budget categories",
    "Add your actual expenses",
    "Set up monthly budget reviews",
    "Explore advanced reporting features"
  ]
}

export default TUTORIAL_STEPS_CONFIG