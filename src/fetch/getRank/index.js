import get from '../get';




export default function getRank(params='', token='') {
    const url = '/user/select/score';
    const result = get(url, params, token);
    return result;
}



