import NotificationDTO from "../contracts/notifications/NotificationDTO";
import BaseService from "./BaseService";

class NotificationService extends BaseService {
    getList(): NotificationDTO[] {
        let res;
        res = this.executeRequestXHR('/api/notification/getlist', 'post');
        return res;
    }
}

let notificationService = new NotificationService();
export default notificationService;