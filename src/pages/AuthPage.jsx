import React, { useState, useContext } from 'react';
import { toast } from 'react-hot-toast';
import AuthContext from '../context/auth-context';
import './AuthPage.scss';

/* eslint-disable no-useless-escape */
/* prettier-ignore */
// const emailRegexp = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const context = useContext(AuthContext);

  const submitHandler = event => {
    event.preventDefault();

    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    let loginData = {
      query: `
        query {
          login(email:"${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    if (!isLogin) {
      loginData = {
        query:`
          mutation{
            createUser(userInput:{email:"${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `
      };
    }


    if (email.trim() === '') {
      toast.error('Email cannot be empty!', {
        duration: 3000,
        icon: '🤷‍♂️',
        style: {
          border: '1px solid tomato',
          color: '#b00b69',
        },
      });
      return;
    }

    if (password.trim() === '') {
      toast.error('Password cannot be empty!', {
        duration: 3000,
        icon: '🤷‍♂️',
        style: {
          border: '1px solid tomato',
          color: '#b00b69',
        },
      });
      return;
    }

    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(loginData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !==201) {
          toast.error('Authorization Failed!', {
            duration: 3000,
            icon: '😒',
            style: {
              border: '1px solid tomato',
              color: '#b00b69',
            },
          });
          throw new Error('Failed');
        }
        return res.json();
      })
      .then(resData => {
        if (resData?.data?.login?.token) {
          context.login(
            resData?.data?.login?.token,
            resData?.data?.login?.userId,
            resData?.data?.login?.tokenExpiration,
          );
        }
      }).catch((error) => {
    console.log(error);
      });

  };

  return (
    <form className="auth-form" autoComplete="off" onSubmit={submitHandler}>
      <div className="form-control">
        <label>
          E-mail:
          <input type="email" name="email" />
        </label>
      </div>
      <div className="form-control">
        <label>
          Password:
          <input type="password" name="password" />
        </label>
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={() => setIsLogin(!isLogin)}>Go to {isLogin?'Register':'Login'}</button>
      </div>
    </form>
  );
}
