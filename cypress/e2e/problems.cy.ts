describe('Problems Page Workflow', () => {
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
  })

  it('should display problems list correctly', function() {
    // Should be on problems page
    cy.url().should('include', '/app')
    
    // Should show page title
    cy.contains('Problems').should('be.visible')
    cy.contains('Choose a problem to solve').should('be.visible')
    
    // Should show search bar
    cy.get('input[placeholder="Search problems..."]').should('be.visible')
    
    // Should show filter buttons
    cy.contains('Difficulty').should('be.visible')
    cy.contains('Sort by').should('be.visible')
    
    // Should show at least one problem from mock data
    cy.contains('Two Sum').should('be.visible')
    cy.contains('Easy').should('be.visible')
    
    // Should show problem count in footer
    cy.contains('problems available').should('be.visible')
  })

  it('should filter problems by difficulty', function() {
    // Click difficulty filter
    cy.contains('Difficulty').click()
    
    // Should show difficulty options
    cy.contains('Easy').should('be.visible')
    cy.contains('Medium').should('be.visible')
    cy.contains('Hard').should('be.visible')
    
    // Select Easy only
    cy.get('[role="menuitem"]').contains('Easy').click()
    
    // Click outside to close dropdown
    cy.get('body').click(0, 0)
    
    // Should still show Two Sum (which is Easy)
    cy.contains('Two Sum').should('be.visible')
  })

  it('should search problems', function() {
    // Type in search box
    cy.get('input[placeholder="Search problems..."]').type('Two')
    
    // Should show matching problems
    cy.contains('Two Sum').should('be.visible')
    
    // Clear search
    cy.get('input[placeholder="Search problems..."]').clear()
    
    // Should show all problems again
    cy.contains('Two Sum').should('be.visible')
  })

  it('should navigate to specific problem', function() {
    // Click on the first problem link
    cy.get('a[href*="/problems/"]').first().click()
    
    // Should navigate to problem page
    cy.url().should('include', '/problems/')
    
    // Should show problem details
    cy.get('h1').should('be.visible')
    
    // Should show test cases panel
    cy.contains('Test Cases').should('be.visible')
    
    // Should show previous solutions panel
    cy.contains('Previous Solutions').should('be.visible')
  })
})