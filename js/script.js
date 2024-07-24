

//Выполняем действия после загрузки структуры страницы (DOMContentLoaded)
window.addEventListener("DOMContentLoaded", function () {
    'use strict';

    //----------------------------------
    //Реализация табов.
    //----------------------------------

    let tab = document.querySelectorAll(".info-header-tab"), // Получаем все табы-кнопки
        info = document.querySelector(".info-header"), //Получаем родителя с табами-кнопками
        tabContent = document.querySelectorAll(".info-tabcontent"), //Получаем весь таб-контент
        btntab = document.querySelectorAll(".description-btn");


// Цикл, который проходит по табам с индексом от 1 до 4 и меняет классы.
    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove("show");
            tabContent[i].classList.add("hide");
            btntab[i].addEventListener("click", modalWindow);  // активируем кнопку на открытие модального окна
        }
    }
    hideTabContent(1); // Передаем 1, чтоб таб с индексом 0 отображался на странице
    btntab[0].addEventListener("click", modalWindow); // Активируем кнопку с модальным окном на 0 табе

    // Передаем индекс таба, чтоб сменить класс
    function showTabContent(b) {
        if (tabContent[b].classList.contains("hide")) {
            tabContent[b].classList.remove("hide");
            tabContent[b].classList.add("show");
        }
    }

    info.addEventListener("click", function (event) {
        let target = event.target;
        if (target && target.classList.contains("info-header-tab")) {
            for(let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0); // Скрываем 0 таб, который отображается по умолчанию
                    showTabContent(i); //Отображаем таб
                    break;
                }
            }
        }
    });

    //----------------------------------
    // Реализация таймера
    //----------------------------------
    let deadline = "2024-07-24";

    // Получаем оставшееся время и записываем данные в функцию
    function  getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date()),  //Дата дедлайна - текущая дата
            seconds = Math.floor((t/1000) % 60),  //Math.floor - округление, t/1000 % 60 - получение секунд
            minutes = Math.floor((t/1000/60) % 60), // - Получение минут
            hours = Math.floor((t/(1000*60*60)) % 60), //  - Получение часов
            days = Math.floor(((t/1000/60/60) % 24)); // - получение дней

            return {
              "total" : t,
              "hours" : hours,
              "minutes" : minutes,
              "seconds" : seconds
            };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return "0" + num
        } else {
            return num
        }
    }

    //Получаем элементы на странице и запускаем функцию каждые 1000мс
    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            hours = timer.querySelector(".hours"),
            minutes = timer.querySelector(".minutes"),
            seconds = timer.querySelector(".seconds"),
            timeInterval = setInterval(updateClock, 1000)


        //Получаем данные из функции и обновляем информация на сайте
        function updateClock() {
            let t = getTimeRemaining(endtime);

            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);


            if (t.total <= 0) {
                clearInterval(timeInterval);
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
            }
        }

    }

    setClock("timer", deadline)

    //----------------------------------
    // Реализация модального окна (Modal)
    //----------------------------------
    let more = document.querySelector(".more"),   //Кнопка вызова модального окна
        overlay = document.querySelector(".overlay"), //Форма модального окна
        close = document.querySelector(".popup-close"); // Кнопка "X" закрытия модального окна


    function modalWindow(event) {
        overlay.style.display = "block";
        this.classList.add("more-splash"); //Анимация кнопки
        document.body.style.overflow = "hidden"; //Запрещаем прокрутку страницы
    }

    more.addEventListener("click", modalWindow);

    //Закрываем модальное окно
    close.addEventListener("click", function () {
        overlay.style.display = "none";
        more.classList.remove("more-splash"); //Анимация кнопки
        document.body.style.overflow = ""; //Снимаем ограничение на прокрутку страницы
    });
    //----------------------------------
    // Реализация формы (Form)
    //----------------------------------
    let message = {
        loading: "Загрузка...",
        success: "Спасибо! Скоро мы с вами свяжемся!",
        failure: "Что-то пошло не так..."
    };

    let form = document.querySelector(".main-form"),
        contactForm = document.querySelector("#form"),
        input = form.getElementsByTagName("input"),
        statusMassage = document.createElement("div"); //Создаем новый элемент div, где будем размещать статус отправки формы

    statusMassage.classList.add("status");

    //----------------------------------------------------
    //ВАЖНО! Отслеживаем, когда форма отправляет на сервер, а не кнопка. (Форма контактов и модального окна)

    function sendForm(elem) {
        elem.addEventListener("submit", function (event) {
            event.preventDefault(); //Отменяем стандартное поведение браузера
            elem.appendChild(statusMassage); //Вставляем в конец формы наш элемент div

            let formData = new FormData(elem); //Получаем данные из формы

            function postData(data) {
                return new Promise(function (resolve, reject) {
                    let request = new XMLHttpRequest(); //Создаем объект через который будем выполнять HTTP-запросы

                    request.open("POST", "server.php"); //Инициализируем запрос на сервер

                    request.setRequestHeader('Content-type', 'application/json; charset=utf-8'); //Указываем заголовок HTTP-запроса. Указываем на JSON

                    //Перебираем массив через forEach и заполняем список для дальнейшего формирования JSON
                    let obj = {};
                    formData.forEach( function (value, key) {
                        obj[key] = value;
                    })
                    //Преобразуем в JSON формат
                    let json = JSON.stringify(obj);

                    request.onreadystatechange = function () {
                        //Отслеживаем загрузку, т.к. 4 статус DONE
                        if (request.readyState < 4 ) {
                            resolve()
                        } else if (request.status === 4) {
                            if (request.status === 200 && request.status < 300) {
                                resolve()
                            }
                            else {
                                reject()
                            }
                        }
                    }
                    request.send(json); // Отправляем данные в формате JSON
                })
            } // End postData
            // Очищаем форму (все input) от введенных значений
            function clearInput(){
                for (let i = 0; i < input.length; i++) {
                    input[i].value = '';
                }
            }

            postData(formData)
                .then(() => statusMassage.innerHTML = message.loading)//при первом положительном ответе мы выводим message.loading
                .then(() => statusMassage.innerHTML = message.success)//при первом положительном ответе мы выводим message.loading
                .catch(() => statusMassage.innerHTML = message.failure)
                .then(clearInput)
        });
    }
    sendForm(form);
    sendForm(contactForm);



//----------------------------------
// Реализация слайдера (Slider)
//----------------------------------

let slideIndex = 3,  // Какой слайд показываем по умолчанию
    slides = document.querySelectorAll(".slider-item"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    dotsWrap = document.querySelector(".slider-dots"),
    dots = document.querySelectorAll(".dot");

    showSlides(slideIndex)
    function showSlides(n) {
        //Если закончились слайды, то мы возвращаемся на 1
        if (n > slides.length) {
            slideIndex = 1;
        }
        //Если мы крутим слайдер в обратную сторону, то отображается последний слайд
        if(n < 1) {{
            slideIndex = slides.length;
        }}


        slides.forEach((item) => item.style.display = "none");  //Перебираем и скрываем все слайды
        dots.forEach((item) => item.classList.remove("dot-active")); //Перебираем и скрываем точки

        slides[slideIndex-1].style.display = "block"; // Отображаем слайд по умолчанию
        dots[slideIndex-1].classList.add("dot-active"); // Отображаем точку по умолчанию
    }
    function  plusSlider(n) {
        showSlides(slideIndex += n)
    }
    function currentSlider(n) {
        showSlides(slideIndex = n);
    }
    //Реализация кнопки на слайдере назад
    prev.addEventListener("click", function () {
        plusSlider(-1);
    });
    //Реализация кнопки на слайдере вперед
    next.addEventListener("click", function () {
        plusSlider(1);
    });

    dotsWrap.addEventListener('click', function (event) {
        //Делегирование
        //Запускаем цикл на 1 раз больше
        for (let i = 0; i < dots.length + 1; i++) {
            if (event.target.classList.contains("dot") && event.target == dots[i-1]) {
                currentSlider(i)
            }
        }
    })
});