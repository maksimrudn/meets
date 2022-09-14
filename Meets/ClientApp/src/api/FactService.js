import BaseService from "./BaseService";

class FactService extends BaseService {
    /**
     * функция получающая запись о факте по id
     * @param {any} formData объект соодержащий id записи об обучении
     */
    get(formData) {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        return this.executeRequestXHR('/api/fact/get', 'post', formData);
    }

    /**
     * функция создающая запись о факте
     * @param {any} data 
     * title - название
     */
    create(data) {
        if (!data) {
            throw new Error('Передано пустое/неверное значение');
        }

        return this.executeRequestXHR('/api/fact/create', 'post', JSON.stringify(data));
    }

    /**
     * функция изменяющая запись о факте
     * @param {any} formData 
     * id - идентификатор записи о факте
     * title - название (#курсов)
     */
    edit(formData) {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        return this.executeRequestXHR('/api/fact/edit', 'post', formData);
    }

    /**
     * isDelete = true (удаляет запись о факте)
     * @param {any} formData
     * id - идентификатор записи о факте
     */
    remove(formData) {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        return this.executeRequestXHR('/api/fact/remove', 'post', formData);
    }
}

let factService = new FactService();
export default factService;