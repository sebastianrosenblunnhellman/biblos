import { Library } from '../../../models/library';
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'data', 'sampleLibrary.json');
      const fileContents = fs.readFileSync(filePath, 'utf8');
      
      // Parseamos el JSON directamente ya que no necesitamos cargar toda la estructura
      res.status(200).json(JSON.parse(fileContents));
    } catch (error) {
      res.status(500).json({ error: 'Error al cargar la biblioteca' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
