import { Tag } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import classes from './PostItem.module.scss';
import { PostType } from '../../types/post';
import { format } from 'date-fns';
import { nanoid } from '@reduxjs/toolkit';
import {HeartOutlined} from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { selectIsAuth } from '../../store/authSlice';
import { fetchLikeArticles, fetchLikeDeleteArticles } from '../../store/blogSlice';
import { useState } from 'react';

const PostItem = ({ ...article }: PostType) => {
  const isAuth = useAppSelector(selectIsAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(localStorage.getItem(`like_${article.slug}`) === 'true');
  const [likesNumber, setLikeNumber] = useState(article.favoritesCount)

  const likeClick = () => {
    if (isAuth) {
      if (!favorited) {
        setLikeNumber(state => state + 1);
        dispatch(fetchLikeArticles({ slug: article.slug }));
        localStorage.setItem(`like_${article.slug}`, 'true');
        setFavorited(true);
      }

      if (favorited) {
        setLikeNumber(state => state - 1);
        dispatch(fetchLikeDeleteArticles({ slug: article.slug }));
        localStorage.removeItem(`like_${article.slug}`);
        setFavorited(false);
      }
    } else {
      navigate('/')
    }
  };

  return (
  <>
    <div className={classes.post}>
      <div className={classes.post__left}>
        <Link to={`articles/${article.slug}`} className={classes.post__title}>
          {article.title}
        </Link>
        {
          favorited ? (
            <HeartOutlined className={classes.post__likeRed} onClick={likeClick}/>
          ) : (
            <HeartOutlined onClick={likeClick} className={classes.post__like}/>

          )
        }
        <p className={classes.post__likeQuantity}>{likesNumber}</p>
        <div className={classes.post__bottom}>
          {article.tagList.map((tag) => {
            if (tag.length !== 0 && tag.length < 20) {
              return (
                <Tag key={nanoid()} className={classes.post__tag}>
                  {tag}
                </Tag>
              );
            }
          })}
        </div>
        <div className={classes.post__text}>{article.description}</div>
      </div>
      <div className={classes.post__right}>
        <div className={classes.post__right_container}>
          <p className={classes.post__personName}>{article.author.username}</p>
          <p className={classes.post__date}>{format(new Date(article.createdAt), 'MMMM d, yyyy')}</p>
        </div>
        <img src={article.author.image} alt="avatar" className={classes.post__image} />
      </div>
    </div>
    </>
  );
};


export default PostItem;
