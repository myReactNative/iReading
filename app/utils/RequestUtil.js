/**
 * 请求类封装
 */
const HOST = 'http://apis.baidu.com';

export const request = (url, method, body) => {
    let isOk;

    return new Promise((resolve, reject) => {
        console.log(HOST + url);
        fetch(HOST + url, {
            method,
            headers: {
                apikey: ''
            },
            body
        })
        .then((response) => {
            if (response.ok) {
                isOk = true;
            } else {
                isOk = false;
            }

            return response.json();
        })
        .then((responseData) => {
            if (isOk) {
                resolve(responseData);
            } else {
                reject(responseData);
            }
        })
        .catch((error) => {
            reject(error);
        });
    });
};