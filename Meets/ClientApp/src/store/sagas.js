import { appActions, UpdateCategories } from "./appActions";

import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

function* mySaga() {
    // takeLatest обрабатывать только последний вызов, предыдущие прекращать
    // takeEvery - обрабатывать каждый вызов
    //yield takeLatest(appActions.CATEGORY_EDIT, CategoryEditWorker);
}

export default mySaga;