import React from 'react';
 
export default class Summary extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let activities = this._getActivities();
    let thresholdMet = '';
    if (!this.props.thresholdMet) {
      thresholdMet = 'NOT';
    }
    return (
      <div className="patient-summary">
        <h3>{this.props.name}</h3>
        <p><em>patient number: {this.props.id}</em></p>
        <p>
          Is <strong>{thresholdMet}</strong> meeting recommended level of physical activity.
        </p>
        <div className="row">
          <div className="six columns">
            <ul>
            <li>Age: {this.props.age}</li>
            <li>Gender: {this.props.gender}</li>
            <li>Height: {this.props.heightCm}</li>
            <li>Weight: {this.props.weightKg}</li>
          </ul>
          </div>
          <div className="six columns">
            <ul>
              {activities}
            </ul>
          </div>
        </div>        
      </div>
    );
  }

  _getActivities() {
    return this.props.summary.map((activity) => {
      return <li key={activity.activity}>
        {activity.activity}: {activity.minutes} mins
      </li>
    });
  }
}