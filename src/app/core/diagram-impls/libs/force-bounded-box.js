import * as d3 from 'd3';

export function boundedBox() {
  let nodes, sizes;
  let bounds;
  let boxSize = constant([0, 0]);

  function force() {
    let node, size;
    let xi, x0, x1, yi, y0, y1;
    let i = -1;

    while (++i < nodes.length) {
      node = nodes[i];
      size = sizes[i];
      xi = node.x + node.vx;
      x0 = bounds[0][0] - xi;
      x1 = bounds[1][0] - (xi + size[0]);
      yi = node.y + node.vy;
      y0 = bounds[0][1] - yi;
      y1 = bounds[1][1] - (yi + size[1]);
      if (x0 > 0 || x1 < 0) {
        node.x += node.vx;
        node.vx = -node.vx;
        if (node.vx < x0) { node.x += x0 - node.vx; }
        if (node.vx > x1) { node.x += x1 - node.vx; }
      }
      if (y0 > 0 || y1 < 0) {
        node.y += node.vy;
        node.vy = -node.vy;
        if (node.vy < y0) { node.vy += y0 - node.vy; }
        if (node.vy > y1) { node.vy += y1 - node.vy; }
      }
    }
  }

  force.initialize = function (_) {
    sizes = (nodes = _).map(boxSize);
  };

  force.bounds = function (_) {
    return (arguments.length ? (bounds = _, force) : bounds);
  };

  force.size = function (_) {
    return (arguments.length
      ? (boxSize = typeof _ === 'function' ? _ : constant(_), force)
      : boxSize);
  };

  return force;
}

function constant(_) {
  return function () { return _; };
}
