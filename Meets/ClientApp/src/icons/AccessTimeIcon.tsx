import React, { Component, useState } from 'react';

export default function AccessTimeIcon() {
    return (<img src="content/icons/material-access-time.svg" alt="" onDragStart={e => e.preventDefault()} />);
}