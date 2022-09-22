"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Routes = {
    UserCard: "/user/card/:id",
    UserCardBuild: function (userId) { return "/user/card/".concat(userId); },
    ProfileSettings: '/user/settings/:id',
    ProfileSettingsBuild: function (userId) { return "/user/settings/".concat(userId); },
    UserChangePassword: '/user/cnangepassword/:id',
    UserChangePasswordBuild: function (userId) { return "/user/cnangepassword/".concat(userId); },
    UserConfirmEmail: '/user/confirmemail/:id',
    UserConfirmEmailBuild: function (userId) { return "/user/confirmemail/".concat(userId); },
    Error: "/error",
};
exports.default = Routes;
//# sourceMappingURL=Routes.js.map