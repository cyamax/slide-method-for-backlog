<!-- Printing and PDF exports -->
$(function(){
  var link = document.createElement( 'link' );
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = window.location.search.match( /print-pdf/gi ) ? 'css/print/pdf.css' : 'css/print/paper.css';
  document.getElementsByTagName( 'head' )[0].appendChild( link );
});

function change_html(){
  Reveal.initialize({
    history: true,
    // More info https://github.com/hakimel/reveal.js#dependencies
    dependencies: [
      { src: 'plugin/markdown/marked.js' },
      { src: 'plugin/markdown/markdown.js' },
      { src: 'plugin/notes/notes.js', async: true },
      { src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } }
    ]
  })
  //console.log("markdownからhtmlに変更完了");// More info https://github.com/hakimel/reveal.js#configuration
};
