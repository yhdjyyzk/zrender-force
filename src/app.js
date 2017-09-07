import * as d3 from 'd3';
import zrender from 'zrender/src/zrender';
import Line from 'zrender/src/graphic/shape/Line';
import Circle from 'zrender/src/graphic/shape/Circle';
import Group from 'zrender/src/container/Group';

let w = 800;
let h = 500;

let zr = zrender.init(document.querySelector("#canvas"));
let g = new Group();
zr.add(g);

let simulation = d3.forceSimulation()
   .force("link", d3.forceLink()
      .id(function (d) {
         return d.id;
      })
      .strength(0.2)
   )
   .force("charge", d3.forceManyBody())
   .force("center", d3.forceCenter(w / 2, h / 2));

d3.json('./data.json', function (err, data) {
   simulation.nodes(data.nodes)
      .on("tick", function () {
         g.removeAll();

         data.nodes.forEach((n) => {
            let c = new Circle({
               shape: {
                  cx: n.x,
                  cy: n.y,
                  r: 10
               },
               style: {
                  fill: "gray",
                  stroke: "rgba(255, 255, 255, 0.8)",
                  lineWidth: 3
               },
               z: 1,
               draggable: true
            });

            c.on("mouseover", function() {
               console.log(n.id);
            });

            g.add(c);
         });

         data.links.forEach((l) => {
            let line = new Line({
               shape: {
                  x1: l.source.x,
                  y1: l.source.y,
                  x2: l.target.x,
                  y2: l.target.y
               },
               style: {
                  lineWidth: 2,
                  stroke: 'black'
               }
            });

            g.add(line);
         });
      });

   simulation.force("link")
      .links(data.links);
});