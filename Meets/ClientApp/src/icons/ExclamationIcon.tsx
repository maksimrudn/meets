import React, { Component, useState } from 'react';

export default function ExclamationIcon() {
    return (<img src="content/icons/awesome-exclamation.svg" alt="" onDragStart={e => e.preventDefault()} />);
}