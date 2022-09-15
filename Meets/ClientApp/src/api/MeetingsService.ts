import ByUserIdRequest from "../contracts/ByUserIdRequest";
import MeetingRequest from "../contracts/meeting/MeetingRequest";
import BaseService from "./BaseService";

class MeetingsService extends BaseService {
    invite(data: MeetingRequest): void {
        this.executeRequestXHR('/api/meetings/invite', 'post', JSON.stringify(data));
    }
}

let meetingsService = new MeetingsService();
export default meetingsService;