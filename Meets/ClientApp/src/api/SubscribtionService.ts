import ByUserIdRequest from "../contracts/ByUserIdRequest";
import BaseService from "./BaseService";

class SubscribtionService extends BaseService{


    /**
     * @param {FormData} formData
     * senderid - sender id
     * receiverid - receiver id
     * @returns {void}
     */
    subscribe(userId: string) {
        if (!userId) {
            throw new Error('Передано пустое/неверное значение');
        }

        this.executeRequestXHR('/api/subscribtion/subscribe', 'post', JSON.stringify(new ByUserIdRequest(userId)));
    }

    /**
     * @param {FormData} formData
     * senderid - sender id
     * receiverid - receiver id
     * @returns {void}
     */
    unSubscribe(userId: string) {
        if (!userId) {
            throw new Error('Передано пустое/неверное значение');
        }

        this.executeRequestXHR('/api/subscribtion/unsubscribe', 'post', JSON.stringify(new ByUserIdRequest(userId)));
    }

}

const subscribtionService = new SubscribtionService();
export default subscribtionService;