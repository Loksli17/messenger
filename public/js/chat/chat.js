const socket = io();

function sendMes(e){
    e.preventDefault();
    let mes = this.children[0].value;
    socket.emit('chat message', mes);
    this.children[0].value = '';
}


socket.on('chat message', function(data){
    let messages = document.querySelector('.messeges-cont'),
        li       = document.createElement('li');

    li.classList.add('messege');

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
});



let form  = document.querySelector('.messege-form');
form.addEventListener('submit', sendMes, false);
