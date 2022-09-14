import React, { Component, useState } from 'react';

export default function DocumentIcon() {
    return (<img src="content/icons/document-icon.svg" alt="" onDragStart={e => e.preventDefault()} />);
}