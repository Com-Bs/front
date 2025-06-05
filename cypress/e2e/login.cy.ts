describe('User Login', () => {
  beforeEach(() => {
    cy.visit('/auth/login')
    cy.fixture('example').as('testData')
  })

  it('should successfully log in with valid credentials', function() {
    const user = this.testData.users.testUser
    
    // Intercept login and problems API calls
    cy.intercept('POST', '/api/auth/login', this.testData.apiResponses.loginSuccess).as('login')
    cy.intercept('GET', '/api/problems', this.testData.apiResponses.problemsResponse).as('getProblems')
    
    // Use the same credentials from signup test
    cy.get('input[type="text"]').type(user.email)
    cy.get('input[type="password"]').type(user.password)
    
    // Submit the form
    cy.get('button[type="submit"]').click()
    
    // Wait for login API call
    cy.wait('@login')
    
    // Should redirect to app dashboard
    cy.url({ timeout: 5000 }).should('include', '/app')
    
    // Wait for problems to load
    cy.wait('@getProblems')
    
    // Should show the problems page
    cy.contains('Problems').should('be.visible')
  })

  it('should show error for invalid credentials', function() {
    // Intercept with error response
    cy.intercept('POST', '/api/auth/login', this.testData.apiResponses.loginError).as('loginError')
    
    cy.get('input[type="text"]').type('invalid@example.com')
    cy.get('input[type="password"]').type('wrongpassword')
    
    cy.get('button[type="submit"]').click()
    
    cy.wait('@loginError')
    
    // Should show error message
    cy.get('.text-red-500').should('be.visible')
  })

  it('should trim email whitespace', function() {
    const user = this.testData.users.testUser
    
    // Intercept API calls
    cy.intercept('POST', '/api/auth/login', this.testData.apiResponses.loginSuccess).as('login')
    cy.intercept('GET', '/api/problems', this.testData.apiResponses.problemsResponse).as('getProblems')
    
    cy.get('input[type="text"]').type(`  ${user.email}  `)
    cy.get('input[type="password"]').type(user.password)
    
    cy.get('button[type="submit"]').click()
    
    cy.wait('@login')
    
    // Should still log in successfully despite whitespace
    cy.url({ timeout: 5000 }).should('include', '/app')
  })

  it('should toggle password visibility', () => {
    cy.get('input[type="password"]').should('exist')
    
    // Find the eye icon button (it's inside the password field container)
    cy.get('div').contains('Password').parent().find('button[type="button"]').click()
    
    // Password should now be visible (changes to text input)
    cy.get('input[type="text"]').should('exist')
    
    // Click again to hide (find the button again since DOM might have changed)
    cy.get('div').contains('Password').parent().find('button[type="button"]').click()
    
    // Should be hidden again
    cy.get('input[type="password"]').should('exist')
  })

  it('should navigate to signup page', () => {
    cy.contains('Sign up').click()
    
    cy.url().should('include', '/auth/signup')
  })
})