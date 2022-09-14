import React, { Component, useState } from 'react';

export default function UserPlusIcon() {
    return (<img src="content/icons/awesome-user-plus.svg" alt="" onDragStart={e => e.preventDefault()} />);
}