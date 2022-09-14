import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import * as moment from 'moment-timezone';

export default class Dialog extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var createDateStr = moment(this.props.createDate).format("DD.MM.YYYY HH:mm");

        return (
            <>
                <NavLink to={`/messanger/${this.props.receiverid}`} >
                <li className="list-group-item px-md-4 py-3 py-md-4">
                    
                        <div className="d-flex">
                            <img class="avatar rounded-circle" src="assets/images/xs/avatar6.jpg" alt=""></img>
                            <div className="flex-fill ms-3 text-truncate">
                                <h6 className="d-flex justify-content-between mb-0"><span>{this.props.fullName}</span> <small className="msg-time">{createDateStr}</small></h6>
                                <span className="text-muted">{this.props.text}</span>
                            </div>
                        </div>
                    
                </li>
                </NavLink>

            </>
        )
    }
}