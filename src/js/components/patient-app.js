import React from 'react';
import jQuery from 'jquery';

import Patient from './patient';
import activities from '../data/activities';
import patients from '../data/patients';
 
export default class PatientApp extends React.Component {  
  constructor(props) {
    super(props);

    this.state = {
      patients: [],
      filters: {
        MODERATE: 150,
        VIGOROUS: 75
      },
      allPatients: true,
      date: new Date(),
      activities: {},
      summaries: []
    };
  }
  
  componentWillMount() {
    let i = 0;
    let _patients = [];

    jQuery.when(this._fetchPatients(), this._fetchActivities())
    .done((patients, activities) => {
      let activitiesMap = {};
      activities.map((activity) => {
        activitiesMap[activity.activity] = activity.intensity;
      });
      
      _patients = patients;
      for (; i < _patients.length; i += 1) {
        let _patient = _patients[i];
        this._fetchSummary(_patient.id).done((summary) => {
          _patient.summary = summary;
          _patient.summary.id = _patient.id;
          this.setState({ patients: _patients });
        });
      }

      this.setState({ patients: _patients, activities: activitiesMap });
    });
  }
  
  render() {
    const today = new Date().toDateString();
    let patients = this._getPatients(this.state.allPatients);
    let caption = 'all patients';
    let buttonText = 'Apply';
    let buttonClass = 'button-primary';

    if (!this.state.allPatients) {
      caption = 'patients falling below recommended level of physical activity';
      buttonText = 'Remove';
      buttonClass = '';
    }

    return (
      <div className="patient-app">
        <h2>Hospital Trial Participants</h2>
        <p>Showing <strong>{caption}</strong> for <strong>{today}</strong></p>
        <button className={buttonClass} onClick={this._togglePatients.bind(this)}>{buttonText} filter</button>
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
              <th>age</th>
            </tr>
          </thead>
          <tbody>
            {patients}
          </tbody>
        </table>
      </div>
    );
  }

  _togglePatients(e) {
    e.preventDefault();

    this.setState({
      allPatients: !this.state.allPatients
    });
  }

  _getPatients(allPatients) {
    return this.state.patients.map((patient) => {
      if (allPatients || (!allPatients && patient.summary[1].activity === 'walking')) {
        return <Patient
          id={patient.id}
          birthDate={patient.birthDate}
          bmi={patient.bmi}
          gender={patient.gender}
          heightCm={patient.heightCm}
          name={patient.name}
          weightKg={patient.weightKg}
          age={patient.age}
          key={patient.id} />
      }
    });
  }

  _fetchActivities() {
    let deferred = jQuery.Deferred();

    jQuery.ajax({
      method: 'GET',
      url: '/mock-api-data/definitions/activities.json',
      success: (activities) => {
        deferred.resolve(activities);
      }
    });

    return deferred.promise();
  }

  _fetchPatients() {
    let deferred = jQuery.Deferred();

    jQuery.ajax({
      method: 'GET',
      url: '/mock-api-data/patients.json',
      success: (patients) => {
        deferred.resolve(patients);
      }
    });

    return deferred.promise();
  }

  _fetchSummary(id) {
    let deferred = jQuery.Deferred();

    jQuery.ajax({
      method: 'GET',
      url: `/mock-api-data/patients/${id}/summary.json`,
      success: (summary) => {
        deferred.resolve(summary);
      }
    });

    return deferred.promise();
  }
}