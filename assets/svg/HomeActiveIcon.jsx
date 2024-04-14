import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
    <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.3333 24H16.3333C15.4127 24 14.6667 23.3114 14.6667 22.4615V16.9231C14.6667 16.2431 14.07 15.6923 13.3333 15.6923H10.6667C9.93 15.6923 9.33333 16.2431 9.33333 16.9231V22.4615C9.33333 23.3114 8.58733 24 7.66667 24H1.66667C0.746 24 0 23.3114 0 22.4615V10.7157C0 9.30092 0.702667 7.96431 1.906 7.08923L11.3807 0.197538C11.744 -0.0658462 12.256 -0.0658462 12.6187 0.197538L22.0947 7.08923C23.298 7.96431 24 9.30031 24 10.7145V22.4615C24 23.3114 23.254 24 22.3333 24Z" fill="#FA4A0C"/>
    </svg>
`;

const HomeActiveIcon = () => <SvgXml xml={xml} />;

export default HomeActiveIcon;
