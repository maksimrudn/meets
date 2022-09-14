import React, { Component, useState } from 'react';

export default function UserOutlineIcon() {
    return (<img src="content/icons/feather-outline-user.svg" alt="" onDragStart={e => e.preventDefault()} />);
}