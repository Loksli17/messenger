let messagesWrap = document.querySelector('.messages');
messagesWrap.addEventListener('scroll', receiveMes, true);

function receiveMes(e){
    let currentPosition = e.currentTarget.scrollTop;

    if(!currentPosition){
        //ajax query
        let xhr = new XMLHttpRequest();
    }
}
