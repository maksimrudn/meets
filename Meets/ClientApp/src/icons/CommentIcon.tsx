import React, { Component, useState } from 'react';

export default function CommentIcon() {
    return (<img src="content/icons/feather-message-square.svg" alt="" onDragStart={e => e.preventDefault()} />);
}