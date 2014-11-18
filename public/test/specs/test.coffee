change = (require "../../src/coffee/another-module.coffee").change

sinon = require "sinon"

describe "Sample Spec", ->
	it "should be the write number", ->
		a = change()
		a.should.equal(123)
		