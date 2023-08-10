import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addDays, format } from 'date-fns';
import { faCheck, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.scss';
import ReceiptModel from '../../../model/ReceiptModel';
import ExpenseModel from '../../../model/ExpenseModel';
import Topbar from '../../../components/Topbar';
import { useNavigate } from 'react-router-dom';

interface Props {
  space: string;
  location: any;
}

const HomePage = (props: Props) => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    startTimer();
  }, []);

  const startTimer = () => {
    setTimeout(() => {
      let deadline = new Date("sep 14, 2023 09:00:00").getTime();
      let now = new Date().getTime();
      let t = deadline - now;
      let days = Math.floor(t / (1000 * 60 * 60 * 24));
      let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((t % (1000 * 60)) / 1000);
      console.log({ days, hours, minutes, seconds });
      setState({ days, hours, minutes, seconds });
      startTimer();
    }, 1000);
  }

  return (
    <div className="landing-page">
      <Topbar title="Choose company" />
      <div className="landing-page__main">
        <div className="landing-page__main__hero">
          <h1>
            Watch out this space for something exciting.
          </h1>
          <h3>
            Having perused his letters Queenie reports that Shep is engaged but encourages Gillian to use her magic to pursue him anyway.
          </h3>
          <div>
            {state.days} days {state.hours} hours {state.minutes} minutes {state.seconds} seconds
          </div>
        </div>
        {/* <div className="landing-page__main__sectionone">
          <div>
            Left
          </div>
          <div>
            right
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default HomePage;
