Feature: Room inventory API
  Background:
   * def roomUrl = baseUrl + '/api/room'

  Scenario: Verify room inventory
   Given url roomUrl
   When method GET
   Then status 200
   # Checking that 'rooms' is an array
   And match response.rooms == '#[]'
   # Checking first element to not be 0
   And match response.rooms[0].roomPrice == '#? _ > 0'