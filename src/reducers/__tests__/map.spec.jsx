import target, {
  defaultState,
  processStateAggregations
} from '../map'
import actions from '../../actions'
import stateAggs from '../__fixtures__/stateAggs'
import { GEO_NORM_NONE } from '../../constants'

describe( 'reducer:map', () => {
  let action

  describe( 'reducer', () => {
    it( 'has a default state', () => {
      expect( target( undefined, {} ) ).toEqual( {
        activeCall: '',
        dataNormalization: GEO_NORM_NONE,
        expandedTrends: [],
        expandableRows: [],
        isLoading: false,
        results: {
          issue: [],
          product: [],
          state: []
        }
      } )
    } )
  } )

  describe( 'handles DATA_NORMALIZATION_SELECTED', () => {
    action = {
      type: actions.DATA_NORMALIZATION_SELECTED,
      value: 'FooBar'
    }
    expect( target( {}, action ) ).toEqual( {
      dataNormalization: 'FooBar'
    } )
  } )

  describe( 'DATE_RANGE_CHANGED', () => {

    it( 'handles date_received', () => {
      action = {
        type: actions.DATE_RANGE_CHANGED,
        filterName: 'date_received',
        minDate: 'foo',
        maxDate: 'bar'
      }
      expect( target( { dataNormalization: 'FooBar' }, action ) ).toEqual( {
        dataNormalization: 'FooBar'
      } )
    } )

    it( 'handles company_received', () => {
      action = {
        type: actions.DATE_RANGE_CHANGED,
        filterName: 'company_received',
        minDate: 'foo',
        maxDate: 'bar'
      }
      expect( target( { dataNormalization: 'FooBar' }, action ) ).toEqual( {
        dataNormalization: GEO_NORM_NONE
      } )
    } )

    it( 'handles company_received null vals', () => {
      action = {
        type: actions.DATE_RANGE_CHANGED,
        filterName: 'company_received',
        minDate: null,
        maxDate: null
      }
      expect( target( { dataNormalization: 'FooBar' }, action ) ).toEqual( {
        dataNormalization: 'FooBar'
      } )
    } )
  } )

  describe( 'handles FILTER_CHANGED', () => {
    action = {
      type: actions.FILTER_CHANGED,
      value: 'FooBar'
    }
    expect( target( { dataNormalization: 'FooBar' }, action ) ).toEqual( {
      dataNormalization: GEO_NORM_NONE
    } )
  } )

  describe( 'handles FILTER_MULTIPLE_ADDED', () => {
    action = {
      type: actions.FILTER_MULTIPLE_ADDED,
      value: 'FooBar'
    }
    expect( target( { dataNormalization: 'FooBar' }, action ) ).toEqual( {
      dataNormalization: GEO_NORM_NONE
    } )
  } )

  describe( 'handles STATE_FILTER_ADDED', () => {
    action = {
      type: actions.STATE_FILTER_ADDED,
      value: 'FooBar'
    }
    expect( target( { dataNormalization: 'FooBar' }, action ) ).toEqual( {
      dataNormalization: GEO_NORM_NONE
    } )
  } )

  describe( 'handles STATES_API_CALLED actions', () => {
    action = {
      type: actions.STATES_API_CALLED,
      url: 'http://www.example.org'
    }
    expect( target( {}, action ) ).toEqual( {
      activeCall: 'http://www.example.org',
      isLoading: true
    } )
  } )

  describe( 'STATES_RECEIVED actions', () => {
    beforeEach( () => {
      action = {
        type: actions.STATES_RECEIVED,
        data: {
          aggregations: stateAggs
        }
      }
    } )


    it( 'maps data to object state', () => {
      const result = target( {}, action )
      expect( result ).toEqual( {
        activeCall: '',
        isLoading: false,
        results: {
          state: [
            { name: "CA", value: 62519, issue: "issue o", product: "fo prod" },
            { name: "FL", value: 47358, issue: "issue o", product: "fo" },
            { name: "TX", value: 44469, issue: "issue o", product: "fo rod" },
            { name: "GA", value: 28395, issue: "issue o", product: "fo prod" },
            { name: "NY", value: 26846, issue: "issue o", product: "fo prod" },
            { name: "IL", value: 18172, issue: "issue o", product: "fo prd" },
            { name: "PA", value: 16054, issue: "issue o", product: "fo prod" },
            { name: "NC", value: 15217, issue: "issue o", product: "fo prod" },
            { name: "NJ", value: 15130, issue: "issue o", product: "fo prod" },
            { name: "OH", value: 14365, issue: "issue o", product: "fo prod" },
            { name: "VA", value: 12901, issue: "issue o", product: "fo prod" },
            { name: "MD", value: 12231, issue: "issue o", product: "fo prod" },
            { name: "MI", value: 10472, issue: "issue o", product: "fo prod" },
            { name: "AZ", value: 10372, issue: "issue o", product: "fo prod" },
            { name: "TN", value: 9011, issue: "issue o", product: "fo prod" },
            { name: "WA", value: 8542, issue: "issue o", product: "fo prod" },
            { name: "MA", value: 8254, issue: "issue o", product: "fo prod" },
            { name: "MO", value: 7832, issue: "issue o", product: "fo prod" },
            { name: "SC", value: 7496, issue: "issue o", product: "fo prod" },
            { name: "CO", value: 7461, issue: "issue o", product: "fo prod" },
            { name: "NV", value: 7095, issue: "issue o", product: "fo prod" },
            { name: "LA", value: 6369, issue: "issue o", product: "fo prod" },
            { name: "AL", value: 6178, issue: "issue o", product: "fo prod" },
            { name: "IN", value: 5659, issue: "issue o", product: "fo prod" },
            { name: "MN", value: 4957, issue: "issue o", product: "fo prod" },
            { name: "CT", value: 4685, issue: "issue o", product: "fo prod" },
            { name: "WI", value: 4443, issue: "issue o", product: "fo prod" },
            { name: "OR", value: 4261, issue: "issue o", product: "fo prod" },
            { name: "UT", value: 3693, issue: "issue o", product: "fo prod" },
            { name: "KY", value: 3392, issue: "issue o", product: "fo prod" },
            { name: "MS", value: 3237, issue: "issue o", product: "fo prod" },
            { name: "OK", value: 2989, issue: "issue o", product: "fo prod" },
            { name: "AR", value: 2691, issue: "issue o", product: "fo prod" },
            { name: "DC", value: 2493, issue: "issue o", product: "fo prod" },
            { name: "KS", value: 2307, issue: "issue o", product: "fo prod" },
            { name: "NM", value: 2176, issue: "issue o", product: "fo prod" },
            { name: "DE", value: 2160, issue: "issue o", product: "fo prod" },
            { name: "IA", value: 1751, issue: "issue o", product: "fo prod" },
            { name: "ID", value: 1436, issue: "issue o", product: "fo prod" },
            { name: "NH", value: 1408, issue: "issue o", product: "fo prod" },
            { name: "NE", value: 1343, issue: "issue o", product: "fo prod" },
            { name: "RI", value: 1166, issue: "issue o", product: "fo prod" },
            { name: "ME", value: 1155, issue: "issue o", product: "fo prod" },
            { name: "WV", value: 1075, issue: "issue o", product: "fo prod" },
            { name: "MT", value: 788, issue: "issue o", product: "fo prod" },
            { name: "ND", value: 637, issue: "issue o", product: "fo prod" },
            { name: "SD", value: 535, issue: "issue o", product: "fo prod" },
            { name: "AK", value: 524, issue: "issue o", product: "fo prod" },
            { name: "WY", value: 450, issue: "issue o", product: "fo prod" },
            { name: "VT", value: 446, issue: "issue o", product: "fo prod" },
            { name: "HI", value: 0, issue: "", product: "" } ],
          issue: [
            {
              hasChildren: false,
              isNotFilter: false,
              isParent: true,
              name: "alpha",
              parent: false,

              value: 600,
              visible: true,
              width: 0.5
            },
            {
              hasChildren: false,
              isNotFilter: false,
              isParent: true,
              name: "bar",
              parent: false,
              value: 150,
              visible: true,
              width: 0.5
            },
            {
              hasChildren: false,
              isNotFilter: false,
              isParent: true,
              name: "car",
              parent: false,

              value: 125,
              visible: true,
              width: 0.5
            },
            {
              hasChildren: false,
              isNotFilter: false,
              isParent: true,
              name: "delta",
              parent: false,
              value: 75,
              visible: true,
              width: 0.5
            },
            {
              hasChildren: false,
              isNotFilter: false,
              isParent: true,
              name: "elephant",
              parent: false,

              value: 50,
              visible: true,
              width: 0.5
            }
          ],
          product: [
            {
              hasChildren: false,
              isNotFilter: false,
              isParent: true,
              name: "foo",
              parent: false,
              value: 600,
              visible: true,
              width: 0.5
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: true,
              name: "goo",
              parent: false,
              value: 150,
              visible: true,
              width: 0.5
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: true,
              name: "hi",
              parent: false,
              value: 125,
              visible: true,
              width: 0.5
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: true,
              name: "indigo",
              parent: false,
              value: 75,
              visible: true,
              width: 0.5
            }, {
              hasChildren: false,
              isNotFilter: false,
              isParent: true,
              name: "joker",
              parent: false,
              value: 50,
              visible: true,
              width: 0.5
            }
          ]
        }
      } )
    } )
  } )

  describe( 'STATES_FAILED actions', () => {
    it( 'handles failed error messages', () => {
      action = {
        type: actions.STATES_FAILED,
        error: { message: 'foo bar', name: 'ErrorTypeName' }
      }

      expect( target( {
        activeCall: 'someurl',
        results: {
          issue: [ 1, 2, 3 ],
          product: [ 1, 2, 3 ],
          state: [ 1, 2, 3 ]
        }
      }, action ) ).toEqual( {
        activeCall: '',
        error: { message: 'foo bar', name: 'ErrorTypeName' },
        isLoading: false,
        results: {
          issue: [],
          product: [],
          state: []
        }
      } )
    } )
  } )

  describe( 'TAB_CHANGED action', () => {
    it( 'clears results and resets values', () => {
      action = {
        type: actions.TAB_CHANGED,
        tab: 'Foo'
      }

      expect( target( {
        expandedTrends: [ 1, 2 ],
        expandableRows: [ 2, 24 ],
        results: [ 1, 2, 3 ]
      }, action ) ).toEqual( {
        expandedTrends: [ 1, 2 ],
        expandableRows: [ 2, 24 ],
        results: {
          issue: [],
          product: [],
          state: []
        }
      } )
    } )

  } )

  describe( 'URL_CHANGED actions', () => {
    let action
    let state
    beforeEach( () => {
      action = {
        type: actions.URL_CHANGED,
        params: {}
      }

      state = { ...defaultState }
    } )

    it( 'handles empty params', () => {
      expect( target( state, action ) ).toEqual( state )
    } )

    it( 'handles dataNormalization params', () => {
      action.params = { dataNormalization: 'hello' }
      const actual = target( state, action )
      expect( actual.dataNormalization ).toEqual( 'hello' )
    } )

    it( 'handles single expandedTrends param', () => {
      action.params = { expandedTrends: 'hello' }
      const actual = target( state, action )
      expect( actual.expandedTrends ).toEqual( [ 'hello' ] )
    } )

    it( 'handles multiple expandedTrends param', () => {
      action.params = { expandedTrends: [ 'hello', 'ma' ] }
      const actual = target( state, action )
      expect( actual.expandedTrends ).toEqual( [ 'hello', 'ma' ] )
    } )

  } )

  describe( 'helper functions', () => {
    describe( 'processStateAggregations', () => {
      it( 'handles empty buckets', () => {
        const stateData = {
          doc_count: 0,
          state: {
            buckets: []
          }
        }
        const res = processStateAggregations( stateData )
        expect( res ).toEqual( [] )
      } )
      it( 'calculates the data correctly', () => {
        const res = processStateAggregations( stateAggs.state )
        expect( res ).toEqual( [
          { name: "CA", value: 62519, issue: "issue o", product: "fo prod" },
          { name: "FL", value: 47358, issue: "issue o", product: "fo" },
          { name: "TX", value: 44469, issue: "issue o", product: "fo rod" },
          { name: "GA", value: 28395, issue: "issue o", product: "fo prod" },
          { name: "NY", value: 26846, issue: "issue o", product: "fo prod" },
          { name: "IL", value: 18172, issue: "issue o", product: "fo prd" },
          { name: "PA", value: 16054, issue: "issue o", product: "fo prod" },
          { name: "NC", value: 15217, issue: "issue o", product: "fo prod" },
          { name: "NJ", value: 15130, issue: "issue o", product: "fo prod" },
          { name: "OH", value: 14365, issue: "issue o", product: "fo prod" },
          { name: "VA", value: 12901, issue: "issue o", product: "fo prod" },
          { name: "MD", value: 12231, issue: "issue o", product: "fo prod" },
          { name: "MI", value: 10472, issue: "issue o", product: "fo prod" },
          { name: "AZ", value: 10372, issue: "issue o", product: "fo prod" },
          { name: "TN", value: 9011, issue: "issue o", product: "fo prod" },
          { name: "WA", value: 8542, issue: "issue o", product: "fo prod" },
          { name: "MA", value: 8254, issue: "issue o", product: "fo prod" },
          { name: "MO", value: 7832, issue: "issue o", product: "fo prod" },
          { name: "SC", value: 7496, issue: "issue o", product: "fo prod" },
          { name: "CO", value: 7461, issue: "issue o", product: "fo prod" },
          { name: "NV", value: 7095, issue: "issue o", product: "fo prod" },
          { name: "LA", value: 6369, issue: "issue o", product: "fo prod" },
          { name: "AL", value: 6178, issue: "issue o", product: "fo prod" },
          { name: "IN", value: 5659, issue: "issue o", product: "fo prod" },
          { name: "MN", value: 4957, issue: "issue o", product: "fo prod" },
          { name: "CT", value: 4685, issue: "issue o", product: "fo prod" },
          { name: "WI", value: 4443, issue: "issue o", product: "fo prod" },
          { name: "OR", value: 4261, issue: "issue o", product: "fo prod" },
          { name: "UT", value: 3693, issue: "issue o", product: "fo prod" },
          { name: "KY", value: 3392, issue: "issue o", product: "fo prod" },
          { name: "MS", value: 3237, issue: "issue o", product: "fo prod" },
          { name: "OK", value: 2989, issue: "issue o", product: "fo prod" },
          { name: "AR", value: 2691, issue: "issue o", product: "fo prod" },
          { name: "DC", value: 2493, issue: "issue o", product: "fo prod" },
          { name: "KS", value: 2307, issue: "issue o", product: "fo prod" },
          { name: "NM", value: 2176, issue: "issue o", product: "fo prod" },
          { name: "DE", value: 2160, issue: "issue o", product: "fo prod" },
          { name: "IA", value: 1751, issue: "issue o", product: "fo prod" },
          { name: "ID", value: 1436, issue: "issue o", product: "fo prod" },
          { name: "NH", value: 1408, issue: "issue o", product: "fo prod" },
          { name: "NE", value: 1343, issue: "issue o", product: "fo prod" },
          { name: "RI", value: 1166, issue: "issue o", product: "fo prod" },
          { name: "ME", value: 1155, issue: "issue o", product: "fo prod" },
          { name: "WV", value: 1075, issue: "issue o", product: "fo prod" },
          { name: "MT", value: 788, issue: "issue o", product: "fo prod" },
          { name: "ND", value: 637, issue: "issue o", product: "fo prod" },
          { name: "SD", value: 535, issue: "issue o", product: "fo prod" },
          { name: "AK", value: 524, issue: "issue o", product: "fo prod" },
          { name: "WY", value: 450, issue: "issue o", product: "fo prod" },
          { name: "VT", value: 446, issue: "issue o", product: "fo prod" },
          { name: "HI", value: 0, issue: "", product: "" }
        ] )
      } )
    } )
  } )
} )
