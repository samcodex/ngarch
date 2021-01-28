export function flatten(root) {
  const nodes = [];
  function recurse(node, depth) {
    if (node.children) {
      node.children.forEach(function(child) {
        recurse(child, depth + 1);
      });
    }
    node.depth = depth;
    nodes.push(node);
  }
  recurse(root, 1);
  return nodes;
}

export function getData() {
  return {
    'name': 'flare',
    'children': [
      {
        'name': 'analytics',
        'children': [
          {
            'name': 'cluster',
            'children': [
              {
              'name': 'AgglomerativeCluster',
              'size': 3938
              },
              {
                'name': 'CommunityStructure',
                'size': 3812
              },
              {
                'name': 'HierarchicalCluster',
                'size': 6714
              },
              {
                'name': 'MergeEdge',
                'size': 743
              }
            ]
          },
          {
            'name': 'graph',
                  'children': [{
                  'name': 'BetweennessCentrality',
                  'size': 3534
              }, {
                  'name': 'LinkDistance',
                  'size': 5731
              }, {
                  'name': 'MaxFlowMinCut',
                  'size': 7840
              }, {
                  'name': 'ShortestPaths',
                  'size': 5914
              }, {
                  'name': 'SpanningTree',
                  'size': 3416
              }]
          }, {
              'name': 'optimization',
                  'children': [{
                  'name': 'AspectRatioBanker',
                  'size': 7074
              }]
          }]
      }, {
          'name': 'animate',
              'children': [{
              'name': 'interpolate',
                  'children': [{
                  'name': 'ArrayInterpolator',
                  'size': 1983
              }, {
                  'name': 'ColorInterpolator',
                  'size': 2047
              }, {
                  'name': 'DateInterpolator',
                  'size': 1375
              }, {
                  'name': 'Interpolator',
                  'size': 8746
              }, {
                  'name': 'MatrixInterpolator',
                  'size': 2202
              }, {
                  'name': 'NumberInterpolator',
                  'size': 1382
              }, {
                  'name': 'ObjectInterpolator',
                  'size': 1629
              }, {
                  'name': 'PointInterpolator',
                  'size': 1675
              }, {
                  'name': 'RectangleInterpolator',
                  'size': 2042
              }]
          }, {
              'name': 'ISchedulable',
              'size': 1041
          }, {
              'name': 'Parallel',
              'size': 5176
          }, {
              'name': 'Pause',
              'size': 449
          }, {
              'name': 'Scheduler',
              'size': 5593
          }, {
              'name': 'Sequence',
              'size': 5534
          }, {
              'name': 'Transition',
              'size': 9201
          }, {
              'name': 'Transitioner',
              'size': 19975
          }, {
              'name': 'TransitionEvent',
              'size': 1116
          }, {
              'name': 'Tween',
              'size': 6006
          }]
      }, {
          'name': 'data',
              'children': [{
              'name': 'converters',
                  'children': [{
                  'name': 'Converters',
                  'size': 721
              }, {
                  'name': 'DelimitedTextConverter',
                  'size': 4294
              }, {
                  'name': 'GraphMLConverter',
                  'size': 9800
              }, {
                  'name': 'IDataConverter',
                  'size': 1314
              }, {
                  'name': 'JSONConverter',
                  'size': 2220
              }]
          }, {
              'name': 'DataField',
              'size': 1759
          }, {
              'name': 'DataSchema',
              'size': 2165
          }, {
              'name': 'DataSet',
              'size': 586
          }, {
              'name': 'DataSource',
              'size': 3331
          }, {
              'name': 'DataTable',
              'size': 772
          }, {
              'name': 'DataUtil',
              'size': 3322
          }]
      }]
  };
}
