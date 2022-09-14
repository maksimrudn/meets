import React, { Component, useState } from 'react';

export default function UserCheckedIcon() {
    return (<img src="content/icons/awesome-user-check.svg" alt="" onDragStart={e => e.preventDefault()} />);
}