import moment from 'moment';
import UserDTO from "../user/UserDTO";

export default class MeetingRequest{

    static createWithMessage(user: UserDTO): MeetingRequest {
        let res = new MeetingRequest();

        res.targetId = user.id;
        res.meetingDate = moment().format('DD.MM.YYYY HH:mm');
        res.message = `Привет ${user.fullName}! Приглашаю тебя попить кофе ${moment(res.meetingDate, 'DD MMMM YYYY HH:mm').format('DD MMMM')} в ${moment(res.meetingDate, 'DD MMMM YYYY HH:mm').format('HH:mm')}`;
        res.isOnline = false;

        return res;
    }


    targetId: number

    meetingDate: any

    isOnline: boolean = false

    place: string = ''

    message: string = ''
}