export interface Blog {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  time_created: string;
  avatar: string;
  author_name: string;
  images: Array<{ thumbnail_url: string; image_url: string }>;
}
