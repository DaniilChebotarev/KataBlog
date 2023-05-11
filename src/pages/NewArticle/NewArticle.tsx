import classes from './NewArticle.module.scss';
import { useFieldArray, useForm } from 'react-hook-form';
import { useAppDispatch } from '../../hooks/redux';
import { IFetchArticles, fetchArticles } from '../../store/blogSlice';
import { useNavigate } from 'react-router-dom';

const NewArticle = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const defaultValues: IFetchArticles = {
    title: '',
    description: '',
    body: '',
    tagList: [],
  };

  const {
    register,
    control,
    handleSubmit,

    formState: { errors, isValid },
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


  const onSubmit = (data: IFetchArticles) => {
    console.log(data)
    dispatch(fetchArticles(data)).then((res) => {
      localStorage.setItem("slug", res.payload.slug);
      navigate(`/articles/${res.payload.slug}`);
      localStorage.removeItem('slug');
    });
  };

  return (
    <div className={classes.article}>
      <h1 className={classes.article__title}>Create new article</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.article__form}>
        <label>
          <p className={classes.article__text}>Title</p>
          <input
            className={`${classes.article__input} ${errors.title ? classes.errorInput : ''}`}
            type="text"
            placeholder="Title"
            {...register('title', { required: 'Укажите заголовок' })}
          />
          {errors.title && <div className={classes.error}>{errors.title.message}</div>}
        </label>
        <label>
          <p className={classes.article__text}>Short description</p>
          <input
            className={`${classes.article__input} ${errors.title ? classes.errorInput : ''}`}
            type="text"
            placeholder="Title"
            {...register('description', { required: 'Укажите описание' })}
          />
          {errors.description && <div className={classes.error}>{errors.description?.message}</div>}
        </label>
        <label>
          <p className={classes.article__text}>Text</p>
          <textarea
            className={`${classes.article__bigInput} ${errors.body ? classes.errorInput : ''}`}
            placeholder="Text"
            {...register('body', { required: 'Укажите текст' })}
          />
          {errors.body && <div className={classes.error}>{errors.body?.message}</div>}
        </label>
        <label>
          <p className={classes.article__text}>Tags</p>
          {fields && fields.length > 0 ? (
            fields.map((field, index) => (
              <section key={field.id}>
                <input
                  className={classes.article__inputTag}
                  type="text"
                  placeholder="Tag"
                  {...register(`tagList.${index}.name`, { required: 'Укажите тег' })}
                />
                <button onClick={() => remove(index)} className={classes.article__delete}>
                  Delete
                </button>
                {index === fields.length - 1 && (
                  <button onClick={() => append({name: ''})} className={classes.article__add} disabled={!isValid}>
                    Add tag
                  </button>
                )}
              </section>
            ))
          ) : (
            <>
              <button className={classes.article__delete}>Delete</button>
              <button onClick={() => append({name: ''})} className={classes.article__add}>
                Add tag
              </button>
            </>
          )}
        </label>
        <button type="submit" className={classes.article__btn}>
          Send
        </button>
      </form>
    </div>
  );
};

export default NewArticle;
