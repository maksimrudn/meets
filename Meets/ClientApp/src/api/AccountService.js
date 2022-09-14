import BaseService from "./BaseService";

class AccountService extends BaseService {
   
    login(email, password) {
        var data = {
            email,
            password
        }

        return this.executeRequestXHR('/api/account/login', 'post', JSON.stringify(data));
    }

    register(fullName, email, password, confirmPassword) {
        var data = {
            fullName,
            email,
            password,
            confirmPassword
        }

        return this.executeRequestXHR('/api/account/register', 'post', JSON.stringify(data));
    }

    registerConfirmation() {

    }

    confirmEmail(userId, code) {
        let data = {
            userId,
            code
        };

        return this.executeRequestXHR('/api/account/ConfirmEmail', 'post', JSON.stringify(data));
    }

    forgotPassword(email) {
        let data = { email };

        return this.executeRequestXHR('/api/account/ForgotPassword', 'post', JSON.stringify(data))
    }

    resetPassword(code, email, password, confirmPassword) {
        let data = {
            code,
            email,
            password,
            confirmPassword
        }

        return this.executeRequestXHR('/api/account/ResetPassword', 'post', JSON.stringify(data));
    }

    confirmEmailChange(userId, email, code) {
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