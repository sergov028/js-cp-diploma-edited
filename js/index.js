localStorage.clear();

document.addEventListener("DOMContentLoaded", () => {
  const dayList = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  const navDayNumbers = document.querySelectorAll(".page-nav__day-number"); //Навигационная панель по дням недели
  const navWeekDays = document.querySelectorAll(".page-nav__day-week");

  const nowTime = new Date(); //Получаем актуальное время
  const timeStampToday = nowTime.getTime();
  nowTime.setHours(0, 0, 0);

  navDayNumbers.forEach((dayNum, i) => {
    const day = new Date(nowTime.getTime() + i * 24 * 60 * 60 * 1000);
    const timestamp = Math.trunc(day / 1000);

    dayNum.innerHTML = `${day.getDate()}`; //Изменяем html
    navWeekDays[i].innerHTML = dayList[`${day.getDay()}`];

    const linkDay = dayNum.parentNode;
    linkDay.dataset.timeStamp = timestamp; //устанавливаем timestamp в data атрибут для каждого дня

    linkDay.classList.remove("page-nav__day_weekend");
    if (
      navWeekDays[i].innerHTML === "Сб" ||
      navWeekDays[i].innerHTML === "Вс"
    ) {
      linkDay.classList.add("page-nav__day_weekend"); //Изменяем стили для выходных дней
    }
  });

  apiRequest("event=update", (response) => {
    const data = {}; //Создаем объект с данными из ответа сервера
    data.films = response.films.result;
    data.halls = response.halls.result.filter((hall) => hall.hall_open == 1);
    data.seances = response.seances.result;
    //console.log(data);
    const main = document.querySelector("main"); //Создаем основной контент страницы

    data.films.forEach((film) => {
      let seancesHtml = "";

      data.halls.forEach((hall) => {
        const seances = data.seances.filter(
          (seance) =>
            seance.seance_hallid == hall.hall_id &&
            seance.seance_filmid == film.film_id
        );
        //console.log(seances);

        if (seances.length > 0) {
          seancesHtml += `
          <div class="movie-seances__hall">
            <h3 class="movie-seances__hall-title">${hall.hall_name}</h3>
            <ul class="movie-seances__list">`;
          seances.forEach((seance) => {
            seancesHtml += `<li class="movie-seances__time-block"><a class="movie-seances__time" href="hall.html" 
            data-film-id="${film.film_id}"  data-film-name="${film.film_name}" 
            data-hall-id="${hall.hall_id}" data-hall-name="${hall.hall_name}" 
            data-price-standart="${hall.hall_price_standart}" data-price-vip="${hall.hall_price_vip}" 
            data-seance-id="${seance.seance_id}" data-seance-start="${seance.seance_start}" data-seance-time="${seance.seance_time}">${seance.seance_time}</a></li>`;
          });
          seancesHtml += `  
            </ul>
          </div>`;
        }
      });
      if (seancesHtml) {
        main.innerHTML += `
        <section class="movie">
          <div class="movie__info">
            <div class="movie__poster">
              <img class="movie__poster-image" alt="${film.film_name} постер" src="${film.film_poster}">
          </div>
          <div class="movie__description">
            <h2 class="movie__title">${film.film_name}</h2>
            <p class="movie__synopsis">${film.film_description}</p>
            <p class="movie__data">
              <span class="movie__data-duration">${film.film_duration} мин.</span>
              <span class="movie__data-origin">${film.film_origin}</span>
            </p>
          </div>
        </div>
        ${seancesHtml}
      </section>`;
      }
    });

    const pageNavDays = document.querySelectorAll(".page-nav__day"); //Выбор дня в навигационной панели

    pageNavDays.forEach((page) =>
      page.addEventListener("click", (event) => {
        event.preventDefault();
        document
          .querySelector(".page-nav__day_chosen")
          .classList.remove("page-nav__day_chosen");
        page.classList.add("page-nav__day_chosen");

        let timeStampDay = Number(event.target.dataset.timeStamp);
        if (isNaN(timeStampDay)) {
          timeStampDay = Number(
            event.target.closest(".page-nav__day").dataset.timeStamp
          );
        }
        changeSeances(timeStampDay);
      })
    );

    const movieSeances = document.querySelectorAll(".movie-seances__time");

    function changeSeances(timeStampDay) {
      movieSeances.forEach((movieSeance) => {
        //Определяем начало сеанса для каждого дня
        const timeStampSeanceDay = Number(movieSeance.dataset.seanceStart) * 60;
        const timeStampSeance = timeStampDay + timeStampSeanceDay;
        const timeStampNow = timeStampToday / 1000;
        movieSeance.dataset.seanceTimeStamp = timeStampSeance;
        if (timeStampSeance - timeStampNow > 0) {
          movieSeance.classList.remove("acceptin-button-disabled"); //Изменяем состояние кнопки бронирования
        } else {
          movieSeance.classList.add("acceptin-button-disabled");
        }
      });
    }
    pageNavDays[0].click(); //Активируем текущий день после загрузки страницы

    movieSeances.forEach((movieSeance) =>
      movieSeance.addEventListener("click", (event) => {
        const selectSeance = event.target.dataset;
        selectSeance.hallConfig = data.halls.find(
          (hall) => hall.hall_id == selectSeance.hallId
        ).hall_config;
        localStorage.setItem("selectSeance", JSON.stringify(selectSeance));
      })
    );
  });
});
