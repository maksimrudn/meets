import Coordinates from "./Coordinates";
import Place from "./Place";

export default class UserAuthInfo {
    userName: string = ''
    user: any
    isAuthenticated: boolean = false
    isAdmin: boolean = false
    hasGeolocation: boolean = false
}