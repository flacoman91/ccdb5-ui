import './RowChart.less'
import * as d3 from 'd3'
import { connect } from 'react-redux'
import { max } from 'd3-array'
import React from 'react'
import { row } from 'britecharts'

export class RowChart extends React.Component {
  constructor( props ) {
    super( props )
    const aggType = props.aggtype
    this.aggtype = aggType
    // only capitalize first letter
    this.chartTitle = aggType.charAt( 0 ).toUpperCase() + aggType.slice( 1 )
  }

  _getHeight( numRows ) {
    return numRows === 1 ? 100 : numRows * 60
  }

  _wrapText( text, width ) {
    // ignore test coverage since this is code borrowed from d3 mbostock
    // text wrapping functions
    /* istanbul ignore next */
    // eslint-disable-next-line complexity
    text.each( function() {
      const innerText = d3.select( this )
      if ( innerText.node().children && innerText.node().children.length > 0 ) {
        // assuming its already split up
        return
      }
      const words = innerText.text().split( /\s+/ ).reverse(),
            // ems
            lineHeight = 1.1,
            y = innerText.attr( 'y' ) || 0,
            dy = parseFloat( innerText.attr( 'dy' ) || 0 )

      let word,
          line = [],
          lineNumber = 0,
          tspan = innerText.text( null ).append( 'tspan' ).attr( 'x', 0 )
            .attr( 'y', y ).attr( 'dy', dy + 'em' )

      // eslint-disable-next-line no-cond-assign
      while ( word = words.pop() ) {
        line.push( word )
        tspan.text( line.join( ' ' ) )
        if ( tspan.node().getComputedTextLength() > width ) {
          line.pop()
          tspan.text( line.join( ' ' ) )
          line = [ word ]
          tspan = innerText.append( 'tspan' )
            .attr( 'x', 0 )
            .attr( 'y', y )
            // eslint-disable-next-line no-mixed-operators
            .attr( 'dy', ++lineNumber * lineHeight + dy + 'em' )
            .text( word )
        }
      }
    } )
  }


  componentDidUpdate() {
    this._redrawChart()
  }

  // --------------------------------------------------------------------------
  // Event Handlers
  // eslint-disable-next-line complexity
  _redrawChart() {
    const componentProps = this.props
    const { data, printMode } = componentProps
    if ( !data || !data.length ) {
      return
    }

    const rowData = data.slice( 0, 5 )
    const total = this.props.total
    const ratio = total / max( rowData, o => o.value )
    const chartID = '#row-chart-' + this.aggtype
    d3.select( chartID + ' .row-chart' ).remove()
    const rowContainer = d3.select( chartID )
    const width = printMode ? 750 :
      rowContainer.node().getBoundingClientRect().width
    const height = this._getHeight( rowData.length )
    const chart = row()
    const marginLeft = width / 3

    // tweak to make the chart full width at desktop
    // add space at narrow width
    const marginRight = width < 600 ? 20 : -80
    const colorScheme = rowData.map( () => '#20aa3f' )

    chart.margin( {
      left: marginLeft,
      right: marginRight,
      top: 20,
      bottom: 10
    } )
      .colorSchema( colorScheme )
      .backgroundColor( '#f7f8f9' )
      .enableLabels( true )
      .labelsTotalCount( total.toLocaleString() )
      .labelsNumberFormat( ',d' )
      .outerPadding( 0.1 )
      .percentageAxisToMaxRatio( ratio )
      .yAxisLineWrapLimit( 2 )
      .yAxisPaddingBetweenChart( 5 )
      .width( width )
      .wrapLabels( true )
      .height( height )

    rowContainer.datum( rowData ).call( chart )
    this._wrapText( d3.select( chartID ).selectAll( '.tick text' ), marginLeft )
  }

  render() {
    return (
      <div className="row-chart-section">
        <h3>{ this.chartTitle } by highest complaint volume</h3>
        <div id={ 'row-chart-' + this.aggtype }>
        </div>
      </div>
    )
  }
}

export const mapStateToProps = ( state, ownProps ) => {
  const { printMode, width } = state.view
  // use state.query to rip filter out the bars
  const aggtype = ownProps.aggtype
  const filters = state.query[aggtype]
  let data = state.map[aggtype]

  if ( filters && filters.length ) {
    data = data.filter( o => filters.includes( o.name ) )
  }
  return {
    data,
    printMode,
    total: state.aggs.total,
    width
  }
}

export default connect( mapStateToProps )( RowChart )
