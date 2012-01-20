# jQuery Truncate

The *jQuery Truncate* plugin consists of 3 components that extend the jQuery object.

* **truncate**: Get the truncated text and/or the last processed node of the first selected element.
* **closestChild**: Get the closest parent that is a child of selector.
* **truncated**: Make the selected elements truncated with a link to expand them.

Sponsored by [Examiner.com](http://www.examiner.com). Licensed under GNU GPL v3.

## API

###truncated

Make the selected elements truncated with a link to expand it. [Example](http://jsfiddle.net/Poetro/DAxsH/).

####Parameters:
  * *{Number}* **minLength**

    Minimal length of the truncated text.
  * *{Object}* **options**
    Options of `truncate` plus the following:
    * *{String}* **options.wrapper** Optional, Default: *`"<div></div>"`*

        HTML fragment to be used as a wrapper for the hidden part.

    * *{String}* **options.wrapperClass** Optional, Default: *`"element-hidden"`*

        Class to be added to the wrapper.

    * *{String}* **options.toggler** Optional, Default: *`"<a></a>"`*

        HTML fragment to be used to reveal the hidden part.
    * *{String}* **options.togglerClass** Optional, Default: *`"read-more"`*

        Class to be added to the toggler.

    * *{String|Number}* **options.toggleSpeed** Optional, Default: *`"fast"`*

        Speed of the reveal animation.

####Returns:
*{jQuery}* The original jQuery object for chainability.

###truncate

Get the truncated text of the first selected element. The truncated text will be fetched along with the last parsed element.

####Parameters:

  * *{Number}* **minLength**

    The length of the text after to look for safe truncation options.
  * *{Object}* **options**
    * *{String}* **options.retType** Optional, Default: *`"both"`*

        Return type containing the following values,
        - `"both"`: to fetch both the text and the node,
        - `"text"`: just fetch the text part,
        - `"node"`: just fetch the last parsed node.

    * *{Boolean}* **options.wordSafe** Optional, Default: *`true`*

        Truncate on whitespace

    * *{Boolean}* **options.sentenceSafe** Optional, Default: *`true`*

        Truncate on sentence delimiters.

    * {Boolean} **options.truncateWhitespace** Optional, Default: *`true`*

        Truncate multiple whitespace in the text to a single space.

####Returns:

*{Object|String|Node}* Depending on the `retType` option, it can be an object with keys `text` and `node`, or the truncated text, or the last parsed Node.

####Example:
```html
<ul>
  <li class="item-1"><a href="#href-1" class="link-1">Item 1.</a></li>
  <li class="item-2"><a href="#href-2" class="link-2">Item 2.</a></li>
  <li class="item-3"><a href="#href-3" class="link-3">Item 3.</a></li>
  <li class="item-4"><a href="#href-4" class="link-4">Item 4.</a></li>
</ul>
```

```javascript
$('ul').truncate(20, {sentenceSafe: false, retType: 'text'});
```

Output:

```cmd
"Item 1. Item 2. Item"
```

###closestChild

Get the closest parent that is a child of selector.

####Parameters:

 * *{String|Node|jQuery}* **selector**

    A CSS selector, element, jQuery object to match elements against.

 * *{Node|jQuery}* **context**

    The element within which a matching element may be found. If no context is passed in then the context of the jQuery set will be used instead.

####Returns:

*{jQuery}* The child of root (defined by the `selector`), that is a parent of element or an empty jQuery object if none found.

####Example:
```html
<ul>
  <li class="item-1"><a href="#href-1" class="link-1">Item 1.</a></li>
  <li class="item-2"><a href="#href-2" class="link-2">Item 2.</a></li>
  <li class="item-3"><a href="#href-3" class="link-3">Item 3.</a></li>
  <li class="item-4"><a href="#href-4" class="link-4">Item 4.</a></li>
</ul>
```

```javascript
console.log($('.link-1, .link-4').closestChild('ul'));
```

Output:

```cmd
jQuery(li.item-1, li.item-4)
```
