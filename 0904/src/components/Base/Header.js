import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

      const loginButton = (
        <button className="singlebutton5" onClick={this.props.Loginlink}>LOGIN</button>
      );
      const logoutButton = (
        <button className="singlebutton5" onClick={this.props.onLogout}>LOGOUT</button>
      );
      const registerButton = (
        <button className="singlebutton5" onClick={this.props.Registerlink}>JOIN</button>
      );
      const modifyButton = (
        <button className="singlebutton5">MODIFY</button>
      );

      //style={{boxShadow: 'none'}}

        return (
          <div id="header_3">
				    <div class="container_3">
						
              <Link to='/'><h1 id="logo_3">QUIZ</h1></Link>
					    <nav className="nav">
                            <ul className="nav__menu">
                            <li className="nav__menu-item">
                                <Link to='/'>홈</Link>
                            </li>
                            <li
                                className="nav__menu-item"
                            >
                                <Link to="/quiz/packagelist">문제집</Link>
                                <Submenu1 />
                            </li>
                            <li className="nav__menu-item">
                                <Link to="/quiz/singlequiz">문제</Link>
                                <Submenu2 />
                            </li>
                            <li className="nav__menu-item">
                                <a>공지사항</a>
                            </li>
                            <li className="nav__menu-item">
                                <a>질응답</a>
                            </li>
                            </ul>
                        </nav>
						<div id="banner_3">
							<div className="container_3">
								<section>
                  { this.props.isLoggedIn ? logoutButton : loginButton }
                  { this.props.isLoggedIn ? modifyButton : registerButton }
								</section>			
							</div>
						</div>

				</div>
			</div>
        );
    }
}

class Submenu1 extends React.Component {
    render() {
      return (
        <ul className="nav__submenu">
          <li className="nav__submenu-item ">
            <Link to="/quiz/packagelist">전체 문제집</Link>
          </li>
          <li className="nav__submenu-item ">
            <Link to="/quiz/existPackageList">풀었던 문제집</Link>
          </li>
          <li className="nav__submenu-item ">
            <Link to="/quiz/noneExistPackageList">풀지 않은 문제집</Link>
          </li>
          <li className="nav__submenu-item ">
            <Link to="/quiz/minePackageList">내가 낸 문제집</Link>
          </li>
          <li className="nav__submenu-item ">
            <Link to="/quiz/anotherPackageList">남이 낸 문제집</Link>
          </li>
          <li className="nav__submenu-item ">
            추천 문제집
          </li>
        </ul>
        )
      }
    }

class Submenu2 extends React.Component {
    render() {
      return (
        <ul className="nav__submenu">
          <li className="nav__submenu-item ">
            <Link to="/quiz/singlequiz">전체 문제</Link>
          </li>
          <li className="nav__submenu-item ">
            <Link to="/quiz/existQuiz">풀었던 문제</Link>
          </li>
          <li className="nav__submenu-item ">
            <Link to="/quiz/noneExistQuiz">풀지 않은 문제</Link>
          </li>
          <li className="nav__submenu-item ">
            <Link to="/quiz/mineQuiz">내가 낸 문제</Link>
          </li>
          <li className="nav__submenu-item ">
            <Link to="/quiz/anotherQuiz">남이 낸 문제</Link>
          </li>
          <li className="nav__submenu-item ">
            추천 문제
          </li>
        </ul>
        )
      }
    }

Header.propTypes = {
  isLoggedIn: PropTypes.bool,
  onLogout: PropTypes.func,
  Loginlink: PropTypes.func,
  Registerlink: PropTypes.func
};

Header.defaultProps = {
  isLoggedIn: false,
  onLogout: () => { console.error("logout function not defined");},
  Loginlink: () => { console.error("Loginlink function not defined");},
  Registerlink: () => { console.error("Registerlink function not defined");}
};

export default Header;
