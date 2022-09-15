import ByUserIdRequest from "../contracts/ByUserIdRequest";
import BaseService from "./BaseService";

class MeetingsService extends BaseService {
    invite(userid: any): void {
        var data = new ByUserIdRequest(userid);

        this.executeRequestXHR('/api/meetings/invite', 'post', JSON.stringify(data));
    }
}

let meetingsService = new MeetingsService();
export default meetingsService;