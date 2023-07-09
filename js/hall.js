const selectSeance = JSON.parse(localStorage.getItem("selectSeance"));

//console.log(selectSeance);

document.addEventListener("DOMContentLoaded", () => {
  const confStepWrapper = document.querySelector(".conf-step__wrapper");
  const buyingInfoTitle = document.querySelector(".buying__info-title");
  const buyingInfoStart = document.querySelector(".buying__info-start");
  const buyingInfoHall = document.querySelector(".buying__info-hall");
  const priceStandart = document.querySelector(".price-standart");

  const acceptinButton = document.querySelector(".acceptin-button");

  buyingInfoTitle.innerHTML = selectSeance.filmName; //Добавляем данные о сеансе в разметку
  buyingInfoStart.innerHTML = `Начало сеанса ${selectSeance.seanceTime}`;
  buyingInfoHall.innerHTML = selectSeance.hallName;
  priceStandart.innerHTML = selectSeance.priceStandart;

  apiRequest(
    `event=get_hallConfig&timestamp=${selectSeance.seanceTimeStamp}&hallId=${selectSeance.hallId}&seanceId=${selectSeance.seanceId}`,
    (response) => {
      //Запрашиваем данные о местах с сервера
      console.log(response);
      if (response) {
        selectSeance.hallConfig = response;
      }
      confStepWrapper.innerHTML = selectSeance.hallConfig;

      console.log(selectSeance);

      const chairs = document.querySelectorAll(
        ".conf-step__row .conf-step__chair"
      );
      let chairsSelected = document.querySelectorAll(
        ".conf-step__row .conf-step__chair_selected"
      );
      if (chairsSelected.length) {
        acceptinButton.removeAttribute("disabled");
      } else {
        acceptinButton.setAttribute("disabled", true);
      }
      chairs.forEach((chair) => {
        chair.addEventListener("click", (event) => {
          if (event.target.classList.contains("conf-step__chair_taken")) return;
          event.target.classList.toggle("conf-step__chair_selected");
          chairsSelected = document.querySelectorAll(
            ".conf-step__row .conf-step__chair_selected"
          );
          if (chairsSelected.length) {
            acceptinButton.removeAttribute("disabled");
          } else {
            acceptinButton.setAttribute("disabled", true);
          }
        });
      });
    }
  );

  acceptinButton.addEventListener("click", (event) => {
    //Добавляем событие клика на кнопку бронирования
    event.preventDefault();
    const chosenPlaces = [];
    const rows = Array.from(document.querySelectorAll(".conf-step__row"));

    for (let i = 0; i < rows.length; i++) {
      const places = Array.from(rows[i].querySelectorAll(".conf-step__chair"));
      for (let j = 0; j < places.length; j++) {
        if (places[j].classList.contains("conf-step__chair_selected")) {
          places[j].classList.replace(
            "conf-step__chair_selected",
            "conf-step__chair_taken"
          );
          const typePlace = places[j].classList.contains(
            //Определяем тип выбранного места
            "conf-step__chair_standart"
          )
            ? "standart"
            : "vip";

          chosenPlaces.push({
            row: i + 1,
            place: j + 1,
            type: typePlace,
          });
        }
      }
    }

    const newHallConf = document.querySelector(".conf-step__wrapper").innerHTML; //Изменяем выбранные места на занятые и сохраяем новую конфигурацию зала

    selectSeance.hallConfig = newHallConf;
    selectSeance.salesPlaces = chosenPlaces;
    localStorage.clear();
    localStorage.setItem("selectSeance", JSON.stringify(selectSeance));
    const linkPay = document.createElement("a");
    linkPay.href = "payment.html";
    linkPay.click();
  });
});
