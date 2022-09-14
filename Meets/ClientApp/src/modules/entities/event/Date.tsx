import React, { Component, useEffect, useLayoutEffect, useRef, useState } from 'react';
import 'react-notifications/lib/notifications.css';

//import DateTime from 'react-datetime-picker';
import DateTime from 'react-date-time-new';
import 'react-date-time-new/css/react-datetime.css'

import moment from 'moment';
import 'moment-timezone';





export default function Date({ name, eventDate }: any) {
    const [date, setDate]: any = useState();

    return (
        <DateTime
            onChange={setDate}
            value={date || eventDate && moment(eventDate).format('DD.MM.YYYY HH:mm')}
            inputProps={{ name: name, placeholder: 'DD.MM.YYYY HH:mm', autoComplete: 'off' }}
            dateFormat="DD.MM.YYYY"
            timeFormat="HH:mm"
            closeOnSelect={true}
        />
    );
}
