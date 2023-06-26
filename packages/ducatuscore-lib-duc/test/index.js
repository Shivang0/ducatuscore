"use strict";

var should = require("chai").should();
var ducatuscoreLibDuc = require("../");

describe('#versionGuard', function() {
  it('global._ducatuscoreLibDuc should be defined', function() {
    should.equal(global._ducatuscoreLibDuc, ducatuscoreLibDuc.version);
  });
});
