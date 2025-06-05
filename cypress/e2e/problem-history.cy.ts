describe('Problem History and Solutions', () => {
  beforeEach(() => {
    // First, try to sign up the test user (in case it doesn't exist)
    cy.visit('/auth/signup')
    
    cy.get('input[placeholder="Username"]').type('testuser')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[placeholder="Create a strong password"]').type('password123')
    cy.get('input[placeholder="Confirm your password"]').type('password123')
    cy.get('button[type="submit"]').click()
    
    // After signup attempt, always go to login page
    cy.visit('/auth/login')
    cy.get('input[type="text"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url({ timeout: 10000 }).should('include', '/app')
    
    // Wait for problems to load
    cy.contains('Loading problems', { timeout: 10000 }).should('not.exist')
    
    // Look for problem links - they should contain problem titles
    cy.get('a[href*="/problems/"]', { timeout: 10000 }).should('have.length.at.least', 1)
    
    // Click on the first problem to navigate to it
    cy.get('a[href*="/problems/"]').first().click()
    
    // Wait for the problem page to load
    cy.url().should('include', '/problems/')
  })

  it('should display previous solutions panel', function() {
    // Should show solutions panel with count
    cy.contains('Previous Solutions (2)').should('be.visible')
    
    // Panel should be collapsed by default
    cy.get('[data-testid="solution-card"]').should('not.exist')
    
    // Click to expand
    cy.contains('Previous Solutions').click()
    
    // Should show solution cards
    cy.get('.space-y-3').should('be.visible')
  })

  it('should show solution cards with correct information', function() {
    // Expand solutions panel
    cy.contains('Previous Solutions').click()
    
    // Should show solution cards
    cy.contains('Solution #2').should('be.visible')
    cy.contains('Solution #1').should('be.visible')
    
    // Should show status badges
    cy.contains('passed').should('be.visible')
    
    // Should show test results
    cy.contains('Tests: 3/3').should('be.visible')
    
    // Should show execution time
    cy.contains('Time: 2ms').should('be.visible')
    
    // Should show submission date
    cy.contains('Jan').should('be.visible') // From mock date
    
    // Should show click hint
    cy.contains('Click to load this solution').should('be.visible')
  })

  it('should load solution code when clicked', function() {
    // Expand solutions panel
    cy.contains('Previous Solutions').click()
    
    // Get current code in editor
    cy.get('textarea').invoke('val').as('originalCode')
    
    // Click on a solution card
    cy.contains('Solution #2').parent().click()
    
    // Code should change in editor
    cy.get('textarea').invoke('val').should('not.equal', this.originalCode)
    
    // Should contain the solution code from mock data
    cy.get('textarea').should('contain.value', 'const map = new Map()')
    cy.get('textarea').should('contain.value', 'function solution(nums, target)')
  })

  it('should show different solution statuses', function() {
    // Get current problem ID from URL
    cy.url().then((url) => {
      const problemId = url.split('/problems/')[1]
      
      // Update mock data to include different statuses
      cy.intercept('GET', `/api/problems/${problemId}/solutions`, {
        success: true,
        solutions: [
          {
            id: "solution1",
            problemId: problemId,
            userId: "user123",
            code: "function solution() { return [0,1]; }",
            status: "passed",
            testResults: { passed: 3, total: 3 },
            submittedAt: "2025-01-01T12:00:00Z",
            executionTime: "2ms"
          },
          {
            id: "solution2", 
            problemId: problemId,
            userId: "user123",
            code: "function solution() { return []; }",
            status: "failed",
            testResults: { passed: 1, total: 3 },
            submittedAt: "2025-01-01T10:00:00Z"
          },
          {
            id: "solution3",
            problemId: problemId, 
            userId: "user123",
            code: "function solution() { return [0]; }",
            status: "partial",
            testResults: { passed: 2, total: 3 },
            submittedAt: "2025-01-01T08:00:00Z"
          }
        ],
        totalSolutions: 3
      }).as('getSolutionsWithStatuses')
      
      // Reload page to get new data
      cy.reload()
      cy.wait('@getProblem')
      cy.wait('@getSolutionsWithStatuses')
    })
    
    // Expand solutions panel
    cy.contains('Previous Solutions (3)').click()
    
    // Should show different status badges
    cy.contains('passed').should('be.visible')
    cy.contains('failed').should('be.visible') 
    cy.contains('partial').should('be.visible')
    
    // Should show different test results
    cy.contains('Tests: 3/3').should('be.visible') // passed
    cy.contains('Tests: 1/3').should('be.visible') // failed
    cy.contains('Tests: 2/3').should('be.visible') // partial
  })

  it('should handle empty solutions state', function() {
    // Get current problem ID from URL
    cy.url().then((url) => {
      const problemId = url.split('/problems/')[1]
      
      // Intercept with empty solutions
      cy.intercept('GET', `/api/problems/${problemId}/solutions`, {
        success: true,
        solutions: [],
        totalSolutions: 0
      }).as('getEmptySolutions')
      
      // Reload page
      cy.reload()
      cy.wait('@getProblem')
      cy.wait('@getEmptySolutions')
    })
    
    // Should show zero count
    cy.contains('Previous Solutions (0)').should('be.visible')
    
    // Expand panel
    cy.contains('Previous Solutions').click()
    
    // Should show empty state message
    cy.contains('No previous solutions found').should('be.visible')
    cy.contains('Submit your first solution').should('be.visible')
  })

  it('should show loading state', function() {
    // Get current problem ID from URL
    cy.url().then((url) => {
      const problemId = url.split('/problems/')[1]
      
      // Intercept with delay
      cy.intercept('GET', `/api/problems/${problemId}/solutions`, {
        delay: 1000,
        statusCode: 200,
        body: { success: true, solutions: [], totalSolutions: 0 }
      }).as('getSlowSolutions')
      
      // Reload page
      cy.reload()
      cy.wait('@getProblem')
    })
    
    // Expand solutions panel while loading
    cy.contains('Previous Solutions').click()
    
    // Should show loading spinner
    cy.get('.animate-spin').should('be.visible')
    cy.contains('Loading solutions').should('be.visible')
    
    cy.wait('@getSlowSolutions')
  })

  it('should work with test cases panel', function() {
    // Should show test cases panel
    cy.contains('Test Cases').should('be.visible')
    
    // Click to expand test cases
    cy.contains('Test Cases').click()
    
    // Should show test case items
    cy.contains('Test Case 1').should('be.visible')
    cy.contains('Input:').should('be.visible')
    
    // Both panels should be able to be open simultaneously
    cy.contains('Previous Solutions').click()
    
    // Both should be visible
    cy.contains('Test Case 1').should('be.visible')
    cy.contains('Solution #2').should('be.visible')
  })
})