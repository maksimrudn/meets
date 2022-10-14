import MessageDTO from "../contracts/message/MessageDTO";
import httpService from "./BaseService";

const messageService = {
    /**
 * Получает список диалогов для текущего пользователя
 * */
    getDialogs: async () => {
        const { data } = await httpService.post(`/api/message/getdialogs`);
        return data;
    },

    getMessages: async (meetingId: any): Promise<MessageDTO[]> => {
        if (!meetingId) {
            throw new Error('Передано пустое/неверное значение');
        }

        const { data } = await httpService.post(`/api/message/getMessages`, JSON.stringify({ meetingId }));
        return data;
    },

    getReceiverInfo: async (targetUserId: any) => {
        if (!targetUserId) {
            throw new Error('Передано пустое/неверное значение');
        }

        const { data } = await httpService.post(`/api/message/getReceiverInfo`, JSON.stringify({ targetUserId }));
        return data;
    },

    sendMessage: async (payload: any) => {
        if (!payload) {
            throw new Error('Передано пустое/неверное значение');
        }

        await httpService.post('/api/message/sendMessage', JSON.stringify(payload));
    }
};

export default messageService;
