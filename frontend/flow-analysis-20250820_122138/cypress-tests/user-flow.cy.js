// Cypress User Flow Tests
// Place this in cypress/e2e/ directory

describe('Automotive App User Flow', () => {
  beforeEach(() => {
    // Visit the app
    cy.visit('/')
  })

  it('should navigate through authentication flow', () => {
    // Test landing page to login
    cy.contains('Login').click()
    cy.url().should('include', '/login')
    
    // Test login form (modify with actual selectors)
    cy.get('[data-cy=email]').type('test@example.com')
    cy.get('[data-cy=password]').type('password')
    cy.get('[data-cy=login-submit]').click()
    
    // Should redirect to dashboard
    cy.url().should('include', '/dashboard')
  })

  it('should navigate vehicle management flow', () => {
    // Login first
    cy.login('test@example.com', 'password')
    
    // Navigate to vehicles
    cy.visit('/app/vehicles')
    cy.url().should('include', '/app/vehicles')
    
    // Test add vehicle flow
    cy.get('[data-cy=add-vehicle]').click()
    cy.url().should('include', '/app/vehicles/add')
  })

  it('should navigate job management flow', () => {
    cy.login('test@example.com', 'password')
    
    cy.visit('/app/jobs')
    cy.url().should('include', '/app/jobs')
    
    cy.get('[data-cy=create-job]').click()
    cy.url().should('include', '/app/jobs/create')
  })

  it('should navigate customer management flow', () => {
    cy.login('test@example.com', 'password')
    
    cy.visit('/app/customers')
    cy.url().should('include', '/app/customers')
    
    cy.get('[data-cy=add-customer]').click()
    cy.url().should('include', '/app/customers/add')
  })
})

// Custom command for login
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('[data-cy=email]').type(email)
    cy.get('[data-cy=password]').type(password)
    cy.get('[data-cy=login-submit]').click()
    cy.url().should('include', '/dashboard')
  })
})
