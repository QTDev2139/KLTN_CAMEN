
export interface FileDocument {
  name: string;
  path: string;
  encoded: string;
  url: string; 
  size: number;
  last_modified: string; 
}


export interface CategoryDocument {
  category_name: string;
  category_path: string;
  files: FileDocument[];
}
