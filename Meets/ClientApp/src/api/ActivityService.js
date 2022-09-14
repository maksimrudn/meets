import BaseService from "./BaseService";

class ActivityService extends BaseService {
    /**
     * функция получающая запись об активности по id
     * @param {any} formData объект соодержащий id записи об обучении
     */
    get(formData) {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        return this.executeRequestXHR('/api/activity/get', 'post', formData);
    }

    /**
     * функция создающая запись об активности работы
     * @param {any} data 
     * title - название
     */
    create(data) {
        if (!data) {
            throw new Error('Передано пустое/неверное значение');
        }

        return this.executeRequestXHR('/api/activity/create', 'post', JSON.stringify(data));
    }

    /**
     * функция изменяющая запись об активности
     * @param {any} formData 
     * id - идентификатор записи об активности
     * title - название (#курсов)
     */
    edit(formData) {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        return this.executeRequestXHR('/api/activity/edit', 'post', formData);
    }

    /**
     * isDelete = true (удаляет запись об активности)
     * @param {any} formData
     * id - идентификатор записи об активности
     */
    remove(formData) {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        return this.executeRequestXHR('/api/activity/remove', 'post', formData);
    }
}

let activityService = new ActivityService();
export default activityService;