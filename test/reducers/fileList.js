import {expect} from 'chai'
import {fileList} from '../../src/js/reducers/fileList'
import {setBannerFile, cleanBannerFile} from '../../src/js/actions/fileList'

let state
const fileStr = '{"lastModified":1469503719078,"lastModifiedDate":"2016-07-26T03:28:39.078Z","name":"{2F48895F-318E-4435-A692-BB2A4CE52E45}.png","size":2504,"type":"image/png","uid":"rc-upload-1476272498333-5","response":{},"error":{"status":404,"method":"post","url":"http://127.0.0.1:8001/news/imgUpload.do"},"percent":100,"originFileObj":{"uid":"rc-upload-1476272498333-5"},"status":"error","url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR…TCEbYzIRqfCVdeNVhWSROnCnXimk7aaS07EuS/En6uMf8DLNcnk5+JvUYAAAAASUVORK5CYII=","thumbUrl":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR…TCEbYzIRqfCVdeNVhWSROnCnXimk7aaS07EuS/En6uMf8DLNcnk5+JvUYAAAAASUVORK5CYII="}'
const file = JSON.parse(fileStr)
//const file = {test:1}

describe('reducers fileList', () => {
    it('should init fileList', () => {
        state = fileList(undefined, {})
        expect(state).to.deep.equal({article: [], banner: []})
    })

    it('should handle set banner file', () => {
        fileList(state, setBannerFile(file, 0))
        expect(state).to.deep.equal({article: [], banner: [file]})
        fileList(state, setBannerFile(file, 3))
        expect(state).to.deep.equal({article: [], banner: [file, , , file]})
    })

    it('should handle clean banner file', () => {
        fileList(state, cleanBannerFile(0))
        expect(state).to.deep.equal({article: [], banner: [undefined, , , file]})
        fileList(state, cleanBannerFile(3))
        expect(state).to.deep.equal({article: [], banner: [undefined, , , undefined]})
    })
})
