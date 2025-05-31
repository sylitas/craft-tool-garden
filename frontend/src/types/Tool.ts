
export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  tags: string[];
  folder: string;
  dateAdded: string;
  version?: string;
  author?: string;
}
