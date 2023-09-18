import httpService from "./BaseService";

const learningService = {
    /**
 * функция получающая запись об обучении по id
 * @param {any} formData объект соодержащий id записи об обучении
    */
    get: async (formData) => {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        const { data } = await httpService.post('/api/learning/get', formData);
        return data;
    },

    /**
     * функция создающая запись об обучении по id
     * @param {any} payload 
     * startDate - дата начала
     * endDate - дата завершения
     * title - название (#курсов)
     */
    create: async (payload) => {
        if (!payload) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/learning/create', JSON.stringify(payload));
    },

    /**
     * функция создающая запись об обучении по id
     * @param {any} formData 
     * id - идентификатор записи об обучении
     * startDate - дата начала
     * endDate - дата завершения
     * title - название (#курсов)
     */
    edit: async (formData) => {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/learning/edit', formData);
    },

    /**
     * isDelete = true (удаляет запись об обучении)
     * @param {any} formData
     * id - идентификатор записи об обучении
     */
    remove: async (formData) => {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/learning/remove', formData);
    }
};

export default learningService;
