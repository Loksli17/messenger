function dropFile(e){
    e.stopPropagation();
    e.preventDefault();

    let backCard = document.querySelector('.settings-background'),
        fileInfo = document.querySelector('.file-info'),
        messages = document.querySelector('.messages-cont'),
        file     = e.dataTransfer.files[0];

    //отключение файл-инфо
    messages.classList.remove('messages-cont-disactive');
    fileInfo.classList.remove('file-info-active');

    //отображение формы
    let fileFormWrap = document.createElement('div'),
        fileSend     = document.createElement('div'),
        fileCancel   = document.createElement('div'),
        fileWrapBut  = document.createElement('div');

    fileSend.textContent = 'Отправить';
    fileSend.id          = 'send-file';
    fileSend.classList.add('file-button');

    fileCancel.textContent = 'Отмена';
    fileCancel.id          = 'cancel-file';
    fileCancel.classList.add('file-button');
    fileCancel.addEventListener('click', closeFileForm, false);

    fileWrapBut.classList.add('file-form-wrap-button');
    fileWrapBut.append(fileSend);
    fileWrapBut.append(fileCancel);

    fileFormWrap.id = "file-form-wrap";
    backCard.append(fileFormWrap);
    backCard.classList.add('settings-background-active');
    fileFormWrap.innerHTML = "<div class='file-form-file'> <img src='/img/chat/file.svg' width='50'> <div class='file-form-file-info'> <div class='file-form-name'>"
                             + file.name + " </div> <div class='form-file-size'>" + initSize(file.size) + " </div> </div> </div>" +
                             "<div class='file-form-text'> <input id='file-message-text' type='text' placeholder='Введите текст..'> <div class='input-line'></div> </div>";
    fileFormWrap.append(fileWrapBut);

    fileSend.addEventListener('click', () => sendFile(file, backCard, fileFormWrap), false);

    //обработка файла
    let reader = new FileReader();

    reader.onload = ((theFile) => {
        return (e) => {
            console.log(file);
        }
    })(file);
    reader.readAsDataURL(file);
}
//

function sendFile(file, backCard, form){
    let xhr  = new XMLHttpRequest(),
        data = new FormData(),
        text = document.querySelector('#file-message-text').value;

    data.append('file', file);

    xhr.open('POST', '/chat/upload-file');
    xhr.responseType = 'json';
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send(data);

    xhr.onload = xhr.onerror = function(){
        if(this.status == 200){
            form.remove();
            backCard.classList.remove('settings-background-active');
            //отправка сокета с сообщением
            let fileData = {
                type: initType(file.type),
                name: this.response.fileName,
            };
            console.log(fileData);
            socket.emit('chat message', text, fileData);
            // addNewMessage();
        }else{
            console.log('ошибка');
        }
    }
}

function closeFileForm(e){
    let form     = document.querySelector('#file-form-wrap'),
        backCard = document.querySelector('.settings-background');
    form.remove();
    backCard.classList.remove('settings-background-active');
}


function initSize(size){
    if(size < 1000){
        return size + " байт";
    }

    let counter = 0;
    do{
        size /= 1000;
        counter++;
    }while(size > 1000);

    size = String(size);

    let countLetAfter  = 0,
        countLetBefore = 0,
        flag           = false;

    for(let i = 0; i < size.length; i++){
        if(size[i] != "."){
            (!flag) ? countLetAfter++ : countLetBefore++;
        }else{
            flag = true;
        }
    }

    if(countLetBefore >= 2){
        size = size.substr(0, countLetAfter + 3)
    }else if(countLetBefore == 1){
        size.substr(0, countLetAfter + 2);
    }else{
        size.substr(0, countLetAfter);
    }

    switch(counter){
        case 1:
            return size + " кб";
        case 2:
            return size + " мб";
        case 3:
            return size + " гб";
        default:
            return "WTF??????????....";
    }
}


function initType(type){
    switch(type){
        case 'image/png':
            return 'img';
        case 'image/jpg':
            return 'img';
        case 'image/jpeg':
            return 'img';
        case 'video/mp4':
            return 'video';
        case 'video/avi':
            return 'video';
        default:
            return 'text'
    }
}


function dragOver(e){
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    onmouseenter = "this.style.cursor = 'move'";

    let fileInfo = document.querySelector('.file-info'),
        messages = document.querySelector('.messages-cont');

    if(e.clientX >= 50){
        messages.classList.add('messages-cont-disactive');
        fileInfo.classList.add('file-info-active');
    }else{
        messages.classList.remove('messages-cont-disactive');
        fileInfo.classList.remove('file-info-active');
    }
}


let dropZone = document.querySelector('.messages');
dropZone.addEventListener('dragover', dragOver, false);
dropZone.addEventListener('drop', dropFile, false);
