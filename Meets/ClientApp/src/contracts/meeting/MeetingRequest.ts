import UserDTO from "../user/UserDTO";

export default class MeetingRequest{

    static create(user: UserDTO): MeetingRequest {

        let res = new MeetingRequest();

        res.targetId = user.id;
        
        return res;
    }


    targetId: number

    meetingDate: any

    isOnline: boolean = false

    place: string = ''

    message: string = ''
}