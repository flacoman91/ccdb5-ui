import 'core-js/es6/array'
import 'core-js/es6/object'
import 'core-js/es6/set'
import 'core-js/es7/object'

import * as d3 from 'd3'
import accessibility from 'highcharts/modules/accessibility';
import Highcharts from 'highcharts/highmaps';
import { STATE_TILES } from './constants'

const TEN_K = 10000
const HUN_K = 100000
const MILLION = 1000000

const WHITE = '#ffffff';

/* ----------------------------------------------------------------------------
   Utility Functions */

/**
* Creates N evenly spaced ranges in the data
*
* @param {Array} data all of the states w/ displayValue, complaintCount, raw
* @param {Array} colors an array of colors
* @returns {Array} floating point numbers that mark the max of each range
*/
export function makeScale( data, colors ) {
  const allValues = data.map( x => x.displayValue )
  const uniques = new Set( allValues )

  let scale = d3.scaleQuantile().range( [ WHITE, ...colors ] )
  // This catches the condition where all the complaints are in one state
  if ( uniques.size < colors.length ) {
    scale = scale.domain( [ ...uniques ] )
  } else {
    scale = scale.domain( allValues )
  }

  return scale
}

/**
* Creates a shorter version of a number. 1,234 => 1.2K
*
* @param {Number} value the raw value
* @returns {string} A string representing a shortened value
*/
export function makeShortName( value ) {
  if ( value < 1000 ) {
    return value.toLocaleString();
  } else if ( value < TEN_K ) {
    return ( Math.floor( value / 100 ) / 10 ).toFixed( 1 ) + 'K'
  } else if ( value < MILLION ) {
    return Math.floor( value / 1000 ) + 'K'
  }

  return ( Math.floor( value / HUN_K ) / 10 ).toFixed( 1 ) + 'M'
}

/* ----------------------------------------------------------------------------
   Bin Functions */

/**
* helper function to get the bins for legend and colors, etc.
*
* @param {Array} quantiles floats that mark the max of each range
* @param {Function} scale scaling function for color
* @returns {Array} the bins with bounds, name, and color
*/
export function getBins( quantiles, scale ) {
  const rounds = quantiles.map( x => Math.round( x ) )
  const ceils = quantiles.map( x => Math.ceil( x ) )
  const mins = Array.from( new Set( rounds ) ).filter( x => x > 0 )

  const bins = [
    { from: 0, color: '#fff', name: '≥ 0', shortName: '≥ 0' }
  ];

  mins.forEach( minValue => {
    // The color is the equivalent ceiling from the floor
    const i = rounds.indexOf( minValue )

    const prefix = ceils[i] === minValue ? '≥' : '>'
    const displayValue = minValue.toLocaleString();
    const shortened = makeShortName( minValue )

    bins.push( {
      from: minValue,
      color: scale( ceils[i] ),
      name: `${ prefix } ${ displayValue }`,
      shortName: `${ prefix } ${ shortened }`
    } );
  } )

  return bins
}

/**
* helper function to get the Per 1000 population bins for legend and colors
*
* @param {Array} quantiles floats that mark the max of each range
* @param {Function} scale scaling function for color
* @returns {Array} the bins with bounds, name, and color
*/
export function getPerCapitaBins( quantiles, scale ) {
  const trunc100 = x => Math.floor( x * 100 ) / 100

  const values = quantiles.map( x => trunc100( x ) )
  const mins = Array.from( new Set( values ) ).filter( x => x > 0 )

  const bins = [
    { from: 0, color: '#fff', name: '≥ 0', shortName: '≥ 0' }
  ];

  mins.forEach( minValue => {
    // The color is the equivalent quantile
    const i = values.indexOf( minValue )

    const prefix = values[i] === quantiles[i] ? '≥' : '>'
    const displayValue = minValue.toFixed( 2 );
    const name = `${ prefix } ${ displayValue }`
    bins.push( {
      from: minValue,
      color: scale( quantiles[i] ),
      name,
      shortName: name
    } );
  } )

  return bins
}

/* ----------------------------------------------------------------------------
   Utility Functions 2 */
/**
 * @param {Object} data - Data to process. add in state paths to the data obj
 * @param {Function} scale scaling function for color
 * @returns {Object} The processed data.
 */
export function processMapData( data, scale ) {
  // Filter out any empty values just in case
  data = data.filter( function( row ) {
    return Boolean( row.name );
  } );

  data = data.map( function( obj ) {
    const path = STATE_TILES[obj.name];
    return {
      ...obj,
      color: getColorByValue( obj.displayValue, scale ),
      path
    };
  } );

  return data;
}

/**
 * helper function to set the color.
 *
 * Highcharts could normally handle it, but it gets confused by values
 * less than 1 that are frequently encountered in perCapita
 *
 * Also, walk through the array backwards to pick up the most saturated
 * color. This helps the "only three values" case
 *
 * @param {number} value the number of complaints or perCapita
 * @param {Function} scale scaling function for color
 * @returns {string} color hex or rgb code for a color
 */
export function getColorByValue( value, scale ) {
  if ( !value ) return WHITE

  return scale( value );
}

/* ----------------------------------------------------------------------------
   Highcharts callbacks */

/**
* callback function for reporting the series point in a voiceover text
*
* @param {Object} p the point in the series
* @returns {string} the text to speak
*/
export function pointDescriptionFormatter( p ) {
  return `${ p.fullName } ${ p.displayValue }`
}

/**
 * callback function to format the individual tiles in HTML
 * @returns {string} html output
 */
export function tileFormatter() {
  let iePatch = ''
  if ( navigator.userAgent.indexOf( 'MSIE' ) !== -1 ||
    navigator.appVersion.indexOf( 'Trident/' ) > -1 ) {
    iePatch = '<br />'
  }

  const value = this.point.displayValue.toLocaleString();
  return '<div class="highcharts-data-label-state">' +
    '<span class="abbr">' + this.point.name + '</span>' +
    iePatch +
    '<span class="value">' + value + '</span>' +
    '</div>';
}

/**
 * callback function to format the tooltip in HTML
 * @returns {string} html output
 */
export function tooltipFormatter() {
  const product = this.product ? '<div class="row u-clearfix">' +
    '<p class="u-float-left">Product with highest complaint volume</p>' +
    '<p class="u-right">' + this.product + '</p>' +
    '</div>' : '';

  const issue = this.issue ? '<div class="row u-clearfix">' +
    '<p class="u-float-left">Issue with highest complaint volume</p>' +
    '<p class="u-right">' + this.issue + '</p>' +
    '</div>' : '';

  const value = this.value.toLocaleString();
  const perCapita = this.perCapita ? '<div class="row u-clearfix">' +
    '<p class="u-float-left">Per 1000 population</p>' +
    '<p class="u-right">' + this.perCapita + '</p>' +
    '</div>' : '';

  return '<div class="title">' + this.fullName + '</div>' +
    '<div class="row u-clearfix">' +
    '<p class="u-float-left">Complaints</p>' +
    '<p class="u-right">' + value + '</p>' +
    '</div>' +
    perCapita +
    product +
    issue;
}

/**
 * Draw a legend on a chart.
 * @param {Object} chart A highchart chart.
 */
export function _drawLegend( chart ) {
  const bins = chart.options.bins;
  let boxWidth = 65;
  const boxHeight = 17;
  let boxPadding = 5;

  const beCompact = chart.chartWidth < 600;
  if ( beCompact ) {
    boxWidth = 45;
    boxPadding = 1;
  }

  /* https://api.highcharts.com/class-reference/Highcharts.SVGRenderer#label
     boxes and labels for legend buckets */
  // main container
  const legendContainer = chart.renderer.g( 'legend-container' )
    .add();

  const legendText = chart.renderer.g( 'legend-title' )
    .translate( boxPadding, 0 )
    .add( legendContainer );
  // key
  chart.renderer
    .label( 'Key', 0, 0, null, null, null, true, false, 'legend-key' )
    .add( legendText );

  // horizontal separator line
  const sepWidth = bins.length * ( boxWidth + boxPadding );
  chart.renderer.path( [ 'M', 0, 0, 'L', sepWidth, 0 ] )
    .attr( {
      'class': 'separator',
      'stroke-width': 1,
      'stroke': 'gray'
    } )
    .translate( 0, 25 )
    .add( legendText );

  // what legend represents
  const labelTx = 'Map shading: <span class="type">' +
    chart.options.legend.legendTitle + '</span>';
  chart.renderer
    .label( labelTx, 0, 28, null, null, null, true, false,
      'legend-description' )
    .add( legendText );

  // bars
  const legend = chart.renderer.g( 'legend__tile-map' )
    .translate( 7, 50 )
    .add( legendContainer );

  for ( let i = 0; i < bins.length; i++ ) {
    const g = chart.renderer.g( `g${ i }` )
      .translate( i * ( boxWidth + boxPadding ), 0 )
      .add( legend );

    const bin = bins[i];

    chart.renderer
      .rect( 0, 0, boxWidth, boxHeight )
      .attr( { fill: bin.color } )
      .addClass( 'legend-box' )
      .add( g );

    chart.renderer
      .text( beCompact ? bin.shortName : bin.name, 0, boxHeight )
      .addClass( 'legend-text' )
      .translate( 3, -3 )
      .add( g );
  }
}

/* ----------------------------------------------------------------------------
   Tile Map class */

accessibility( Highcharts );

Highcharts.setOptions( {
  lang: {
    thousandsSep: ','
  }
} );

const colors = [
  'rgba(247, 248, 249, 0.5)',
  'rgba(212, 231, 230, 0.5)',
  'rgba(180, 210, 209, 0.5)',
  'rgba(137, 182, 181, 0.5)',
  'rgba(86, 149, 148, 0.5)',
  'rgba(37, 116, 115, 0.5)'
];

/* ----------------------------------------------------------------------------
   Tile Map class */

class TileMap {
  constructor( { el, data, isPerCapita, events, height, width } ) {
    const scale = makeScale( data, colors )
    const quantiles = scale.quantiles()

    let bins, legendTitle
    if ( isPerCapita ) {
      bins = getPerCapitaBins( quantiles, scale )
      legendTitle = 'Complaints per 1,000'
    } else {
      bins = getBins( quantiles, scale )
      legendTitle = 'Complaints'
    }

    data = processMapData( data, scale );

    const options = {
      bins,
      chart: {
        styledMode: true,
        height,
        width
      },
      colors,
      colorAxis: {
        dataClasses: bins,
        dataClassColor: 'category'
      },
      title: false,
      credits: false,
      legend: {
        enabled: false,
        legendTitle
      },
      tooltip: {
        className: 'tooltip',
        enabled: true,
        headerFormat: '',
        pointFormatter: tooltipFormatter,
        useHTML: true
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            formatter: tileFormatter,
            useHTML: true
          }
        }
      },

      series: [ {
        type: 'map',
        clip: false,
        data: data,
        accessibility: {
          description: legendTitle + ' in the United States',
          exposeAsGroupOnly: false,
          keyboardNavigation: { enabled: true },
          pointDescriptionFormatter: pointDescriptionFormatter
        }
      } ]
    };

    // our custom passing of information
    if ( events ) {
      options.plotOptions.series.events = events;
    }

    // to adjust for legend height
    const mapBreakpoints = [
      { width: 700, legendHeight: 15 },
      { width: 580, legendHeight: 20 },
      { width: 500, legendHeight: 30 },
      { width: 400, legendHeight: 40 },
      { width: 370, legendHeight: 55 }
    ]

    let legendHeight = 10

    mapBreakpoints.forEach( item => {
      if ( width < item.width ) {
        legendHeight = item.legendHeight
      }
    } )

    options.chart.marginRight = 0
    options.chart.marginLeft = 0
    options.chart.marginTop = legendHeight
    options.chart.height += legendHeight

    this.draw( el, options );
  }

  draw( el, options ) {
    Highcharts.mapChart( el, options, _drawLegend );
  }
}

export default TileMap;
