import BaseService from "./BaseService";
import AppConfig from "../common/AppConfig";
import ByUserIdRequest from "../contracts/ByUserIdRequest";
import UserCardResponse from "../contracts/user/UserCardResponse";
import ProfileSettingsDTO from "../contracts/user/ProfileSettingsDTO";
import EditProfileSettingsDTO from "../contracts/user/EditProfileSettingsDTO";
import ChangePasswordRequest from "../contracts/user/ChangePasswordRequest";
import UserAuthInfo from "../contracts/UserAuthInfo";

class UserService extends BaseService {
    getAuthInfo(): UserAuthInfo {
        var res;

        res = this.executeRequestXHR('/api/user/GetAuthInfo', 'post', null);

        return res;
    }

    get(id) {
        if (id === undefined)
            throw new Error("Передано пустое значение");

        var res;

        var data = { UserId: id };

        res = this.executeRequestXHR(`/api/user/Get`, 'post', JSON.stringify(data));

        return res;
    }

    /**
     * Получает список пользователей
     * 
     * @param {any} filter
     * структура данных содержит поля:
     * city - имя пользователя
     * tags - тэги пользователя
     * growthTo - рост до (для сортиовки)
     * growthFrom - рост от (для сортировки)
     * weightTo - вес до (для сортиовки)
     * weightFrom - вес от (для сортировки)
     * ageTo - возраст до (для сортиовки)
     * ageFrom - возраст от (для сортировки)
     * work - место работы
     * learning - учебные заведния, курсы
     * activity - активнности
     * 
     * @returns {object[]}
     */
    getList(filter) {
        if (!filter) {
            throw new Error('Передано пустое/неверное значение');
        }

        let res;

        res = this.executeRequestXHR('/api/user/getList', 'post', JSON.stringify(filter));

        return res;
    }

    /**
     * получает details данные профиля пользователя
     * new URL(`/api/user/Details/${this.props.match.params.id}`, window.location.origin)
     * 
     * @param {URL} url
     * объект url содержит параметры:
     * Organizes - организованные пользователем события
     * Goes - события на которые пользователь пойдет
     * Past - прошедшие события пользователя
     * 
     * @returns {object}
     */
    getCard(userid: any): UserCardResponse {
        if (!userid) {
            throw new Error('Передано пустое/неверное значение');
        }

        var res = null;

        var data = new ByUserIdRequest(userid);

        res = this.executeRequestXHR(`/api/user/getCard`, "post", JSON.stringify(data) );

        return res;
    }


    getProfileSettings(userid: any): ProfileSettingsDTO {
        if (!userid) {
            throw new Error('Передано пустое/неверное значение');
        }

        var res = null;

        var data = new ByUserIdRequest(userid);

        res = this.executeRequestXHR(`/api/user/getProfileSettings`, "post", JSON.stringify(data));

        return res;
    }

    editProfileSettings(data: EditProfileSettingsDTO): void {
        if (!data) {
            throw new Error('Передано пустое/неверное значение');
        }

        this.executeRequestXHR(`/api/user/editProfileSettings`, "post", JSON.stringify(data));
    }
    /**
     * Изменяet данные профиля пользователя
     * @param {FormData} formData
     * структура данных содержит поля:
     * photo - аватар пользователя
     * FullName - имя пользователя
     * Email - еmail пользователя
     * BirthDate - дата рождения пользователя
     * PhoneNumber - номер телефона пользователя
     */
    edit(formData) {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        this.executeRequestXHR('/api/user/Edit', 'post', formData);
    }

    /**
     * удаляет аватарку поьзователя
     * */
    removeAvatar() {
        this.executeRequestXHR('/api/user/RemoveUserAvatar', 'post');
    }

    /**
     * Изменяет пароль пользователя
     * 
     * @param {FormData} formData 
     * структура данных содержит поля:
     * OldPassword - старый (текущий) пароль пользователя
     * NewPassword - новый пароль
     * ConfirmPassword - подтверждение пароля (сравнивается с новым паролем)
     * 
     * @returns {void}
     */
    changePassword(oldPassword: string, newPassword: string, confirmPassword: string): void { // todo ошибки выводятся в консоли
        if (!(oldPassword && newPassword && confirmPassword)) {
            throw new Error('Передано пустое/неверное значение');
        }

        this.executeRequestXHR('/api/user/ChangePassword', 'post', JSON.stringify(new ChangePasswordRequest(oldPassword, newPassword, confirmPassword)));
    }

    confirmEmail(data: any): void {
        if (!data) {
            throw new Error('Передано пустое/неверное значение');
        }

        this.executeRequestXHR('/api/user/confirmEmail', 'post', JSON.stringify(data));
    }

    /**
     * Сохраняет геопозицию пользователя
     * 
     * @param {FormData} formData - структура содержит поля:
     * id - id пользвателя
     * latitude - долгота пользователя
     * longitude - широта пользователя
     *
     * @returns {void}
     */
    saveUserGeo(formData) {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        this.executeRequestXHR(`/api/user/SaveUserGeo`, "POST", formData);
    }

    getCoordinatesForCurrentUser() {

        return this.executeRequestXHR(`/api/user/getCoordinatesForCurrentUser`, "post");
    }

    /**
     * Возвращает название населённого пункта авторизованного пользователя
     * Если город не найден - возвращается null
     * Поиск происходит по данным о населённых пунктах из загруженного файла
     
     * @returns {string}
     */
    getLocalityForCurrentUser() {

        return this.executeRequestXHR(`/api/user/getLocalityForCurrentUser`, "post");
    }

    /**
    * Возвращает название населённого пункта авторизованного пользователя c помощью сервиса DADATA
    * Если город не найден - возвращается null
 
    * @returns {string}
    */
    getLocalityFromDadata(latitude, longitude) {
        if (latitude == 0 || longitude == 0) {
            return null;
        }
        const tokenDadata = AppConfig.TokenDadata;
        // коорединаты должны передаваться с разделителем - точкой (en-En)
        var coords = { lat: latitude, lon: longitude };
        var data = JSON.stringify(coords);
        var responseObj = this.executeRequestXHR(`https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address`, "post", data, tokenDadata);

        let locality
        if (responseObj.suggestions[0].data) {
            if (responseObj.suggestions[0].data.city != null) {
                locality = responseObj.suggestions[0].data.city;
            }
            else {
                locality = responseObj.suggestions[0].data.settlement_with_type
            }
        }
        return locality;
    }

    /**
     * сохраняет город пользоваетля
     * @param {any} name название города
     */
    saveUserCity(name) {
        this.executeRequestXHR(`/api/User/SaveUserCity`, "post", JSON.stringify({ name }));
    }
}

const userService = new UserService();
export default userService;


