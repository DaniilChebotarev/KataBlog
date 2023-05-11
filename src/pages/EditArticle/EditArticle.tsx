import classes from './EditArticle.module.scss';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../../axios';
import { IFetchArticles, fetchPutArticles } from '../../store/blogSlice';
import { selectIsAuth } from '../../store/authSlice';

const EditArticle = () => {
  const [titleInput, setTitleInput] = useState('');
  const [shortInput, setShortInput] = useState('');
  const [bodyInput, setBodyInput] = useState('');
  const [tagsInput, setTagsInput] = useState([]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAuth = useAppSelector(selectIsAuth);
  
  const defaultValues: IFetchArticles = {
    title: '',
    description: '',
    body: '',
    tagList: [],
  };

  const {
    handleSubmit,
    control,
    register,
    formState: { isValid },
  } = useForm({
    defaultValues,
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray<any>({
    control,
    name: 'tagList',
    rules: {
      required: 'Please append at least 1 item',
    },
  });

  const onSubmit = (data: { title: string; description: string; body: string }) => {
    dispatch(fetchPutArticles(data));
    navigate('/');
  };

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      const data = localStorage.getItem('data');
      const parse = JSON.parse(data as string);
      const slug = localStorage.getItem('slug');
      const response = await axios.get(`articles/${slug}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setTitleInput(response?.data.article.title);
      setShortInput(response?.data.article.description);
      setBodyInput(response?.data.article.body);
      setTagsInput(response?.data.article?.title);

      if (response?.data.article.author.username !== parse?.user.username) {
        navigate('/');
      }

      if (!isAuth && !token) {
        navigate('/sign-in');
      }
    }

    fetchData();
  }, []);

  return (
    <div className={classes.article}>
      <h1 className={classes.article__title}>Edit article </h1>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.article__form}>
        <label>
          <p className={classes.article__text}>Title</p>
          <input
            className={classes.article__input}
            value={titleInput}
            type="text"
            {...register('title', {
              onChange: (e) => setTitleInput(e.target.value),
            })}
          />
        </label>
        <label>
          <p className={classes.article__text}>Short description</p>
          <input
            className={classes.article__input}
            type="text"
            value={shortInput}
            {...register('description', {
              onChange: (e) => setShortInput(e.target.value),
            })}
          />
        </label>
        <label>
          <p className={classes.article__text}>Text</p>
          <textarea
            className={classes.article__bigInput}
            value={bodyInput}
            {...register('body', {
              onChange: (e) => setBodyInput(e.target.value),
            })}
          />
        </label>
        <label>
          <p className={classes.article__text}>Tags</p>
          {fields && fields.length > 0 ? (
            fields.map((field, index) => (
              <section key={field.id}>
                <input
                  className={classes.article__inputTag}
                  defaultValue=""
                  placeholder="Tag"
                  {...register(`tagList.${index}.name`, { required: 'Укажите тег' })}
                />
                <button onClick={() => remove(index)} className={classes.article__delete}>
                  Delete
                </button>
                {index === fields.length - 1 && (
                  <button onClick={() => append({ name: '' })} className={classes.article__add} disabled={!isValid}>
                    Add tag
                  </button>
                )}
              </section>
            ))
          ) : (
            <>
              <button className={classes.article__delete}>Delete</button>
              <button onClick={() => append({ name: '' })} className={classes.article__add}>
                Add tag
              </button>
            </>
          )}
        </label>
        <button onClick={() => tagsInput} type="submit" className={classes.article__btn}>
          Send
        </button>
      </form>
    </div>
  );
};

export default EditArticle;
