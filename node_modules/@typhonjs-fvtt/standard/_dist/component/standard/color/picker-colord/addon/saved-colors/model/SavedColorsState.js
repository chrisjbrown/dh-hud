/**
 * Provides management of all saved colors in a session storage store.
 *
 * Note:
 */
export class SavedColorsState
{
   static #webStorageKey = 'trl:standard:tjs-colord-picker:addon:saved-colors:state';

   #colorArray = [];

   /** @type {import('../../../model').InternalState} */
   #internalState;

   #webStorageStore;

   /**
    * Stores the subscribers.
    *
    * @type {import('svelte/store').Subscriber<string[]>[]}
    */
   #subscriptions = [];

   /**
    * Stores the unsubscribe function from the session storage store.
    *
    * @type {Function}
    */
   #unsubscribe;

   /**
    * @param {import('../../../model/InternalState').InternalState} internalState - Internal picker state.
    */
   constructor(internalState)
   {
      this.#internalState = internalState;

      const storage = internalState.webStorage;

      this.#webStorageStore = storage.getStore(SavedColorsState.#webStorageKey, []);

      this.#unsubscribe = this.#webStorageStore.subscribe(this.#webStorageUpdate.bind(this));
   }

   destroy()
   {
      this.#unsubscribe();

      this.#internalState = void 0;
      this.#webStorageStore = void 0;
      this.#unsubscribe = void 0;
   }


   addColor()
   {
      const color = this.#internalState.colorState.getColor({ format: 'hsl', formatType: 'string' });

      const currentIndex = this.#colorArray.findIndex((elem) => elem === color);

      // Move color to front of array as applicable.
      if (currentIndex > 0)
      {
         this.#colorArray.splice(currentIndex, 1);
         this.#colorArray.unshift(color);

         // Remove last color if list length is greater than 16.
         if (this.#colorArray.length > 16) { this.#colorArray.pop(); }

         this.#webStorageStore.set(this.#colorArray);
      }
      else if (currentIndex === -1)
      {
         this.#colorArray.unshift(color);

         // Remove last color if list length is greater than 16.
         if (this.#colorArray.length > 16) { this.#colorArray.pop(); }

         this.#webStorageStore.set(this.#colorArray);
      }
   }

   deleteColor(color)
   {
      const currentIndex = this.#colorArray.findIndex((elem) => elem === color);

      if (currentIndex >= 0)
      {
         this.#colorArray.splice(currentIndex, 1);
         this.#webStorageStore.set(this.#colorArray);
      }
   }

   deleteAll()
   {
      this.#webStorageStore.set([]);
   }

   /**
    * Invoked when the session storage store changes.
    *
    * @param {string[]} colorArray -
    */
   #webStorageUpdate(colorArray)
   {
      this.#colorArray = colorArray;
      this.#updateSubscribers();
   }

   // Store subscriber implementation --------------------------------------------------------------------------------

   /**
    * @param {import('svelte/store').Subscriber<string[]>} handler - Callback function that is invoked on update /
    * changes.
    *
    * @returns {import('svelte/store').Unsubscriber} Unsubscribe function.
    */
   subscribe(handler)
   {
      this.#subscriptions.push(handler); // add handler to the array of subscribers

      handler(this.#colorArray);         // call handler with current value

      // Return unsubscribe function.
      return () =>
      {
         const index = this.#subscriptions.findIndex((sub) => sub === handler);
         if (index >= 0) { this.#subscriptions.splice(index, 1); }
      };
   }

   /**
    * Updates subscribers.
    */
   #updateSubscribers()
   {
      for (let cntr = 0; cntr < this.#subscriptions.length; cntr++) { this.#subscriptions[cntr](this.#colorArray); }
   }
}
