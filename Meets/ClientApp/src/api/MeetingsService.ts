import ByUserIdRequest from "../contracts/ByUserIdRequest";
import GetMeetingDTO from "../contracts/meeting/GetMeetingDTO";
import GetTimeTableDTO from "../contracts/meeting/GetTimeTableDTO";
import MeetingDTO from "../contracts/meeting/MeetingDTO";
import MeetingRequest from "../contracts/meeting/MeetingRequest";
import httpService from "./BaseService";

const meetingsService = {
    invite: async (payload: MeetingRequest) => {
        await httpService.post('/api/meetings/invite', JSON.stringify(payload));
    },

    getList: async (): Promise<MeetingDTO[]> => {
        const { data } = await httpService.post('/api/meetings/getlist');
        return data;
    },

    getTimeTable: async (): Promise<GetTimeTableDTO[]> => {
        const { data } = await httpService.post('/api/meetings/gettimetable');
        return data;
    },

    get: async (meetingId: any): Promise<GetMeetingDTO> => {
        const { data } = await httpService.post('/api/meetings/get', JSON.stringify({ meetingId }));
        return data;
    },

    edit: async (payload: any) => {
        await httpService.post('/api/meetings/edit', JSON.stringify(payload));
    },

    discuss: async (meetingId: any) => {
        await httpService.post('/api/meetings/discuss', JSON.stringify({ meetingId }));
    },

    cancel: async (meetingId: any) => {
        await httpService.post('/api/meetings/cancel', JSON.stringify({ meetingId }));
    },

    confirm: async (meetingId: any) => {
        await httpService.post('/api/meetings/confirm', JSON.stringify({ meetingId }));
    },
};

export default meetingsService;