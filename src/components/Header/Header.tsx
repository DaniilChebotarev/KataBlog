import classes from './Header.module.scss';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchAuthMe, logout, selectIsAuth } from '../../store/authSlice';
import { useEffect } from 'react';
import avatar from '../PostItem/Pickture.png'

const Header = () => {
  const image = useAppSelector(state => state.authReducer.data?.user.image)
  const dataFromLocalStorage = localStorage.getItem('data');
  const date = dataFromLocalStorage ? JSON.parse(dataFromLocalStorage) : null;
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuth);
  const {data} = useAppSelector(state => state.authReducer)
  const onClickLogout = () => {
    if(window.confirm('Вы действительно хотите выйти?')) {
      dispatch(logout())
      localStorage.clear()
    }
  }

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchAuthMe());
    }
  }, [dispatch, isAuth]);

  return (
    <div className={classes.header}>
      <div className={classes.wrapper}>
        <Link to="/" className={classes.header__title}>
          Realworld Blog
        </Link>
        {isAuth ? (
          <>
          <Link to='new-article' className={classes.header__article}>Create article</Link>
          <Link to='profile' className={classes.header__username}>{data?.user.username}</Link>
          <img className={classes.header__img} src={image ? date.user.image : avatar} />
          <button onClick={onClickLogout} className={classes.header__btn}>Log Out</button>
          </>
        ) : (
          <ul className={classes.header__list}>
            <li>
              <Link to="sign-in" className={classes.header__signIn}>
                Sign In
              </Link>
            </li>
            <li>
              <Link to="sign-up" className={classes.header__signUp}>
                Sign Up
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Header;
