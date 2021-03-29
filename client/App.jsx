import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './App.css';

import DisplayCalendar from './components/DisplayCalendar/DisplayCalendar';
import CheckoutTool from './components/CheckoutTool/CheckoutTool';

import {
  numberOfGuests,
  totalReviewCount,
  averageReviewRatings,
} from '../sampleData/sampleData';

import { months } from './calendarMonths.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkInDate: '',
      checkOutDate: '',
      monthsInAdvance: '',
      pricePerNight: '',
      cleaningFee: '',
      serviceFee: '',
      occupancyFee: 0.1,
      selectedAdults: 1,
      selectedChildren: 0,
      selectedInfants: 0,
      calendarMessage: 'Select check-in date',
      calendarSubMessage: 'Add your travel dates for exact pricing',
      sliderPosition: 0,
      direction: null,
      checkoutButtonText: 'Check availability',
      guestSelectionClicked: false,
    };

    this.selectDate = this.selectDate.bind(this);
    this.clearDates = this.clearDates.bind(this);
    this.changeSlider = this.changeSlider.bind(this);
    this.toggleGuestSelection = this.toggleGuestSelection.bind(this);
  }

  componentDidMount() {
    let productId = window.location.pathname.split('/')[1];

    axios.get(`/checkoutInformation/${productId}`).then((response) => {
      this.setState({
        monthsInAdvance: response.data.monthsInAdvance,
        pricePerNight: response.data.priceForDate,
        serviceFee: response.data.serviceFee,
        cleaningFee: response.data.cleaningFee,
      });
    });
  }

  selectDate(e) {
    if (!this.state.checkInDate) {
      this.setState({
        checkInDate: e.target.name,
        calendarMessage: 'Select checkout date',
        calendarSubMessage: 'Minimum stay: 1 night',
      });
    } else if (this.state.checkInDate && this.state.checkOutDate) {
      this.setState({
        checkInDate: e.target.name,
        checkOutDate: '',
        calendarMessage: 'Select checkout date',
        calendarSubMessage: 'Minimum stay: 1 night',
      });
    } else {
      let [month, date, year] = this.state.checkInDate.split('/');
      let checkInDateTransformed = new Date(
        Number(year),
        Number(month) - 1,
        Number(date)
      );
      let [month2, date2, year2] = e.target.name.split('/');
      let checkOutDateTransformed = new Date(
        Number(year2),
        Number(month2) - 1,
        Number(date2)
      );

      const formatForCalendarMessage = (dateString) => {
        let dateSplit = dateString.toLocaleDateString().split('/');

        return `${months[Number(dateSplit[0]) - 1].slice(0, 3)} ${
          dateSplit[1]
        }, ${dateSplit[2]}`;
      };

      let formattedCheckIn = formatForCalendarMessage(checkInDateTransformed);
      let formattedCheckOut = formatForCalendarMessage(checkOutDateTransformed);

      if (checkOutDateTransformed - checkInDateTransformed < 0) {
        this.setState({ checkOutDate: '' });
      } else {
        this.setState({
          checkOutDate: e.target.name,
          calendarMessage: `${(
            (checkOutDateTransformed - checkInDateTransformed) /
            1000 /
            86400
          ).toFixed(0)} nights in {location}`,
          calendarSubMessage: `${formattedCheckIn} - ${formattedCheckOut}`,
          checkoutButtonText: 'Reserve',
        });
      }
    }
  }

  clearDates() {
    this.setState({
      checkInDate: '',
      checkOutDate: '',
      calendarMessage: 'Select check-in date',
      calendarSubMessage: 'Add your travel dates for exact pricing',
      checkoutButtonText: 'Check availability',
    });
  }

  changeSlider(e) {
    if (e.target.getAttribute('name') === 'left') {
      this.setState({ direction: 'left' });
      if (this.state.sliderPosition > 0) {
        this.setState({ sliderPosition: --this.state.sliderPosition });
      }
    } else {
      this.setState({
        sliderPosition: ++this.state.sliderPosition,
        direction: 'right',
      });
    }
  }

  toggleGuestSelection() {
    this.setState({ guestSelectionClicked: !this.state.guestSelectionClicked });
    let guestSelectionPopupElement = React.createElement(
      'div',
      null,
      React.createElement('label', null, 'enter name'),
      React.createElement('input', {
        onChange: this.onInputChange,
        type: 'text',
        placeholder: "what's your name",
      })
    );
    ReactDOM.reander(guestSelectionClicked, document.getElementById('guest-selection-container'))
  }

  render() {
    const {
      checkInDate,
      checkOutDate,
      monthsInAdvance,
      pricePerNight,
      cleaningFee,
      serviceFee,
      occupancyFee,
      selectedAdults,
      selectedChildren,
      selectedInfants,
      calendarMessage,
      calendarSubMessage,
      sliderPosition,
      direction,
      checkoutButtonText,
      guestSelectionClicked,
    } = this.state;
    let [month, date, year] = new Date().toLocaleDateString('en-US').split('/');

    return (
      <div id="main-checkout-container">
        <DisplayCalendar
          currentDate={date}
          currentMonth={month}
          currentYear={year}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          monthsInAdvance={monthsInAdvance}
          calendarMessage={calendarMessage}
          calendarSubMessage={calendarSubMessage}
          sliderPosition={sliderPosition}
          direction={direction}
          selectDate={this.selectDate}
          clearDates={this.clearDates}
          changeSlider={this.changeSlider}
        />
        <CheckoutTool
          currentMonth={month}
          currentYear={year}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          totalReviews={totalReviewCount}
          pricePerNight={pricePerNight}
          serviceFee={serviceFee}
          cleaningFee={cleaningFee}
          occupancyFee={occupancyFee}
          selectedAdults={selectedAdults}
          selectedChildren={selectedChildren}
          selectedInfants={selectedInfants}
          checkoutButtonText={checkoutButtonText}
          guestSelectionClicked={guestSelectionClicked}
          guestsAllowed={numberOfGuests.numberOfGuests}
          averageReviews={averageReviewRatings.averageRating}
          toggleGuestSelection={this.toggleGuestSelection}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('checkoutCalendar'));
