import Cookies from 'js-cookie'
import { isJson } from "../common/Utils";
import ApiError from "../common/ApiError";

export default class BaseService {




	executeRequestXHR(url, method, data, tokenDadata = null): any {

        let errorCode = null;
        let errorFlag = false;
        var errorText = null;
        var res = null;

        let xhr = new XMLHttpRequest();
        xhr.open(method, url, false);

        // в случае если в качесте данных был передан JSON - надо поставить специальный заголовок. По умолчанию обработка работа идёт с FormData
        if (isJson(data))
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        

        // в случае если был передан токен, используется для dadata
        if (tokenDadata != null) {
            xhr.setRequestHeader("Authorization", `Token ${tokenDadata}`);
        }
        else {
            // добавление jwt в случае его существования и в случае если не передаётся токен для дадаты
            
            let jwt = Cookies.get('access_token');
            if (jwt) {
                xhr.setRequestHeader("Authorization", `Bearer  ${jwt}`);
            }
        }

        

        xhr.onload = function () {
            if (xhr.status === 200) {
                try {
                    // в условии выполняется проверка на то, передан ли пустой результат из контроллера
                    // пустой результат приходит когода котроллер возвращает Ok()
                    if (xhr.response !== '' && xhr.response !== undefined)
                        res = JSON.parse(xhr.response);
                }
                catch (err) {
                    errorFlag = true;
                    errorText = `В структуре полученного JSON есть ошибка: ${xhr.response}`;
                }
            }
            // ответ приходит если метод контроллера вернул null
            else if (xhr.status === 204) {
                res = null;
            }

            // todo: сделать обработку неавторизованного запроса, когда происходит редирект на страницу авторизации
            // конструкция ниже не отлавливает такие запросы
            // возможно отловить в fetch: res.redirect === true
            //else if (xhr.status === 302) {
            //    errorFlag = true;
            //    errorText = "Неавторизованный доступ к методу api";
            //}
            else if (xhr.status === 400) {
                let response = JSON.parse(xhr.response);
                errorCode = 400;
                errorFlag = true;
                errorText = Object.values(response.errors).join('<br/>');
            }
            else if (xhr.status === 500) {
                let response = JSON.parse(xhr.response);
                errorCode = 500;
                errorFlag = true;
                errorText = response.errors?.map(err => err.description).join('<br/>');
            }
            else if (xhr.status === 415) {
                errorCode = 415;
                errorFlag = true;
                errorText = `Неподдерживаемый формат данных запроса (HTTP ${xhr.status})`;
            }
            else {
                errorFlag = true;
                errorText = `Неизвестная ошибка API (HTTP ${xhr.status})`;
            }
        }
        xhr.send(data);
        
        if (errorFlag) {
            throw new ApiError(errorText, errorCode);
        }
        else {
            return res;
		}
    }

    /**
     * НЕДОПИСАННЫ ЗАПРОС ЧЕРЕЗ FETCH НА БУДУЩЕЕ
     * @param {any} url
     * @param {any} method
     * @param {any} data
     */
    async executeRequestFetch(url, method, data) {
        let response = await (await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        })
            //.then((response) => {
            //    console.log(response);

            //    if (response.status == 200) {
            //        // если контроллер вернул успешный ответ без данных: Ok(new {})
            //        return response.json();
            //    }
            //    // ошибки на этапе биндинга модели (до вызова самого метода контроллера)
            //    else if (response.status == 400) {
            //        let data = response.json();

            //        let message = Object.values(data.errors).join('<br/>');

            //        throw new Error(message);
            //    }
            //    // ошибки на этапе выполнения прикладной операции (status code 500)
            //    // https://www.thecodebuzz.com/return-http-status-codes-asp-net-core/
            //    else if (response.status == 500) {
            //        let data = response.json();

            //        // код прикладной ошибки находится в поле code
            //        // описание прикладной ошибки находится в поле description
            //        let message = data.errors.map(x=>x.description).join('<br/>');

            //        throw new Error(message);
            //    }
            //    else {
            //        throw new Error("Неожиданная ошибка обработки запроса");
            //    }
            //})
            .catch(err => {
                throw err;
            })).json();

        return response;
    }
}