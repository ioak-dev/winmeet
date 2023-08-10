import React, { useEffect, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import './style.scss';
import winmeetWhiteSmall from '../../images/winmeet_white_small.svg';
import winmeetWhiteText from '../../images/winmeet_white_text.svg';
import winmeetBlackSmall from '../../images/winmeet_black_small.svg';
import winmeetBlackText from '../../images/winmeet_black_text.svg';
import winmeetBlack from '../../../../images/winmeet_black.svg';

interface Props {
  variant: 'full' | 'short';
}

const Logo = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);

  const profile = useSelector((state: any) => state.profile);

  const dispatch = useDispatch();

  return (
    <div className="logo">
      <div className="logo--image">
        <img src={winmeetBlack} alt="Winmeet logo" />
      </div>
    </div>
  );
};

export default Logo;
