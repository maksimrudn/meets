import axios, { AxiosResponse } from "axios";
import UserDTO from "../contracts/user/UserDTO";
import httpService from "./BaseService";

const httpAccount = axios.create({
    baseURL: 'http://localhost:53237/api/account/',
    headers: { "Content-Type": "application/json;charset=UTF-8" }
});

const accountService = {
    // AllowAnonymous
    refreshToken: async () => {
        const { data } = await httpAccount.post('RefreshToken');
        return data;
    },
    revokeToken: async () => {
        await httpService.post('/api/account/RevokeToken', JSON.stringify({ token: null }));
    },
    // AllowAnonymous
    login: async (email: string, password: string) => {
        const payload = {
            email,
            password
        };

        const { data } = await httpAccount.post('login', JSON.stringify(payload));
        return data;
    },
    getCurrentUser: async (): Promise<UserDTO> => {
        const { data } = await httpService.post('/api/account/GetCurrentUser');
        return data;
    },
    // AllowAnonymous
    register: async (fullName: string, email: string, password: string, confirmPassword: string) => {
        const payload = {
            fullName,
            email,
            password,
            confirmPassword
        };

        const { data } = await httpAccount.post('register', JSON.stringify(payload));
        return data;
    },
    removeAccount: async () => {
        await httpService.post('/api/account/removeAccount');
    },
    registerConfirmation: async () => {

    },
    confirmEmail: async (userId: string, code: string) => {
        const payload = {
            userId,
            code
        };

        const { data } = await httpService.post('/api/account/ConfirmEmail', JSON.stringify(payload));
        return data;
    },
    forgotPassword: async (email: string) => {
        await httpService.post('/api/account/ForgotPassword', JSON.stringify({ email }));
    },
    resetPassword: async (code: string, email: string, password: string, confirmPassword: string) => {
        const data = {
            code,
            email,
            password,
            confirmPassword
        };

        await httpService.post('/api/account/ResetPassword', JSON.stringify(data));
    },
    confirmEmailChange: async (userId: string, email: string, code: string) => {
        const data = {
            userId,
            email,
            code
        };

        await httpService.post('/api/account/ConfirmEmailChange', JSON.stringify(data));
    }
};

export default accountService;

//class AccountService extends BaseService {

//    refreshToken() {
//        let res;

//        res = this.executeRequestXHR('/api/account/RefreshToken', 'post', undefined);

//        return res;
//    }

//    revokeToken() {
//        this.executeRequestXHR('/api/account/RevokeToken', 'post', JSON.stringify({ token: null }));
//    }

//    login(email: string, password: string) {
//        var data = {
//            email,
//            password
//        }

//        return this.executeRequestXHR('/api/account/login', 'post', JSON.stringify(data), null, true);
//    }

//    getCurrentUser(): UserDTO {
//        var res;

//        res = this.executeRequestXHR('/api/account/GetCurrentUser', 'post', null);

//        return res;
//    }

//    register(fullName: string, email: string, password: string, confirmPassword: string) {
//        var data = {
//            fullName,
//            email,
//            password,
//            confirmPassword
//        }

//        return this.executeRequestXHR('/api/account/register', 'post', JSON.stringify(data), null, false, true);
//    }

//    removeAccount() {
//        this.executeRequestXHR('/api/account/removeAccount', 'post');
//    }

//    registerConfirmation() {

//    }

//    confirmEmail(userId: string, code: string) {
//        let data = {
//            userId,
//            code
//        };

//        return this.executeRequestXHR('/api/account/ConfirmEmail', 'post', JSON.stringify(data));
//    }

//    forgotPassword(email: string) {
//        let data = { email };

//        return this.executeRequestXHR('/api/account/ForgotPassword', 'post', JSON.stringify(data))
//    }

//    resetPassword(code: string, email: string, password: string, confirmPassword: string) {
//        let data = {
//            code,
//            email,
//            password,
//            confirmPassword
//        }

//        return this.executeRequestXHR('/api/account/ResetPassword', 'post', JSON.stringify(data));
//    }

//    confirmEmailChange(userId: string, email: string, code: string) {
//        let data = {
//            userId,
//            email,
//            code
//        }

//        return this.executeRequestXHR('/api/account/ConfirmEmailChange', 'post', JSON.stringify(data));
//    }
//}

//const accountService = new AccountService();
//export default accountService;