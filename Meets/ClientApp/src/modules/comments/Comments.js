import React, { Component, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Moment from 'react-moment';
import 'moment-timezone';
import 'moment/locale/ru';
import commentService from '../../api/CommentService';
import eventService from '../../api/EventService';
import CommentTargetType from '../../common/CommentTargetType';
import SubComments from './SubComments';
import AppConfig from '../../common/AppConfig';
import { getAvatarPathForUser } from '../../common/Utils';

Moment.globalLocale = 'ru';

export default function Comments(props) {

    let {
        userInfo,
        targetId,
        targetType
    } = props;

    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        getComments();
    }, []);

    useEffect(() => {
        getComments();
    }, [targetId]);


    const getComments = () => {
        try {
            const comm = commentService.getList(targetId, targetType);
            setComments(comm);
            setCommentText('');
        } catch (err) {
            NotificationManager.error(err.message, err.name);
        }
    }

    const onCommentSubmit = (e) => {
        e.preventDefault();
        let data = new FormData(e.target);

        try {
            commentService.add(data);
            getComments();
        } catch (err) {
            NotificationManager.error(err.message, err.name);
        }
    }

    const onCommentTextChange = (e) => {
        setCommentText(e.target.value);
    }

    return  (
        <div className="col-12">
            <div className="card">
                <div className="card-body card-body-height py-4">
                    <div className="row">
                        <div className="col-12">
                            <h6 className="mb-0 fw-bold mb-3">Комментарии</h6>

                            {userInfo.isAuthenticated &&
                            <div className="card mb-2">
                                <div className="card-body">
                                    <div className="post">
                                        <div className="py-3">
                                            <form onSubmit={onCommentSubmit}>
                                                <textarea className="form-control" name="Text" value={commentText} placeholder="Написать" rows="4" onChange={onCommentTextChange}></textarea>

                                                <input type="number" name="TargetId" value={targetId} hidden readOnly />
                                                <input type="text" name="TargetType" value={targetType} hidden readOnly />
                                                <input type="text" name="ParentId" value="" hidden readOnly />
                                                <br/>
                                                <input type="submit" className="btn btn-primary float-sm-end  mt-2 mt-sm-0" value="Отправить" disabled={!commentText} />
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }
                            {comments && comments.map(comment =>
                                {                                            
                                    return (
                                        <>
                                            <ul key={comment.id} className="list-unstyled res-set">
                                                <li key={comment.id} className="card mb-2">
                                                    <div className="card-body">
                                                        <div className="d-flex mb-3 pb-3 border-bottom">
                                                            <img className="avatar rounded-circle" src={getAvatarPathForUser( comment.author )} alt="" />
                                                            <div className="flex-fill ms-3 text-truncate">
                                                                <Link to={'/user/details/' + comment.author.id} >
                                                                    <h6 className="mb-0 fw-bold"><span>{comment.author.fullName}</span> <span className="text-muted small">написал</span></h6>
                                                                </Link>
                                                                <span className="text-muted">
                                                                    <Moment date={comment.createDate} format="DD.MM.YYYY HH:mm:ss" />
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <SubComments
                                                            userInfo={userInfo}
                                                            comment={comment}
                                                            onCommentSubmit={onCommentSubmit}
                                                        />


                                                    </div>
                                                </li>
                                            </ul>
                                        </>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}