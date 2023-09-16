import React from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { getAuth } from 'firebase/auth';
import { doc, setDoc, updateDoc, deleteField } from 'firebase/firestore';
import "./BookList.css";

const Book = ({ isFavorite, id, ...book }) => {
  console.log('ID recibido en el componente Book:', id);
  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  console.log("Props recibidas en el componente Book:", { isFavorite, ...book });


  const addToFavorites = async (userId, bookId) => {
    console.log("Intentando añadir el libro con ID", id, "para el usuario", userId);
    if (!userId) {
      alert("Necesitas iniciar sesión para añadir a favoritos");
      return;
    }
    

    const userDoc = doc(db, 'Favoritos', userId);

    try {
      await setDoc(userDoc, {
        librosFavoritos: {
          [bookId]: true,
        },
      }, { merge: true });

      alert("Libro añadido a favoritos");
    } catch (error) {
      console.error('Error al añadir a favoritos:', error);
    }
  };

  const removeFromFavorites = async (userId, bookId) => {
    console.log("Intentando remover el libro con ID", id, "para el usuario", userId);


    if (!userId) {
      alert("Necesitas iniciar sesión para eliminar de favoritos");
      return;
    }
  
    const userDoc = doc(db, 'Favoritos', userId);
  
    try {
      await updateDoc(userDoc, {
        [`librosFavoritos.${bookId}`]: deleteField(),
      });
  
      alert("Libro eliminado de favoritos");
    } catch (error) {
      console.error('Error al eliminar de favoritos:', error);
    }
  };
  

  return (
    <div className='book-item flex flex-column flex-sb'>
      <div className='book-item-img'>
        <img src={book.cover_img} alt="cover" />
      </div>
      <div className='book-item-info text-center'>
        
        <Link to={`/book/${id}`} {...book}>
          <div className='book-item-info-item title fw-7 fs-18'>
            <span>{book.title}</span>
          </div>
        </Link>
        <div className='book-item-info-item author fs-15'>
          <span className='text-capitalize fw-7'>Autor: </span>
          <span>{book.author ? book.author.join(", ") : "Autor desconocido"}</span>
        </div>
        <div className='book-item-info-item edition-count fs-15'>
          <span className='text-capitalize fw-7'>Ediciones: </span>
          <span>{book.edition_count}</span>
        </div>
        <div className='book-item-info-item publish-year fs-15'>
          <span className='text-capitalize fw-7'>Año de publicación: </span>
          <span>{book.first_publish_year}</span>
        </div>
      </div>
      {isFavorite ? (
  <button onClick={() => removeFromFavorites(userId, id)}
  className="remove-to-favorites-button">
    Eliminar de favoritos
  </button>
) : (
  <button 
    onClick={() => addToFavorites(userId, id)}
    className="add-to-favorites-button"
  >
    <i className="fa fa-heart"></i>  {/* Ícono de Font Awesome */}
    Agregar a favoritos
  </button>
)}

    </div>
  )
}

export default Book;
