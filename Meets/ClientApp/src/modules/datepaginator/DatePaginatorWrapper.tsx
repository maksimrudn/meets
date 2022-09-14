import * as React from 'react';
import ReactDOM from 'react-dom';
import { Component, useEffect, useState } from 'react';

import moment from 'moment';
import { DatePaginator } from 'modules/datepaginator/datepaginator';

export default function DatePaginatorWrapper(onDateChange: any) {
    const [selectedDate, setSelectedDate]: any = useState(moment().format('yyyy-MM-DD'));

    useEffect(() => {
        let datepaginator = new DatePaginator({
            container: '#dp-container',
            onClick: (e: any) => {

                let date = e.target.closest('.dp-item').attributes['data-date'].value;
                // преобразование даты с лидирующими нулями
                let dateZeroLeading = moment(date).format('YYYY-MM-DD');

                setSelectedDate(dateZeroLeading);
            }
        });
    }, [])

    useEffect(() => {
        onDateChange(selectedDate);
    }, [selectedDate]);
}