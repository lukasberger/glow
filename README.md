Glow.js
=======

Glow.js is a simple syntax highlighter for websites written in JavaScript. It is designed to support multiple languages, with the language files being written according to the textmate language grammar naming conventions. Glow.js is fully
styleable by CSS.

The library will search for all ```<code>``` tags in the source code and apply syntax highlighting for the language that is given in its ```data-language``` attribute, e.g. if the element is ```<code data-language="java">```, then syntax will be highlit based on the rules in languages/java.js.

Installation and usage
----------------------

Include the following code snippet at the end of your website, note that the src path should point to the location of the file on your server, ie. if the file is in the directory **js** then use **js/glow.js**.

```html
<script src="js/glow.js"></script>
```

Include any languages that you want highlit in the following way, changing the src as necessary. The languages folder must placed in the same folder as glow.js:

```html
<script src="js/languages/your_language.js"></script>
```

Lastly, add the following JavaScript code anywhere on your site:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  GLOW.glow();
});
```



You should see something like this:
![glow in action](https://dl.dropboxusercontent.com/u/26288239/glow.png)


