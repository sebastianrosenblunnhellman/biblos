import { Library } from '../../../models/library';
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      
      // Carga la biblioteca desde el archivo JSON
      const filePath = path.join(process.cwd(), 'data', 'sampleLibrary.json');
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const library = Library.fromJSON(fileContents);
      
      // Busca el item solicitado
      const item = library.getItem(id);
      
      if (!item) {
        return res.status(404).json({ error: 'Item no encontrado' });
      }
      
      res.status(200).json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener el item' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
