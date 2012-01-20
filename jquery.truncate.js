/*!
 * @fileOverview Truncation plugins that work together.
 * @author Peter Galiba (Poetro)
 * @requires jQuery 1.4
 * @extends jQuery
 *
 * Contains three plugins:
 * - truncate: Get the truncated text of the first selected element.
 * - closestChild: Get the closest parent that is a child of selector.
 * - truncated: Make the selected elements truncated with a link to expand them.
 *
 * Sponsored by Examiner.com. Licensed under GNU GPL v3.
 */

(function ($, document) {
  var punctations = /[.!?\u00a1\u203c\u2026\u00bf\u203d]\s|\u3002/,
      wordDelim = /\s/,
      truncateDefaults,
      truncatedDefaults,
      /**
       * @namespace Extend jQuery with some trucating functionality.
       * @class jQuery
       */
      fn = $.fn;

  /**
   * Truncate the text in a node to a specific size, closing the last sentence.
   *
   * @param {Node} node
   *   The node to truncate the text in.
   * @param {Number} minLength
   *   The length of the string after to search the end of the sentence.
   * @param {Object} settings
   *
   * @return {Object}
   *   Object with the following fields:
   *    - text: Contains the truncated text.
   *    - node: The last non-text node that was parsed.
   */
  function truncate(nodes, minLength, settings) {
    var text = '',     // Current text
        searching = 1, // Is the search in progress.
        lastNode,      // Last node that was checked
        truncateWhitespace = settings.truncateWhitespace,
        sentenceSafe = settings.sentenceSafe,
        wordSafe = settings.wordSafe,
        checkDelim = sentenceSafe || wordSafe,
        regex = sentenceSafe ? punctations : wordDelim;


    // Go through the nodes to find minLength text plus the next puctation.
    (function getText(elems) {
      var elem,   // Current DOM element to check.
          i = 0,  // Iteration variable
          result; // Results of the regex execution.

      for (; elems[i] && searching; i += 1) {
        elem = elems[i];

        // Get the text from text nodes and CDATA nodes.
        if (elem.nodeType === 3 || elem.nodeType === 4) {
          // Trim the value if the text is still empty.
          text += text ? elem.nodeValue : elem.nodeValue.replace(/^\s+/g, '');
          if (truncateWhitespace) {
            text = text.replace(/\s+/g, ' ');
          }
          // Check if the text is enough.
          if (text.length >= minLength) {
            if (checkDelim) {
              result = regex.exec(text.slice(minLength));
              if (result) {
                text = text.slice(0, minLength + result.index + (wordSafe ? 0 : 1));
                searching = 0;
              }
            }
            else {
              searching = 0;
            }
          }
        }
        // Traverse everything else, except comment nodes.
        else if (elem.nodeType !== 8) {
          lastNode = elem;
          getText(elem.childNodes);
        }
      }
    }(nodes));

    return {
      text: text,
      node: lastNode
    };
  }

  /**
   * Get the truncated text of the first selected element.
   *
   * The truncated text will be fetched along with the last parsed element.
   *
   * @extends jQuery#
   *
   * @param {Number} minLength
   *   The length of the text after to look for safe truncation options.
   * @param {Object} options
   * @param {String} [options.retType="both"]
   *   Return type containing the following values,
   *    - 'both': to fetch both the text and the node,
   *    - 'text': just fetch the text part,
   *    - 'node': just fetch the last parsed node.
   * @param {Boolean} [options.wordSafe=true]
   *   Truncate on whitespace
   * @param {Boolean} [options.sentenceSafe=true]
   *   Truncate on sentence delimiters.
   * @param {Boolean} [options.truncateWhitespace=true]
   *   Truncate multiple whitespace in the text to a single space.
   *
   * @returns {Object|String|Node}
   *   Depending on the retType option, it can be an object with keys text, node,
   *   or the truncated text, or the last parsed Node.
   */
  fn.truncate = function (minLength, options) {
    var truncated = null, settings, retType;
    if (this[0]) {
      settings = $.extend({}, truncateDefaults, options);
      truncated = truncate(this.eq(0), minLength, settings);
      retType = settings.retType;
      if (retType !== 'both' && retType in truncated) {
        truncated = truncated[retType];
      }
    }
    return truncated;
  };

  truncateDefaults = fn.truncate.defaultSettings = {
    retType: 'both',
    wordSafe: true,
    sentenceSafe: true,
    truncateWhitespace: true
  };

  /**
   * Get the closest parent that is a child of selector.
   *
   * @extends jQuery#
   *
   * @param {String|Node|jQuery} selector
   *   A CSS selector, element, jQuery object to match elements against.
   * @param {Node|jQuery} context
   *   The element within which a matching element may be found. If no context
   *   is passed in then the context of the jQuery set will be used instead.
   *
   * @returns {jQuery}
   *   The child of root (defined by the selector), that is a parent of element or an empty jQuery object
   *   if none found.
   */
  fn.closestChild = function (selector, context) {
    var pos = $.expr.match.POS.test(selector) || typeof selector !== "string" ?
          $(selector, context || this.context) :
          0,
        elem,
        ret = [], i, l, cur = this[0];

    for (i = 0, l = this.length; i < l; i+=1) {
      elem = cur = this[i];

      while ( cur ) {
        if (pos ? pos.index(cur) > -1 : $(cur).is(selector)) {
          ret.push(elem);
          break;

        } else {
          elem = cur;
          cur = cur.parentNode;
          if (!cur || !cur.ownerDocument || cur === context || cur.nodeType === 11) {
            break;
          }
        }
      }
    }

    ret = ret.length > 1 ? $.unique(ret) : ret;

    return this.pushStack(ret, "closestChild", selector);
  };

  /**
   * Make the selected elements truncated with a link to expand it.
   *
   * @extends jQuery#
   *
   * @param {Number} minLength
   *   Minimal length of the truncated text.
   * @param {Object} options
   *   Options of truncate plus the following:
   * @param {String} [options.wrapper="<div></div>"]
   *   HTML fragment to be used as a wrapper for the hidden part.
   * @param {String} [options.wrapperClass="element-hidden"]
   *   Class to be added to the wrapper.
   * @param {String} [options.toggler="<a></a>"]
   *   HTML fragment to be used to reveal the hidden part.
   * @param {String} [options.togglerClass="read-more"]
   *   Class to be added to the toggler.
   * @param {String|Number} [options.toggleSpeed="fast"]
   *   Speed of the reveal animation.
   *
   * @returns {jQuery}
   *   The original jQuery object for chainability.
   */
  fn.truncated = function (minLength, options) {
    var i = 0, l = this.length, cur, truncated,
        settings = $.extend({}, truncatedDefaults, options),
        rootItem, nextItems;

    function toggle() {
      var toggler = $(this);
      toggler.next().slideDown(settings.toggleSpeed);
      toggler.remove();
      return false;
    }

    if (l) {
      settings.retType = 'node';
      for (; i < l; i += 1) {
        cur = this.eq(i);
        truncated = cur.truncate(minLength, settings);
        rootItem = truncated && $(truncated).closestChild(cur);
        if (rootItem.length) {
          nextItems = rootItem.nextAll();
          if (nextItems.length) {
            nextItems.wrapAll($(settings.wrapper, {'class': settings.wrapperClass}));
            $(settings.toggler, {
              text: settings.togglerText,
              href: '#',
              'class': settings.togglerClass,
              click: toggle
            }).insertAfter(rootItem);
          }
        }
      }
    }
    return this;
  };

  truncatedDefaults = fn.truncated.defaultSettings = {
    wrapper: '<div></div>',
    wrapperClass: 'element-hidden',
    toggler: '<a></a>',
    togglerText: 'Continue reading',
    togglerClass: 'read-more',
    toggleSpeed: 'fast'
  };
}(jQuery, document));
