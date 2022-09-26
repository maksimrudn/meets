const Routes = {
    UserCard: "/user/card/:id",
    UserCardBuild: (userId) => `/user/card/${userId}`,

    MeetingList: '/meetings',
    Meeting: '/meeting/:id',
    MeetingBuild: (targetid: any) => `/meeting/${targetid}`,

    Error: "/error",
}

export default Routes;