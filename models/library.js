export class LibraryItem {
  constructor(id, name, type, parent = null, metadata = {}) {
    this.id = id;
    this.name = name;
    this.type = type; // 'folder' o 'book'
    this.parent = parent;
    this.metadata = metadata; // autor, año, descripción, etc.
    this.children = type === 'folder' ? [] : null;
    this.driveLink = type === 'book' ? metadata.driveLink || null : null;
  }

  addChild(child) {
    if (this.type !== 'folder') throw new Error('Cannot add child to a book');
    this.children.push(child);
    return child;
  }
}

export class Library {
  constructor() {
    this.root = new LibraryItem('root', 'Biblioteca', 'folder');
    this.itemsMap = new Map([['root', this.root]]);
  }

  addItem(id, name, type, parentId, metadata = {}) {
    const parent = this.getItem(parentId) || this.root;
    const newItem = new LibraryItem(id, name, type, parentId, metadata);
    parent.addChild(newItem);
    this.itemsMap.set(id, newItem);
    return newItem;
  }

  getItem(id) {
    return this.itemsMap.get(id);
  }

  searchItems(query) {
    query = query.toLowerCase();
    return Array.from(this.itemsMap.values()).filter(item => 
      item.name.toLowerCase().includes(query) || 
      (item.metadata.author && item.metadata.author.toLowerCase().includes(query)) ||
      (item.metadata.description && item.metadata.description.toLowerCase().includes(query))
    );
  }

  toJSON() {
    return JSON.stringify(this.root);
  }

  static fromJSON(jsonString) {
    const library = new Library();
    const parseNode = (node, parentId) => {
      if (node.id === 'root') {
        library.root = node;
        library.itemsMap.set('root', node);
      } else {
        library.addItem(node.id, node.name, node.type, parentId, node.metadata);
      }
      
      if (node.children) {
        node.children.forEach(child => parseNode(child, node.id));
      }
    };
    
    parseNode(JSON.parse(jsonString), null);
    return library;
  }
}
