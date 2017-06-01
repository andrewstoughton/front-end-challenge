import React from 'react';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';

import Summary from './summary';
 
export default class Patient extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // debugger;
  }

  componentDidMount() {
    // debugger;
  }

  render() {
    let age = this._patientAge(this.props.birthDate);
    
    return (
      <tr>
        <td>{this.props.name}</td>
        <td>{age}</td>
        <td>{this.props.bmi}</td>
        <td><a onClick={this._displaySummary.bind(this)}>patient summary</a></td>
      </tr>
    );
  }

  _displaySummary() {
    ReactDOM.render(
      <Summary
        id={this.props.id}
        summary={this.props.summary}
        gender={this.props.gender}
        heightCm={this.props.heightCm}
        weightKg={this.props.weightKg}
        age={this._patientAge(this.props.birthDate)}
        name={this.props.name}
        thresholdMet={this.props.thresholdMet}
        key={this.props.id} />,
      document.getElementById('patient-summary')
    );
  }

  _patientAge(birthDate) {
    var birth = new Date(birthDate);
    var ageDifMs = Date.now() - birth.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}