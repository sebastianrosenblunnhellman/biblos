import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Filter from '../components/Filter';
import Footer from '../components/Footer';

export default function Home() {
  const [library, setLibrary] = useState({ children: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await fetch('/api/library');
        if (!response.ok) throw new Error('Error al cargar la biblioteca');
        const data = await response.json();
        setLibrary(data);
        setCurrentFolder(data);
        setFilteredItems(data.children || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  // Navigate to a specific folder
  const navigateToFolder = (folder, index) => {
    if (index === -1) {
      // Go to root
      setCurrentPath([]);
      setCurrentFolder(library);
      setFilteredItems(library.children || []);
    } else {
      // Navigate to a folder in the path or a new folder
      const newPath = index >= 0 ? currentPath.slice(0, index + 1) : [...currentPath, folder];
      setCurrentPath(newPath);

      // Find the target folder by navigating through the path
      let targetFolder = library;
      newPath.forEach(folderName => {
        targetFolder = targetFolder.children.find(item =>
          item.type === 'folder' && item.name === folderName
        ) || targetFolder;
      });

      setCurrentFolder(targetFolder);
      setFilteredItems(targetFolder.children || []);
    }
  };

    // Extract unique categories from the library data
    const getCategories = (folder) => {
    let categories = new Set();

    const traverse = (item) => {
      if (item.type === 'book' && item.metadata && item.metadata.category) {
        categories.add(item.metadata.category);
      }
      if (item.children) {
        item.children.forEach(traverse);
      }
    };

    traverse(folder);
    return Array.from(categories);
  };

  // Filter items based on search query and selected category
  useEffect(() => {
    if (!currentFolder) return;

    let results = currentFolder.children || [];

    // Apply category filter
    if (selectedCategory) {
      results = results.filter(item => item.type === 'folder' || (item.type === 'book' && item.metadata && item.metadata.category === selectedCategory));
    }

    // Apply search query filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      results = searchAllItems(library, query, selectedCategory); // Pass selectedCategory to search
    }

    setFilteredItems(results);
  }, [searchQuery, currentFolder, library, selectedCategory]);

  // Recursive search function (modified to consider category)
const searchAllItems = (folder, query, category) => {
  let results = [];

  if (!folder || !folder.children) return results;

  folder.children.forEach(item => {
    let matches = false;

    if (item.type === 'book') {
      // Check if the item matches the selected category
      const categoryMatch = category === '' || (item.metadata && item.metadata.category === category);

      if (categoryMatch) {
        const title = (item.name || '').toLowerCase();
        const author = (item.metadata && item.metadata.author || '').toLowerCase();
        const description = (item.metadata && item.metadata.description || '').toLowerCase();

        matches = title.includes(query) || author.includes(query) || description.includes(query);
      }
    } else if (item.type === 'folder') {
      matches = (item.name || '').toLowerCase().includes(query);

      const childResults = searchAllItems(item, query, category);
      if (childResults.length > 0) {
        matches = true;
        results = [...results, ...childResults];
      }
    }

    if (matches) results.push(item);
  });

  return results;
};

  if (loading) return <div className={styles.container}>Cargando biblioteca...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;

  const categories = getCategories(library);

  return (
    <div className={styles.container}>
      <Head>
        <title>Biblos - Gestor de Biblioteca</title>
        <meta name="description" content="Sistema de gestión de biblioteca" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Biblos Ψ
        </h1>

        <p className={styles.description}>
          Tu biblioteca de Psicologia Cientifica
        </p>

        <div className={styles.contentWrapper}>
          <div className={styles.filterWrapper}>
            <Filter
              options={categories}
              selected={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
          </div>
          <div className={styles.resultsWrapper}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Buscar por título, autor o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Breadcrumb navigation */}
            <div className={styles.breadcrumbs}>
              <span
                className={styles.breadcrumbItem}
                onClick={() => navigateToFolder(null, -1)}
              >
                Inicio
              </span>
              {currentPath.map((folder, index) => (
                <span key={index}>
                  <span className={styles.breadcrumbSeparator}>/</span>
                  <span
                    className={styles.breadcrumbItem}
                    onClick={() => navigateToFolder(null, index)}
                  >
                    {folder}
                  </span>
                </span>
              ))}
            </div>

            <div className={styles.booksGrid}>
              {/* Render folders first */}
              {filteredItems.filter(item => item.type === 'folder').map((folder, index) => (
                <div
                  key={`folder-${index}`}
                  className={`${styles.bookCard} ${styles.folderCard}`}
                  onClick={() => navigateToFolder(folder.name)}
                >
                  <div className={styles.folderIcon}>📁</div>
                  <h2>{folder.name}</h2>
                  <p className={styles.itemCount}>
                    {folder.children ? `${folder.children.length} elementos` : '0 elementos'}
                  </p>
                </div>
              ))}

              {/* Then render books */}
              {filteredItems.filter(item => item.type === 'book').map((book, index) => (
                <div key={`book-${index}`} className={styles.bookCard}>
                  <h2>{book.name}</h2>
                  <p className={styles.author}>Por: {book.metadata.author || 'Desconocido'}</p>
                  <p className={styles.description}>{book.metadata.description || 'Sin descripción'}</p>
                  <div className={styles.bookDetails}>
                    <span className={styles.category}>{book.metadata.category || 'Sin categoría'}</span>
                    <span className={styles.year}>{book.metadata.year || ''}</span>
                  </div>
                </div>
              ))}

              {filteredItems.length === 0 && (
                <div className={styles.emptyState}>
                  {searchQuery ? 'No se encontraron resultados para tu búsqueda.' : 'Esta carpeta está vacía.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
