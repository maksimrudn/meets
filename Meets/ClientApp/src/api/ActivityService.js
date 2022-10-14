import httpService from "./BaseService";

const activityService = {
    /**
 * функция получающая запись об активности по id
 * @param {any} formData объект соодержащий id записи об обучении
    */
    get: async (formData) => {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        const { data } = await httpService.post('/api/activity/get', formData);
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
     * @param {any} formData 
     * id - идентификатор записи об активности
     * title - название (#курсов)
     */
    edit: async (formData) => {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/activity/edit', formData);
    },

    /**
     * isDelete = true (удаляет запись об активности)
     * @param {any} formData
     * id - идентификатор записи об активности
     */
    remove: async (formData) => {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/activity/remove', formData);
    }
};

export default activityService;
