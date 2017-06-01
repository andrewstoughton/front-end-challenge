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

    this.store = {
      activities: [],
      patients: []
    }
  }

  componentDidMount() {
    // debugger;
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

      this.store.activities = activities;
      this.store.patients = patients;
      this.store.sortedActivities = this._sortActivities(activities);
      this.store.mappedActivities = this._mapActivities(activities);
      
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
    let caption = 'All patients';
    let buttonText = 'See patients not meeting recommended level of physical activity';
    let buttonClass = 'button-primary';
    let length = 0;
    let i = 0;

    for (; i < patients.length; i += 1) {
      if (patients[i] !== undefined) {
        length ++;
      }
    } 

    if (!this.state.allPatients) {
      caption = 'Patients falling below recommended level of physical activity';
      buttonText = 'See all patients';
      buttonClass = '';
    }

    return (
      <div className="patient-app">
        <h1>Hospital Trial</h1>
        <p>Patient activity summary for {today}</p>
        <p>
          <button className={buttonClass} onClick={this._togglePatients.bind(this)}>{buttonText}</button>
        </p>
        <h2>{caption}</h2>
        <div className="row">
          <div className="six columns">
            <table className="u-full-width">
              <thead>
                <tr>
                  <th>name</th>
                  <th>age</th>
                  <th>bmi</th>
                  <th>summary</th>
                </tr>
              </thead>
              <tbody>
                {patients}
              </tbody>
            </table>
            <p>Patient count: {length}</p>
          </div>
          <div className="six columns" id="patient-summary">
          </div>
        </div>
      </div>
    );
  }

  _togglePatients(e) {
    e.preventDefault();

    document.getElementById('patient-summary').innerHTML = '';

    this.setState({
      allPatients: !this.state.allPatients
    });
  }

  _getIntensity(activity) {
    return this.store.mappedActivities[activity];
  }

  _checkPatientLevels(patient) {
    const LOW = 300,
      MODERATE = 150,
      VIGOROUS = 75,
      SUMMARY = patient.summary,
      x = patient.summary.length;
    let i = 0,
      log = {},
      intensity = '',
      activity = {},
      moderateMinutes = 0,
      vigorousMinutes = 0;

    for (; i < x; i += 1) {
      activity = SUMMARY[i];
      intensity = this._getIntensity(activity.activity);
      
      if (intensity === 'vigorous') {
        vigorousMinutes += activity.minutes;
      }

      if (intensity === 'moderate') {
        moderateMinutes += activity.minutes;
      }
    }

    if (vigorousMinutes < VIGOROUS || moderateMinutes < MODERATE) {
      if ((vigorousMinutes / VIGOROUS) + (moderateMinutes / MODERATE) < 1) {
        return false;
      }
    }

    return true;
  }

  _sortActivities(activities) {
    let sorted = {},
      i = 0,
      x = activities.length;

    for (; i < x; i += 1) {
      let activity = activities[i];
      if (!sorted[activity.intensity]) {
        sorted[activity.intensity] = [];
      }
      sorted[activity.intensity].push(activity.activity);
    }

    return sorted;
  }

  _mapActivities(activities) {
    let map = {};
    activities.map((activity) => {
      map[activity.activity] = activity.intensity;
    });
    return map;
  }

  _getPatients(allPatients) {
    let thresholdMet = false;
    return this.state.patients.map((patient) => {
      if (patient.summary) {
        thresholdMet = this._checkPatientLevels(patient);
      }
      if (allPatients || (!allPatients && !thresholdMet)) {
        return <Patient
          id={patient.id}
          birthDate={patient.birthDate}
          bmi={patient.bmi}
          gender={patient.gender}
          heightCm={patient.heightCm}
          name={patient.name}
          weightKg={patient.weightKg}
          summary={patient.summary}
          thresholdMet={thresholdMet}
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