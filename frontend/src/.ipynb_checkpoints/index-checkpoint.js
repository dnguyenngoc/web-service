import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';

import './index.css';
import './header.scss'

import Overview from './component/Overview.js';

import Logo from './assets/images/logo.svg'
import GithubLogo from './assets/images/github.png'
import DigiLogo from './assets/images/digi-logo.png'

const routes = [
  {
    path: '/',
    component: Overview,
  }
];

const Header = withRouter(({ history, location }) => {
  const onChange = (event: ChangeEvent<HTMLSelectElement>) => history.push(event.target.value);
    return (
      <div className='block__content'>
       <header>
          <nav className='header'>
            <div className='header__content'>
              <a className='none__text__decoration header__content__digi__logo' href='https://digi-texx.vn/'>
                <img src = {DigiLogo} className='header__content__standard__logo'></img>
              </a>
              <a className='header__content__standard none__text__decoration' href="/">
                <img src={Logo} className='header__content__standard__logo'></img>
                <div className='header__content__standard__detail'>
                  <div className='header__content__standard__detail__title'>
                    Web Scanning
                  </div>
                  <div className='header__content__standard__detail__explain'>
                    A project design by Data Team
                  </div>
                </div>
              </a>
          
            </div>
            <div className='header__tag'>
              <div className='header__tag__padding'></div>
              <div className='header__tag__content'>
                <a className = 'header__tag__content__field none__text__decoration' href='/'>Home</a>
                <a className = 'header__tag__content__field none__text__decoration' href='/workflow'>Processing</a>
                <a className = 'header__tag__content__github none__text__decoration' href='https://git.digi-texx.vn/dbdd-solution-team/pi-cluster-webscan'>
                  <div className = 'header__tag__content__github_icon'>
                    <img src = {GithubLogo}></img>
                  </div>
                  Github
                </a>       
              </div>
            </div>
          </nav>

        </header>
      </div>
       
    );
});

ReactDOM.render(
  <Router forceRefresh={true}>
    <Header/>
     <Switch>
      {routes.map((route) => (
        <Route exact path={route.path} render={() => <route.component />} key={route.path} />
      ))}
    </Switch>
  </Router>,
  document.getElementById('root')
);
