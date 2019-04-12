import post from '../post';




export default function login( body='',  token='', verify='',) {
    const url = '/user/login';
    const result = post(url, body, token, verify );
    return result;
}



