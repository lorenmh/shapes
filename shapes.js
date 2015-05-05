/* jshint node:true */
function toRadians(angle) {
  'use strict';
  return Math.PI * (angle / 180);
}

function Vertex(params) {
  'use strict';

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
  'use strict';

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

function Shape(params) {
  'use strict';

  params = params || {} ;

  var shape, i, angle;

  var RANDOM_OFFSET, DEFAULT_COLOR, DEFAULT_FILL_OPACITY,
      DEFAULT_STROKE_OPACITY, DEFAULT_ANIM_DUR_FN, DEFAULT_ROTATION_FN,
      OFFSET_RANDOM_STRING
  ;

  shape = {};
  
  RANDOM_OFFSET = function $RANDOM_OFFSET() {
    return Math.PI * 2 * Math.random();
  };

  DEFAULT_COLOR = '#000';
  DEFAULT_FILL_OPACITY = 0.06;
  DEFAULT_STROKE_OPACITY = 0.1;
  DEFAULT_ANIM_DUR_FN = function $DEFAULT_ANIM_DUR_FN() {
    return Math.random() * 6000 + 4000;
  };
  DEFAULT_ROTATION_FN = function $DEFAULT_ROTATION_FN() {
    return (15 - Math.random() * 30);
  };
  OFFSET_RANDOM_STRING = 'RANDOM';

  shape.offset =  params.offset || 0 ;
  shape.radius =  params.radius || 0 ;
  shape.rand =    params.rand || 0 ;
  shape.repel =   params.repel || 0 ;
  shape.attract = params.attract || 0 ;
  shape.x =       params.x || 0 ;
  shape.y =       params.y || 0 ;
  shape.size =    params.size || 0 ;
  shape.edges =   params.edges || makeCyclicEdges(params.size) ;
  shape.color =   params.color || DEFAULT_COLOR; 
  shape.animate = !!params.animate;
  shape.drawBoundingCircle = !!params.drawBoundingCircle;
  shape.fillOpacity =   params.fillOpacity !== undefined ? 
                        params.fillOpacity : DEFAULT_FILL_OPACITY ;
  shape.strokeOpacity = params.strokeOpacity !== undefined ? 
                        params.strokeOpacity: DEFAULT_STROKE_OPACITY ;
  shape.animDur =       params.animDurFn || DEFAULT_ANIM_DUR_FN ;
  shape.rotation =      params.rotationFn || DEFAULT_ROTATION_FN ;
  
  if (shape.offset === OFFSET_RANDOM_STRING) {
    shape.offset = Math.PI * 2 * Math.random();
  }

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

  // Doesn't work well; think of refactoring
  function bezierValues(edge) {
    var dist, a0, a1, magnitude;
    
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

  shape.initialize = function $initialize() {
    // $v: vertex
    // $a: angle
    function initVertex( $v, $a ) {
      var $rand = Math.random() * shape.rand;
     
      $v.x = Math.sin($a) * ($rand + shape.radius);
      $v.y = Math.cos($a) * ($rand + shape.radius);
    }

    // converted from generator to curried fn
    angle = (function $angle() {
      var i, multiplier;
      
      i = 0;
      multiplier = shape.edges.length ? 360 / shape.edges.length : 0;
      
      return {
        next: function() {
          return {
            value: (toRadians(i++ * multiplier) + shape.offset) % (2 * Math.PI)
          };
        }
      };
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
  'use strict';
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
  'use strict';
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
    .on('click', (function() {
      var hidden = false;
      return function() {
        if (hidden) {
          showFill();
          hidden = false;
        } else {
          hideFill();
          hidden = true;
        }
      };
    })())
  ;

  d3View.append('rect')
      .attr({
        class: 'white-fill',
        x: 0,
        y: 0,
        width: view.bounds.width,
        height: view.bounds.height
      })
      .style({
        fill: 'url(#radial-gradient)'//'rgba(255,255,255,.6)'
      })
  ;
  
  d3Clip = d3Svg.append('defs')
      .append('clipPath')
      .attr('id', 'clip')
  ;

  var d3GradWrap = d3Svg.append('defs')
      .append('radialGradient')
      .attr({
        id: 'radial-gradient',
        cx: '50%',
        cy: '50%',
        r: '50%',
        fy: '50%'
      })
  ;
  d3GradWrap.append('stop')
      .attr({
        offset: '0%'
      })
      .style({
        'stop-color': 'rgba(255,255,255,.1)'
      })
  ;
  d3GradWrap.append('stop')
      .attr({
        offset: '100%'
      })
      .style({
        'stop-color': 'rgba(0,0,0,0)'
      })
  ;
  
  var clipShape = Shape({
    x: view.bounds.width / 2,
    y: view.bounds.height / 2,
    size: 6,
    radius: (view.bounds.width / 2) * 0.9
  });
  
  clipShape.initialize();

  d3Clip.append('path')
      .attr({
        transform: 'translate(' + clipShape.x + ', ' + clipShape.y + ')',
        d: clipShape.d()
      })
  ;

  view.drawShape = function $drawShape($params) {
    var shape, d3Shape, i;
   

    shape = Shape($params);
    shape.initialize();
    var translateStr = 'translate(' + shape.x + ', ' + shape.y + ')';
    d3Shape = d3View.append('g')
        .attr({
          transform: translateStr 
        })
    ;

    var firstRun = true;
    function rotate() {
      if (shape.animate) {
        var animDur = firstRun ? Math.random() * 6000 + 500 : shape.animDur() ;
        var rot = firstRun ? 90 - (Math.random() * 180) : shape.rotation() ;
        if (firstRun) { firstRun = false; }
        d3Shape.transition()
            .duration(animDur)
            .attr({
              transform: translateStr + ' rotate(' + rot + ')'
            })
            .each('end', rotate)
        ;
      }
    }

    rotate();

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

    
    var d3ShapePath = d3Shape.append('path')
    ;
    
    d3ShapePath.attr({
          d: shape.d(),
          class: 'shape',
          'pointer-events': 'all'
        })
        .style({
          fill: shape.color,
          stroke: shape.color,
          'fill-opacity': shape.fillOpacity,
          'stroke-opacity': shape.strokeOpacity
        })
      .on('mouseover', function() {
        if( shape.x > (0.2 * view.bounds.width) &&
            shape.x < (0.8 * view.bounds.width) &&
            shape.y > (0.2 * view.bounds.height) &&
            shape.y < (0.8 * view.bounds.height)) {
          d3ShapePath.transition().delay(0).duration(200).style({
            'fill-opacity': 0,
            'stroke-opacity': shape.fillOpacity
          }).attr({
            'pointer-events': 'none'
          });
        }
      })
    ;
    //}
  };
  
  return view;
} 

var hideFill = function $hideFill() {
  d3.select('.white-fill').transition()
      .duration(200)
      .delay(0)
      .style({
        'fill-opacity': 0
      })
  ;

  d3.selectAll('path.shape')
    .transition()
      .duration(200)
      .delay(0)
      .style({
        'fill-opacity': 0,
        'stroke-opacity': 0.6
      })
      .attr({
        'pointer-events': 'none'
      });
  ;
};

var showFill = function $showFill() {
  d3.select('.white-fill').transition()
      .duration(200)
      .delay(0)
      .style({
        'fill-opacity': 1
      })
  ;

  d3.selectAll('path.shape')
    .transition()
      .duration(200)
      .delay(0)
      .style({
        'fill-opacity': 0.6,
        'stroke-opacity': 0
      })
      .attr({
        'pointer-events': 'all'
      });
  ;
}