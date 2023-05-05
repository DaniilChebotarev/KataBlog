export type PostAuthorType = {
  username: string;
  image?: string;
  following?: boolean;
};

export type PostType = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: PostAuthorType;
};

export type PostsResponse = {
  articles: PostType[];
  articlesCount: number;
};

export type PostResponse = {
  article: PostType;
};


export type Fetch = {
  username?: string; 
  email: string; 
  password: string, 
  image?: string,
}