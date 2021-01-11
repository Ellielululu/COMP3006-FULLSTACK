var expect = require('chai').expect;
const { describe, it } = require("mocha");
const request = require('supertest');
const baseUrl = "http://127.0.0.1:3000"
const io = require('socket.io-client')

// 
const username = "test"
const password = "admin123"
const email = "test_new3@test.com"
var username1 = "";
var author = ""
var message = ""

var socket = null;
describe("chat test",function(){
	beforeEach(function(){
            request(baseUrl)
			.put("/signup")
			.send({
				username,
				password,
				email
			});

			 socket = io.connect(baseUrl);
			socket.on('connected', (data) => {
				// console.log(data.username)
		        username1 = data.username
		        expect(username1).to.be.equal('test')
		        // socket.emit('receiveHistory');
		    });

		    socket.on('history', messages => {
		        expect(messages.length).to.be.above(0)
		    });

		    socket.on('new_message', function(data){
		        message = data.message;
		        author =  data.author;
		        expect(author).to.be.equal('test')
		        // expect(message).to.be.equal('test message1')
		    });
        });

	it("test receiveHistory",function(done){
		socket.emit("receiveHistory")
		socket.emit("receiveHistory")
		socket.emit("receiveHistory")
		// console.log(histories)
		// expect(histories.length).not.to.be.equal(0)
		done()

	})
	it("test new message",function(done){
		socket.emit('new_message', "test message1");
		socket.emit("receiveHistory")
		 socket.disconnect();
		// expect(histories.length).to.be.equal(1)
		done()
	})

})