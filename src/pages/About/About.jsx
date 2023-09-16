import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Book from '../../components/BookList/Book';

const About = () => {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    async function fetchFavoriteBooks() {
      if (userId) {
        const docRef = doc(db, 'Favoritos', userId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
          const favoriteBookIds = Object.keys(data.librosFavoritos).filter(id => data.librosFavoritos[id] === true);
  
          const booksDetails = await Promise.all(favoriteBookIds.map(async (id) => {
            const response = await fetch(`https://openlibrary.org/works/${id}.json`);
            const bookData = await response.json();
            console.log("Datos brutos del libro:", bookData);  // Primer log
            const authorKey = bookData.authors[0]?.author?.key;
            const response2 = await fetch(`https://openlibrary.org${authorKey}.json`);
            const author = await response2.json();
            
            const covers = bookData.covers[0];
            const responseEditions = await fetch(`https://openlibrary.org/works/${id}/editions.json`);
            const ediciones = await responseEditions.json();
            let fechaMinima = '9999';

           
            ediciones.entries.forEach((edicion) => {
              if (edicion.publish_date) {
                const fechaPublicacion = edicion.publish_date;

                if (fechaPublicacion < fechaMinima) {
                  fechaMinima = fechaPublicacion;
                }
              }
            });

            const adaptedBookData = {
              id: id,
              title: bookData.title || 'N/D',
              author: bookData.authors ? bookData.authors.map(a => a.name || 'N/D') : [],
              edition_count: bookData.number_of_pages || 'N/D',
              first_publish_year: bookData.publish_date || 'N/D',
              cover_img: bookData.cover ? bookData.cover.large : '',
            };
            
            adaptedBookData.author =  [author.personal_name];
            adaptedBookData.cover_img= `https://covers.openlibrary.org/b/id/${covers}-L.jpg`
            adaptedBookData.edition_count= ediciones.entries.length;
            adaptedBookData.first_publish_year= fechaMinima;
            console.log("Datos adaptados del libro:", adaptedBookData);  // Segundo log

            adaptedBookData.isFavorite = true;
  
            return adaptedBookData;
          }));
  
          console.log("Todos los libros favoritos:", booksDetails);  // Tercer log
          setFavoriteBooks(booksDetails);
        } else {
          console.log('No such document!');
        }
      }
    }
  
    fetchFavoriteBooks();
  }, [userId]);
  

  return (
    <div>
      <div className='section-title'>
      <h2>Mis libros favoritos</h2>
      </div>
      <section className='booklist'>
      <div className='container'>
      <div className='booklist-content grid'>
      {favoriteBooks.map((book) => (
  <Book key={book.id} id={book.id} {...book} isFavorite={true} />
))}
        </div>
      </div>
    </section>

    </div>
  );
};

export default About;

