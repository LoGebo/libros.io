import React from 'react';
import Navbar from "../Navbar/Navbar";
import SearchForm from "../SearchForm/SearchForm";
import "./Header.css";

const Header = () => {
  return (
    <div className='holder'>
        <header className='header'>
            <Navbar />
            <div className='header-content flex flex-c text-center text-white'>
                <h2 className='header-title text-capitalize'>Encuentra el libro de tu elección.</h2><br />
                <p className='header-text fs-18 fw-3'> Somos Jesús Daniel, Rene y Luis, este proyecto es para nuestra clase de Conectando el Mundo Web. Para lo cual consumimos el API de OpenLibrary.org utilizando React js.</p>
                <SearchForm />
            </div>
        </header>
    </div>
  )
}

export default Header