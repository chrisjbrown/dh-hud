function isDocument(doc) {
    return doc !== void 0 && doc !== null && doc instanceof foundry.abstract.Document;
}
function isDocumentClass(doc) {
    return doc !== void 0 && doc !== null && Object.prototype.isPrototypeOf.call(foundry.abstract.Document, doc);
}
function isDocumentCollection(collection) {
    return collection !== void 0 && collection !== null && collection instanceof DocumentCollection;
}
function isEmbeddedCollection(collection) {
    return collection !== void 0 && collection !== null && collection instanceof foundry.abstract.EmbeddedCollection;
}
function isFolder(doc) {
    return doc !== void 0 && doc !== null && doc instanceof Folder;
}
function isFolderClass(doc) {
    return doc !== void 0 && doc !== null && Object.prototype.isPrototypeOf.call(Folder, doc);
}

export { isDocument, isDocumentClass, isDocumentCollection, isEmbeddedCollection, isFolder, isFolderClass };
//# sourceMappingURL=index.js.map
