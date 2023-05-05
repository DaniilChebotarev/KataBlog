import Header from '../Header/Header';
import Home from '../../pages/Home';
import Registration from '../../pages/Registration/Regisration';
import Signin from '../../pages/SignIn/Signin';
import classes from './App.module.scss';
import { Routes, Route } from 'react-router-dom';
import Post from '../../pages/Post/Post';
import { useAppDispatch } from '../../hooks/redux';
import { useEffect } from 'react';
import { fetchAuthMe } from '../../store/authSlice';
import Profile from '../../pages/Profile/Profile';
import NewArticle from '../../pages/NewArticle/NewArticle';
import EditArticle from '../../pages/EditArticle/EditArticle';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <div className={classes.app}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<Registration />} />
        <Route path="/sign-in" element={<Signin />}></Route>
        <Route path="/articles/:id" element={<Post />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path='/new-article' element={<NewArticle />}></Route>
        <Route path='/articles/:id/edit' element={<EditArticle />}></Route>
      </Routes>
    </div>
  );
}

export default App;
