declare function isDocument(doc: unknown): doc is fvtt.Document;
declare function isDocumentClass(doc: unknown): doc is fvtt.DocumentConstructor;
declare function isDocumentCollection(collection: unknown): collection is fvtt.DocumentCollection;
declare function isEmbeddedCollection(collection: unknown): collection is fvtt.EmbeddedCollection;
declare function isFolder(doc: unknown): doc is fvtt.Folder;
declare function isFolderClass(doc: unknown): doc is typeof fvtt.Folder;

export { isDocument, isDocumentClass, isDocumentCollection, isEmbeddedCollection, isFolder, isFolderClass };
