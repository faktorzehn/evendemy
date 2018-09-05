

describe("A suite", function() {
    it("contains spec with an expectation", function() {
      var userService = require('./userService');
      spyOn(User, 'find');

      userService.getAllUsers();
      
      expect(User.find).toHaveBeenCalled();
    });
  });
  
  