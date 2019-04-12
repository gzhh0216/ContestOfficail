import 'whatwg-fetch'
import 'es6-promise'
export default function nopost( ...args ) {
    const [ url, body, token ] = [ args[0], args[1], args[2] ];
    const params = JSON.stringify(body);
    // console.log(params);
    let proToken = 'Bearer ' + token;
    var result = null ;
    result = fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        credentials: 'include',
        body: params
    });
    return result
}