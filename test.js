

// var colors = [
//   '#a63754',
//   '#85698c',
//   '#5ba69e',
//   '#d9753b',
//   '#a64724'
// ];

var colors = [
  '#50A3A2',
  '#53E3A6',
  '#F79E7F',
  '#F7CF93',
  '#E2F0A5'
];

function randColor() { return colors[ Math.floor(Math.random() * colors.length) ]; }

// function range(p) {
//   var size, i;
//   for (size = p.range[0], i = 0; size <= p.range[1]; size++, i++) {
//     p.x += (p.radius * 2 + 15);
//     p.size = size;
//     p.fillOpacity = 0.5;
//     p.strokeOpacity = 1;
//     p.color = randColor();
//     p.animate = false;
//     p.offset = 'RANDOM';
//     v.drawShape(p);
//   }
// }

// range({ x: -15, y: 115, radius: 20, range: [ 3, 5 ] });
// range({ x: -115, y: 345, radius: 20, range: [ 4, 6 ] });
// range({ x: -115, y: 575, radius: 20, range: [ 5, 7 ] });
// range({ x: -115, y: 805, radius: 100, range: [ 4, 6 ] });
// range({ x: -115, y: 1035, radius: 100, range: [ 3, 5 ] });


function shapeArray(v, p) {
  var iY, iX;
  
  var numRows = Math.floor( v.bounds.height / ( p.radius * 2 + p.pad * 2 ) );
  var numCols = Math.floor( v.bounds.width / ( p.radius * 2 + p.pad * 2 ) );
  
  for (iY = 0; iY < numRows; iY++) {
    for (iX = 0; iX < numCols; iX++) {
      v.drawShape({
        x: (p.radius + p.pad) + iX * (p.radius * 2 + p.pad * 2),
        y: (p.radius + p.pad) + iY * (p.radius * 2 + p.pad * 2),
        size: Math.floor(p.range[0] + Math.random() * (p.range[1] - p.range[0] + 1)),
        color: randColor(),
        radius: p.radius,
        offset: 'RANDOM',
        animate: true,
        animDurFn: function() { return 2000 + Math.random() * 2000 ; },
        rotationFn: function() { return 360 - Math.random() * 720 ; },
        fillOpacity: 0.6,
        strokeOpacity: 0.0,
        drawBoundingCircle: false,
        rand: 40
      });
    }
  }
}



// v.blah({ radius: 100, size: 10, x: 300, y: 300, offset: 'RANDOM', rand: 70, color: '#D77FD9', animate: true })
// v.blah({ radius: 200, size: 10, x: 300, y: 300, offset: 'RANDOM', rand: 70, color: '#8FD95B', animate: true })
// v.blah({ radius: 200, size: 10, x: 300, y: 300, offset: 'RANDOM', rand: 70, color: '#6DBBD1', animate: true })
// v.blah({ radius: 200, size: 10, x: 300, y: 300, offset: 'RANDOM', rand: 70, color: '#555252', animate: true })
// v.blah({ radius: 200, size: 10, x: 300, y: 300, offset: 'RANDOM', rand: 70, color: '#F9E185', animate: true })
// v.blah({ radius: 200, size: 10, x: 300, y: 300, offset: 'RANDOM', rand: 70, color: '#D77FD9', animate: true })
// v.blah({ radius: 200, size: 10, x: 300, y: 300, offset: 'RANDOM', rand: 70, color: '#8FD95B', animate: true })
// v.blah({ radius: 200, size: 10, x: 300, y: 300, offset: 'RANDOM', rand: 70, color: '#6DBBD1', animate: true })
// v.blah({ radius: 200, size: 10, x: 300, y: 300, offset: 'RANDOM', rand: 70, color: '#555252', animate: true })
// v.blah({ radius: 200, size: 10, x: 300, y: 300, offset: 'RANDOM', rand: 70, color: '#F9E185', animate: true })
// v.blah({ radius: 200, size: 10, x: 300, y: 300, offset: 'RANDOM', rand: 70, color: 'black', animate: true })
// v.blah({ radius: 200, size: 10, x: 300, y: 300, offset: 'RANDOM', rand: 70, color: 'white', animate: true })
// v.blah({ radius: 200, size: 10, x: 300, y: 300, offset: 'RANDOM', rand: 70, color: '#D77FD9', animate: true })
// v.blah({ radius: 200, size: 10, x: 300, y: 300, offset: 'RANDOM', rand: 70, color: '#6DBBD1', animate: true })
// v.blah({ radius: 200, size: 10, x: 300, y: 300, offset: 'RANDOM', rand: 70, color: 'white', animate: true })