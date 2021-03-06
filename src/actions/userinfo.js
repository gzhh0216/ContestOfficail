import * as actionTypes from '../constants/user';

export function login(data) {
    // console.log('dispatch login data:', data);
    return {
        type: actionTypes.USERINFO_LOGIN,
        data
    }
}

export function logout(data) {
    return {
        type: actionTypes.USERINFO_LOGOOF,
        data
    }
}
export function addTeamInfo(data) {
    return {
        type: actionTypes.USERINFO_ADDTEAMINFO,
        data
    }
}
export function match(data) {
    return {
        type: actionTypes.USERINFO_MATCH,
        data
    }
}