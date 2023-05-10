import classes from './Registration.module.scss';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchRegister, selectIsAuth } from '../../store/authSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const navigate = useNavigate();
  const [errorPassword, setErrorPassword] = useState('');
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      repeatPassword: '',
      checkbox: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: { username: string; email: string; password: string; repeatPassword: string }) => {
    if (data.password !== data.repeatPassword && data.repeatPassword.length !== 0) {
      setErrorPassword('Пароли не совпадают');
    } else {
      setErrorPassword('');
    }
    
    dispatch(fetchRegister(data));

  };

  if(isAuth) {
    navigate('/');
  }

  return (
    <div className={classes.login}>
      <h1 className={classes.login__title}>Create new account</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          <p className={classes.login__name}>Username</p>
          <input
            type="text"
            className={`${classes.login__input} ${errors.username ? classes.errorInput : ''}`}
            placeholder="Username"
            {...register('username', {
              required: 'Укажите имя',
              pattern: /^[^@#$%^&*().]+$/i,
              maxLength: { value: 20, message: 'Имя слишком длинное' },
              minLength: { value: 3, message: 'Имя слишком короткое' },
            })}
          />
          {errors.username && <div className={classes.error}>{errors.username?.message}</div>}
          {errors.username?.type === 'pattern' && <span className={classes.error}>Недопустимый символ</span>}
        </label>
        <label>
          <p className={classes.login__name}>Email address</p>
          <input
            type="email"
            className={`${classes.login__input} ${errors.email ? classes.errorInput : ''}`}
            placeholder="Email address"
            {...register('email', { required: 'Укажите почту' })}
          />
          {errors.email && <div className={classes.error}>{errors.email.message}</div>}
        </label>
        <label>
          <p className={classes.login__name}>Password</p>
          <input
            type="password"
            className={`${classes.login__input} ${errors.password ? classes.errorInput : ''}`}
            placeholder="Password"
            {...register('password', {
              required: 'Укажите пароль',
              maxLength: { value: 40, message: 'Пароль слишком длинный' },
              minLength: { value: 6, message: 'Пароль слишком короткий' },
            })}
          />
          {errors.password && <div className={classes.error}>{errors.password.message}</div>}
        </label>
        <label>
          <p className={classes.login__name}>Repeat password</p>
          <input type="password" className={classes.login__input} placeholder="Repeat password" />
          {errorPassword && <div className={classes.error}>{errorPassword}</div>}
        </label>
        <label>
          <input 
              type="checkbox" 
              className={classes.login__checkbox} 
              {...register('checkbox', {
                required: 'Нажмите для согласия на обработку данных'
              })}/>
          <p className={classes.login__text}>I agree to the processing of my personal information</p>
          {errors.checkbox && <div className={classes.error_checkbox}>{errors.checkbox.message}</div>}
        </label>
        <button type="submit" className={classes.login__button}>Create</button>
      </form>

      <p className={classes.login__signIn}>Already have an account? <span onClick={() => navigate('/sign-in')} className={classes.signin}>Sign in</span>.</p>
    </div>
  );
};

export default Registration;
