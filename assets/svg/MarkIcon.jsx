import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
    <svg width="38" height="28" viewBox="0 0 38 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5647 27.1768C12.8064 27.1768 12.0859 26.8734 11.5551 26.3426L0.824688 15.6122C-0.274896 14.5126 -0.274896 12.6926 0.824688 11.593C1.92427 10.4934 3.74427 10.4934 4.84385 11.593L13.5647 20.3139L33.0539 0.824688C34.1534 -0.274896 35.9734 -0.274896 37.073 0.824688C38.1726 1.92427 38.1726 3.74427 37.073 4.84385L15.5743 26.3426C15.0434 26.8734 14.323 27.1768 13.5647 27.1768Z" fill="#FA4A0C"/>
    </svg>
`;

const MarkIcon = () => <SvgXml xml={xml} />;

export default MarkIcon;
