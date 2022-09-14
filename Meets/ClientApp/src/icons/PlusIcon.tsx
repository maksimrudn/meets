import React, { Component, useState } from 'react';

export default function PlusIcon() {
    return (<img src="content/icons/feather-plus.svg" alt="" onDragStart={e => e.preventDefault()} />);
}