var v = View();

var colors = [
  '#a63754',
  '#85698c',
  '#5ba69e',
  '#d9753b',
  '#a64724'
];

function randColor() { return colors[ Math.floor(Math.random() * colors.length) ]; }

function range(p) {
  var size, i;
  for (size = p.range[0], i = 0; size <= p.range[1]; size++, i++) {
    p.x += (p.radius * 2 + 15);
    p.size = size;
    p.fillOpacity = 0.5;
    p.strokeOpacity = 1;
    p.color = randColor();
    p.animate = true;
    p.offset = 'RANDOM';
    v.drawShape(p);
  }
}

range({ x: -115, y: 115, radius: 100, range: [ 3, 5 ] });
range({ x: -115, y: 345, radius: 100, range: [ 4, 6 ] });
range({ x: -115, y: 575, radius: 100, range: [ 5, 7 ] });
range({ x: -115, y: 805, radius: 100, range: [ 4, 6 ] });
range({ x: -115, y: 1035, radius: 100, range: [ 3, 5 ] });
