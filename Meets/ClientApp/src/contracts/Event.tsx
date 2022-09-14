export default class Event{
    id: number = 0
    title: string = ''
    startDate: any = ''
    endDate: any = ''
    placeId?: number
    place?: any = {}
    tags?: any = []
    price?: number
    isParticipant: boolean = false
    photos?: any = []
    categoryId?: number
    address?: any = ''
    shortDescription?: string
    description?: string
    maxPeopleCount: number = 0
    eighteenPlus: boolean = false
    published: boolean = false
    latitude: any = ''
    longitude: any = ''
}