"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Routes = {
    UserCard: "/user/card/:id",
    UserCardBuild: function (userId) { return "/user/card/".concat(userId); },
    MeetingList: '/meetings',
    Meeting: '/meeting/:id',
    MeetingBuild: function (targetid) { return "/meeting/".concat(targetid); },
    Error: "/error",
};
exports.default = Routes;
//# sourceMappingURL=Routes.js.map