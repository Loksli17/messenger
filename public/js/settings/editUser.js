function upload(file){
    let ouputZone = document.getElementById('output-zone'),
        progress  = document.getElementById('progress'),
        loadInfo  = document.getElementsByClassName('load-info')[0],
        idUser    = document.getElementsByName('_id')[0];
        formData  = new FormData();
        ajax      = new XMLHttpRequest();

    ajax.upload.onprogress = (e) => {
        loadInfo.style.display = "flex";
        let percent = e.loaded / e.total;
        console.log(e.loaded, e.total);
        progress.setAttribute('max', event.total);
        progress.value = event.loaded;
    }

    ajax.onload = ajax.onerror = function(){
        if(this.status == 200){
            ouputZone.style.color = "green";
            ouputZone.innerHTML = "Файл загружен";
        }else{
            ouputZone.style.color = "red";
            ouputZone.innerHTML = "Ошибка загрузки попробуйте позже";
        }
    }

    formData.append('file', file);
    formData.append('_id', idUser.value);

    ajax.open("POST", "/settings/upload-file");
    xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*, q=0.01');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    ajax.send(formData);
}


function dropImage(e){
    e.stopPropagation();
    e.preventDefault();
    let ouputZone = document.getElementById('output-zone'),
        img       = document.getElementById('img'),
        file      = e.dataTransfer.files[0];

    if(file.type != 'image/png' && file.type != 'image/jpeg' && file.type != 'image/jpg'){
        ouputZone.style.color = "red";
        ouputZone.innerHTML = "Загруженный файл не является изображением";
        return;
    }

    if(file.size > 8 * 1014 * 1024 * 5){
        ouputZone.style.color = "red";
        ouputZone.innerHTML = "Загруженный файл больше 5 мегабайт";
        return;
    }

    let reader = new FileReader();

	reader.onload = (function(theFile){
		return function(e){
			img.src = e.target.result;
            ouputZone.style.color = "green";
            ouputZone.innerHTML = "Файл успешно добавлен и отправляется.";
            upload(file);
		}
	})(file);
    reader.readAsDataURL(file);

}


function dragOver(e){
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    onmouseenter = "this.style.cursor = 'move'";
}


let dropZone = document.getElementById('drop-zone');
dropZone.addEventListener('dragover', dragOver, false);
dropZone.addEventListener('drop', dropImage, false);
