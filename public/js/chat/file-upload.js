function dropFile(e){
    e.stopPropagation();
    e.preventDefault();

    let backCard     = document.querySelector('.settings-background'),
        fileInfo     = document.querySelector('.file-info'),
        messages     = document.querySelector('.messages-cont'),
        file         = e.dataTransfer.files[0];

    //отключение файл-инфо
    messages.classList.remove('messages-cont-disactive');
    fileInfo.classList.remove('file-info-active');

    //отображение формы
    let fileFormWrap  = document.createElement('div'),
        fileSend      = document.createElement('div'),
        fileCancel    = document.createElement('div'),
        fileWrapBut   = document.createElement('div');

    fileSend.textContent = 'Отправить';
    fileSend.id          = 'send-file';
    fileSend.classList.add('file-button');

    fileCancel.textContent = 'Отмена';
    fileCancel.id          = 'cancel-file';
    fileCancel.classList.add('file-button');

    fileWrapBut.classList.add('file-form-wrap-button');
    fileWrapBut.append(fileSend);
    fileWrapBut.append(fileCancel);

    fileFormWrap.id = "file-form-wrap";
    backCard.append(fileFormWrap);
    backCard.classList.add('settings-background-active');
    fileFormWrap.innerHTML = "<div class='file-form-file'> <img src='/img/chat/file.svg' width='50'> <div class='file-form-file-info'> <div class='file-form-name'>" + file.name + " </div> <div class='form-file-size'>" + file.size + " </div> </div> </div>" +
                             "<div class='file-form-text'> <input type='text' placeholder='Введите текст..'> <div class='input-line'></div> </div>";
    fileFormWrap.append(fileWrapBut);

    //обработка файла
    let reader = new FileReader();

    reader.onload = ((theFile) => {
        return (e) => {
            console.log(file);
        }
    })(file);
    reader.readAsDataURL(file);
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
