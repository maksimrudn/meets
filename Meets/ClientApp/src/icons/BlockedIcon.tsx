import React, { Component, useState } from 'react';

export default function BlockedIcon() {
    return (<img src="content/icons/metro-blocked.svg" alt="" onDragStart={e => e.preventDefault()} />);
}