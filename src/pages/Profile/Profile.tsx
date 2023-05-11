import { useForm } from 'react-hook-form';
import classes from './Profile.module.scss';
import { useAppDispatch } from '../../hooks/redux';
import { fetchPutUser } from '../../store/authSlice';
import { Fetch } from '../../types/post';
import { useEffect, useState } from 'react';




const Profile = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const dispatch = useAppDispatch()

    const onSubmit = (data: Fetch) => {
        dispatch(fetchPutUser(data));
      };


    useEffect(() => {
      const data = localStorage.getItem('data');
      const parse = JSON.parse(data as string);

      setUsername(parse.user.username);
      setEmail(parse.user.email);
    }, [setUsername, setEmail])

     

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        defaultValues: {
          username: '',
          email: '',
          password: '',
          image: '',
        },
        mode: 'onBlur',
      });

    return (
        <div className={classes.login}>
        <h1 className={classes.login__title}>Edit Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            <p className={classes.login__name}>Username</p>
            <input
              type="text"
              value={username}
              className={`${classes.login__input} ${errors.username ? classes.errorInput : ''}`}
              placeholder="Username"
              {...register('username', {
                required: 'Укажите имя',
                maxLength: { value: 20, message: 'Имя слишком длинное' },
                minLength: { value: 3, message: 'Имя слишком короткое' },
              })}
            />
            {errors.email && <div className={classes.error}>{errors.username?.message}</div>}
          </label>
          <label>
            <p className={classes.login__name}>Email address</p>
            <input
                          value={email}

              type="email"
              className={`${classes.login__input} ${errors.email ? classes.errorInput : ''}`}
              placeholder="Email address"
              {...register('email', { required: 'Укажите почту' })}
            />
            {errors.email && <div className={classes.error}>{errors.email.message}</div>}
          </label>
          <label>
            <p className={classes.login__name}>New password</p>
            <input
              type="password"
              className={`${classes.login__input} ${errors.password ? classes.errorInput : ''}`}
              placeholder="New password"
              {...register('password', {
                required: 'Укажите пароль',
                maxLength: { value: 40, message: 'Пароль слишком длинный' },
                minLength: { value: 6, message: 'Пароль слишком короткий' },
              })}
            />
            {errors.password && <div className={classes.error}>{errors.password.message}</div>}
          </label>
          <label>
            <p className={classes.login__name}>Avatar image(url)</p>
            <input 
                type="url" 
                className={`${classes.login__input} ${errors.password ? classes.errorInput : ''}`}
                placeholder="Avatar image" 
                {...register('image', {
                    required: 'Укажите url'
                })}/>
                {errors.image && <div className={classes.error}>{errors.image.message}</div>}

          </label>
          <button className={classes.login__button}>Save</button>
        </form>
  
      </div>
    );
};

export default Profile;