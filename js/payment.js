const selectSeance = JSON.parse(localStorage.getItem("selectSeance"));

document.addEventListener("DOMContentLoaded", () => {
  //Данные билета о фильме
  //
  document.querySelector(".ticket__title").innerHTML = selectSeance.filmName;
  document.querySelector(".ticket__hall").innerHTML = selectSeance.hallName;
  document.querySelector(".ticket__start").innerHTML = selectSeance.seanceTime;

  const places = [];

  selectSeance.salesPlaces.forEach((elem) => {
    places.push(" " + elem.row + "/" + elem.place);
  });

  document.querySelector(".ticket__chairs").innerHTML = places;

  const sumCost = [];

  selectSeance.salesPlaces.forEach((elem) => {
    let standart = 0; //Расчитываем стоимость билета
    let vip = 0;

    if (elem.type === "vip") {
      vip = selectSeance.priceVip;
    } else {
      standart = selectSeance.priceStandart;
    }

    sumCost.push(Number(standart) + Number(vip));
  });

  let cost = sumCost.reduce((sum, item) => {
    return sum + item;
  }, 0);

  document.querySelector(".ticket__cost").innerHTML = cost;

  const newHallConfig = selectSeance.hallConfig.replace(/selected/g, "taken");

  apiRequest(
    `event=sale_add&timestamp=${selectSeance.seanceTimeStamp}&hallId=${selectSeance.hallId}&seanceId=${selectSeance.seanceId}&hallConfiguration=${newHallConfig}`,
    () => {}
  );
});
