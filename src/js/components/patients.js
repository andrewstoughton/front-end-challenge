import React from 'react';
import jQuery from 'jquery';
 
export default class Patients extends React.Component {
  
  render() {
    return (
      <div>
        <table className="u-full-width">
          <thead>
            <tr>
              <th>birthDate</th>
              <th>bmi</th>
              <th>gender</th>
              <th>heightCm</th>
              <th>id</th>
              <th>name</th>
              <th>weightKg</th>
            </tr>
          </thead>
          <tbody>
            <Patient />
          </tbody>
        </table>
      </div>
    );
  }
}