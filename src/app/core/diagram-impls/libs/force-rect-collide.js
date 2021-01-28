import * as d3 from 'd3';

export function rectCollide() {
  let nodes, sizes, masses;
  let rectSize = constant([0, 0]);
  let strength = 1;
  let iterations = 10;

  function force() {
    let i = -1;
    while (++i < iterations) {
      iterate();
    }
  }

  function iterate() {
    let j = -1;
    const tree = d3.quadtree(nodes, xCenter, yCenter).visitAfter(prepare);

    nodes.forEach((node, index) => {
      tree.visit(collide(node, index));
    });
  }

  function collide(node, index) {
    const size = sizes[index];
    const mass = masses[index];
    const xi = xCenter(node);
    const yi = yCenter(node);

    return function(quad, x0, y0, x1, y1) {
      const data = quad.data;
      const xSize = (size[0] + quad.size[0]) / 2;
      const ySize = (size[1] + quad.size[1]) / 2;

      if (data) {
        if (data.index <= node.index) { return; }

        let x = xi - xCenter(data);
        let y = yi - yCenter(data);
        const xd = Math.abs(x) - xSize;
        const yd = Math.abs(y) - ySize;

        if (xd < 0 && yd < 0) {
          const l = Math.sqrt(x * x + y * y);
          const m = masses[data.index] / (mass + masses[data.index]);

          if (Math.abs(xd) < Math.abs(yd)) {
              node.vx -= (x *= xd / l * strength) * m;
              data.vx += x * (1 - m);
          } else {
              node.vy -= (y *= yd / l * strength) * m;
              data.vy += y * (1 - m);
          }
        }
      }

      return x0 > xi + xSize
        || y0 > yi + ySize
        || x1 < xi - xSize
        || y1 < yi - ySize;
    }
  }

  function prepare(quad) {
    // console.log('prepare -- ', quad);
    if (quad.data) {
      quad.size = sizes[quad.data.index];
    } else {
      quad.size = [0, 0];
      let j = -1;
      while (++j < 4) {
        if (quad[j] && quad[j].size) {
          quad.size[0] = Math.max(quad.size[0], quad[j].size[0]);
          quad.size[1] = Math.max(quad.size[1], quad[j].size[1]);
        }
      }
    }
  }

  function xCenter(d) {
    return d.x + d.vx + sizes[d.index][0] / 2;
  }

  function yCenter(d) {
    return d.y + d.vy + sizes[d.index][1] / 2;
  }

  force.initialize = function (_) {
    sizes = (nodes = _).map(rectSize);
    masses = sizes.map(function (d) { return d[0] * d[1]; });
  };

  force.size = function (_) {
    return (arguments.length
      ? (rectSize = typeof _ === 'function' ? _ : constant(_), force)
      : rectSize);
  };

  force.strength = function (_) {
    return (arguments.length ? (strength = +_, force) : strength);
  };

  force.iterations = function (_) {
    return (arguments.length ? (iterations = +_, force) : iterations);
  };

  return force;
}

function constant(_) {
  return function () {
    return _;
  };
}
