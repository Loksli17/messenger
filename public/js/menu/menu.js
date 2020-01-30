function clickBurger(e){
    e.preventDefault();
    this.classList.toggle('menu-bth-active');

    let menu = document.querySelector('.user-menu');
    menu.classList.toggle("user-menu-active");
}

window.onload = () => {
    let burger = document.querySelector(".menu-bth");
    burger.addEventListener('click', clickBurger, false);
}
