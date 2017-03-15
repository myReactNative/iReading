/**
 * 文章阅读
 */
import { put, take, call, fork } from 'redux-saga/effects';
import * as types from '../constants/ActionTypes';
import { toastShort } from '../utils/ToastUtil';
import Http from '../utils/HttpUtil';
import { WEXIN_ARTICLE_LIST } from '../constants/Urls';
import YiYuan from '../constants/YiYuan';
import md5 from 'react-native-md5';
import {formatCurrentTimestamp, objKeySortToStr} from '../utils/FormatUtil';
import { fetchArticleList, receiveArticleList } from '../actions/read';

export function* requestArticleList(isRefreshing, loading, typeId, isLoadMore, page) {
    try {
        yield put(fetchArticleList(isRefreshing, loading, isLoadMore));
        
        const params = {
            'showapi_appid': YiYuan.APP_ID,
            'showapi_sign_method': 'md5',
            'typeId': typeId,
            'page': page,
        };

        const paramsStr = objKeySortToStr(params);
        const sign = md5.hex_md5(paramsStr + YiYuan.APP_SECRET);
        params['showapi_sign'] = sign;
        
        const articleList = yield call(Http.get, WEXIN_ARTICLE_LIST, params);
        yield put(receiveArticleList(articleList.showapi_res_body.pagebean.contentlist, typeId));
        const errorMessage = articleList.showapi_res_error;
        if (errorMessage && errorMessage !== '') {
            yield toastShort(errorMessage);
        }
    } catch (error) {
        yield put(receiveArticleList([], typeId));
        toastShort('网络发生错误，请重试');
    }
}

export function* watchRequestArticleList() {
    while (true) {
        const {
            isRefreshing, 
            loading,
            typeId,
            isLoadMore,
            page
        } = yield take(types.REQUEST_ARTICLE_LIST);
        yield fork(requestArticleList, isRefreshing, loading, typeId, isLoadMore, page);
    }
}