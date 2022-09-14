import React, { Component, useState } from 'react';

export default function EditIcon() {
    return (<img src="content/icons/feather-edit.svg" alt="" onDragStart={e => e.preventDefault()} />);
}