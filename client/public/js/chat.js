


$(function () {
    // make connect
    var socket = io.connect('http://localhost:3000');

    var form = $('#msgform');
    var msginp = $('#m');

    function addMessages(message, author){
       
        $('#messages').append("<li>" + "<b>"+author +":   "+ "</b>" + message + "</li>");
     
    
    }

    // listen connected
    socket.on('connected', (data) => {
        $('#user-username').html(data.username)
        socket.emit('receiveHistory');
    });

    socket.on('history', messages => {
        for (let message of messages) {
            addMessages(message.content, message.author);
        }
    });
    
    // listen form submit
    form.submit(function(e){
        e.preventDefault();
        // emit message
        socket.emit('new_message', msginp.val());
        msginp.val('');
    });

    // listen on new message
    socket.on('new_message', function(data){
        addMessages(data.message, data.author);
    });
});