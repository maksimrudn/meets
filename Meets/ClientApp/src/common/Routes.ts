const Routes = {
    UserCard: "/user/card/:id",
    UserCardBuild: (userId) => `/user/card/${userId}`,

    MeetingList: '/meetings',

    Error: "/error",
}

export default Routes;