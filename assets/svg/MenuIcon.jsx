import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
    <svg width="25" height="17" viewBox="0 0 25 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.59857 8.33333H13.5M1.59857 1H23.5986M1.59857 15.6667H23.5986" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`;

const MenuIcon = () => <SvgXml xml={xml} />;

export default MenuIcon;
