import React, { Component, useState } from 'react';

export default function HeartIcon() {
    return (<img src="content/icons/feather-heart.svg" alt="" onDragStart={e => e.preventDefault()} />);
}