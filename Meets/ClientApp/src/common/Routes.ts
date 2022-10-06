const Routes = {
    UserCard: "/user/card/:id",
    UserCardBuild: (userId) => `/user/card/${userId}`,

    UserSearch: '/user/search',

    ProfileSettings: '/user/settings/:id',
    ProfileSettingsBuild: (userId) => `/user/settings/${userId}`,
    UserChangePassword: '/user/cnangepassword',
    //UserChangePasswordBuild: (userId) => `/user/cnangepassword/${userId}`,

    UserConfirmEmail: '/user/confirmemail',
    //UserConfirmEmailBuild: (userId) => `/user/confirmemail/${userId}`,

    MeetingList: '/meetings',
    Meeting: '/meeting/:id',
    MeetingBuild: (targetid: any) => `/meeting/${targetid}`,

    Notifications: '/notifications',

    TimeTable: '/timetable',

    Error: "/error",
}

export default Routes;