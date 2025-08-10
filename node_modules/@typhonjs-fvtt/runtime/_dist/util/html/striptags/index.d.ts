interface StateMachineOptions {
  readonly allowedTags?: Set<string>;
  readonly disallowedTags?: Set<string>;
  readonly tagReplacementText: string;
  readonly encodePlaintextTagDelimiters: boolean;
}

declare const DefaultStateMachineOptions: StateMachineOptions;
declare class StateMachine {
  private state;
  private transitionFunction;
  constructor(partialOptions?: Partial<StateMachineOptions>);
  consume(text: string): string;
}
declare function striptags(text: string, options?: Partial<StateMachineOptions>): string;

export { DefaultStateMachineOptions, StateMachine, type StateMachineOptions, striptags };
