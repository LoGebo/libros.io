import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.css";
import logoImg from "../../images/logo.png";
import googleImg from "../../images/google.png";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [user, setUser] = useState(null);
  const handleNavbar = () => setToggleMenu(!toggleMenu);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      }).catch((error) => {
        console.log(error.message);
      });
  };

  const logout = () => {
    signOut(auth).then(() => {
      setUser(null);
    }).catch((error) => {
      console.log(error.message);
    });
  };

  return (
    <nav className='navbar' id="navbar">
      <div className='container navbar-content flex'>
        <div className='brand-and-toggler flex flex-sb'>
          <Link to="/" className='navbar-brand flex'>
            <img src={logoImg} alt="site logo" />
            <span className='text-uppercase fw-7 fs-24 ls-1'> LIBROS.IO </span>
          </Link>
          <button type="button" className='navbar-toggler-btn' onClick={handleNavbar}>
            <HiOutlineMenuAlt3 size={35} style={{
              color: `${toggleMenu ? "#fff" : "#010101"}`
            }} />
          </button>
        </div>
        <div className={toggleMenu ? "navbar-collapse show-navbar-collapse" : "navbar-collapse"}>
          <ul className="navbar-nav">
            <li className='nav-item'>
              <Link to="book" className='nav-link text-uppercase text-white fs-22 fw-6 ls-1'>Inicio</Link>
            </li>
            <li className='nav-item'>
              <Link to="favorite" className='nav-link text-uppercase text-white fs-22 fw-6 ls-1'>Favoritos</Link>
            </li>
            { user ? (
              <>
                <li className='nav-item'>
                  <span className='nav-link text-uppercase text-white fs-22 fw-6 ls-1'>{user.displayName}</span>
                </li>
                <li className='nav-item'>
                  <button onClick={logout} className='nav-link text-uppercase text-white fs-22 fw-6 ls-1'>Log Out</button>
                </li>
              </>
            ) : (
              <li className='nav-item'>
    <button onClick={signInWithGoogle} className='nav-link google-sign-in-btn'>
      <img src={googleImg} alt='Google Logo' />
    </button>
  </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

