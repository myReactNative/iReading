var Http = {};

/**
 * 基于fetch封装的get请求
 * @param url
 * @param params {}
 * @param headers
 * @returns {Promise}
 */
Http.get = function(url, params, headers) {
    if (params) {
        let paramsAry = [];
        //encodeURIComponent
        Object.keys(params).forEach(key => paramsAry.push(key + '=' + params[key]));
        if (url.search(/\?/) === -1) {
            url += '?' + paramsAry.join('&');
        } else {
            url += '&' + paramsAry.join('&');
        }
    }


    return new Promise(function(resolve, reject) {
        fetch(url, {
            method: 'GET',
            headers: headers,
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                reject({status: response.status})
            }
        })
        .then((response) => {
            resolve(response);
        })
        .catch((error) => {
            console.error(error);
            reject({status: -1});
        })
    })
}

/**
 * 封装基于fetch的post请求， formdata表单数据
 * @param url
 * @param formData
 * @param headers
 * @returns {Promise}
 */
Http.post = function(url, formData, headers) {
    let isOk;
    if (! headers) {
        headers = {
            "Content-Type": "application/json;charset=UTF-8",
            "Accept":"application/json"
        }
    }
    
    return new Promise(function(resolve, reject) {
        
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: formData,
        })
        .then((response) => {
            isOk = !!response.ok;
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
            console.error(error);
            reject(error);
        })
    })
}

export default Http;