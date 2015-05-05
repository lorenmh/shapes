Hey there, this is [plutonium.io](http://plutonium.io)'s first 'Hello World' to the internet in the form of a blog post.  

What started out as some weekend fun playing around with SVG elements eventually turned into this simple website.  Here you'll find informative blog posts, stories of personal ventures, and recent updates about my projects.  

With my most recent project being this website, I'll quickly go over the nuts and bolts of how I put it together.

The hexagonal animation on the homepage uses [D3.js](http://d3js.org/).  D3.js is a great tool for SVG manipulation, and is generally used for data visualization (The three *D's* in D3 stands for 'Data Driven Documents').

To make the shapes, I coded a `Shape` object which has an array of Edge objects.  `Edge` objects each point to two vertices.  In order to make the actual geometric shape, the vertices of these `Edge` objects need to be placed.  To place the vertices, simple trigonometry is used.  Then the `Shape` object converts the array of vertices into a [path description format](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d).  A *path description* is the string of text which goes into the *d* attribute of an SVG path element.

```
<svg width="20" height="20">
  <path d="M0,0 L 0,20 L 20,20 L 20,0 L 0,0"></path>
</svg>
```
As an example, the above path would correspond to a square.  That cryptic *path description* attribute really just means:
```
Move to (0, 0)
From there draw a line to (0, 20)
From there draw a line to (20, 20)
From there draw a line to (20, 0)
From there draw a line to (0, 0)
```

D3 is used to render these `Shape` objects, to animate them, and to handle all of the mouse events.

For the UI and the routing, [AngularJS](https://angularjs.org) and [Angular UI Router](https://github.com/angular-ui/ui-router) are used.  AngularJS is a library for creating 'front-end applications'.  I am using it to dynamically render templates in the browser.  This means that when you interact with any UI elements, such as the navigation bar links, the browser renders all transitions immediately and in real time, without fetching any templates from the server.

On the backend, I'm using StrongLoop's [LoopBack](http://loopback.io/).  LoopBack is a [node.js](https://nodejs.org/) framework built on top of [express.js](http://expressjs.com/).  So far it's been pretty straightforward to get up and running with LoopBack.  LoopBack comes with a model generator which creates models pre-baked with a REST API.

LoopBack is only used for data persistence, for example, to persist the data (like text) that goes into this blog.

### What to add?
I've decided to deploy this website in its current state although it is lacking in some important features.  Namely, various web crawlers will likely have a difficult time indexing the content on this website, which will effect how well the website performs in search engines results.

The simple fix for that would be to pre-render the website using something like [phantom.js](http://phantomjs.org/).  When one of the web crawlers makes a request for the content of the various endpoints, a pre-rendered template would be returned.

I would choose to pre-render the templates because the load time of the page adversely affects the search engine page rank and keeping the request open while rendering the site with phantom.js might have a negative effect.  That said, it would be more straightforward to render the page on each request made by the web crawler.

I also need to add a way to comment on blog posts or projects.

Thank you for joining me on this commemorative *Hello World* blog post.  Now it's time to get back to work!