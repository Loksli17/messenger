function Pagination(_params){
    // this.pageOffset = _params.pageOffset;
    this.pageSize   = _params.pageSize;
    this.limit      = _params.limit;
    this.url        = _params.url;
    this.count      = _params.count;
    this.maxPage    = Math.ceil(_params.count / this.limit);
    this.page       = _params.page;
    if(this.page > this.maxPage){
        this.page = this.maxPage;
    }
    this.skip       = this.limit * (this.page - 1);
}


Pagination.prototype.checkUrl = function(){
    for(let i = 0; i < this.url.length; i++){
        if(this.url[i] == "?"){
            return true;
        }
    }
    return false;
}


Pagination.prototype.getPages = function(){

    if(this.count <= this.limit){
        return [];
    }

    //определение крайних ссылок
    let first = 0,
        last  = 0,
        pages = new Array();

    if(Number(this.page) + (this.pageSize / 2) >= this.maxPage){
        last = this.maxPage;
        first = this.maxPage - this.pageSize + 1;
    }else if(Number(this.page) - (this.pageSize / 2) <= 1){
        first = 1;
        last = this.pageSize;
    }else{
        if(this.page < this.maxPage / 2){
            first = Math.floor(Number(this.page) - this.pageSize / 2);
        }else{
            first = Math.ceil(Number(this.page) - this.pageSize / 2);
        }
        last = first + this.pageSize - 1;
    }
    if(last > this.maxPage){
        last = this.maxPage;
    }
    if(first < 1){
        first = 1;
    }

    //корректировка адреса
    if(this.checkUrl()){
        this.url += '&'
    }else{
        this.url += '?'
    }

    //создание массива
    if(this.page > 1){
        pages.push({id: Number(this.page) - 1, route: this.url, content: "<<"});
    }

    for(let i = first; i <= last; i++){
        if(i == this.page){
            pages.push({id: i, route: this.url, content: i, current: true});
        }else{
            pages.push({id: i, route: this.url, content: i});
        }
    }

    if(this.page < this.maxPage){
        pages.push({id: Number(this.page) + 1, route: this.url, content: ">>"});
    }

    if(pages.length != 1){
        return pages;
    }else{
        return [];
    }

};

module.exports = Pagination;


/*ИСПОЛЬЗОВАНИЕ В КОНТРОЛЛЕРЕ ПИСАТЬ ТАК*/
/*
ОБЬЕКТ ПАГИНАЦИИ
let pagination = new Pagination({
    pageSize  : 4,
    limit     : 4,
    page      : page,
    url       : '/user',
    count     : count,
});

ЗАПРОС
let result = await User.find().skip(pagination.skip).limit(pagination.limit);

РЕНДЕР МАССИВА КНОПОК
res.render('user/user', {
    users: users,
    pages: pagination.getPages(),
});
*/




//во view писать так
//делать hbs-helper'ом или добавлять в виды
// {{#each pages}}не
// <li>
//     {{#if current}}
//         <a class="active page" href="{{route}}page={{id}}">{{content}}</a>
//     {{else}}
//         <a class="page" href="{{route}}page={{id}}">{{content}}</a>
//     {{/if}}
// </li>
// {{/each}}





/*
<style>
.pages{
    margin-top: 30px;
}

.pages ul{
    display: flex;
}

.pages li{
    width: 40px;
    height: 40px;
    list-style: none;
    margin-left: 10px;
}

.pages .page{
    background: #fff;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 40px;
    display: block;
    color: #cc33cc;
    border: 1.5px solid;
    text-decoration: none;
    font-size: 18px;
}

.pages .active{
    background: #cc33cc;
    border: 1.5px solid #cc33cc;
    color: #fff;
}


</style>
*/
