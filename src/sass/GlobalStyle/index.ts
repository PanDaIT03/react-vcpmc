import React from 'react';
import './GlobalStyle.scss';

interface GlobalStyleProps {
    children: React.ReactElement
}

function GlobalStyle({ children }: GlobalStyleProps){
    return children;
}

export default GlobalStyle;