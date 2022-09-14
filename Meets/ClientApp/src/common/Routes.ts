const Routes = {
    UserCard: "/user/card/:id",
    UserCardBuild: (userId) => `/user/card/${userId}`,

    Error: "/error",
}

export default Routes;