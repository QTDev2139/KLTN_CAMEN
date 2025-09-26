// src/components/RichTextEditor.tsx
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Heading,
  Link,
  List,
  ListProperties,

  // ⬇️ HÌNH ẢNH
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageUpload,
  ImageInsert,

  // ⬇️ CĂN LỀ & FONT
  Alignment,
  Font,
  Base64UploadAdapter,
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onChange={(_, editor) => onChange(editor.getData())}
      config={{
        licenseKey: 'GPL',
        plugins: [
          Essentials,
          Paragraph,
          Bold,
          Italic,
          Heading,
          Link,
          List,
          ListProperties,
          Image,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageUpload,
          ImageInsert,
          Alignment,
          Font,
          Base64UploadAdapter,
        ],
        toolbar: [
          'undo',
          'redo',
          '|',
          'heading',
          '|',
          'bold',
          'italic',
          'link',
          '|',
          'bulletedList',
          'numberedList',
          '|',
          'alignment', // 👈 nút căn lề văn bản
          'fontFamily',
          'fontSize', // 👈 chọn font & cỡ chữ
          '|',
          'insertImage',
        ],

        // Heading
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
          ],
        },

        // Link
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: 'https://',
        },

        // List
        list: {
          properties: { styles: true, startIndex: true, reversed: true },
        },


        // Ảnh (thanh công cụ & style)
        image: {
          toolbar: [
            'toggleImageCaption',
            'imageTextAlternative',
            '|',
            // style cho khối/inline/side
            'imageStyle:inline',
            'imageStyle:block',
            'imageStyle:side',
            '|',
            // style căn lề ảnh
            'imageStyle:alignLeft',
            'imageStyle:alignCenter',
            'imageStyle:alignRight',
          ],
          styles: {
            options: [
              'inline',
              'block',
              'side',
              'alignLeft',
              'alignCenter',
              'alignRight', // 👈 căn lề ảnh
            ],
          },
          insert: { type: 'auto' },
        },

        placeholder,
      }}
    />
  );
}
