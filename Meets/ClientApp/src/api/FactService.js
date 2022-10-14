import httpService from "./BaseService";

const factService = {
    /**
 * функция получающая запись о факте по id
 * @param {any} formData объект соодержащий id записи об обучении
    */
    get: async (formData) => {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        const { data } = await httpService.post('/api/fact/get', formData);
        return data;
    },

    /**
     * функция создающая запись о факте
     * @param {any} payload 
     * title - название
     */
    create: async (payload) => {
        if (!payload) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/fact/create', JSON.stringify(payload));
    },

    /**
     * функция изменяющая запись о факте
     * @param {any} formData 
     * id - идентификатор записи о факте
     * title - название (#курсов)
     */
    edit: async (formData) => {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/fact/edit', formData);
    },

    /**
     * isDelete = true (удаляет запись о факте)
     * @param {any} formData
     * id - идентификатор записи о факте
     */
    remove: async (formData) => {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/fact/remove', formData);
    }
};

export default factService;
