import React, { Component, useState } from 'react';

export default function CheckIcon() {
    return (<img src="content/icons/feather-check.svg" alt="" onDragStart={e => e.preventDefault()} />);
}