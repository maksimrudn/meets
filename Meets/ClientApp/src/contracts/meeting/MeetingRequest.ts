import UserCardResponse from "../user/UserCardResponse";
import UserDTO from "../user/UserDTO";
import UserListItemDTO from "../user/UserListItemDTO";

export default class MeetingRequest{

    static create(user: UserCardResponse | UserListItemDTO, message: string): MeetingRequest {

        let res = new MeetingRequest();

        res.targetId = user.id;
        res.message = message;

        return res;
    }


    targetId: number

    meetingDate: any

    isOnline: boolean = false

    place: string = ''

    message: string = ''
}