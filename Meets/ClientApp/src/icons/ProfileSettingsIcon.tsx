import React, { Component, useState } from 'react';

export default function ProfileSettingsIcon() {
    return (<img src="content/icons/feather-settings.svg" alt="" onDragStart={e => e.preventDefault()} />);
}