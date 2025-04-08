
export interface KnowledgeBase {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  source_count: number;
  sources: KnowledgeBaseSource[];
  auto_sync?: boolean;
}

export interface KnowledgeBaseSource {
  id: string;
  type: 'url' | 'file' | 'text';
  title: string;
  content?: string;
  url?: string;
  file_name?: string;
  created_at: string;
  auto_sync?: boolean;
}

export interface WebPage {
  url: string;
  title: string;
  selected: boolean;
}
