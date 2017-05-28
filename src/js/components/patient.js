import React from 'react';
 
export default class Patient extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let age = this._patientAge(this.props.birthDate);
    return (
      <tr>
        <td>{this.props.birthDate}</td>
        <td>{this.props.bmi}</td>
        <td>{this.props.gender}</td>
        <td>{this.props.heightCm}</td>
        <td>{this.props.id}</td>
        <td>{this.props.name}</td>
        <td>{this.props.weightKg}</td>
        <td>{age}</td>
      </tr>
    );
  }

  _patientAge(birthDate) {
    var birth = new Date(birthDate);
    var ageDifMs = Date.now() - birth.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}