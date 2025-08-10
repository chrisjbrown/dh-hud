export {};
/**
 * @hidden
 */
declare global {
  /**
   * Re-exports common global types between `pf2e` and `league` types.
   *
   * @hidden
   */
  namespace fvtt {
    export {
      Application,
      ApplicationOptions,
      ClientDocument,
      CompendiumCollection,
      Folder,
      FontFamilyDefinition,
      Game,
      RollTable,
    };
  }
}

/**
 * Re-exports global Foundry VTT types under a namespace shim to disambiguate global Foundry types referenced in TRL.
 *
 * @hidden
 *
 * @packageDocumentation
 */
declare global {
  /**
   * @hidden
   */
  namespace fvtt {
    export {
      ApplicationHeaderButton,
      type FVTTDataModel as DataModel,
      type FVTTDocument as Document,
      type FVTTDocumentConstructor as DocumentConstructor,
      type FVTTDocumentCollection as DocumentCollection,
      type FVTTEmbeddedCollection as EmbeddedCollection,
      EnrichmentOptions,
      type FavoriteFolder,
    };
  }
}
type FVTTDataModel = foundry.abstract.DataModel;
type FVTTDocument = foundry.abstract.Document;
type FVTTDocumentConstructor = DocumentConstructorOf<foundry.abstract.Document>;
type FVTTDocumentCollection = DocumentCollection<any>;
type FVTTEmbeddedCollection = foundry.abstract.EmbeddedCollection<any>;
interface FavoriteFolder {
  /** The source of the folder (e.g. "data", "public") */
  source: string;
  /** The full path to the folder */
  path: string;
  /** The label for the path */
  label: string;
}
