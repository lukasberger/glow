/**
 * Constructor
 */
GLOW = function () {};
/**
 * Stores all the replacements to process at the end
 * @type {Array}
 */
GLOW.prototype.replacements = [];

/**
 * Stores the start and end positions of the already replaced code
 * @type {Array}
 */
GLOW.prototype.replaced_positions = [];

/**
 * Stores class name which will be applied to every styled element
 * @type {string}
 */
GLOW.prototype.global_class = "";

/**
 * If true line numbers will be added to each line of processed code
 * @type {boolean}
 */
GLOW.prototype.add_line_numbers = true;

/**
 * Find all occurences of the pattern in the given code block
 *
 * @param {Object} pattern  an object containing a regex and a scope
 * @param {String} code     a string containing the code block
 */
GLOW.prototype.applyPattern = function (pattern, code) {

    var match = pattern.regex.exec(code), // find the first match
        scope = pattern.scope;

    if (!match) {
        return;
    }

    // get the start and the end positions of the match
    var start = match.index,
        end   = start + match[0].length;

    // check if the match is inside an already existing match, if it is
    // continue with the next match
    if (this.matchInsideExisting(start, end)) {
        return this.applyPattern(pattern, code);
    }

    // save the replacement without modifing current code
    this.saveReplacement(match, scope, code);

    return this.applyPattern(pattern, code);
};
/**
 * Saves the position and the highlighted string for a later replacement
 * 
 * @param  {Object} match  object containing the matched string and start
 * @param  {String} scope  scope of the search
 * @param  {String} code   code we are replacing in
 */
GLOW.prototype.saveReplacement = function (match, scope, code) {

    // get the start and end positions of the match
    var start = match.index,
        end   = start + match[0].length;

    // deletes any existing matches that are inside this match
    this.handleExistingMatches(start, end);

    // update the already replaced positions
    this.replaced_positions[start] = end;

    // save all the information we need to replace the match later
    this.replacements[start] = {
        original : match[0],
        replace  : this.wrapCodeInSpan(match[0], scope),
        scope    : scope
    };
};
/**
 * Checks the existing replacements for any complete overlaps, if any
 * exist, deletes them
 * 
 * @param  {Number} start  starting position of the match
 * @param  {Number} end    end position of the match
 */
GLOW.prototype.handleExistingMatches = function (start, end) {

    // if the match surrounds another match, delete that match
    for (var key in this.replaced_positions) {

        var start1 = parseInt(key, 10),
            end1   = this.replaced_positions[key];

        // if the match completely surrounds an existing delete the
        // existing, otherwise keep the existing
        if (start1 > start && end1 < end) {
            delete this.replaced_positions[key];
            delete this.replacements[key];
        }
    }
};
/**
 * Checks if the first match is completely inside the second match
 * 
 * @param  {Number}  start1  starting position of the first match
 * @param  {Number}  end1    end position of the first match
 * @param  {Number}  start2  start position of the second match 
 * @param  {Number}  end2    end position of the second match
 * @return {boolean}         true if the first match is completely inside
 */
GLOW.prototype.matchCompletelyInsideOther = function (start1, end1, start2, end2) {
    return start1 > start2 && end1 < end2;
};
/**
 * Checks if the match is inside an already existing match
 * @param  {Number}  start starting index of the match
 * @param  {Number}  end   ending index of the match
 * @return {boolean}       true if the match is inside an existing match
 */
GLOW.prototype.matchInsideExisting = function (start, end) {

    var inside = false;

    for (var key in this.replaced_positions) {

        var start1 = parseInt(key, 10),
            end1   = this.replaced_positions[key];

        inside = inside || (start >= start1 && end <= end1);
    }

    return inside;
};
/**
 * Wraps the given code string inside a span with classes based on the 
 * given scope
 * 
 * @param  {String} code   code to wrap in a span
 * @param  {String} scope  scope of the search
 * @return {string}        code wrapped in a span 
 */
GLOW.prototype.wrapCodeInSpan = function (code, scope) {
    return '<span class="' + scope.replace(/\./g, ' ') +
            (this.global_class ? ' ' + this.global_class : '') + '">' + code + '</span>';

};
/**
 * Adds a span with a class based on the scope around the given match in
 * the given block of code
 * 
 * @param  {Object} replacement object containing data needed to replace
 * @param  {String} code        code we are replacing in
 * @return {string}             code with highlighted match
 */
GLOW.prototype.replaceInCode = function (pos, replacement, code) {

    var before = code.substring(0, pos),
        after  = code.substring(pos);

    return before + after.replace(replacement.original, replacement.replace);
};
/**
 * Applies all the replacements on the code
 * 
 * @param  {String} code  code we are replacing on
 * @return {String}       code with all the replacements
 */
GLOW.prototype.processReplacements = function (code) {

    var order = this.findAndReverseKeys(this.replacements);

    for(var i in order) {
        key = parseInt(order[i], 10);
        code = this.replaceInCode(key, this.replacements[key], code);
    }

    return code;
};
/**
 * Returns an array of all the keys of the array from greatest to smallest
 * 
 * @param  {Array} array  array whose indexes we want to find
 * @return {Array}        array of all the indexes in reverse order
 */
GLOW.prototype.findAndReverseKeys = function (array) {

    keys = [];

    // insert all the indexes of array to keys
    for(var index in array) {
        keys.push(index);
    }

    // sort the keys from the greatest to the smallest
    keys = keys.sort(function (a, b) {
        return b - a;
    });

    return keys;

};
/**
 * Adds line numbers to processed code
 * 
 * @param  {string} code  code to add line numbers to
 * @return {string}       code with added line numbers
 */
GLOW.prototype.addLineNumbers = function (code) {

    // count the number of lines
    var lines = code.match(/\n/g).length;

    for (var i = 1; i < lines; i++) {
        code += '<div class="line-number" style="top: ' + (i * 20) +
                'px" data-number="' + i + '"></div>';
    }

    return code;
};
/**
 * Apply the patterns for the given language to the code
 * @param  {String} code      code to apply the patterns to
 * @param  {Object} language  object storing all the replacement patterns
 */
GLOW.prototype.applyLanguagePatterns = function (code, language) {

    for(var key in language) {
        this.applyPattern(language[key], code);
    }

};
/**
 * Highlight a block with the given id based on patterns of the given language
 * @param  {String} id        id of the element containing the code
 * @param  {String} language  string representation of the language 
 */
GLOW.prototype.highlight = function (id, language) {
    
    lang = this.getLanguageByString(language);

    if (lang !== null) {
        this.applyLanguagePatterns(id.innerHTML, lang);
        id.innerHTML = this.processReplacements(id.innerHTML);
        id.innerHTML = this.addLineNumbers(id.innerHTML);

        this.replacements       = [];
        this.replaced_positions = [];
    }
};
/**
 * Finds the language objet by its name
 * @param  {String} language  name of the language
 * @return {Object}           object containing replacements for the language
 */
GLOW.prototype.getLanguageByString = function (language) {
    if (language.toLowerCase() === "java") {
        return Java;
    }

    return null;
};
/**
 * Highlights all code tags on the site 
 */
GLOW.prototype.glow = function () {

    var elems = document.getElementsByTagName('code');

    for (var i = 0; i < elems.length; i++) {
        var language = elems[i].dataset.language;
        this.highlight(elems[i], language);
    }

};


window['GLOW'] = new GLOW();