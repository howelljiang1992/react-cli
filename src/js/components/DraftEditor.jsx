import React, {Component} from 'react'
import {Editor, EditorState, RichUtils, AtomicBlockUtils, convertToRaw} from 'draft-js'
import {Entity} from 'draft-js-origin'
import {convertToHTML, convertFromHTML} from 'draft-convert'
import ModalDialog from './ModalDialog'
import UploadImage from './UploadImage'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as actions from '../actions/fileList'

const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2
    }
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        }
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
              {this.props.label}
            </span>
        );
    }
}

const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'H3', style: 'header-three'},
    {label: 'H4', style: 'header-four'},
    {label: 'H5', style: 'header-five'},
    {label: 'H6', style: 'header-six'},
    {label: 'Blockquote', style: 'blockquote'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'},
    {label: 'Code Block', style: 'code-block'}
];

const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

var INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'},
    {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

class DraftEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editorState: EditorState.createEmpty()
        }
        //this.state = {editorState: EditorState.createEmpty()}

        this.taskQueue = []
        this.focus = () => this.refs.editor.focus();
        this.onChange = editorState => {
            this.setState({editorState});
            //this.logHTML()
        }

        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.onTab = (e) => this._onTab(e);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);

        this.confirm = this.confirm.bind(this);
        //this.url = 'https://img10.360buyimg.com/da/jfs/t3301/13/3186788876/125711/23dc4146/57ecde63N86562428.jpg'

        //this.logState = () => {
        //    const content = this.state.editorState.getCurrentContent();
        //    console.log(convertToRaw(content));
        //}

        this.fromHTML = html => {
            const contentState = convertFromHTML({
                htmlToStyle: (nodeName, node, currentStyle) => {
                    if (nodeName === 'span' && node.style.color === 'blue') {
                        return currentStyle.add('BLUE');
                    } else {
                        return currentStyle;
                    }
                },
                htmlToEntity: (nodeName, node) => {
                    if (nodeName === 'a') {
                        return Entity.create(
                            'LINK',
                            'MUTABLE',
                            {url: node.href}
                        )
                    }
                    if (nodeName === 'img') {
                        console.log('node:', node)
                        let editorState = EditorState.createEmpty()
                        let contentState = editorState.getCurrentContent()
                        let contentStateWithEntity = contentState.createEntity(
                            'image',
                            'IMMUTABLE',
                            {src: node.src}
                        )
                        this.taskQueue.push(contentStateWithEntity)
                        return contentStateWithEntity
                    }
                },
                textToEntity: (text) => {
                    const result = [];
                    text.replace(/\@(\w+)/g, (match, name, offset) => {
                        const entityKey = Entity.create(
                            'AT-MENTION',
                            'IMMUTABLE',
                            {name}
                        );
                        result.push({
                            entity: entityKey,
                            offset,
                            length: match.length,
                            result: match
                        });
                    });
                    return result;
                },
                htmlToBlock: (nodeName, node) => {
                    if (nodeName === 'blockquote') {
                        return {
                            type: 'blockquote',
                            data: {}
                        };
                    }
                }
            })(html)

            return contentState
        }

        this.logHTML = () => {
            const content = this.state.editorState.getCurrentContent();
            const html = convertToHTML({
                blockToHTML: {
                    'PARAGRAPH': {
                        start: '<p>',
                        end: '</p>',
                        empty: '<br>'
                    },
                    'code-block': {
                        start: '<pre>',
                        end: '</pre>'
                    },
                    'atomic': {
                        start: '<i>',
                        end: '</i>'
                    },
                    'unstyled': {
                        start: '<p>',
                        end: '</p>',
                        empty: '<br>'
                    },
                    'blockquote': {
                        start: '<b>',
                        end: '</b>'
                    }

                },
                entityToHTML: (entity, originalText) => {
                    if (entity.type === 'LINK') return `<a href="${entity.data.url}">${originalText}</a>`
                    if (entity.type === 'image') return `<img src="${entity.data.src}" style="display: block;margin: 0 auto" />`
                    return originalText
                }
            })(content)

            return html
        }
    }

    _handleKeyCommand(command) {
        const {editorState} = this.state
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            this.onChange(newState)
            return true
        }
        return false
    }

    _onTab(e) {
        const maxDepth = 4
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth))
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }


    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }
    confirm() {
        const fileList = this.props.fileList
        fileList.map(file => {
            setTimeout(() => {
                let url = file.url
                let {editorState} = this.state
                let contentState = editorState.getCurrentContent()
                let contentStateWithEntity = contentState.createEntity(
                    'image',
                    'IMMUTABLE',
                    {src: url}
                )
                let entityKey = contentStateWithEntity.getLastCreatedEntityKey();
                let newEditorState = EditorState.set(
                    editorState,
                    {currentContent: contentStateWithEntity}
                )
                console.log(newEditorState, entityKey)
                this.setState({
                    editorState: AtomicBlockUtils.insertAtomicBlock(
                        newEditorState,
                        entityKey,
                        ' '
                    )
                })
            }, 0)

        })
    }

    componentDidMount() {
        document.querySelector(this.props.submitSelector).onclick = () => {
            console.log('analysis...')
            let html = this.logHTML()
            localStorage.setItem('content', html)
            console.log('finish')
        }
    }

    render() {
        const {defaultHtml, render} = this.props
        console.log(render, defaultHtml)
        if (render && defaultHtml)
            this.setState({editorState: EditorState.createWithContent(this.fromHTML(this.props.defaultHtml))})

        let {editorState} = this.state
        //let contentStateWithEntity = this.taskQueue.pop()
        //if (contentStateWithEntity) {
        //    let entityKey = contentStateWithEntity.getLastCreatedEntityKey()
        //    let newEditorState = EditorState.set(
        //        editorState,
        //        {currentContent: contentStateWithEntity}
        //    )
        //    console.log(newEditorState, entityKey)
        //    this.setState({
        //        editorState: AtomicBlockUtils.insertAtomicBlock(
        //            newEditorState,
        //            entityKey,
        //            ' '
        //        )
        //    })
        //}


        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = 'RichEditor-editor';
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }

        return (
            <div className="RichEditor-root">
                <BlockStyleControls
                    editorState={editorState}
                    onToggle={this.toggleBlockType}
                />
                <InlineStyleControls
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                />
                <ModalDialog triggerElm={<span className="add-image">Image</span>} OKCb={this.confirm}>
                    <UploadImage type="article" />
                </ModalDialog>
                <div className={className} onClick={this.focus}>
                    <Editor
                        blockRendererFn={mediaBlockRenderer}
                        blockStyleFn={getBlockStyle}
                        customStyleMap={styleMap}
                        editorState={editorState}
                        handleKeyCommand={this.handleKeyCommand}
                        onChange={this.onChange}
                        onTab={this.onTab}
                        placeholder="请输入正文内容"
                        ref="editor"
                        spellCheck={true}
                    />
                </div>
            </div>
        );
    }
}

function mediaBlockRenderer(block) {
    if (block.getType() === 'atomic') {
        return {
            component: Media,
            editable: false
        };
    }
    return null;
}

const Media = (props) => {
    const entity = props.contentState.getEntity(
        props.block.getEntityAt(0)
    )
    const {src} = entity.getData();

    return <Image src={src} />
}

const Image = (props) => {
    return <img src={props.src} style={styles.media} />;
}

const styles = {
    media: {
        width: 'auto',
        display: 'block',
        margin: '0 auto'
    }
}

let mapStateToProps = state => {
    return {
        fileList: state.fileList.article
    }
}
let mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DraftEditor)