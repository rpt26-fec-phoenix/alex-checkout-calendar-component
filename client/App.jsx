import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import { DisplayCalendar } from './components/DisplayCalendar/DisplayCalendar';
import CheckoutTool from './components/CheckoutTool/CheckoutTool';

import { numberOfGuests, totalReviewCount, averageReviewRatings } from '../sampleData/sampleData';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkInDate: '',
      checkOutdate: '',
      pricePerNight: '',
      cleaningFee: '',
      serviceFee: '',
      occupancyFee: '',
      selectedAdults: 1,
      selectedChildren: 0,
      selectedInfants: 0

    };
  }

  componentDidMount() {
    let productId = window.location.pathname.split('/')[1];

    axios.get(`/checkoutInformation/${productId}`)
      .then(response => {
        this.setState({
          pricePerNight: response.data.pricePerDate,
          serviceFee: response.data.serviceFee,
          cleaningFee: response.data.cleaningFee,
        });
      });
  }

  render() {
    const { checkInDate, checkOutdate, pricePerNight, cleaningFee, serviceFee, occupancyFee, selectedAdults, selectedChildren, selectedInfants } = this.state;

    return (
      <div>
        <DisplayCalendar checkInDate={checkInDate} checkInDate={checkOutdate}/>
        <CheckoutTool checkInDate={checkInDate} checkInDate={checkOutdate} guestsAllowed={numberOfGuests.numberOfGuests} totalReviews={totalReviewCount} averageReviews={averageReviewRatings.averageRating} pricePerNight={pricePerNight} serviceFee={serviceFee} cleaningFee={cleaningFee} selectedAdults={selectedAdults} selectedChildren={selectedChildren} selectedInfants={selectedInfants}/>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));