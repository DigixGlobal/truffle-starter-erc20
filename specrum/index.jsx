import React, { PropTypes, Component } from 'react';

import MyToken from '../contracts/MyToken.sol';

const network = Object.keys(MyToken.networks)[0];
const { address } = MyToken.networks[network];

export default class MyDapplet extends Component {
  render() {
    return (
      <p>Howdy {address}</p>
    );
  }
}

MyDapplet.propTypes = {

};
