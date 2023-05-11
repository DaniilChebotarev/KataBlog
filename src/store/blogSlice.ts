import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PostType } from '../types/post';
import axios from '../axios';

type BlogState = {
  articles: PostType[];
  article: null | string;
  status: null | string;
  error: null | boolean;
  page: number;
};

export type IFetchArticles = {
  title: string;
  description: string;
  body: string;
  tagList: Tag[];
};

export type Tag = {
  name: string;
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async ({ offset }: { offset: number }) => {
  const { data } = await axios.get(`/articles?limit=5&offset=${offset}`);
  return data.articles;
});

export const fetchArticles = createAsyncThunk(
  'posts/fetchArticles',
  async ({ title, description, body, tagList }: IFetchArticles) => {
    const token = localStorage.getItem('token');
    const { data } = await axios.post(
      '/articles',
      { article: { title, description, body, tagList: tagList.map((tag) => tag.name) } },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      }
    );

    localStorage.setItem('dataPosts', JSON.stringify(data.article));
    return data.article;
  }
);

export const fetchPutArticles = createAsyncThunk(
  'put/fetchPutArticles',
  async ({ title, description, body }: { title: string; description: string; body: string }) => {
    const slug = localStorage.getItem('slug');
    const token = localStorage.getItem('token');
    const { data } = await axios.put(
      `/articles/${slug}`,
      { article: { title, description, body } },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      }
    );
    return data.article;
  }
);

export const fetchDeleteArticles = createAsyncThunk('delete/fetchDeleteArticles', async () => {
  const token = localStorage.getItem('token');
  const slug = localStorage.getItem('slug');
  const { data } = await axios.delete(`/articles/${slug}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });
  return data.article;
});


export const fetchLikeArticles = createAsyncThunk(
  'posts/fetchLikeArticles',
  async ({slug} : {slug: string}) => {
    const token = localStorage.getItem('token');
    const { data } = await axios.post(
      `/articles/${slug}/favorite`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      }
    );

    localStorage.setItem('dataPosts', JSON.stringify(data.article));
    return data.article;
  }
);

export const fetchLikeDeleteArticles = createAsyncThunk('delete/fetchKLikeDeleteArticles', async ({slug} : {slug: string}) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.delete(`/articles/${slug}/favorite`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });
  console.log(data.article);
  return data.article;
});


const initialState: BlogState = {
  articles: [],
  article: null,
  status: null,
  error: null,
  page: 1,
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    changePage(state, action) {
      state.page = action.payload;
    },
    setArticles(state, action) {
      state.articles = action.payload
    }
  },
  extraReducers: {
    [fetchPosts.pending.type]: (state) => {
      state.status = 'loading';
    },
    [fetchPosts.fulfilled.type]: (state, action) => {
      state.articles = action.payload;
      state.status = 'loaded';
    },
    [fetchPosts.rejected.type]: (state) => {
      state.status = 'error';
    },
    [fetchArticles.pending.type]: (state) => {
      state.status = 'loading';
    },
    [fetchArticles.fulfilled.type]: (state, action) => {
      state.article = action.payload;
      state.status = 'loaded';
    },
    [fetchArticles.rejected.type]: (state) => {
      state.status = 'error';
    },
  },
});

export const { changePage, setArticles } = blogSlice.actions;
export default blogSlice.reducer;
