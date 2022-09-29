﻿const Routes = {
    UserCard: "/user/card/:id",
    UserCardBuild: (userId) => `/user/card/${userId}`,

    ProfileSettings: '/user/settings/:id',
    ProfileSettingsBuild: (userId) => `/user/settings/${userId}`,
    UserChangePassword: '/user/cnangepassword/:id',
    UserChangePasswordBuild: (userId) => `/user/cnangepassword/${userId}`,

    UserConfirmEmail: '/user/confirmemail/:id',
    UserConfirmEmailBuild: (userId) => `/user/confirmemail/${userId}`,

    MeetingList: '/meetings',
    Meeting: '/meeting/:id',
    MeetingBuild: (targetid: any) => `/meeting/${targetid}`,

    Error: "/error",
}

export default Routes;