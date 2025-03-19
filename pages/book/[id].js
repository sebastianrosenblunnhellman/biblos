import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/Book.module.css';

export default function Book() {
  const router = useRouter();
  const { id } = router.query;
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/library/${id}`);
        
        if (!response.ok) {
          throw new Error('No se pudo cargar el libro');
        }
        
        const data = await response.json();
        
        if (data.type !== 'book') {
          throw new Error('El ID proporcionado no corresponde a un libro');
        }
        
        setBook(data);
      } catch (error) {
        console.error('Error al cargar el libro:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (!id) return null;
  if (loading) return <div className={styles.container}>Cargando libro...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <Head>
        <title>{book?.name || 'Libro'} | Biblos</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{book.name}</h1>

        <div className={styles.bookDetails}>
          {book.metadata.author && (
            <p className={styles.author}><strong>Autor:</strong> {book.metadata.author}</p>
          )}
          
          {book.metadata.year && (
            <p><strong>Año:</strong> {book.metadata.year}</p>
          )}
          
          {book.metadata.description && (
            <div className={styles.description}>
              <h2>Descripción</h2>
              <p>{book.metadata.description}</p>
            </div>
          )}

          {book.metadata.driveLink && (
            <div className={styles.actions}>
              <a 
                href={book.metadata.driveLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.button}
              >
                Ver/Descargar de Google Drive
              </a>
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <Link href="/browse">Volver a Explorar</Link> | 
        <Link href="/">Inicio</Link>
      </footer>
    </div>
  );
}
