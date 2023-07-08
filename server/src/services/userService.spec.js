describe("userService", function() {
  
  var rewiremock = require("rewiremock").default;
  var sinon = require("sinon");
  var User;

  beforeEach(() => {
    User = function User() {
      this.save = sinon.fake.resolves(this);
    };

    User.find = sinon.fake.returns(User);
    User.findOne = sinon.fake.returns(User);
    User.where = sinon.fake.returns(User);
    User.sort = sinon.fake.returns(User);
    User.eq = sinon.fake.returns(User);
    User.exec = sinon.fake.returns(User);
    User.update = sinon.fake();

    rewiremock("../models/user").with(User);
    rewiremock.enable();
  });

  afterEach(() => {
    rewiremock.disable();
  });

  it("getAllUsers should call correct mongoose query", () => {
    const userService = require("./userService");

    userService.getAllUsers();

    sinon.assert.calledWith(User.find, {});
    sinon.assert.calledWith(User.where, "deleted");
    sinon.assert.calledWith(User.sort, { lastname: 1, firstname: 1 });
    sinon.assert.calledWith(User.eq, false);
    sinon.assert.called(User.exec);
  });

  it("getUserByUsername should make lowercase and call correct mongoose query", () => {
    const userService = require("./userService");

    userService.getUserByUsername("TeSt");

    sinon.assert.calledWith(User.findOne, { username: "test" });
    sinon.assert.calledWith(User.where, "deleted");
    sinon.assert.calledWith(User.eq, false);
    sinon.assert.called(User.exec);
  });

  it("saveUser will save user", done => {
    const userService = require("./userService");

    var result = userService.saveUser({
      uid: "TeSt",
      mail: "some.test@email.com",
      firstname: "John",
      lastname: "Doe"
    });

    result.then(res => {
      done();

      sinon.assert.called(res.save);
      expect(res.username).toBe("test");
      expect(res.email).toBe("some.test@email.com");
      expect(res.firstname).toBe("John");
      expect(res.lastname).toBe("Doe");
    });
  });

  it("saveSettings will save additional_info_visible", () => {
    const userService = require("./userService");

    userService.saveSettings('john',{ additional_info_visible: true });

    sinon.assert.calledWith(User.update, {username: 'john' }, { $set: {options: { additional_info_visible: true }} }, { upsert: true });
  });

  it("saveSettings will save description", () => {
    const userService = require("./userService");

    userService.saveAdditionalInfo('john',{ description: 'describe me' });

    sinon.assert.calledWith(User.update, {username: 'john' }, { $set: {additional_info: { description: 'describe me' }} }, { upsert: true });
  });

  it("saveSettings will save job_title", () => {
    const userService = require("./userService");

    userService.saveAdditionalInfo('john',{ job_title: 'president' });

    sinon.assert.calledWith(User.update, {username: 'john' }, { $set: {additional_info: { job_title: 'president' }} }, { upsert: true });
  });

  it("saveSettings will save instagram_username", () => {
    const userService = require("./userService");

    userService.saveAdditionalInfo('john',{ instagram_username: 'insta' });

    sinon.assert.calledWith(User.update, {username: 'john' }, { $set: {additional_info: { instagram_username: 'insta' }} }, { upsert: true });
  });

  it("saveSettings will save facebook_username", () => {
    const userService = require("./userService");

    userService.saveAdditionalInfo('john',{ facebook_username: 'face' });

    sinon.assert.calledWith(User.update, {username: 'john' }, { $set: {additional_info: { facebook_username: 'face' }} }, { upsert: true });
  });

  it("saveSettings will save twitter_username", () => {
    const userService = require("./userService");

    userService.saveAdditionalInfo('john',{ twitter_username: 'twitter' });

    sinon.assert.calledWith(User.update, {username: 'john' }, { $set: {additional_info: { twitter_username: 'twitter' }} }, { upsert: true });
  });

  it("saveSettings will save birthday", () => {
    const userService = require("./userService");

    userService.saveAdditionalInfo('john',{ birthday: '1.1.1988' });

    sinon.assert.calledWith(User.update, {username: 'john' }, { $set: {additional_info: { birthday: '1.1.1988' }} }, { upsert: true });
  });
});
