import ByUserIdRequest from "../contracts/ByUserIdRequest";
import httpService from "./BaseService";

const subscribtionService = {
    /**
 * @param {FormData} formData
 * senderid - sender id
 * receiverid - receiver id
 * @returns {void}
    */
    subscribe: async (userId: string) => {
        if (!userId) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/subscribtion/subscribe', JSON.stringify(new ByUserIdRequest(userId)));
    },

    /**
     * @param {FormData} formData
     * senderid - sender id
     * receiverid - receiver id
     * @returns {void}
     */
    unSubscribe: async (userId: string) => {
        if (!userId) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/subscribtion/unsubscribe', JSON.stringify(new ByUserIdRequest(userId)));
    }
};

export default subscribtionService;