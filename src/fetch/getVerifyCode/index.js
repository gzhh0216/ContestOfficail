import get from '../get';



export default function getVerifyCode() {
    let url = '/user/getCode';
    const result = get(url);
    return result;
}



