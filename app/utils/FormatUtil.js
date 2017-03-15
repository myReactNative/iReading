/**
 * 格式化工具类
 */
export const formatDateString = (timestamp) => {
    const date = new Date(parseInt(timestamp) * 1000);
    const year = date.getFullYear();
    const month = parseInt(date.getMonth()) + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
};

export const formatCurrentTimestamp = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = parseInt(date.getMonth()) + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const newmonth = month < 10 ? '0'+month : month;
    const newday   = day < 10 ? '0'+day : day;
    const newhour  = hour < 10 ? '0'+hour : hour;
    const newminute = minute < 10 ? '0'+minute : minute;
    const newsecond = second < 10 ? '0'+second : second;

    return `${year}${newmonth}${newday}${newhour}${newminute}${newsecond}`;
};

/**
 * 把对象按照属性名的字母顺序排列
 * @param {*} obj 
 */
export const objKeySortToStr = (obj) => {
    const newkey = Object.keys(obj).sort();

    var returnStr = '';
    for (var i = 0; i < newkey.length; i++) {
        //newObj[newkey[i]] = obj[newkey[i]];
        returnStr += newkey[i] + obj[newkey[i]];
    }

    return returnStr;
};