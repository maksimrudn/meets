
export default class ChangePasswordRequest {
    constructor(oldPassword: string, newPassword: string, confirmPassword: string) {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
        this.confirmPassword = confirmPassword;
    }

    oldPassword: string
    newPassword: string
    confirmPassword: string
}