var expect = require('chai').expect;
const { describe, it } = require("mocha");
const request = require('supertest');
const baseUrl = "http://127.0.0.1:3000"
describe("passport test",function(){
	const username = "test_new3"+((new Date()).getTime())
	const password = "admin123"
	const email = "test_new3+"+((new Date()).getTime())+"@test.com"
	
	it("sign out test success",function(done){
		request(baseUrl)
		.put("/signup")
		.send({
			username,
			password,
			email
		})
		.end(function(error,res){
			// console.log(res.body._id)
			expect(res.body._id).not.to.be.null;
			expect(res.body._id).not.to.be.undefined;
			done()
		})
		
	})

	it("sign out test email exist",function(done){
		request(baseUrl)
		.put("/signup")
		.send({
			username,
			password,
			email
		})
		.end(function(error,res){
			expect(res.body.signupMessage).to.be.equal('That email is already taken.');
			done()
		})
		
	})

	it("sign out test input empty",function(done){
		request(baseUrl)
		.put("/signup")
		.send({
			username,
			password:'',
			email
		})
		.end(function(error,res){
			expect(res.body.message).to.be.equal('Missing credentials');
			done()
		})
		
	})

	it("login test success",function(done){
		request(baseUrl)
		.put("/login")
		.send({
			password,
			email
		})
		.end(function(error,res){
			expect(res.body._id).not.to.be.null;
			expect(res.body._id).not.to.be.undefined;
			done()
		})
		
	})

	it("login test user not found",function(done){
		request(baseUrl)
		.put("/login")
		.send({
			password,
			email:"test_not_found@ee.com"
		})
		.end(function(error,res){
			expect(res.body.loginMessage).to.be.equal('User is not found.')
			done()
		})
		
	})

	it("login test password is error",function(done){
		request(baseUrl)
		.put("/login")
		.send({
			password:password+'test',
			email
		})
		.end(function(error,res){
			expect(res.body.loginMessage).to.be.equal('Incorrect password.')
			done()
		})
		
	})



	
})