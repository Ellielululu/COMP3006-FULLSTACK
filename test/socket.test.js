var expect = require('chai').expect;
const { describe, it } = require("mocha");
const request = require('supertest');
const baseUrl = "http://127.0.0.1:3000"
const io = require('socket.io-client')

const username = "test_new3"
const password = "admin123"
const email = "test_new3@test.com"

describe("socket test",function(){
	beforeEach(function(){
            request(baseUrl)
			.put("/signup")
			.send({
				username,
				password,
				email
			})
        });
	it('test connected',function(done){
		var socket = io.connect(baseUrl);
		expect(socket).not.to.be.null
		expect(socket).not.to.be.undefined
	     socket.disconnect();
	    done()
	})

	it('test new message',function(done){
		var socket = io.connect(baseUrl);
	    socket.emit('new_message', "is a tester");
	     socket.disconnect();
	    done()
	})

	it('test history',function(done){
		var socket = io.connect(baseUrl);
	    socket.emit('receiveHistory');
	    socket.disconnect();
	    done()
	})

})