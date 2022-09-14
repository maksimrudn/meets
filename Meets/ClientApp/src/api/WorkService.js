import BaseService from "./BaseService";

class WorkService extends BaseService {
    /**
     * функция получающая запись о месте работы по id
     * @param {any} formData объект соодержащий id записи об обучении
     */
    get(formData) {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        return this.executeRequestXHR('/api/work/get', 'post', formData);
    }

    /**
     * функция создающая запись о месте работы
     * @param {any} data 
     * startDate - дата начала
     * endDate - дата завершения
     * title - название (#курсов)
     */
    create(data) {
        if (!data) {
            throw new Error('Передано пустое/неверное значение');
        }

        return this.executeRequestXHR('/api/work/create', 'post', JSON.stringify(data));
    }

    /**
     * функция изменяющая запись о месте работы
     * @param {any} formData 
     * id - идентификатор записи о месте работы
     * startDate - дата начала
     * endDate - дата завершения
     * title - название (#курсов)
     */
    edit(formData) {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        return this.executeRequestXHR('/api/work/edit', 'post', formData);
    }

    /**
     * isDelete = true (удаляет запись о месте работы)
     * @param {any} formData
     * id - идентификатор записи о месте работы
     */
    remove(formData) {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        return this.executeRequestXHR('/api/work/remove', 'post', formData);
    }
}

let workService = new WorkService();
export default workService;