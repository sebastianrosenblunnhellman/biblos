import { Library } from '../../../models/library';
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const query = req.query.q || '';
      
      // Carga la biblioteca desde el archivo JSON
      const filePath = path.join(process.cwd(), 'data', 'sampleLibrary.json');
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const library = Library.fromJSON(fileContents);
      
      // Busca items que coincidan con la consulta
      const results = library.searchItems(query);
      
      res.status(200).json({ results });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al buscar en la biblioteca' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
