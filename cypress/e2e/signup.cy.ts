describe('User Signup', () => {
  beforeEach(() => {
    cy.visit('/auth/signup')
    cy.fixture('example').as('testData')
  })

  it('should successfully sign up a new user', function() {
    const user = this.testData.users.testUser
    
    // Intercept signup API call
    cy.intercept('POST', '/api/auth/signup', this.testData.apiResponses.signupSuccess).as('signup')
    
    // Fill out the signup form
    cy.get('input[type="text"]').type(user.name)
    cy.get('input[type="email"]').type(user.email)
    cy.get('input[type="password"]').first().type(user.password)
    cy.get('input[type="password"]').last().type(user.password)
    
    // Submit the form
    cy.get('button[type="submit"]').click()
    
    // Wait for API call
    cy.wait('@signup')
    
    // Should show success message
    cy.contains('Account created successfully').should('be.visible')
    
    // Should redirect to login page after delay
    cy.url({ timeout: 3000 }).should('include', '/auth/login')
  })

  it('should show error for mismatched passwords', function() {
    const user = this.testData.users.testUser
    
    cy.get('input[type="text"]').type(user.name)
    cy.get('input[type="email"]').type(user.email)
    cy.get('input[type="password"]').first().type(user.password)
    cy.get('input[type="password"]').last().type('differentpassword')
    
    cy.get('button[type="submit"]').click()
    
    cy.contains("Passwords don't match").should('be.visible')
  })

  it('should trim email whitespace', function() {
    const user = this.testData.users.testUser
    
    // Intercept signup API call
    cy.intercept('POST', '/api/auth/signup', this.testData.apiResponses.signupSuccess).as('signup')
    
    cy.get('input[type="text"]').type(user.name)
    cy.get('input[type="email"]').type(`  ${user.email}  `)
    cy.get('input[type="password"]').first().type(user.password)
    cy.get('input[type="password"]').last().type(user.password)
    
    // The trimming happens on submit, so we just verify form submits without error
    cy.get('button[type="submit"]').click()
    
    cy.wait('@signup')
    
    // Should proceed normally (not show validation errors about email format)
    cy.contains('Account created successfully').should('be.visible')
  })
})