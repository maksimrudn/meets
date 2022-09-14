import React, { Component, useState } from 'react';

export default function LockOutlineIcon() {
    return (<img src="content/icons/feather-outline-lock.svg" alt="" onDragStart={e => e.preventDefault()} />);
}