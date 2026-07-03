import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon } from 'lucide-react';

type RichTextEditorProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'min-h-[150px] w-full rounded-lg border border-zinc-950/10 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm placeholder:text-zinc-400 focus:outline-2 focus:outline-offset-2 focus:outline-zinc-950 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:outline-white prose prose-sm dark:prose-invert max-w-none',
            },
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2 rounded-lg border border-zinc-950/10 p-1 shadow-sm dark:border-white/10">
            <div className="flex flex-wrap items-center gap-1 border-b border-zinc-950/10 pb-1 dark:border-white/10">
                <button
                    type="button"
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors ${editor.isActive('bold') ? 'bg-zinc-200 dark:bg-zinc-700' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors ${editor.isActive('italic') ? 'bg-zinc-200 dark:bg-zinc-700' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors ${editor.isActive('bulletList') ? 'bg-zinc-200 dark:bg-zinc-700' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors ${editor.isActive('orderedList') ? 'bg-zinc-200 dark:bg-zinc-700' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors ${editor.isActive('link') ? 'bg-zinc-200 dark:bg-zinc-700' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    onClick={() => {
                        const previousUrl = editor.getAttributes('link').href;
                        const url = window.prompt('URL', previousUrl);
                        if (url === null) return;
                        if (url === '') {
                            editor.chain().focus().extendMarkRange('link').unsetLink().run();
                            return;
                        }
                        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                    }}
                >
                    <LinkIcon className="h-4 w-4" />
                </button>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
