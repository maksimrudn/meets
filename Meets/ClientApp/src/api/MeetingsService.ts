import ByUserIdRequest from "../contracts/ByUserIdRequest";
import GetMeetingDTO from "../contracts/meeting/GetMeetingDTO";
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

    get(meetingId: any): GetMeetingDTO {
        let res: any = null;
        res = this.executeRequestXHR('/api/meetings/get', 'post', JSON.stringify({ meetingId }));
        return res;
    }

    edit(data: any) {
        this.executeRequestXHR('/api/meetings/edit', 'post', JSON.stringify(data));
    }

    discuss(meetingId: any) {
        let res: any = null;
        res = this.executeRequestXHR('/api/meetings/discuss', 'post', JSON.stringify({ meetingId }));
        return res;
    }

    cancel(meetingId: any) {
        let res: any = null;
        res = this.executeRequestXHR('/api/meetings/cancel', 'post', JSON.stringify({ meetingId }));
        return res;
    }

    confirm(meetingId: any) {
        let res: any = null;
        res = this.executeRequestXHR('/api/meetings/confirm', 'post', JSON.stringify({ meetingId }));
        return res;
    }
}

let meetingsService = new MeetingsService();
export default meetingsService;