import httpService from "./BaseService";

const workService = {
    /**
 * функция получающая запись о месте работы по id
 * @param {any} payload объект соодержащий id записи об обучении
    */
    get: async (payload)=> {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        const { data } = await httpService.post('/api/work/get', JSON.stringify(payload));
        return data;
    },

    /**
     * функция создающая запись о месте работы
     * @param {any} payload 
     * startDate - дата начала
     * endDate - дата завершения
     * title - название (#курсов)
     */
    create: async (payload) => {
        if (!payload) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/work/create', JSON.stringify(payload));
    },

    /**
     * функция изменяющая запись о месте работы
     * @param {any} payload 
     * id - идентификатор записи о месте работы
     * startDate - дата начала
     * endDate - дата завершения
     * title - название (#курсов)
     */
    edit: async (payload) => {
        if (!payload) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/work/edit', JSON.stringify(payload));
    },

    /**
     * isDelete = true (удаляет запись о месте работы)
     * @param {any} payload
     * id - идентификатор записи о месте работы
     */
    remove: async (payload) => {
        if (!payload) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/work/remove', JSON.stringify(payload));
    }
};

export default workService;
