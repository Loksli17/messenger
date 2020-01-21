function dropImage(e){
    e.stopPropagation();
    e.preventDefault();
    let ouputZone = document.getElementById('output-zone'),
        img       = document.getElementById('img');
        file      = e.dataTransfer.files[0];

    if(file.type != 'image/png' && file.type != 'image/jpeg' && file.type != 'image/jpg'){
        ouputZone.style.color = "red";
        ouputZone.innerHTML = "Загруженный файл не является изображением";
        return;
    }

    let reader = new FileReader();

	reader.onload = (function(theFile){
		return function(e){
			img.src = e.target.result;
            ouputZone.style.color = "green";
            ouputZone.innerHTML = "Файл успешно добавлен и отправляется.";
		}
	})(file);
    reader.readAsDataURL(file);

}


function dragOver(e){
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}


let dropZone = document.getElementById('drop-zone');
dropZone.addEventListener('dragover', dragOver, false);
dropZone.addEventListener('drop', dropImage, false);
