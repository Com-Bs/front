describe('Code Editor and Compilation', () => {
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

  it('should load code editor with default code', function() {
    // Should show code editor
    cy.get('textarea').should('be.visible')
    
    // Should show editor elements
    cy.contains('Run Code').should('be.visible')
  })

  it('should allow code editing', function() {
    // Clear existing code and type new code
    cy.get('textarea').clear()
    
    const solutionCode = `function solution(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`
    
    cy.get('textarea').type(solutionCode, { delay: 0 })
    
    // Should show the typed code
    cy.get('textarea').should('contain.value', 'function solution(nums, target)')
    cy.get('textarea').should('contain.value', 'const map = new Map()')
  })

  it('should show problem details', function() {
    // Should show problem title and description
    cy.get('h1').should('be.visible')
    
    // Should show test cases panel
    cy.contains('Test Cases').should('be.visible')
    
    // Should show previous solutions panel
    cy.contains('Previous Solutions').should('be.visible')
  })

  it('should work on mobile tabs', function() {
    // Test mobile responsive behavior
    cy.viewport(375, 667) // Mobile size
    
    // Should show tab switcher on mobile
    cy.get('.lg\\:hidden').contains('Problem').should('be.visible')
    cy.get('.lg\\:hidden').contains('Code').should('be.visible')
    
    // Switch to Code tab
    cy.get('.lg\\:hidden').contains('Code').click()
    
    // Should show code editor
    cy.get('textarea').should('be.visible')
    cy.contains('Run Code').should('be.visible')
    
    // Switch back to Problem tab
    cy.get('.lg\\:hidden').contains('Problem').click()
    
    // Should show problem content
    cy.get('h1').should('be.visible')
  })
})