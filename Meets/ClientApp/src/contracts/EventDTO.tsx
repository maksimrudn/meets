import Coordinates from "./Coordinates";
import Place from "./Place";

export default class EventDTO extends Coordinates{
    id: number = 0
    title: string = ''
    startDate: any
    placeId?: number 
    place?: Place
    tags?: Array<string>
    price?: number
    isParticipant: boolean = false
}