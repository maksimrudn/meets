

export const appActions = {
	UPDATE_USER_INFO: "UPDATE_USER_INFO",
};


export function UpdateUserInfo(value) {
	return {
		type: appActions.UPDATE_USER_INFO,
		userInfo: value
	};
}
