import MessageDTO from "../contracts/message/MessageDTO";
import BaseService from "./BaseService";


class MessageService extends BaseService {

    /**
     * Получает список диалогов для текущего пользователя
     * */
    getDialogs() {

        var res = this.executeRequestXHR(`/api/message/getdialogs`, 'post');

        return res;
    }

    getMessages(meetingId: any): MessageDTO[] {
        if (!meetingId) {
            throw new Error('Передано пустое/неверное значение');
        }

        var data = { meetingId };

        var res = this.executeRequestXHR(`/api/message/getMessages`, 'post', JSON.stringify(data));

        return res;
    }

    
    getReceiverInfo(targetUserId) {
        if (!targetUserId) {
            throw new Error('Передано пустое/неверное значение');
        }

        var data = { targetUserId };

        var res = this.executeRequestXHR(`/api/message/getReceiverInfo`, 'post', JSON.stringify(data));

        return res;
    }

    sendMessage(data) {
        if (!data) {
            throw new Error('Передано пустое/неверное значение');
        }

        this.executeRequestXHR('/api/message/sendMessage', 'post', JSON.stringify(data));
    }
}

const messageService = new MessageService();
export default messageService;