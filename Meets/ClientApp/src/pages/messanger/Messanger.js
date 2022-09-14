import React, { Component, useEffect, useState } from 'react';
import 'moment-timezone';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import MessageList from './MessageList';
import DialogsList from './DialogsList';
import messageService from '../../api/MessageService';
import { objectToFormData } from '../../common/Utils';




export default function Messanger(props) {

    const [dialogs, setDialogs] = useState([]);
    const [targetUser, setTargetUser] = useState(null);
    const [messages, setMessages] = useState([]); // список сообщений диалога с выбранным пользователем

    useEffect(() => {
        updateUI();
    }, []);

    // выбор диалга выполняется через props
    useEffect(() => {
        updateUI();
    }, [props.match.params.id]);

    /**
     * обновление данных и самого интерфейса
     * */
    const updateUI = () => {
        getDialogs();

        if (props.match.params.id) {
            getMessages(props.match.params.id);
        }
    }

    const getDialogs = () => {

        try {
            var dialogs = messageService.getDialogs();

            setDialogs(dialogs);

        }
        catch (err) {
            NotificationManager.error(err.message);
        }
    }

    const getMessages = (targetId) => {
        var res = null;
        var receiverInfo = null;

        try {
            receiverInfo = messageService.getReceiverInfo(targetId);


            setTargetUser(receiverInfo);


            res = messageService.getMessages(targetId);
            setMessages(res);

        }
        catch (err) {
            NotificationManager.error(err.message, undefined);
        }
    }


    /**
     * метод передачи сообщений, передаётся в дочерний компонент
     */
    const onSendMessage = (text, receiverId) => {

        var msgDto = {
            receiverId: receiverId,
            text: text
        };

        messageService.sendMessage( objectToFormData( msgDto ) );
        updateUI();

    }

    

    

    return (
        <>
            <NotificationContainer />

            <div className="row g-0">
                <div className="col-12 d-flex">
                    <DialogsList
                        targetid={props.match.params.id}
                        dialogs={dialogs}
                    />
                    <MessageList
                        targetid={props.match.params.id}
                        targetUser={targetUser}
                        onSendMessage={onSendMessage}
                        messages={messages}
                    />
                </div>
            </div>
        </>
    );
}