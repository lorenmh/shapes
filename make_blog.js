/* jshint node: true */
var fs = require('fs');

fs.readFile('./blog.md', 'utf8', function (e, d) {
  if (e) {
    return console.log(e);
  }
  fs.writeFile('blog.json', JSON.stringify({
    title: "plutonium.io's First Post: An Introduction",
    text: d,
  }));
});