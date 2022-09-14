import React, { Component, useState } from 'react';

export default function RepeatIcon() {
    return (<img src="content/icons/feather-repeat.svg" alt="" onDragStart={e => e.preventDefault()} />);
}