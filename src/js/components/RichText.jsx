import { Editor, Raw, Html } from 'slate'
import React from 'react'
//import initialState from '../../json/slate'


const initialState = (
    sessionStorage.getItem('content') || '<p></p>'
)

/**
 * Define the default node type.
 */

const DEFAULT_NODE = 'paragraph'

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
    nodes: {
        'bulleted-list': props => <ul {...props.attributes}>{props.children}</ul>,
        'heading-one': props => <h1 {...props.attributes}>{props.children}</h1>,
        'heading-two': props => <h2 {...props.attributes}>{props.children}</h2>,
        'list-item': props => <li {...props.attributes}>{props.children}</li>,
        'numbered-list': props => <ol {...props.attributes}>{props.children}</ol>,
        'link': (props) => {
            const { data } = props.node
            const href = data.get('href')
            return <a href={href} {...props.attributes}>{props.children}</a>
        },
        image: (props) => {
            const { node, state } = props
            const isFocused = state.selection.hasEdgeIn(node)
            const src = node.data.get('src')
            const className = isFocused ? 'active' : null
            return (
                <img src={src} className={className} {...props.attributes} />
            )
        }
    },
    marks: {
        bold: props => <strong>{props.children}</strong>,
        italic: props => <em>{props.children}</em>,
        underlined: props => <u>{props.children}</u>
    }
}

const type2Html = (children, href) => {
    return {
        'paragraph': <p>{children}</p>,
        'bulleted-list': <ul>{children}</ul>,
        'heading-one': <h1>{children}</h1>,
        'heading-two': <h2>{children}</h2>,
        'list-item': <li>{children}</li>,
        'numbered-list': <ol>{children}</ol>,
        'link': <a href={href}>{children}</a>,
        'bold': <strong>{children}</strong>,
        'italic': <em>{children}</em>,
        'underlined': <u>{children}</u>,
        'image': <img src={href} />
    }
}

/**
 * Tags to blocks.
 *
 * @type {Object}
 */

const BLOCK_TAGS = {
    p: 'paragraph',
    li: 'list-item',
    ul: 'bulleted-list',
    ol: 'numbered-list',
    h1: 'heading-one',
    h2: 'heading-two',
    img: 'image'
}

/**
 * Tags to marks.
 *
 * @type {Object}
 */

const MARK_TAGS = {
    strong: 'bold',
    em: 'italic',
    u: 'underline',
    s: 'strikethrough'
}

/**
 * Serializer rules.
 *
 * @type {Array}
 */

const RULES = [
    {
        deserialize(el, next) {
            const block = BLOCK_TAGS[el.tagName]
            if (!block) return
            return {
                kind: 'block',
                type: block,
                nodes: next(el.children)
            }
        },
        serialize(object, children) {
            console.log(object.kind)
            if (object.kind != 'block') return
            return type2Html(children)[object.type]
        }
    },
    {
        deserialize(el, next) {
            const mark = MARK_TAGS[el.tagName]
            if (!mark) return
            return {
                kind: 'mark',
                type: mark,
                nodes: next(el.children)
            }
        },
        serialize(object, children) {
            if (object.kind != 'mark') return
            return type2Html(children)[object.type]
        }
    },
    {
        // Special case for links, to grab their href.
        deserialize(el, next) {
            if (el.tagName != 'a') return
            return {
                kind: 'inline',
                type: 'link',
                nodes: next(el.children),
                data: {
                    href: el.attribs.href
                }
            }
        },
        serialize(object, children) {
            if (object.kind != 'inline') return
            let href = object.data._root.entries[0][1]
            return type2Html(children, href)[object.type]
        }
    },
    {
        deserialize(el, next) {
            if (el.tagName != 'img') return
            return {
                kind: 'block',
                type: 'image',
                nodes: next(el.children),
                data: {
                    src: el.attribs.src
                }
            }
        },
        serialize(object, children) {
            console.log(object.kind)
            if (object.kind != 'block') return
            console.log('img:', object.data)
            let src = object.data._root.entries[0][1]
            return type2Html(undefined, src)[object.type]
        }
    }
]

/**
 * Create a new HTML serializer with `RULES`.
 *
 * @type {Html}
 */

const serializer = new Html({ rules: RULES })

/**
 * RichText.
 *
 * @type {Component}
 */

class RichText extends React.Component {

    /**
     * Deserialize the initial editor state.
     *
     * @type {Object}
     */
    constructor() {
        super()
        console.log(serializer.deserialize(initialState))
        this.state = {
            state: serializer.deserialize(initialState)
        }


        this.hasMark = this.hasMark.bind(this)
        this.hasBlock = this.hasBlock.bind(this)
        //this.onChange = this.onChange.bind(this)
        //this.onPaste = this.onPaste.bind(this)
        //this.onDocumentChange = this.onDocumentChange.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
        this.onClickImage = this.onClickImage.bind(this)
        this.onClickMark = this.onClickMark.bind(this)
        this.onClickBlock = this.onClickBlock.bind(this)
        this.renderToolbar = this.renderToolbar.bind(this)
        this.renderMarkButton = this.renderMarkButton.bind(this)
        this.renderBlockButton = this.renderBlockButton.bind(this)
        this.renderEditor = this.renderEditor.bind(this)
    }

    /**
     * Check if the current selection has a mark with `type` in it.
     *
     * @param {String} type
     * @return {Boolean}
     */

    hasMark(type) {
        const { state } = this.state
        return state.marks.some(mark => mark.type == type)
    }

    /**
     * Check if the any of the currently selected blocks are of `type`.
     *
     * @param {String} type
     * @return {Boolean}
     */

    hasBlock(type) {
        const { state } = this.state
        return state.blocks.some(node => node.type == type)
    }

    /**
     * On change, save the new state.
     *
     * @param {State} state
     */

    onChange(state) {
        this.setState({ state })
    }

    /**
     * On paste, deserialize the HTML and then insert the fragment.
     *
     * @param {Event} e
     * @param {Object} data
     * @param {State} state
     */

    onPaste(e, data, state) {
        if (data.type !== 'html') return
        const { document } = serializer.deserialize(data.html)
        return state
            .transform()
            .insertFragment(document)
            .apply()
    }

    onDocumentChange(document, state) {
        // Switch to using the Raw serializer.
        sessionStorage.setItem('content', serializer.serialize(state))
    }

    /**
     * On key down, if it's a formatting command toggle a mark.
     *
     * @param {Event} e
     * @param {Object} data
     * @param {State} state
     * @return {State}
     */

    onKeyDown(e, data, state) {
        if (!data.isMod) return
        let mark

        switch (data.key) {
            case 'b':
                mark = 'bold'
                break
            case 'i':
                mark = 'italic'
                break
            case 'u':
                mark = 'underlined'
                break
            default:
                return
        }

        state = state
            .transform()
            .toggleMark(mark)
            .apply()

        e.preventDefault()
        return state
    }

    /**
     * When a mark button is clicked, toggle the current mark.
     *
     * @param {Event} e
     * @param {String} type
     */

    onClickMark(e, type) {
        e.preventDefault()
        let { state } = this.state

        state = state
            .transform()
            .toggleMark(type)
            .apply()

        this.setState({ state })
    }

    /**
     * When a block button is clicked, toggle the block type.
     *
     * @param {Event} e
     * @param {String} type
     */

    onClickBlock(e, type) {
        e.preventDefault()
        let { state } = this.state
        let transform = state.transform()
        const { document } = state

        // Handle everything but list buttons.
        if (type != 'bulleted-list' && type != 'numbered-list') {
            const isActive = this.hasBlock(type)
            const isList = this.hasBlock('list-item')

            if (isList) {
                transform = transform
                    .setBlock(isActive ? DEFAULT_NODE : type)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            }

            else {
                transform = transform
                    .setBlock(isActive ? DEFAULT_NODE : type)
            }
        }

        // Handle the extra wrapping required for list buttons.
        else {
            const isList = this.hasBlock('list-item')
            const isType = state.blocks.some((block) => {
                return !!document.getClosest(block, parent => parent.type == type)
            })

            if (isList && isType) {
                transform = transform
                    .setBlock(DEFAULT_NODE)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            } else if (isList) {
                transform = transform
                    .unwrapBlock(type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
                    .wrapBlock(type)
            } else {
                transform = transform
                    .setBlock('list-item')
                    .wrapBlock(type)
            }
        }

        state = transform.apply()
        this.setState({ state })
    }

    /**
     * On clicking the image button, prompt for an image and insert it.
     *
     * @param {Event} e
     */

    onClickImage(e) {
        e.preventDefault()
        const src = window.prompt('Enter the URL of the image:')
        if (!src) return
        let { state } = this.state
        state = this.insertImage(state, src)
        this.onChange(state)
    }

    /**
     * Insert an image with `src` at the current selection.
     *
     * @param {State} state
     * @param {String} src
     * @return {State}
     */

    insertImage(state, src) {
        return state
            .transform()
            .insertBlock({
                type: 'image',
                isVoid: true,
                data: { src }
            })
            .apply()
    }

    /**
     * Render.
     *
     * @return {Element}
     */

    render() {
        return (
            <div>
                {this.renderToolbar()}
                {this.renderEditor()}
            </div>
        )
    }

    /**
     * Render the toolbar.
     *
     * @return {Element}
     */

    renderToolbar() {
        return (
            <div className="menu toolbar-menu">
                {this.renderMarkButton('bold', 'format_bold')}
                {this.renderMarkButton('italic', 'format_italic')}
                {this.renderMarkButton('underlined', 'format_underlined')}
                {this.renderBlockButton('heading-one', 'looks_one')}
                {this.renderBlockButton('heading-two', 'looks_two')}
                {this.renderBlockButton('numbered-list', 'format_list_numbered')}
                {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
                <span className="button" onMouseDown={this.onClickImage}>
                  <span className="material-icons">image</span>
                </span>
            </div>
        )
    }

    /**
     * Render a mark-toggling toolbar button.
     *
     * @param {String} type
     * @param {String} icon
     * @return {Element}
     */

    renderMarkButton(type, icon) {
        const isActive = this.hasMark(type)
        const onMouseDown = e => this.onClickMark(e, type)

        return (
            <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
        )
    }

    /**
     * Render a block-toggling toolbar button.
     *
     * @param {String} type
     * @param {String} icon
     * @return {Element}
     */

    renderBlockButton(type, icon) {
        const isActive = this.hasBlock(type)
        const onMouseDown = e => this.onClickBlock(e, type)

        return (
            <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
                <span className="material-icons">{icon}</span>
            </span>
        )
    }

    /**
     * Render the Slate editor.
     *
     * @return {Element}
     */

    renderEditor() {
        return (
            <div className="editor">
                <Editor
                    placeholder={'请输入正文内容'}
                    schema={schema}
                    state={this.state.state}
                    onChange={state => this.onChange(state)}
                    onPaste={this.onPaste}
                    onKeyDown={this.onKeyDown}
                    onDocumentChange={(document, state) => this.onDocumentChange(document, state)}
                />
            </div>
        )
    }

}

/**
 * Export.
 */

export default RichText