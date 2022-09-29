import React, { Component, useState } from 'react';

export default function SendMessageIcon() {
    return (<img src="content/icons/send-message-icon.svg" alt="" onDragStart={e => e.preventDefault()} />);
}