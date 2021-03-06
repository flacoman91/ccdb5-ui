import { connect } from 'react-redux'
import React from 'react'
import Warning from './Warning'

const WARN_DATA_ISSUE = 'We’re currently experiencing technical issues that' +
  ' have delayed the refresh of data on the Consumer Complaint Database.  We' +
  ' expect to refresh the data in the next few days.'

const WARN_NARRATIVES_STALE = 'We’re currently experiencing technical issues' +
  ' that have delayed the refresh of consumer complaint narratives on the ' +
  'Consumer Complaint Database.  We expect to refresh the data in the next ' +
  'few days.'

const WARN_DATA_STALE = 'We’re currently experiencing technical issues that' +
  ' have delayed the refresh of data in the ' +
  'Consumer Complaint Database.  We expect to refresh the data in the next ' +
  'few days.'

export class StaleDataWarnings extends React.Component {
  // eslint-disable-next-line complexity
  render() {
    const { hasDataIssue, isDataStale, isNarrativeStale } = this.props;
    const anything = hasDataIssue || isDataStale || isNarrativeStale;

    if ( !anything ) return null;

    return (
      <div>
        { hasDataIssue && <Warning text={ WARN_DATA_ISSUE } /> }
        { isDataStale && <Warning text={ WARN_DATA_STALE } /> }
        { isNarrativeStale && !isDataStale &&
          <Warning text={ WARN_NARRATIVES_STALE } />
        }
      </div>
    )
  }
}

const mapStateToProps = state => ( {
  hasDataIssue:  state.aggs.hasDataIssue,
  isDataStale:  state.aggs.isDataStale,
  isNarrativeStale: state.aggs.isNarrativeStale
} )

export default connect( mapStateToProps )( StaleDataWarnings )
