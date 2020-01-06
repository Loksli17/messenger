module.exports.formatMysql = function(date){
    let d = date.getDate(),
        m = date.getMonth() + 1,
        y = date.getFullYear();

    d > 10 ? false : d = "0" + d;
    m > 10 ? false : m = "0" + m;

    return y + "-" + m + "-" + d;
}


module.exports.formatView = function(d_){

    let date = new Date(d_);
    let d = date.getDate(),
        m = date.getMonth() + 1,
        y = date.getFullYear();

    switch(m){
        case 1:
            m = "Января";
            break;
        case 2:
            m = "Февраля";
            break;
        case 3:
            m = "Марта";
            break;
        case 4:
            m = "Апреля";
            break;
        case 5:
            m = "Мая";
            break;
        case 6:
            m = "Июня";
            break;
        case 7:
            m = "Июля";
            break;
        case 8:
            m = "Августа";
            break;
        case 9:
            m = "Сентября";
            break;
        case 10:
            m = "Октября";
            break;
        case 11:
            m = "Ноября";
            break;
        case 12:
            m = "Декабря";
            break;
    }

    return d + " " + m + " " + y;
}
