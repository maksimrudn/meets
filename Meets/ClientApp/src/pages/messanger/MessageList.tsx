import React, { Component, useEffect, useRef } from 'react';
import Message from './Message';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Link } from 'react-router-dom';
import { scrollIntoView } from 'scroll-polyfill';


interface MessageListProps {
    targetUser: any,
    onSendMessage: any,
    messages: any,
}

export default function MessageList(props: MessageListProps): JSX.Element {
    // элемент для скролла сообщений
    let scrollElem: any = useRef();

    useEffect(() => {
        setTimeout(() => { scrollMessages(); });
    }, [props.messages]);

    // "переопределение" метода контейнера (Messanger) для добавления возможности очистки поля Text после отправки
    const onSendMessage = (e: any) => {

        if (e.keyCode == 13) {
            e.preventDefault();

            var msg = e.target.form['Text'].value;
            var receiverId = e.target.form['ReceiverId'].value;

            if (msg.trim()) {
                try {
                    props.onSendMessage(msg, receiverId);
                    e.target.form['Text'].value = '';
                }
                catch (err: any) {
                    NotificationManager.error(err.message, undefined);
                }
            }
        }
    }

    const renderMessages = () => {
        let messageList = props.messages.map((m: any) =>
        (
            <Message
                text={m.text}
                createDate={m.createdate}
                receiverid={m.receiverId}
                targetid={props.targetUser.id}
            />));

        return messageList;
    }

    const scrollMessages = () => {
        scrollIntoView(scrollElem.current, { inline: 'nearest', block: 'nearest' });
    }

    return (
        <>
            <NotificationContainer />

            {props.targetUser &&
                <div className="card card-chat-body border-0  w-100 px-4 px-md-5 py-3 py-md-4">
                    <div className="chat-header d-flex justify-content-between align-items-center border-bottom pb-3">
                        <Link to={`/user/details/${props.targetUser.id}`} className="d-flex align-items-center">
                            <img className="avatar rounded-circle" src="/assets/images/xs/avatar6.jpg" alt=""></img>
                            <div className="ms-3">
                                <h6 className="mb-0">{props.targetUser.fullName}</h6>
                            </div>
                        </Link>
                    </div>
                    <ul className="chat-history list-unstyled mb-0 py-lg-5 py-md-4 py-3 flex-grow-1" >
                        {
                            renderMessages()
                        }
                        <li ref={scrollElem} style={{ position: 'relative', bottom: -10, left: 0 }}></li>
                    </ul>
                    <div className="chat-message">
                        <form>
                            <textarea
                                className="form-control"
                                name="Text"
                                onKeyDown={onSendMessage}></textarea>
                            <input
                                type="number"
                                name="ReceiverId"
                                value={props.targetUser.id}
                                hidden
                                readOnly />

                            <div className="py-4"></div>
                        </form>

                    </div>
                </div>
            }
        </>
    )
}
