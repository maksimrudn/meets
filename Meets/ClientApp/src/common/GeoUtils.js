import Coordinates from "../contracts/Coordinates";

var geo_options = {
    frequency: 1000, // частоста обновления данных
    enableHighAccuracy: true, // требуется позиция с максимально возможным уровнем точности (что может занять больше времени и больше мощности)
    maximumAge: Infinity, //  максимальный «возраст» позиции, кешируемой браузером. (ms)
    timeout: 5000 // Поиск позиции может занять некоторое время, и мы можем установить максимальное время, необходимое для выполнения операции, в качестве передаваемого параметра.
};

export default function getPosition() {
    let promise = new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, geo_options)
    );

    let coordinates = new Coordinates();

    return promise.then(res => {
        coordinates.latitude = res.coords.latitude;
        coordinates.longitude = res.coords.longitude;

        return coordinates;
    })
}