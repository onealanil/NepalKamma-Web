"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Eye, X } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { 
    ssr: false,
    loading: () => <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
});

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    height?: string;
}

const RichTextEditor = ({ value, onChange, placeholder = "Enter description...", height = "200px" }: RichTextEditorProps) => {
    const [showPreview, setShowPreview] = useState(false);

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link'],
            ['clean']
        ],
    };

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'list', 'color', 'background', 'align', 'link'
    ];

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .ql-editor {
                min-height: ${height};
                font-family: inherit;
                font-size: 14px;
                line-height: 1.6;
            }
            .ql-toolbar {
                border-top: 1px solid #e5e7eb;
                border-left: 1px solid #e5e7eb;
                border-right: 1px solid #e5e7eb;
                border-bottom: none;
                border-radius: 8px 8px 0 0;
                background: #f9fafb;
            }
            .ql-container {
                border-bottom: 1px solid #e5e7eb;
                border-left: 1px solid #e5e7eb;
                border-right: 1px solid #e5e7eb;
                border-top: none;
                border-radius: 0 0 8px 8px;
                background: white;
            }
            .ql-editor.ql-blank::before {
                color: #9ca3af;
                font-style: normal;
            }
            .ql-toolbar .ql-stroke {
                stroke: #6b7280;
            }
            .ql-toolbar .ql-fill {
                fill: #6b7280;
            }
            .ql-toolbar button:hover .ql-stroke {
                stroke: var(--primary);
            }
            .ql-toolbar button:hover .ql-fill {
                fill: var(--primary);
            }
            .ql-toolbar button.ql-active .ql-stroke {
                stroke: var(--primary);
            }
            .ql-toolbar button.ql-active .ql-fill {
                fill: var(--primary);
            }
            .preview-content h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
            .preview-content h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; }
            .preview-content h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; }
            .preview-content p { margin: 1em 0; }
            .preview-content ul, .preview-content ol { margin: 1em 0; padding-left: 2em; }
            .preview-content li { margin: 0.5em 0; }
            .preview-content strong { font-weight: bold; }
            .preview-content em { font-style: italic; }
            .preview-content u { text-decoration: underline; }
            .preview-content s { text-decoration: line-through; }
            .preview-content a { color: #3b82f6; text-decoration: underline; }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, [height]);

    return (
        <>
            <div className="rich-text-editor">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        Preview
                    </button>
                </div>
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                />
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900">Live Preview</h3>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            <div 
                                className="preview-content prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: value || '<p class="text-gray-400 italic">No content to preview</p>' }}
                            />
                        </div>
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                            <button
                                onClick={() => setShowPreview(false)}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RichTextEditor;
