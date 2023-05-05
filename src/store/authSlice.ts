import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '.';
import axios from '../axios';
import { Fetch } from '../types/post';

type TauthSlice = {
  data: null | {user: {username: string, email: string, token: string, image?: string}}
  status: string
}



export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async ({ email, password }: Fetch) => {
    const { data } = await axios.post('/users/login', { user: { email, password } });
    localStorage.setItem('token', data.user.token);
    localStorage.setItem('data', JSON.stringify(data));
    return data;
  }
);

export const fetchRegister = createAsyncThunk(
  'auth/fetchUserData',
  async ({ username, email, password }: Fetch) => {
    const { data } = await axios.post('/users', { user: { username, email, password } });
    localStorage.setItem('token', data.user.token);
    localStorage.setItem('data', JSON.stringify(data));
    return data;
  }
);

export const fetchPutUser = createAsyncThunk(
  'put/fetchPutUser',
  async ({ username, email, password, image }: Fetch) => {
    const token = localStorage.getItem('token');
    const { data } = await axios.put('/user', {user: {email, password, username, image}}, {
             headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
    })
    localStorage.setItem("data", JSON.stringify(data));
    localStorage.setItem("image", JSON.stringify(data.user.image));
    return data;
  }
)

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
  const token = localStorage.getItem('token');
  if (token) {
    const response = await axios.get(`/user`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    localStorage.setItem('data', JSON.stringify(response.data));
    return response.data;
  }
  return null;
});

const initialState: TauthSlice = {
  data: null,
  status: 'loading',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
    login: (state, action) => {
      state.data = action.payload;
      localStorage.setItem('data', JSON.stringify(action.payload));
      localStorage.setItem('token', action.payload.user.token);
    },
  },
  extraReducers: {
    [fetchUserData.pending.type]: (state) => {
      state.status = 'loading';
    },
    [fetchUserData.fulfilled.type]: (state, action) => {
      state.data = action.payload;
      state.status = 'loaded';
    },
    [fetchUserData.rejected.type]: (state) => {
      state.status = 'error';
    },
    [fetchAuthMe.pending.type]: (state) => {
      state.status = 'loading';
    },
    [fetchAuthMe.fulfilled.type]: (state, action) => {
      state.data = action.payload;
      state.status = 'loaded';
    },
    [fetchAuthMe.rejected.type]: (state) => {
      state.status = 'error';
    },
    [fetchRegister.pending.type]: (state) => {
      state.status = 'loading';
    },
    [fetchRegister.fulfilled.type]: (state, action) => {
      state.data = action.payload;
      state.status = 'loaded';
    },
    [fetchRegister.rejected.type]: (state) => {
      state.status = 'error';
    },    [fetchAuthMe.rejected.type]: (state) => {
      state.status = 'error';
    },
    [fetchPutUser.pending.type]: (state) => {
      state.status = 'loading';
    },
    [fetchPutUser.fulfilled.type]: (state, action) => {
      state.data = action.payload;
      state.status = 'loaded';
    },
    [fetchPutUser.rejected.type]: (state) => {
      state.status = 'error';
    },
  },
});

export const {logout} = authSlice.actions;
export const selectIsAuth = (state: RootState) => Boolean(state.authReducer.data);
export const authReducer = authSlice.reducer;
