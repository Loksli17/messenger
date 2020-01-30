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

    li.innerText = "Date: [" + data.date + "] Time: [" + data.time + "] User: [" + data.userName + "] Text: " + data.message;
    messages.append(li);
});


window.onload = () => {
    let form  = document.querySelector('.messege-form'),
        input = document.querySelector('#messege');

    form.addEventListener('submit', sendMes, false);
}
