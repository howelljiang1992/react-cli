import {expect} from 'chai'
import {userInfo} from '../../src/js/reducers/userInfo'
import {GET_USERINFO} from '../../src/js/constants/Actions'

describe('reducers userInfo', () => {
    it('should handle actions', () => {
        let state
        state = userInfo(undefined, {})
        expect(state).to.deep.equal({authorize: 0, name: 'claudeliang'})
        state = userInfo(state, {type: GET_USERINFO, data: {name: 'markmeng'}})
        expect(state).to.deep.equal({authorize: 0, name: 'markmeng'})
    })
})
