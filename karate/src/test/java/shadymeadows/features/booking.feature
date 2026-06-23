Feature: Booking API
    Background:
    * def roomUrl = baseUrl + '/api/room'
    * def bookingUrl = baseUrl + '/api/booking'
    * def testData = read('booking-data.json')

    Scenario: Find an accessible room create a booking
    # Getting all rooms
    Given url roomUrl
    When method GET
    Then status 200

    # Filtering for accessible rooms and select the first one
    * def rooms = response.rooms
    * def accessibleRooms = karate.filter(rooms, function(x){ return x.accessible == true })
    
    # Validation in case no free rooms were found
    * assert accessibleRooms.length > 0
    
    # Picking the first room for the predictibility of the test
    * def targetRoomId = accessibleRooms[0].roomid
    
    # Booking using the target room ID
    Given url bookingUrl
    And request read('booking-payload.json')
    When method POST
    Then status 201
    
    # Verifying that bookingId was created
    And match response.bookingid == '#number'
    And match response.roomid == targetRoomId
