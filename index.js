// frontend.js
$(function () {
    "use strict";

    var alert = $('#alert');
    var input_content = $('#input_content');
    var status = $('#status');
    var scroll_chat = $('#scroll_chat');
    var errors = $('#errors');

    var myColor = false;
    var myName = false;

    var scrollbar = $('body > section:first').tinyscrollbar();

    window.WebSocket = window.WebSocket || window.MozWebSocket;

    if (!window.WebSocket) {
        errors.html($('<p>', { text: 'Sorry, your browser doesn\'t support WebSockets. You can try with other browser. Thanks!'} ));
        input_content.hide();
        $('span').hide();
        return;
    }

    var connection = new WebSocket('ws://localhost:1337');

    connection.onopen = function () {
        input_content.removeAttr('disabled').val('').focus();
        status.text('Welcome to chat room');
        input_content.attr("placeholder", "Please enter your name");
    };

    connection.onmessage = function (message) {
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }

        if (json.type === 'color') {
            myColor = json.data;
            status.text(myName + ': ').css('color', myColor);
            input_content.attr("placeholder", "Please enter content chat here");    
            input_content.removeAttr('disabled').focus();
        } else if (json.type === 'history') {
            for (var i=0; i < json.data.length; i++) {
                addMessage (json.data[i].author, json.data[i].text,
                    json.data[i].color, new Date(json.data[i].time));
            }
            slideScrollbar();
        } else if (json.type === 'message') {
            input_content.removeAttr('disabled');
            addMessage (json.data.author, json.data.text,
                json.data.color, new Date(json.data.time));
            slideScrollbar();
        } else {
        }
    };

    connection.onerror = function (error) {
        input_content.hide();
        alert.html($('<p>', { text: 'Sorry, but there\'s some problem with your connection or the server is down. Please check.' } ));
    };
    
    input_content.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            connection.send(msg);
            $(this).val('');

            input_content.attr('disabled', 'disabled');

            if (myName === false) {
                myName = msg;
            }
        }
    });

    setInterval(function() {
        if (connection.readyState !== 1) {
            status.text('Error connection');
            errors.append($('<p>', { text: '* Sorry! Unable to connect with the WebSocket server.' } ));
        }
    }, 3000);


    function addMessage(author, message, color, datetime) {
        var bg_cl;
        var right;
        if (author === myName) {
            bg_cl = '#DDEEFF';
            right = 'rigth: 0px;';
        } else {
            bg_cl = '#F4F4F4';
            right = '';
        }

        if (author === null) {
            message = '<span style="padding-left: 5px; padding-right: 5px; ' + right + '" >' + message + '</span>';
            scroll_chat.append(
                '<p style="padding-right: 5px; "><span>'
                + (datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours()) + ':'
                + (datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes()) + ' </span>' + message + '</p>');
        } else {
            message = '<span style="background-color:' + bg_cl + '; border: solid 1px #DDAAFF; border-radius: 5px; padding-left: 5px; padding-right: 5px; ' + right + '" >' + message + '</span>';
            scroll_chat.append(
                '<p style="padding-right: 5px; "><span style="color:' + color + '">' + author + ' @ ' +
                + (datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours()) + ':'
                + (datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes()) + ' </span>' + message + '</p>');
        }
    }

    
    function slideScrollbar() {
        scrollbar.update();
        scrollbar.move(Math.max(0, scroll_chat.find('> p').length - 9) * 18);
    }
});