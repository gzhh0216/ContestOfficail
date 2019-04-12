import post from '../post';




export default function register(body='', verify='', token='') {
    const url = '/user/updatePw';
    const result = post(url, body, token, verify);
    return result;
}



