function apiRequest(data, callback) {
  const method = "POST"; //Метод запроса
  const url = "https://jscp-diplom.netoserver.ru/"; //URL для запроса на сервер;
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(data);
  xhr.onload = () => {
    const object = JSON.parse(xhr.responseText);
    callback(object); //Обработка ответа
    //console.log(object);
  };
}
