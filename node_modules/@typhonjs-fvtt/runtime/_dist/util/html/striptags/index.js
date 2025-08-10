function isSpace(character) {
    return character == " " || character == "\n" || character == "\r" || character == "\t";
}
function isQuote(character) {
    return character == '"' || character == "'";
}
const TAG_START = "<";
const TAG_END = ">";
const ENCODED_TAG_START = "&lt;";
const ENCODED_TAG_END = "&gt;";
class InPlaintextState {
    options;
    constructor(options) {
        this.options = options;
    }
    consume(character, transition) {
        if (character == TAG_START) {
            transition(new InTagNameState(this.options));
            return "";
        }
        else if (character == TAG_END && this.options.encodePlaintextTagDelimiters) {
            return ENCODED_TAG_END;
        }
        return character;
    }
}
class InTagNameState {
    options;
    nameBuffer = "";
    isClosingTag = false;
    constructor(options) {
        this.options = options;
    }
    consume(character, transition) {
        if (this.nameBuffer.length == 0) {
            if (isSpace(character)) {
                transition(new InPlaintextState(this.options));
                return ((this.options.encodePlaintextTagDelimiters ? ENCODED_TAG_START : "<") +
                    character);
            }
            if (character == "/") {
                this.isClosingTag = true;
                return "";
            }
        }
        if (isSpace(character)) {
            if (this.isNameBufferAnAllowedTag()) {
                transition(new InTagState(0 /* TagMode.Allowed */, this.options));
                return TAG_START + (this.isClosingTag ? "/" : "") + this.nameBuffer + character;
            }
            else {
                transition(new InTagState(1 /* TagMode.Disallowed */, this.options));
                return this.options.tagReplacementText;
            }
        }
        if (character == TAG_START) {
            this.nameBuffer += ENCODED_TAG_START;
            return "";
        }
        if (character == TAG_END) {
            transition(new InPlaintextState(this.options));
            if (this.isNameBufferAnAllowedTag()) {
                return TAG_START + (this.isClosingTag ? "/" : "") + this.nameBuffer + character;
            }
            else {
                return this.options.tagReplacementText;
            }
        }
        if (character == "-" && this.nameBuffer == "!-") {
            transition(new InCommentState(this.options));
            return "";
        }
        this.nameBuffer += character;
        return "";
    }
    isNameBufferAnAllowedTag() {
        const tagName = this.nameBuffer.toLowerCase();
        if (this.options.allowedTags) {
            return this.options.allowedTags.has(tagName);
        }
        else if (this.options.disallowedTags) {
            return !this.options.disallowedTags.has(tagName);
        }
        else {
            return false;
        }
    }
}
class InTagState {
    mode;
    options;
    constructor(mode, options) {
        this.mode = mode;
        this.options = options;
    }
    consume(character, transition) {
        if (character == TAG_END) {
            transition(new InPlaintextState(this.options));
        }
        else if (isQuote(character)) {
            transition(new InQuotedStringInTagState(this.mode, character, this.options));
        }
        if (this.mode == 1 /* TagMode.Disallowed */) {
            return "";
        }
        if (character == TAG_START) {
            return ENCODED_TAG_START;
        }
        else {
            return character;
        }
    }
}
class InQuotedStringInTagState {
    mode;
    quoteCharacter;
    options;
    constructor(mode, quoteCharacter, options) {
        this.mode = mode;
        this.quoteCharacter = quoteCharacter;
        this.options = options;
    }
    consume(character, transition) {
        if (character == this.quoteCharacter) {
            transition(new InTagState(this.mode, this.options));
        }
        if (this.mode == 1 /* TagMode.Disallowed */) {
            return "";
        }
        if (character == TAG_START) {
            return ENCODED_TAG_START;
        }
        else if (character == TAG_END) {
            return ENCODED_TAG_END;
        }
        else {
            return character;
        }
    }
}
class InCommentState {
    options;
    consecutiveHyphens = 0;
    constructor(options) {
        this.options = options;
    }
    consume(character, transition) {
        if (character == ">" && this.consecutiveHyphens >= 2) {
            transition(new InPlaintextState(this.options));
        }
        else if (character == "-") {
            this.consecutiveHyphens++;
        }
        else {
            this.consecutiveHyphens = 0;
        }
        return "";
    }
}

const DefaultStateMachineOptions = {
    tagReplacementText: "",
    encodePlaintextTagDelimiters: true,
};
class StateMachine {
    state;
    transitionFunction;
    constructor(partialOptions = {}) {
        this.state = new InPlaintextState({
            ...DefaultStateMachineOptions,
            ...partialOptions,
        });
        this.transitionFunction = ((next) => {
            this.state = next;
        }).bind(this);
    }
    consume(text) {
        let outputBuffer = "";
        for (const character of text) {
            outputBuffer += this.state.consume(character, this.transitionFunction);
        }
        return outputBuffer;
    }
}
function striptags(text, options = {}) {
    return new StateMachine(options).consume(text);
}

export { DefaultStateMachineOptions, StateMachine, striptags };
//# sourceMappingURL=index.js.map
