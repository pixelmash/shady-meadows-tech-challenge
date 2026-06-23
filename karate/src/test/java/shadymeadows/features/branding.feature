Feature: Branding API
  Background:
   * def brandingUrl = baseUrl + '/api/branding'
   * def emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'

  Scenario: Verify branding information
   Given url brandingUrl
   When method GET
   Then status 200
   # Verifying the title and email
   And match response.name == 'Shady Meadows B&B'
   And match response.contact.email == '#regex ' + emailPattern