import React, { useEffect } from 'react';
import { useState } from 'react';
import Moment from 'react-moment';
import 'moment-timezone';
import 'moment/locale/ru';
import moment from 'moment-timezone';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import './EventPlacemarkBalloon.scss';
import UserAuthInfo from '../contracts/UserAuthInfo';


export interface IMainProps {
    history: any
    userInfo: UserAuthInfo
}
