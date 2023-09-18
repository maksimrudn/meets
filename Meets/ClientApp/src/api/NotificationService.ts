import NotificationDTO from "../contracts/notifications/NotificationDTO";
import httpService from "./BaseService";

const notificationService = {
    getList: async (): Promise<NotificationDTO[]> => {
        const { data } = await httpService.post('/api/notification/getlist');
        return data;
    }
};

export default notificationService;
