import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { FormHelperText } from '@mui/material';

interface RichEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  onBlur?: () => void;
  height?: number;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
}

export const RichEditor: React.FC<RichEditorProps> = ({
  value = '',
  onChange,
  onBlur,
  height = 300,
  placeholder = '',
  error = false,
  helperText = ' ',
}) => {
  return (
    <div>
      <Editor
        apiKey="zfenvlpuaf2bwnctqh6qu5bpcdyc9v0pgx8un1gx3sl5pc1i"
        value={value}
        onEditorChange={(newValue) => onChange?.(newValue)}
        onBlur={() => onBlur?.()}
        init={{
          height,
          placeholder,
          menubar: true,
          branding: false,
          promotion: false,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'help',
            'wordcount',
          ],
          toolbar:
            'undo redo | blocks | bold italic underline forecolor | ' +
            'alignleft aligncenter alignright alignjustify | bullist numlist ' +
            'outdent indent | removeformat | image link media table | code preview fullscreen | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />
      <FormHelperText error={!!error}>{helperText || ' '}</FormHelperText>
    </div>
  );
};
