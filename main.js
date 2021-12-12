const graph = {
    vertices: ["A", "B", "C", "D", "E"],
    edges: [
      { u: "A", v: "B", w: 4 },
      { u: "A", v: "C", w: 2 },
      { u: "B", v: "C", w: 3 },
      { u: "B", v: "D", w: 2 },
      { u: "B", v: "E", w: 3 },
      { u: "C", v: "B", w: 1 },
      { u: "C", v: "D", w: 4 },
      { u: "C", v: "E", w: 5 },
      { u: "E", v: "D", w: -5 },
    ],
    poses: {
      A: { x: 60, y: 180 },
      B: { x: 240, y: 60 },
      C: { x: 240, y: 300 },
      D: { x: 420, y: 60 },
      E: { x: 420, y: 300 }
    }
  };
  
  function bellmanFord(vertices, edges, source) {
    let distance = {};
    let predecessor = {};
  
    vertices.map(v => {
      distance[v] = Infinity;
      predecessor[v] = null;
    });
  
    distance[source] = 0;
  
    for (let i = 1; i < vertices.length; i++) {
      for (let { u, v, w } of edges) {
        if (distance[u] + w < distance[v]) {
          distance[v] = distance[u] + w;
          predecessor[v] = u;
        }
      }
    }
  
    for (let { u, v, w } of edges) {
      if (distance[u] + w < distance[v]) {
        throw "Graph contains a negative-weight cycle";
      }
    }
  
    return { distance, predecessor };
  }
  
  let timeOutRef;
  let nodeOrder = [];
  let i = 0;
  function display() {
    const result = bellmanFord(graph.vertices, graph.edges, "A");
  
    if (i === 0) {
      nodeOrder.push("A");
    } else {
      for (let p in result.predecessor) {
        if (result.predecessor[p] === nodeOrder[nodeOrder.length - 1]) {
          nodeOrder.push(p);
          break;
        }
      }
    }
  
    if (i < graph.vertices.length) {
      i++;
      timeOutRef = setTimeout(display, 1000);
    }
  }
  
  var displayBtn = document.getElementById("displayBtn");
  displayBtn.onclick = () => {
    if (timeOutRef) clearTimeout(timeOutRef);
  
    nodeOrder = [];
    i = 0;
    display();
  };
  
  var canvas = document.getElementById("bellmanCanvas");
  var ctx = canvas.getContext("2d");
  
  canvas.width = 1000;
  canvas.height = 500;
  const radius = 20;
  const margin = 10;
  
  function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let { u, v, w } of graph.edges) {
      var pos = graph.poses[u];
      var toPos = graph.poses[v];
      var vecX = toPos.x - pos.x;
      var vecY = toPos.y - pos.y;
      var magnitude = Math.sqrt(vecX * vecX + vecY * vecY);
      var magX = vecX / magnitude;
      var magY = vecY / magnitude;
      var marginedX = (radius + margin) * magX;
      var marginedY = (radius + margin) * magY;
      var x = pos.x + marginedX;
      var y = pos.y + marginedY;
      x = x - 5 * magY;
      y = y + 5 * magX;
      var toX = toPos.x - marginedX;
      var toY = toPos.y - marginedY;
      toX = toX - 5 * magY;
      toY = toY + 5 * magX;
      var arrowX = toX - marginedX;
      var arrowY = toY - marginedY;
      arrowX = arrowX - 10 * magY;
      arrowY = arrowY + 10 * magX;
  
      var edgeWidth = 2;
      var edgeColor = "steelblue";
      var weightColor = "gray";
  
      for (let n = 0; n < nodeOrder.length - 1; n++) {
        if (nodeOrder[n + 1] === v && nodeOrder[n] === u) {
          edgeWidth = 5;
          edgeColor = "royalblue";
          weightColor = "black";
          break;
        }
      }
  
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(toX, toY);
      ctx.lineTo(arrowX, arrowY);
      ctx.strokeStyle = edgeColor;
      ctx.lineWidth = edgeWidth;
      ctx.lineJoin = "bevel";
      ctx.stroke();
  
      var wX = arrowX - marginedX;
      var wY = arrowY - marginedY;
      ctx.fillStyle = weightColor;
      ctx.font = "24px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(w, wX, wY);
    }
  
    for (let v in graph.poses) {
      const { x, y } = graph.poses[v];
  
      let nodeColor = "white";
      if (nodeOrder.includes(v)) {
        nodeColor = "palegreen";
      }
  
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = nodeColor;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "tomato";
      ctx.stroke();
  
      ctx.fillStyle = "black";
      ctx.font = "20px monospace";
      ctx.fillText(v, x, y);
    }
  
    setTimeout(drawGraph, 1000);
  }
  
  drawGraph();