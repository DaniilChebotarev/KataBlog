import PostItem from '../PostItem/PostItem';
import { Pagination } from 'antd';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchPosts, changePage, setArticles } from '../../store/blogSlice';
import axios from '../../axios';
import { nanoid } from 'nanoid';

const PostList = () => {
  const [results, setResults] = useState(1);

  const dispatch = useAppDispatch();
  const { articles, page } = useAppSelector((state) => state.blogReducer);


  useEffect(() => {
    const fetchArticleData = async () => {
        const res = await axios.get(`articles?limit=5&offset=5`);
        setResults(res.data.articlesCount);
        dispatch(fetchPosts({ offset: (page - 1) * 5 }));
    }
    dispatch(setArticles([]));
    fetchArticleData();
  }, [page]);

  return (
    <>
      {articles.map((article) => (
        <PostItem key={nanoid()} {...article} />
      ))}
      <Pagination
        onChange={(page) => dispatch(changePage(page))}
        defaultCurrent={page}
        total={results}
        style={{ textAlign: 'center', marginTop: '30px' }}
        showSizeChanger={false}
      />
    </>
  );
};

export default PostList;
