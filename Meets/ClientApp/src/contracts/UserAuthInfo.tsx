import UserDTO from "./user/UserDTO"

export default class UserAuthInfo {
    userName: string = ''
    user: UserDTO
    isAuthenticated: boolean = false
    isAdmin: boolean = false
    hasGeolocation: boolean = false
    latitude: number = 0
    longitude: number = 0
}