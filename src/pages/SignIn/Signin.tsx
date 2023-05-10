import classes from './Signin.module.scss';
import { useForm } from 'react-hook-form';
import { useAppDispatch, } from '../../hooks/redux';
import { fetchUserData} from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Fetch } from '../../types/post';

const Signin = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit =  async (data: Fetch) => {
      const res = await dispatch(fetchUserData(data))
      const payload = await res.payload;
      if(!payload) {
        setError('Incorrect password');
      } else {
        navigate('/');
      }
  }


  return (
    <div className={classes.signin}>
      <h1 className={classes.signin__title}>Sign in</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          <p className={classes.signin__name}>Email address</p>
          <input
            type="email"
            className={`${classes.signin__input} ${errors.email ? classes.errorInput : ''}`}
            placeholder="Email address"
            {...register('email', { required: 'Укажите почту' })}
          />
          {errors.email && <div className={classes.error}>{errors.email.message}</div>}
        </label>
        <label>
          <p className={classes.signin__name}>Password</p>
          <input
            type="password"
            className={`${classes.signin__input} ${errors.password ? classes.errorInput : ''}`}
            placeholder="Password"
            {...register('password', {
              required: 'Укажите пароль',
              maxLength: { value: 40, message: 'Пароль слишком длинный' },
              minLength: { value: 6, message: 'Пароль слишком короткий' },
            })}
          />
          {errors.password && <div className={classes.error}>{errors.password.message}</div>}
        </label>
        {error && <div className={classes.error}>{error}</div>}
        <button type="submit" className={classes.signin__button}>
             Enter
        </button>
      </form>

      <p className={classes.signin__signUp}>Don’t have an account? <span className={classes.signup} onClick={() => navigate('/sign-up')}>Sign Up</span>.</p>
    </div>
  );
};

export default Signin;
