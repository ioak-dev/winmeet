import React, { useEffect, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import './style.scss';
import winmeetWhiteSmall from '../../images/winmeet_white_small.svg';
import winmeetWhiteText from '../../images/winmeet_white_text.svg';
import winmeetBlackSmall from '../../images/winmeet_black_small.svg';
import winmeetBlackText from '../../images/winmeet_black_text.svg';
import winmeetBlack from '../../images/winmeet_black.svg';
import winmeetWhite from '../../images/winmeet_white.svg';

interface Props {
}

const Logo = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);

  const profile = useSelector((state: any) => state.profile);

  const dispatch = useDispatch();

  return (
    <div className="logo">
      <div className="logo--image">
        {profile.theme === 'basicui-light' && (
          <img src={'https://westernacher.com/wp-content/uploads/2019/06/Westermnacher-logotype-gray.svg'} alt="Winmeet logo" />
        )}
        {profile.theme !== 'basicui-light' && (
          <img src={'https://westernacher.com/wp-content/uploads/2019/06/Westermnacher-logotype-gray.svg'} alt="Winmeet logo" />
        )}
      </div>
    </div>
  );
};

export default Logo;
