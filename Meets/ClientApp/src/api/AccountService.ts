import UserDTO from "../contracts/user/UserDTO";
import BaseService from "./BaseService";

class AccountService extends BaseService {

    refreshToken() {
        let res;

        res = this.executeRequestXHR('/api/account/RefreshToken', 'post', undefined);

        return res;
    }

    login(email: string, password: string) {
        var data = {
            email,
            password
        }

        return this.executeRequestXHR('/api/account/login', 'post', JSON.stringify(data));
    }

    getCurrentUser(): UserDTO {
        var res;

        res = this.executeRequestXHR('/api/account/GetCurrentUser', 'post', null);

        return res;
    }

    register(fullName: string, email: string, password: string, confirmPassword: string) {
        var data = {
            fullName,
            email,
            password,
            confirmPassword
        }

        return this.executeRequestXHR('/api/account/register', 'post', JSON.stringify(data));
    }

    removeAccount() {
        this.executeRequestXHR('/api/account/removeAccount', 'post');
    }

    registerConfirmation() {

    }

    confirmEmail(userId: string, code: string) {
        let data = {
            userId,
            code
        };

        return this.executeRequestXHR('/api/account/ConfirmEmail', 'post', JSON.stringify(data));
    }

    forgotPassword(email: string) {
        let data = { email };

        return this.executeRequestXHR('/api/account/ForgotPassword', 'post', JSON.stringify(data))
    }

    resetPassword(code: string, email: string, password: string, confirmPassword: string) {
        let data = {
            code,
            email,
            password,
            confirmPassword
        }

        return this.executeRequestXHR('/api/account/ResetPassword', 'post', JSON.stringify(data));
    }

    confirmEmailChange(userId: string, email: string, code: string) {
        let data = {
            userId,
            email,
            code
        }

        return this.executeRequestXHR('/api/account/ConfirmEmailChange', 'post', JSON.stringify(data));
    }
}

const accountService = new AccountService();
export default accountService;