/**
 * 文章分类saga
 */

import { put, take, call, fork } from 'redux-saga/effects';

import * as types from '../constants/ActionTypes';
import { toastShort } from '../utils/ToastUtil';
import { request } from '../utils/RequestUtil';
import Http from '../utils/HttpUtil';
import { WEXIN_ARTICLE_TYPE } from '../constants/Urls';
import YiYuan from '../constants/YiYuan';
import Storage from '../utils/Storage';
import md5 from 'react-native-md5';
import {formatCurrentTimestamp, objKeySortToStr} from '../utils/FormatUtil';
import { fetchTypeList, receiveTypeList } from '../actions/category';

export function* requestTypeList() {
    try {
        yield put(fetchTypeList());

        const params = {
            'showapi_appid': YiYuan.APP_ID,
            //'showapi_timestamp': formatCurrentTimestamp(),
            'showapi_sign_method': 'md5',
        };

        const paramsStr = objKeySortToStr(params);
        const sign = md5.hex_md5(paramsStr + YiYuan.APP_SECRET);
        params['showapi_sign'] = sign;


        const typeList = yield call(Http.get, WEXIN_ARTICLE_TYPE, params);
        yield put(receiveTypeList(typeList.showapi_res_body.typeList));
        yield call(Storage.save, 'typeList', typeList.showapi_res_body.typeList);
        const errorMessage = typeList.showapi_res_error;
        if (errorMessage && errorMessage !== '') {
            yield toastShort(errorMessage);
        }
    } catch (error) {
        console.log(error);
        yield put(receiveTypeList([]));
        yield toastShort('网络发生错误，请重试');
    }
}

export function* watchRequestTypeList() {
    while(true) {
        yield take(types.REQUEST_TYPE_LIST);
        yield fork(requestTypeList);
    }
}
