import BaseService from "./BaseService";

class LearningService extends BaseService {
    /**
     * функция получающая запись об обучении по id
     * @param {any} formData объект соодержащий id записи об обучении
     */
    get(formData) {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        return this.executeRequestXHR('/api/learning/get', 'post', formData);
    }

    /**
     * функция создающая запись об обучении по id
     * @param {any} data 
     * startDate - дата начала
     * endDate - дата завершения
     * title - название (#курсов)
     */
    create(data) {
        if (!data) {
            throw new Error('Передано пустое/неверное значение');
        }

        return this.executeRequestXHR('/api/learning/create', 'post', JSON.stringify(data));
    }

    /**
     * функция создающая запись об обучении по id
     * @param {any} formData 
     * id - идентификатор записи об обучении
     * startDate - дата начала
     * endDate - дата завершения
     * title - название (#курсов)
     */
    edit(formData) {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        return this.executeRequestXHR('/api/learning/edit', 'post', formData);
    }

    /**
     * isDelete = true (удаляет запись об обучении)
     * @param {any} formData
     * id - идентификатор записи об обучении
     */
    remove(formData) {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        return this.executeRequestXHR('/api/learning/remove', 'post', formData);
    }
}

let learningService = new LearningService();
export default learningService;