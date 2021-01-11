// models
const User = require('./models/user.js');
const messageModel = require('./models/message.js');

module.exports = io => {
    // listen on connection
    io.on('connection', (socket) => {

        // check if user exists in the session
		if(socket.request.session.passport == null){
            socket.username = 'test'
            socket.emit('connected', { username: socket.username });
			// return;
		} else {   
            var userId = socket.request.session.passport.user;
            User.findById(userId, (err, user) => {
                if(err) throw err;
                if(!user){
                    return null;
                } else {
                    socket.username = user.username;
                    console.log(`[CONNECTED] ${socket.username} connected`);

                    // emit connected
                    socket.emit('connected', { username: socket.username });
                }
            })
        }

        // socket.username = 'anonymous';
        
        // listen on disconnect
        socket.on('disconnect', () => {
            console.log(`[DISCONNECTED] ${socket.username} disconnected`);
        });
        
        // listen on new message
        socket.on('new_message', content => {
            console.error(content)
            console.error(socket.username)
            const msgobj = {
                date: new Date(),
                content: content,
                author: socket.username
            };

            if(msgobj.content.trim() === '') return null;

            messageModel.create(msgobj, err => {
                if(err) throw err;
                console.log('[MESSAGE]: ' + socket.username + ': ' + msgobj.content);
                io.emit('new_message',  { message: msgobj.content, author: socket.username });
            });
        });

        socket.on('receiveHistory', () => {
            messageModel
                .find({})
                .limit(50)
                .sort({date: 1})
                .lean()
                .exec((err, messages) => {
                    if(!err){
                        socket.emit("history", messages);
                    }
                })
        })
    });
}