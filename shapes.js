function toRadians(angle) {
  return Math.PI * (angle / 180);
}

function Vertex(params) {
  params = params || {} ;
  
  var vertex;

  vertex = {};
 
  vertex.x = params.x || 0 ;
  vertex.y = params.y || 0 ;
  
  vertex.toString = function $toString() {
    return '(x: ' + vertex.x + ', y: ' + vertex.y + ')';
  };

  return vertex;
}

function Edge(params) {
  params = params || {};

  var edge;

  edge = {};

  edge.v0 = params.v0 || Vertex() ;
  edge.v1 = params.v1 || Vertex() ;

  edge.toString = function $toString() {
    return '[v0: ' + edge.v0.toString() + ', v1: ' + edge.v1.toString() + ']';
  };

  return edge;
}

/* params.offset: offset angle, radians
 * params.radius: radius of the spheroid
 * params.repel: constant for repellent force
 * params.attract: constant for attractive force
 * params.rand: constant for threshold
 * params.x: x position of center
 * params.y: y position of center
 * params.size: number of edges / size
 * params.edges: an array of edges 
 */
function Shape(params) {
  params = params || {} ;
  var shape, i, angle;

  shape = {};
      
  shape.offset = params.offset || 0 ;
  if (shape.offset === 'RANDOM') { shape.offset = Math.PI * 2 * Math.random(); }

  shape.radius = params.radius || 0 ;
  shape.rand = params.rand || 0 ;
  shape.repel = params.repel || 0 ;
  shape.attract = params.attract || 0 ;
  shape.rand = params.rand || 0 ;
  shape.x = params.x || 0 ;
  shape.y = params.y || 0 ;
  shape.size = params.size || 0 ;
  shape.edges = params.edges || makeCyclicEdges(params.size) ;
  shape.color = params.color || '#000';
  shape.animate = !!params.animate;
  shape.drawBoundingCircle = !!params.drawBoundingCircle;
  shape.fillOpacity = params.fillOpacity !== undefined ? 
                        params.fillOpacity : 0.06 ;
  shape.strokeOpacity = params.strokeOpacity !== undefined ? 
                        params.strokeOpacity: 0.1 ;
  shape.animDur = params.animDur || 
                  function() { return Math.random() * 6000 + 4000 } ;
  shape.rotation =  params.rotation || 
                    function() { return (15 - Math.random() * 30) } ;
  shape.d = function $d() {
    var str, i;
    
    str = '';

    for (i = 0; i < shape.edges.length; i++) {
      if (i === 0) { 
        str += 'M' + shape.edges[i].v0.x + ' ' + shape.edges[i].v0.y;
      }
        str += ' L ' + shape.edges[i].v1.x + ' ' + shape.edges[i].v1.y;
    }

    return str;
  };

  function bezierValues(edge, i) {
    var str, dist, angle, magnitude;
    
    dist = Math.sqrt( Math.pow(edge.v1.x - edge.v0.x, 2) +
                      Math.pow(edge.v1.y - edge.v0.y, 2)
    );

    a0 = Math.atan( edge.v0.y / edge.v0.x );
    a1 = Math.PI + Math.atan( edge.v1.y / edge.v1.x );

    magnitude = 0.3 * dist;
    

    return 'M' + edge.v0.x + ' ' + edge.v0.y + ' C ' +
          ( edge.v0.x + (Math.sin(a0) * magnitude) ) + ' ' +
          ( edge.v0.y + (Math.cos(a0) * magnitude) ) + ', ' +
          ( edge.v1.x + (Math.sin(a1) * magnitude) ) + ' ' +
          ( edge.v1.y + (Math.cos(a1) * magnitude) ) + ', ' +
          edge.v1.x + ' ' + edge.v1.y

    ;


  }

  shape.dC = bezierValues ;

  shape.setPositions = function $setPositions() {
    // $v: vertex
    // $a: angle
    function initVertex( $v, $a ) {
      var $rand = Math.random() * shape.rand;
     
      $v.x = Math.sin($a) * ($rand + shape.radius);
      $v.y = Math.cos($a) * ($rand + shape.radius);
    }

    angle = (function* $angle() {
      var i, multiplier;
      
      i = 0;
      multiplier = shape.edges.length ? 360 / shape.edges.length : 0;
      
      while (i < shape.edges.length) {
        yield (toRadians(i++ * multiplier) + shape.offset) % (2 * Math.PI);
      }
    })();

    var odd = shape.edges.length % 2 === 1;
    var stop = Math.ceil(shape.edges.length / 2);

    for (i = 0; i < stop; i++) {
      initVertex( shape.edges[i * 2].v0, angle.next().value);
      if (!odd || i !== stop - 1) {
        initVertex( shape.edges[i * 2].v1, angle.next().value);
      }
    }
  };

  return shape;
}

function makeCyclicEdges(num) {
  num = num || 0;

  var i, v0, v1, vStart, edges;
  edges = [];
  for (i = 0; i < num; i++) {
    if (i === 0) { vStart = v0 = Vertex(); } else { v0 = v1; }
    if (i === num - 1) { v1 = vStart; } else { v1 = Vertex(); }
    edges.push( Edge({ v0: v0, v1: v1 }) ); 
  }
  return edges;
}

function View(params) {
  params = params || {} ;

  var view, bounds, d3Svg, d3View, d3Clip;

  view = {};

  view.target = params.target || document.body;

  view.bounds = view.target.getBoundingClientRect();
  
  d3Svg = d3.select(view.target).append('svg')
      .attr({
        width: view.bounds.width,
        height: view.bounds.height
      })
  ;
  
  d3View = d3Svg.append('g').attr('clip-path', 'url(#clip)')
  ;
  
  d3View.append('rect').attr({ x: 0, y: 0, width: view.bounds.width, height: view.bounds.height })
      .style({ fill: 'rgba(255,255,255,.6)'})
  
  d3Clip = d3Svg.append('defs')
      .append('clipPath')
      .attr('id', 'clip')
  ;

  
  var clipShape = Shape({
    x: view.bounds.width / 2,
    y: view.bounds.height / 2,
    size: 6,
    radius: (view.bounds.width / 2) * .9
  })
  console.log(clipShape)
  
  clipShape.setPositions();

  d3Clip.append('path')
    .attr({
      transform: 'translate(' + clipShape.x + ', ' + clipShape.y + ')',
      d: clipShape.d()
    })

  view.drawShape = function $drawShape($params) {
    var shape, d3Shape, i;
   

    shape = Shape($params);
    shape.setPositions();
    var translateStr = 'translate(' + shape.x + ', ' + shape.y + ')';
    d3Shape = d3View.append('g')
        .attr({
          transform: translateStr 
        })
    ;

    function rotate() {
      if (shape.animate) {
        d3Shape.transition()
            .duration(shape.animDur())
            .attr({
              transform: translateStr + ' rotate(' + shape.rotation() + ')'
            })
            .each('end', rotate)
        ;
      }
    }

    rotate();

    // for (i = 0; i < shape.edges.length; i++) {
    //   d3Shape.append('line')
    //     .attr({
    //       x1: shape.edges[i].v0.x,
    //       y1: shape.edges[i].v0.y,
    //       x2: shape.edges[i].v1.x,
    //       y2: shape.edges[i].v1.y
    //     })
    //     .style({
    //       stroke: 'black',
    //       'stroke-width': 1
    //     })
    //   ;
    // }

    // for (i = 0; i < shape.edges.length; i++) {
    if (shape.drawBoundingCircle) {
      d3Shape.append('circle')
          .attr({
            cx: 0,
            cy: 0,
            r: shape.radius
          })
          .style({
            stroke: 'black',
            'stroke-width': 1,
            fill: 'transparent'
          })
      ;
    }

    
    d3Shape.append('path')
        .attr({
          d: shape.d()
        })
        .style({
          fill: shape.color,
          stroke: shape.color,
          'fill-opacity': shape.fillOpacity,
          'stroke-opacity': shape.strokeOpacity
        })
    ;
    //}
  };

  view.blah = function(params) {
    // var primes = [3,5,7,11,13,17,19,23,29];
    var primes = [3,6,9];
    var s = [4, 6, 8];

    function a(z) {
    z.forEach(function(el, i) { 
      params.size = el;
      params.i = i;
      view.drawShape(params);
    });
    }

    a(primes);
    //params.x += 300;
    //a(s);
    

    // for (i = 0; i < 10; i++) {
    //   params.size = i + 3;
    //   params.i = i;
    //   view.drawShape(params);
    // }
  };
  
  return view;
} 