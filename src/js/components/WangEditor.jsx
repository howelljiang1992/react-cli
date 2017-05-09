import React, {Component} from 'react'
import wangEditor from 'wangeditor'
import {uploadImgUrl} from '../configs/url'

export default class WangEditor extends Component {
    constructor() {
        super()
        this.update = true
    }

    // shouldComponentUpdate() {
    //     return this.update
    // }

    componentDidMount() {
        let textarea = document.getElementById('richEditor');
        if (this.editor) return
        // 生成编辑器
        let editor = new wangEditor(textarea)
        editor.onchange = function () {
            localStorage.setItem('content', this.$txt.html())
        }
        editor.config.uploadImgUrl = uploadImgUrl
        editor.config.uploadImgFileName = 'file'
        editor.config.uploadHeaders = {
            'X-Requested-With': 'XMLHttpRequest'
        }

        editor.config.menus = wangEditor.config.menus.map(function(item, key) {
        //    if (item === 'video') {
        //        return null
        //    }
           if (item === 'location') {
               return null
           }
           return item;
        })

        editor.create();
        this.editor = editor
    }

    render() {
        let content = localStorage.getItem('content')
        // if (!!content) this.update = false
        if (this.editor) this.editor.$txt.html(content)
        return (
            <textarea id="richEditor">

            </textarea>
        )
    }
}
