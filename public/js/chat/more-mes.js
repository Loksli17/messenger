let messagesWrap = document.querySelector('.messages'),
    countQuery   = 1;

messagesWrap.addEventListener('scroll', receiveMes, true);

function receiveMes(e){
    let currentPosition = e.currentTarget.scrollTop;

    if(!currentPosition){
        //ajax query
        let xhr  = new XMLHttpRequest();

        data = JSON.stringify({
            countMessage: countQuery * countMessage,
        });

        xhr.open('POST', '/chat/more-messages');
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*, q=0.01');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader("Content-Type", "application/json");;
        xhr.send(data);

        xhr.onload = xhr.onerror = function(){
            (this.status == 200){
                console.log(this.response);
            }
        }
        
    }
}
