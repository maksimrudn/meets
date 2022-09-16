import ByUserIdRequest from "../contracts/ByUserIdRequest";
import MeetingDTO from "../contracts/meeting/MeetingDTO";
import MeetingRequest from "../contracts/meeting/MeetingRequest";
import BaseService from "./BaseService";

class MeetingsService extends BaseService {
    invite(data: MeetingRequest): void {
        this.executeRequestXHR('/api/meetings/invite', 'post', JSON.stringify(data));
    }

    getList(): MeetingDTO[] {
        let res: any = null;
        res = this.executeRequestXHR('/api/meetings/getlist', 'post');
        return res;
    }
}

let meetingsService = new MeetingsService();
export default meetingsService;