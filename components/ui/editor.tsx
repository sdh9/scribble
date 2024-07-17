import { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import {
    BalloonEditor,
    AutoImage,
    Autosave,
    Bold,
    CKBox,
    CloudServices,
    Essentials,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    Paragraph,
    PictureEditing,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TodoList,
    Undo
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

const LICENSE_KEY = 'T05Ickc2L2ovUzViTUs5aFI3cTlKSXdseU9wT0NzSlUwejZUQjJsRE9Ib3g2OWlMeTBvZ1lOajVHVFlLdkE9PS1NakF5TkRBNE1UWT0=';
const CKBOX_TOKEN_URL = 'https://40985.cke-cs.com/token/dev/ebb1a4ba6f8033a70e01efc68cec25d95749d47a491444be56c9e2d12a1a?limit=10';

export default function Editor(
    {
        content,
        onChange,
        onBlur,
        onFocus,
        isEditable
    } :
    {
        content: string,
        onChange: any,
        onBlur: any,
        onFocus: any,
        isEditable: boolean
    }
)
{
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    useEffect(() => {
        setIsLayoutReady(true);

        return () => setIsLayoutReady(false);
    }, []);

    const editorConfig = {
        toolbar: {
            items: [
                'undo',
                'redo',
                '|',
                'bold',
                'italic',
                '|',
                'link',
                'insertImage',
                'ckbox',
                'insertTable',
                '|',
                'bulletedList',
                'numberedList',
                'todoList',
            ],
            shouldNotGroupWhenFull: false
        },
        plugins: [
            AutoImage,
            Autosave,
            Bold,
            CKBox,
            CloudServices,
            Essentials,
            ImageBlock,
            ImageCaption,
            ImageInline,
            ImageInsert,
            ImageInsertViaUrl,
            ImageResize,
            ImageStyle,
            ImageTextAlternative,
            ImageToolbar,
            ImageUpload,
            Italic,
            Link,
            LinkImage,
            List,
            ListProperties,
            Paragraph,
            PictureEditing,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableProperties,
            TableToolbar,
            TodoList,
            Undo
        ],
        ckbox: {
            tokenUrl: CKBOX_TOKEN_URL
        },
        image: {
            toolbar: [
                'toggleImageCaption',
                'imageTextAlternative',
                '|',
                'imageStyle:inline',
                'imageStyle:wrapText',
                'imageStyle:breakText',
                '|',
                'resizeImage',
            ]
        },
        initialData: content,
        licenseKey: LICENSE_KEY,
        link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        list: {
            properties: {
                styles: true,
                startIndex: true,
                reversed: true
            }
        },
        placeholder: 'Start writing...',
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
        }
    };

    configUpdateAlert(editorConfig);

    return (
        <div>
            <div className="main-container">
                <div className="editor-container editor-container_balloon-editor" ref={editorContainerRef}>
                    <div className="editor-container__editor">
                        <div ref={editorRef}>
                            {isLayoutReady && (
                                <CKEditor
                                    editor={BalloonEditor}
                                    config={editorConfig as any}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    onFocus={onFocus}
                                    disabled={!isEditable}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * This function exists to remind you to update the config needed for premium features.
 * The function can be safely removed. Make sure to also remove call to this function when doing so.
 */
function configUpdateAlert(config: any) {
    if ((configUpdateAlert as any).configUpdateAlertShown) {
        return;
    }

    const isModifiedByUser = (currentValue: any, forbiddenValue: any) => {
        if (currentValue === forbiddenValue) {
            return false;
        }

        if (currentValue === undefined) {
            return false;
        }

        return true;
    };

    const valuesToUpdate = [];

    (configUpdateAlert as any).configUpdateAlertShown = true;

    if (!isModifiedByUser(config.licenseKey, '<YOUR_LICENSE_KEY>')) {
        valuesToUpdate.push('LICENSE_KEY');
    }

    if (!isModifiedByUser(config.ckbox?.tokenUrl, '<YOUR_CKBOX_TOKEN_URL>')) {
        valuesToUpdate.push('CKBOX_TOKEN_URL');
    }

    if (valuesToUpdate.length) {
        window.alert(
            [
                'Please update the following values in your editor config',
                'in order to receive full access to the Premium Features:',
                '',
                ...valuesToUpdate.map(value => ` - ${value}`)
            ].join('\n')
        );
    }
}
