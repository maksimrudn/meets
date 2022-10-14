import httpService from "./BaseService";

const workService = {
    /**
 * функция получающая запись о месте работы по id
 * @param {any} formData объект соодержащий id записи об обучении
    */
    get: async (formData)=> {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        const { data } = await httpService.post('/api/work/get', formData);
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
     * @param {any} formData 
     * id - идентификатор записи о месте работы
     * startDate - дата начала
     * endDate - дата завершения
     * title - название (#курсов)
     */
    edit: async (formData) => {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/work/edit', formData);
    },

    /**
     * isDelete = true (удаляет запись о месте работы)
     * @param {any} formData
     * id - идентификатор записи о месте работы
     */
    remove: async (formData) => {
        if (!formData) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/work/remove', formData);
    }
};

export default workService;
