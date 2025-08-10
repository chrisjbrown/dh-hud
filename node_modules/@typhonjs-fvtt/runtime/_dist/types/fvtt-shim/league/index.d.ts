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
    export { Application, ApplicationOptions, ClientDocument, CompendiumCollection, Folder, Game, RollTable };
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
    export type {
      ApplicationHeaderButton,
      FVTTDataModel as DataModel,
      FVTTDocument as Document,
      FVTTDocumentConstructor as DocumentConstructor,
      FVTTDocumentCollection as DocumentCollection,
      FVTTEmbeddedCollection as EmbeddedCollection,
      EnrichmentOptions,
      FavoriteFolder,
      FontFamilyDefinition,
    };
  }
}
type FVTTDataModel = foundry.abstract.DataModel<any>;
type FVTTDocumentCollection = DocumentCollection<any, any>;
type FVTTEmbeddedCollection = foundry.abstract.EmbeddedCollection<any, any>;
type ApplicationHeaderButton = Application.HeaderButton;
type EnrichmentOptions = TextEditor.EnrichmentOptions;
type FavoriteFolder = FilePicker.FavoriteFolder;
type FVTTDocument = foundry.abstract.Document.Any;
type FVTTDocumentConstructor = foundry.abstract.Document.AnyConstructor;
type FontFamilyDefinition = CONFIG.Font.FamilyDefinition;
