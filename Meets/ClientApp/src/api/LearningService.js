import httpService from "./BaseService";

const learningService = {
    /**
 * функция получающая запись об обучении по id
 * @param {any} payload объект соодержащий id записи об обучении
    */
    get: async (payload) => {
        if (!payload) {
            throw new Error('Передано пустое/неверное значение');
        }

        const { data } = await httpService.post('/api/learning/get', JSON.stringify(payload));
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
     * @param {any} payload 
     * id - идентификатор записи об обучении
     * startDate - дата начала
     * endDate - дата завершения
     * title - название (#курсов)
     */
    edit: async (payload) => {
        if (!payload) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/learning/edit', JSON.stringify(payload));
    },

    /**
     * isDelete = true (удаляет запись об обучении)
     * @param {any} payload
     * id - идентификатор записи об обучении
     */
    remove: async (payload) => {
        if (!payload) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/learning/remove', JSON.stringify(payload));
    }
};

export default learningService;
