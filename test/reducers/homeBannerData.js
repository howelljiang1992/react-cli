import {expect} from 'chai'
import {homeBannerData} from '../../src/js/reducers/homeBannerData'
import {GET_HOMEBANNER_DATA} from '../../src/js/constants/Actions'

describe('reducers homeBannerData', () => {
    it('should handle actions', () => {
        let state
        state = homeBannerData(undefined, {})
        expect(state).to.exist
    })
})
