import React, { Component, useEffect, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import moment from 'moment';
import 'moment-timezone';
import 'react-notifications/lib/notifications.css';
import DateTime from 'react-date-time-new';
import 'react-date-time-new/css/react-datetime.css'


interface DateProps {
    name: any,
    birthDate: any
}

export default function Date({ name, birthDate }: DateProps) {
    const [date, setDate]: any = useState();
    return (
        <DateTime
            onChange={setDate}
            value={date || birthDate && moment(birthDate).format('DD.MM.YYYY')}
            inputProps={{ name: name, placeholder: 'dd.mm.yyyy' }}
            dateFormat="DD.MM.YYYY"
            timeFormat={false}
            closeOnSelect={true}
        />
    );
}