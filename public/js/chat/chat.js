const socket = io();

function sendMes(e){
    e.preventDefault();
    let mes = this.children[0].value;
    socket.emit('chat message', mes);
    this.children[0].value = '';
}


socket.on('chat message', function(data){
    let messages = document.querySelector('.messages-cont'),
        li       = document.createElement('li');

    li.classList.add('message');

    if(data.userId == currentUserId){
        li.innerHTML = "<div class='mes-body'><div class='mes-text'>"
                        + data.message
                        + "</div><div class='mes-datetime'>"
                        + data.date + data.time
                        + "</div></div><div class='mes-user-img'><img width='50' height='50' src='/img/user-photo/"
                        + data.img
                        + "' alt=''></div>";
        li.classList.add('currentUser');
    }else{
        li.innerHTML = "<div class='mes-user-img'><img width='50' height='50' src='/img/user-photo/"
                        + data.img
                        + "' alt=''></div><div class='mes-body'>"
                        + "<div class='mes-text'>"
                        + data.message
                        + "</div><div class='mes-datetime'>"
                        + data.date + data.time
                        + "</div></div>";
        li.classList.add('partner');
    }

    messages.append(li);

    let messagesScroll = document.querySelectorAll('.messages li');
    let lastMes = messagesScroll[messagesScroll.length - 1];
    lastMes.scrollIntoView(true);
});



let form = document.querySelector('.message-form');
form.addEventListener('submit', sendMes, false);
