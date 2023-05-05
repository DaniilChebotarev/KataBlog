import classes from './Post.module.scss';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from '../../axios';
import { PostType } from '../../types/post';
import ReactMarkdown from 'react-markdown';
import like from '../../components/PostItem/Vector.svg';
import { Popconfirm, Tag, message } from 'antd';
import { fetchDeleteArticles } from '../../store/blogSlice';
import { useAppDispatch } from '../../hooks/redux';
const Post = () => {
  const [data, setData] = useState<PostType>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const slug = localStorage.getItem('slug');
  const token = localStorage.getItem('data');
  const parse = JSON.parse(token as string)
    const isAuthor = () => {
    const authorName = data?.author?.username;
    return parse?.user?.username === authorName;
  };

  

  const confirm = () => {
    dispatch(fetchDeleteArticles());
    navigate('/')
  }

  const cancel = () => {
    message.error("Click on No");
  };

  useEffect(() => {
    axios
      .get(`/articles/${id}`)
      .then((res) => {
        setData(res.data.article);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, []);

  useEffect(() => {
    if (data?.slug) {
      localStorage.setItem('slug', data.slug);
    }
  }, [data?.slug]);
  
    
  return (
    <div className={classes.post}>
      <div className={classes.post__left}>
        <div className={classes.post__title}>{data?.title}</div>

        <img src={like} className={classes.post__like} />
        <p className={classes.post__likeQuantity}>{data?.favoritesCount}</p>
        <div className={classes.post__bottom}>
          {data?.tagList.map((tag) => {
            if (tag.length !== 0) {
              return (
                <Tag key={tag} className={classes.post__tag}>
                  {tag}
                </Tag>
              );
            }
          })}
        </div>
        <div className={classes.post__text}>{data?.description}</div>
        {data !== undefined ? <ReactMarkdown className={classes.post__body}>{data?.body}</ReactMarkdown> : ''}
      </div>
      <div className={classes.post__right}>
        <div className={classes.post__right_container}>
          <p className={classes.post__personName}>{data?.author.username}</p>
          {data?.createdAt && <p className={classes.post__date}>{format(new Date(data.createdAt), 'MMMM d, yyyy')}</p>}
        </div>
        <img src={data?.author.image} alt="avatar" className={classes.post__image} />
        {isAuthor() ? (
          <>
            <Popconfirm
              title="Delete Article"
              description="Are you sure to delete this article?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
              placement="right"
        >
          <button className={classes.post__delete}>Delete</button>
        </Popconfirm>
        <Link to={`/articles/${slug}/edit`} className={classes.post__edit}>
          Edit
        </Link>
          </>

        ) : null}
        
      </div>
    </div>
  );
};

export default Post;
