import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllCategories } from '../../store/actions/CategoryActions';
import { receiveMessage, sendMessage } from '../../events/MessageService';
import ExpenseStateActions from '../../simplestates/ExpenseStateActions';
import { fetchAndSetCompanyItems } from '../../store/actions/CompanyActions';
import { fetchAndSetUserItems } from '../../store/actions/UserActions';
import { fetchAndSetFilterExpenseItems } from '../../store/actions/FilterExpenseActions';
import { fetchAllTags } from '../../store/actions/TagActions';
import { setProfile } from '../../store/actions/ProfileActions';
import ReceiptStateActions from '../../simplestates/ReceiptStateActions';
import { fetchAllIncomeCategories } from '../../store/actions/IncomeCategoryActions';
import IncomeStateActions from '../../simplestates/IncomeStateActions';
import { axiosInstance, httpPost } from '../Lib/RestTemplate';
import { removeSessionValue, setSessionValue } from '../../utils/SessionUtils';
import { addAuth, removeAuth } from '../../store/actions/AuthActions';
import { useNavigate } from 'react-router-dom';
import { rotateToken } from './service';
import { RawAxiosRequestHeaders } from 'axios';

const Init = () => {
  const navigate = useNavigate();
  const authorization = useSelector((state: any) => state.authorization);
  const authorizationRef = useRef<any>({});
  const profile = useSelector((state: any) => state.profile);
  const [previousAuthorizationState, setPreviousAuthorizationState] =
    useState<any>();
  const [space, setSpace] = useState<string>();
  const [previousSpace, setPreviousSpace] = useState<string>();
  const dispatch = useDispatch();

  useEffect(() => {
    authorizationRef.current = authorization;
  }, [authorization]);

  useEffect(() => {
    if (authorization?.isAuth && space) {
      //  && !previousAuthorizationState?.isAuth) {
      initialize();
      initializeHttpRequestInterceptor();
      initializeHttpResponseInterceptor();
      // dispatch(fetchAndSetUserItems(space, authorization));
    }
  }, [authorization, space]);

  useEffect(() => {
    if (authorization?.isAuth && !previousAuthorizationState?.isAuth) {
      dispatch(fetchAndSetCompanyItems(authorization));
      setPreviousAuthorizationState(authorization);
    }
  }, [authorization]);

  useEffect(() => {
    if (space && previousSpace !== space) {
      setPreviousSpace(space);
    }
  }, [space]);

  useEffect(() => {
    initializeProfileFromSession();
    receiveMessage().subscribe((event: any) => {
      if (event.name === 'spaceChange') {
        // TODO
        setSpace(event.data);
      }
      if (event.name === 'spaceChange' && authorization.isAuth) {
        setSpace(event.data);
        initialize();
        initializeHttpRequestInterceptor();
        initializeHttpResponseInterceptor();
      }
    });
  }, []);

  // useEffect(() => {
  //   document.body.addEventListener('mousedown', () => {
  //     sendMessage('usingMouse', true);
  //   });

  //   // Re-enable focus styling when Tab is pressed
  //   document.body.addEventListener('keydown', (event: any) => {
  //     if (event.keyCode === 9) {
  //       sendMessage('usingMouse', false);
  //     }
  //   });
  // }, [profile]);

  useEffect(() => {
    if (profile.theme === 'basicui-light') {
      document.body.classList.add("basicui-light");
      document.body.classList.remove("basicui-dark");
      // document.body.style.backgroundColor = 'var(--theme-white-50)';
    } else {
      document.body.classList.add("basicui-dark");
      document.body.classList.remove("basicui-light");
      // document.body.style.backgroundColor = 'var(--theme-black-800)';
    }
  }, [profile.theme]);

  const initialize = () => {
    console.log('Initialization logic here');
    if (space) {
      // dispatch(fetchAllCategories(space, authorization));
    }
  };

  const initializeProfileFromSession = () => {
    const colorMode = sessionStorage.getItem('winmeet_pref_profile_colormode');
    const sidebarStatus = sessionStorage.getItem('winmeet_pref_sidebar_status');

    if (colorMode || sidebarStatus) {
      dispatch(
        setProfile({
          theme: colorMode || 'basicui-dark basicui-dark',
          sidebar: sidebarStatus === 'expanded',
        })
      );
    }
  };

  const initializeHttpRequestInterceptor = () => {
    axiosInstance.interceptors.request.use(
      config => {
        // (config.headers as RawAxiosRequestHeaders)['Authorization'] = authorization.access_token;
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  const initializeHttpResponseInterceptor = () => {
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const config = error?.config;
        if (error?.response?.status === 401 && !config?._retry) {
          config._retry = true;
          console.log(authorizationRef.current);
          return rotateToken(space || '', authorizationRef.current)
            .then((response: any) => {
              if (response) {
                config.headers = {
                  ...config.headers,
                  authorization: response?.access_token,
                };
                dispatch(
                  addAuth({
                    ...authorizationRef.current,
                    access_token: response?.access_token,
                  })
                );
                return axiosInstance(error.config);
              }
              else {
                console.log('********redirect to login');
                dispatch(removeAuth());
                removeSessionValue(
                  `winmeet-access_token`
                );
                removeSessionValue(
                  `winmeet-refresh_token`
                );
                navigate('/login');
                Promise.reject(error);
              }
            })
        }
        Promise.reject(error);
      }
    )
  }

  return (
    <>
      <ExpenseStateActions space={space} />
      <ReceiptStateActions space={space} />
      <IncomeStateActions space={space} />
    </>
  );
};

export default Init;
