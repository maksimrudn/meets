import IUserDTO from "./IUserDTO"

export default class UserDTO implements IUserDTO {
    id: any
    gender: any
    birthDate: any
    avatar: any
    city: any
    company: any
    job: any
    fullName: any
    lockoutEnabled: any
    tags: any
    latitude: number = 0
    longitude: number = 0

    hasGeolocation: boolean = false
}