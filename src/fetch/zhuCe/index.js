import nopost from '../nopost';




export default function login( body='',  token='', ) {
    const url = '/user/insert';
    const result = nopost(url, body, token );
    return result;
}



