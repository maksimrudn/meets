import httpService from "./BaseService";

const activityService = {
    /**
 * функция получающая запись об активности по id
 * @param {any} payload объект соодержащий id записи об обучении
    */
    get: async (payload) => {
        if (!payload) {
            throw new Error('Передано пустое/неверное значение');
        }

        const { data } = await httpService.post('/api/activity/get', JSON.stringify(payload));
        return data;
    },

    /**
     * функция создающая запись об активности работы
     * @param {any} payload 
     * title - название
     */
    create: async (payload) => {
        if (!payload) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/activity/create', JSON.stringify(payload));
    },

    /**
     * функция изменяющая запись об активности
     * @param {any} payload 
     * id - идентификатор записи об активности
     * title - название (#курсов)
     */
    edit: async (payload) => {
        if (!payload) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/activity/edit', JSON.stringify(payload));
    },

    /**
     * isDelete = true (удаляет запись об активности)
     * @param {any} payload
     * id - идентификатор записи об активности
     */
    remove: async (payload) => {
        if (!payload) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/activity/remove', JSON.stringify(payload));
    }
};

export default activityService;
