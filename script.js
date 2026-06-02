const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

const algorithmSelect = document.getElementById("algorithmSelect");
const statusText = document.getElementById("statusText");
const startText = document.getElementById("startText");
const destinationText = document.getElementById("destinationText");
const routeText = document.getElementById("routeText");
const distanceText = document.getElementById("distanceText");

const algorithmResultBar = document.getElementById("algorithmResultBar");
const selectedAlgorithmBadge = document.getElementById("selectedAlgorithmBadge");
const selectedAlgorithmResult = document.getElementById("selectedAlgorithmResult");
const algorithmConclusion = document.getElementById("algorithmConclusion");

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const vehicleImage = new Image();
vehicleImage.src = "truck.png";

const mapImage = new Image();
mapImage.src = "map3.png";

const mapOriginalWidth = 1920;
const mapOriginalHeight = 900;

const locations = [
  { id: "A", name: "Gudang Utama", x: 900, y: 500 },
  { id: "B", name: "Lokasi 1", x: 260, y: 85 },
  { id: "C", name: "Lokasi 2", x: 500, y: 400 },
  { id: "D", name: "Lokasi 3", x: 610, y: 300 },
  { id: "E", name: "Lokasi 4", x: 900, y: 120 },
  { id: "F", name: "Lokasi 5", x: 1440, y: 570 },
  { id: "G", name: "Lokasi 6", x: 1300, y: 230 },
  { id: "H", name: "Lokasi 7", x: 1650, y: 680 },
  { id: "I", name: "Lokasi 8", x: 650, y: 720 },
  { id: "J", name: "Lokasi 9", x: 400, y: 760 },
  { id: "K", name: "Lokasi 10", x: 1630, y: 450 },
  { id: "L", name: "Lokasi 11", x: 300, y: 565 },
  { id: "M", name: "Lokasi 12", x: 1400, y: 400 },
  { id: "N", name: "Lokasi 13", x: 1150, y: 750 },
  { id: "O", name: "Lokasi 14", x: 1250, y: 600 }
];

/*
  Edge mengikuti koordinat titik terbaru.
  Path dibuat berbelok agar menyerupai jalur jalan.
  Titik pertama dan terakhir setiap path harus sama dengan koordinat node from dan to.
*/
const edges = [
  {
    from: "A",
    to: "C",
    path: [{ x: 900, y: 500 }, { x: 780, y: 475 }, { x: 620, y: 435 }, { x: 500, y: 400 }]
  },
  {
    from: "A",
    to: "D",
    path: [{ x: 900, y: 500 }, { x: 820, y: 430 }, { x: 720, y: 360 }, { x: 610, y: 300 }]
  },
  {
    from: "A",
    to: "E",
    path: [{ x: 900, y: 500 }, { x: 890, y: 380 }, { x: 895, y: 240 }, { x: 900, y: 120 }]
  },
  {
    from: "A",
    to: "G",
    path: [{ x: 900, y: 500 }, { x: 1010, y: 430 }, { x: 1160, y: 330 }, { x: 1300, y: 230 }]
  },
  {
    from: "A",
    to: "O",
    path: [{ x: 900, y: 500 }, { x: 1010, y: 535 }, { x: 1130, y: 575 }, { x: 1250, y: 600 }]
  },
  {
    from: "A",
    to: "N",
    path: [{ x: 900, y: 500 }, { x: 970, y: 600 }, { x: 1060, y: 700 }, { x: 1150, y: 750 }]
  },

  {
    from: "B",
    to: "D",
    path: [{ x: 260, y: 85 }, { x: 360, y: 145 }, { x: 500, y: 230 }, { x: 610, y: 300 }]
  },
  {
    from: "B",
    to: "E",
    path: [{ x: 260, y: 85 }, { x: 430, y: 80 }, { x: 670, y: 95 }, { x: 900, y: 120 }]
  },
  {
    from: "B",
    to: "L",
    path: [{ x: 260, y: 85 }, { x: 245, y: 220 }, { x: 275, y: 390 }, { x: 300, y: 565 }]
  },

  {
    from: "C",
    to: "D",
    path: [{ x: 500, y: 400 }, { x: 520, y: 355 }, { x: 570, y: 320 }, { x: 610, y: 300 }]
  },
  {
    from: "C",
    to: "L",
    path: [{ x: 500, y: 400 }, { x: 430, y: 455 }, { x: 360, y: 520 }, { x: 300, y: 565 }]
  },
  {
    from: "C",
    to: "I",
    path: [{ x: 500, y: 400 }, { x: 560, y: 500 }, { x: 610, y: 620 }, { x: 650, y: 720 }]
  },
  {
    from: "C",
    to: "J",
    path: [{ x: 500, y: 400 }, { x: 470, y: 520 }, { x: 430, y: 650 }, { x: 400, y: 760 }]
  },

  {
    from: "D",
    to: "E",
    path: [{ x: 610, y: 300 }, { x: 700, y: 225 }, { x: 805, y: 160 }, { x: 900, y: 120 }]
  },
  {
    from: "E",
    to: "G",
    path: [{ x: 900, y: 120 }, { x: 1020, y: 145 }, { x: 1170, y: 190 }, { x: 1300, y: 230 }]
  },

  {
    from: "F",
    to: "H",
    path: [{ x: 1440, y: 570 }, { x: 1510, y: 610 }, { x: 1580, y: 650 }, { x: 1650, y: 680 }]
  },
  {
    from: "F",
    to: "K",
    path: [{ x: 1440, y: 570 }, { x: 1510, y: 535 }, { x: 1585, y: 495 }, { x: 1630, y: 450 }]
  },
  {
    from: "F",
    to: "M",
    path: [{ x: 1440, y: 570 }, { x: 1435, y: 510 }, { x: 1420, y: 455 }, { x: 1400, y: 400 }]
  },
  {
    from: "F",
    to: "O",
    path: [{ x: 1440, y: 570 }, { x: 1380, y: 585 }, { x: 1310, y: 595 }, { x: 1250, y: 600 }]
  },

  {
    from: "G",
    to: "M",
    path: [{ x: 1300, y: 230 }, { x: 1340, y: 285 }, { x: 1380, y: 345 }, { x: 1400, y: 400 }]
  },
  {
    from: "G",
    to: "K",
    path: [{ x: 1300, y: 230 }, { x: 1430, y: 290 }, { x: 1550, y: 370 }, { x: 1630, y: 450 }]
  },
  {
    from: "G",
    to: "O",
    path: [{ x: 1300, y: 230 }, { x: 1320, y: 350 }, { x: 1290, y: 480 }, { x: 1250, y: 600 }]
  },

  {
    from: "H",
    to: "K",
    path: [{ x: 1650, y: 680 }, { x: 1660, y: 610 }, { x: 1645, y: 520 }, { x: 1630, y: 450 }]
  },
  {
    from: "H",
    to: "O",
    path: [{ x: 1650, y: 680 }, { x: 1540, y: 800 }, { x: 1390, y: 800 }, { x: 1250, y: 600 }]
  },

  {
    from: "I",
    to: "J",
    path: [{ x: 650, y: 720 }, { x: 570, y: 705 }, { x: 480, y: 725 }, { x: 400, y: 760 }]
  },
  {
    from: "I",
    to: "N",
    path: [{ x: 650, y: 720 }, { x: 800, y: 735 }, { x: 980, y: 755 }, { x: 1150, y: 750 }]
  },

  {
    from: "J",
    to: "L",
    path: [{ x: 400, y: 760 }, { x: 345, y: 700 }, { x: 315, y: 630 }, { x: 300, y: 565 }]
  },
  {
    from: "L",
    to: "J",
    path: [{ x: 300, y: 565 }, { x: 315, y: 630 }, { x: 345, y: 700 }, { x: 400, y: 760 }]
  },
  {
    from: "N",
    to: "O",
    path: [{ x: 1150, y: 750 }, { x: 1190, y: 700 }, { x: 1230, y: 650 }, { x: 1250, y: 600 }]
  }
];

let scale = 1;
let minScale = 0.9;
let maxScale = 2.8;

let offsetX = 0;
let offsetY = 0;

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

let startPoint = null;
let destinationPoints = [];
let currentRouteNodes = [];
let currentDetailedPath = [];

let vehiclePosition = null;
let vehicleAngle = 0;
let targetVehicleAngle = 0;
let traveledDistance = 0;
let isAnimating = false;

const baseVehicleSpeed = 1.6; 
const turnSlowdownSpeed = 0.55;
const turnAngleThreshold = 0.35;

function getLocationById(id) {
  return locations.find(location => location.id === id);
}

function initializeMapPosition() {
  const scaleX = canvasWidth / mapOriginalWidth;
  const scaleY = canvasHeight / mapOriginalHeight;

  scale = Math.max(scaleX, scaleY);
  minScale = scale;

  offsetX = (canvasWidth - mapOriginalWidth * scale) / 2;
  offsetY = (canvasHeight - mapOriginalHeight * scale) / 2;

  clampOffset();
}

function clampOffset() {
  const mapWidth = mapOriginalWidth * scale;
  const mapHeight = mapOriginalHeight * scale;

  if (mapWidth <= canvasWidth) {
    offsetX = (canvasWidth - mapWidth) / 2;
  } else {
    offsetX = Math.min(0, Math.max(canvasWidth - mapWidth, offsetX));
  }

  if (mapHeight <= canvasHeight) {
    offsetY = (canvasHeight - mapHeight) / 2;
  } else {
    offsetY = Math.min(0, Math.max(canvasHeight - mapHeight, offsetY));
  }
}

function mapToScreen(point) {
  return {
    x: point.x * scale + offsetX,
    y: point.y * scale + offsetY
  };
}

function screenToMap(x, y) {
  return {
    x: (x - offsetX) / scale,
    y: (y - offsetY) / scale
  };
}

function pixelDistance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function quadraticBezier(p0, p1, p2, t) {
  const x =
    (1 - t) * (1 - t) * p0.x +
    2 * (1 - t) * t * p1.x +
    t * t * p2.x;

  const y =
    (1 - t) * (1 - t) * p0.y +
    2 * (1 - t) * t * p1.y +
    t * t * p2.y;

  return { x, y };
}

/*
  Mengubah path belokan menjadi banyak titik kecil.
  Inilah yang membuat edge, rute, dan kendaraan memakai jalur yang sama.
*/
function createRoadPath(path, samplesPerCurve = 24) {
  if (!path || path.length < 2) return [];

  const result = [];

  result.push({ x: path[0].x, y: path[0].y });

  if (path.length === 2) {
    result.push({ x: path[1].x, y: path[1].y });
    return result;
  }

  for (let i = 1; i < path.length - 1; i++) {
    const previous = path[i - 1];
    const control = path[i];
    const next = path[i + 1];

    const start = {
      x: (previous.x + control.x) / 2,
      y: (previous.y + control.y) / 2
    };

    const end = {
      x: (control.x + next.x) / 2,
      y: (control.y + next.y) / 2
    };

    if (i === 1) {
      result.push(start);
    }

    for (let s = 1; s <= samplesPerCurve; s++) {
      const t = s / samplesPerCurve;
      const point = quadraticBezier(start, control, end, t);
      result.push(point);
    }
  }

  const last = path[path.length - 1];
  result.push({ x: last.x, y: last.y });

  return result;
}

function pathDistanceKm(path) {
  let total = 0;

  for (let i = 0; i < path.length - 1; i++) {
    total += pixelDistance(path[i], path[i + 1]) / 100;
  }

  return total;
}

function getPathTotalPixelDistance(path) {
  let total = 0;

  for (let i = 0; i < path.length - 1; i++) {
    total += pixelDistance(path[i], path[i + 1]);
  }

  return total;
}

function getPointAtDistance(path, distanceTarget) {
  let traveled = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];

    const segmentLength = pixelDistance(from, to);

    if (traveled + segmentLength >= distanceTarget) {
      const localDistance = distanceTarget - traveled;
      const t = segmentLength === 0 ? 0 : localDistance / segmentLength;

      return {
        position: {
          x: lerp(from.x, to.x, t),
          y: lerp(from.y, to.y, t)
        },
        from,
        to,
        segmentIndex: i
      };
    }

    traveled += segmentLength;
  }

  const last = path[path.length - 1];
  const beforeLast = path[path.length - 2];

  return {
    position: { x: last.x, y: last.y },
    from: beforeLast,
    to: last,
    segmentIndex: path.length - 2
  };
}

function normalizeAngle(angle) {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

function smoothAngle(currentAngle, targetAngle, factor = 0.12) {
  const difference = normalizeAngle(targetAngle - currentAngle);
  return currentAngle + difference * factor;
}

function getTurnIntensity(path, segmentIndex) {
  if (segmentIndex <= 0 || segmentIndex >= path.length - 2) {
    return 0;
  }

  const previous = path[segmentIndex - 1];
  const current = path[segmentIndex];
  const next = path[segmentIndex + 1];

  const angle1 = Math.atan2(current.y - previous.y, current.x - previous.x);
  const angle2 = Math.atan2(next.y - current.y, next.x - current.x);

  return Math.abs(normalizeAngle(angle2 - angle1));
}

function getUpcomingTurnIntensity(path, currentSegmentIndex, lookAheadSegments = 18) {
  let maxTurnIntensity = 0;

  const startIndex = Math.max(1, currentSegmentIndex);
  const endIndex = Math.min(path.length - 2, currentSegmentIndex + lookAheadSegments);

  for (let i = startIndex; i <= endIndex; i++) {
    const turnIntensity = getTurnIntensity(path, i);

    if (turnIntensity > maxTurnIntensity) {
      maxTurnIntensity = turnIntensity;
    }
  }

  return maxTurnIntensity;
}

function drawFallbackMap() {
  ctx.fillStyle = "#243b35";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
  for (let x = 0; x < mapOriginalWidth; x += 80) {
    ctx.fillRect(x, 0, 1, mapOriginalHeight);
  }

  for (let y = 0; y < mapOriginalHeight; y += 80) {
    ctx.fillRect(0, y, mapOriginalWidth, 1);
  }

  ctx.restore();
}

function drawMap() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  if (mapImage.complete && mapImage.naturalWidth > 0) {
    ctx.drawImage(
      mapImage,
      offsetX,
      offsetY,
      mapOriginalWidth * scale,
      mapOriginalHeight * scale
    );
  } else {
    drawFallbackMap();
  }

  drawEdges();
  drawRoute();
  drawLocations();
  drawVehicle();
}

function drawRoadPolyline(path, lineWidth, strokeStyle) {
  if (!path || path.length < 2) return;

  ctx.beginPath();

  const first = mapToScreen(path[0]);
  ctx.moveTo(first.x, first.y);

  for (let i = 1; i < path.length; i++) {
    const point = mapToScreen(path[i]);
    ctx.lineTo(point.x, point.y);
  }

  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
}

function drawEdges() {
  edges.forEach(edge => {
    const roadPath = createRoadPath(edge.path);

    drawRoadPolyline(roadPath, 5, "rgba(255, 255, 255, 0.35)");
    drawRoadPolyline(roadPath, 2, "rgba(20, 184, 166, 0.68)");

    const midIndex = Math.floor(roadPath.length / 2);
    const midPoint = mapToScreen(roadPath[midIndex]);
    const jarak = pathDistanceKm(roadPath).toFixed(1);

    ctx.font = "11px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
    ctx.lineWidth = 3;
    ctx.strokeText(jarak + " km", midPoint.x + 5, midPoint.y - 5);
    ctx.fillText(jarak + " km", midPoint.x + 5, midPoint.y - 5);
  });
}

function drawRoute() {
  if (currentDetailedPath.length < 2) return;

  drawRoadPolyline(currentDetailedPath, 10, "#0ea5e9");
  drawRoadPolyline(currentDetailedPath, 4, "#ffffff");
}

function drawLocations() {
  locations.forEach(location => {
    const screen = mapToScreen(location);

    let color = "#facc15";

    if (startPoint && location.id === startPoint.id) {
      color = "#22c55e";
    }

    if (destinationPoints.some(point => point.id === location.id)) {
      color = "#ef4444";
    }

    ctx.beginPath();
    ctx.arc(screen.x, screen.y, 11, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 4;
    ctx.strokeText(location.id, screen.x + 15, screen.y - 10);
    ctx.fillText(location.id, screen.x + 15, screen.y - 10);

    ctx.font = "12px Arial";
    ctx.strokeText(location.name, screen.x + 15, screen.y + 8);
    ctx.fillText(location.name, screen.x + 15, screen.y + 8);
  });
}

function drawVehicle() {
  if (!vehiclePosition) return;

  const screen = mapToScreen(vehiclePosition);

  const vehicleWidth = 46;
  const vehicleHeight = 80;

  /*
    Atur arah gambar kendaraan:
    0 = gambar default menghadap kanan
    Math.PI / 2 = gambar default menghadap atas
    Math.PI = gambar default menghadap kiri
    -Math.PI / 2 = gambar default menghadap bawah
  */
  const vehicleRotationOffset = Math.PI / 2;

  ctx.save();

  ctx.translate(screen.x, screen.y);
  ctx.rotate(vehicleAngle + vehicleRotationOffset);

  if (vehicleImage.complete && vehicleImage.naturalWidth > 0) {
    ctx.drawImage(
      vehicleImage,
      -vehicleWidth / 2,
      -vehicleHeight / 2,
      vehicleWidth,
      vehicleHeight
    );
  } else {
    ctx.font = "30px Arial";
    ctx.fillText("🚚", -15, 10);
  }

  ctx.restore();
}

function buildGraph() {
  const graph = {};

  locations.forEach(location => {
    graph[location.id] = [];
  });

  edges.forEach(edge => {
    const from = getLocationById(edge.from);
    const to = getLocationById(edge.to);

    if (!from || !to) return;

    const roadPath = createRoadPath(edge.path);
    const weight = pathDistanceKm(roadPath);

    graph[from.id].push({
      id: to.id,
      weight: weight,
      path: roadPath
    });

    graph[to.id].push({
      id: from.id,
      weight: weight,
      path: [...roadPath].reverse()
    });
  });

  return graph;
}

function dijkstra(startId, endId) {
  const graph = buildGraph();
  const distances = {};
  const previous = {};
  const previousPath = {};
  const unvisited = new Set(Object.keys(graph));

  Object.keys(graph).forEach(id => {
    distances[id] = Infinity;
    previous[id] = null;
    previousPath[id] = null;
  });

  distances[startId] = 0;

  while (unvisited.size > 0) {
    let currentId = null;
    let smallestDistance = Infinity;

    unvisited.forEach(id => {
      if (distances[id] < smallestDistance) {
        smallestDistance = distances[id];
        currentId = id;
      }
    });

    if (currentId === null) break;
    if (currentId === endId) break;

    unvisited.delete(currentId);

    graph[currentId].forEach(neighbor => {
      if (!unvisited.has(neighbor.id)) return;

      const newDistance = distances[currentId] + neighbor.weight;

      if (newDistance < distances[neighbor.id]) {
        distances[neighbor.id] = newDistance;
        previous[neighbor.id] = currentId;
        previousPath[neighbor.id] = neighbor.path;
      }
    });
  }

  const pathIds = [];
  let current = endId;

  while (current !== null) {
    pathIds.unshift(current);
    current = previous[current];
  }

  if (pathIds[0] !== startId) {
    return {
      distance: Infinity,
      pathIds: [],
      roadPath: []
    };
  }

  let roadPath = [];

  for (let i = 0; i < pathIds.length - 1; i++) {
    const toId = pathIds[i + 1];
    const edgePath = previousPath[toId];

    if (!edgePath) continue;

    if (roadPath.length === 0) {
      roadPath = roadPath.concat(edgePath);
    } else {
      roadPath = roadPath.concat(edgePath.slice(1));
    }
  }

  return {
    distance: distances[endId],
    pathIds: pathIds,
    roadPath: roadPath
  };
}

function getRouteDistanceByGraph(routeNodes) {
  let total = 0;

  for (let i = 0; i < routeNodes.length - 1; i++) {
    const result = dijkstra(routeNodes[i].id, routeNodes[i + 1].id);

    if (result.distance === Infinity) {
      return Infinity;
    }

    total += result.distance;
  }

  return total;
}

function buildDetailedPath(routeNodes) {
  let finalPath = [];

  for (let i = 0; i < routeNodes.length - 1; i++) {
    const result = dijkstra(routeNodes[i].id, routeNodes[i + 1].id);

    if (result.roadPath.length === 0) continue;

    if (finalPath.length === 0) {
      finalPath = finalPath.concat(result.roadPath);
    } else {
      finalPath = finalPath.concat(result.roadPath.slice(1));
    }
  }

  return finalPath;
}

function greedyNearest(start, destinations) {
  const remaining = [...destinations];
  const route = [start];

  let current = start;

  while (remaining.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = Infinity;

    remaining.forEach((destination, index) => {
      const result = dijkstra(current.id, destination.id);

      if (result.distance < nearestDistance) {
        nearestDistance = result.distance;
        nearestIndex = index;
      }
    });

    current = remaining[nearestIndex];
    route.push(current);
    remaining.splice(nearestIndex, 1);
  }

  return route;
}

function permute(array) {
  if (array.length <= 1) return [array];

  const result = [];

  for (let i = 0; i < array.length; i++) {
    const current = array[i];
    const remaining = array.slice(0, i).concat(array.slice(i + 1));
    const permutations = permute(remaining);

    permutations.forEach(permutation => {
      result.push([current, ...permutation]);
    });
  }

  return result;
}

function bruteForce(start, destinations) {
  const permutations = permute(destinations);

  let bestRoute = null;
  let bestDistance = Infinity;

  permutations.forEach(order => {
    const route = [start, ...order];
    const totalDistance = getRouteDistanceByGraph(route);

    if (totalDistance < bestDistance) {
      bestDistance = totalDistance;
      bestRoute = route;
    }
  });

  return bestRoute;
}

function hideAlgorithmResultBar() {
  if (algorithmResultBar) {
    algorithmResultBar.classList.add("hidden");
  }
}

function measureAlgorithmPerformance(callback) {
  const startTime = performance.now();
  const result = callback();
  const endTime = performance.now();

  return {
    result: result,
    time: endTime - startTime
  };
}

function getRouteIds(route) {
  return route.map(point => point.id).join(" → ");
}

function getDetailedRouteIds(routeNodes) {
  let finalIds = [];

  for (let i = 0; i < routeNodes.length - 1; i++) {
    const result = dijkstra(routeNodes[i].id, routeNodes[i + 1].id);

    if (!result.pathIds || result.pathIds.length === 0) continue;

    if (finalIds.length === 0) {
      finalIds = finalIds.concat(result.pathIds);
    } else {
      finalIds = finalIds.concat(result.pathIds.slice(1));
    }
  }

  return finalIds.join(" → ");
}

function showSelectedAlgorithmEvaluation() {
  if (!algorithmResultBar) return;
  if (!startPoint || destinationPoints.length < 1) return;

  const selectedAlgorithm = algorithmSelect.value;

  let evaluation;
  let algorithmName;
  let badgeClass;
  let explanation;
  let conclusion;

  if (selectedAlgorithm === "greedy") {
    evaluation = measureAlgorithmPerformance(function() {
      return greedyNearest(startPoint, destinationPoints);
    });

    algorithmName = "Greedy Nearest";
    badgeClass = "badge badge-greedy";

    const distance = getRouteDistanceByGraph(evaluation.result);
    const routeOrder = getRouteIds(evaluation.result);
    const route = getDetailedRouteIds(evaluation.result);

    explanation = `
    <div><b>Urutan tujuan:</b> ${routeOrder}</div>
    <div><b>Jalur dilewati:</b> ${route}</div>
    <div><b>Total jarak:</b> ${distance.toFixed(2)} km</div>
    <div><b>Waktu proses:</b> ${evaluation.time.toFixed(3)} ms</div>
    <div>✅ Memilih tujuan terdekat dari posisi saat ini</div>
    <div>✅ Proses cepat dan sederhana</div>
    <div>⚠️ Hasil belum tentu selalu paling optimal karena tidak membandingkan semua kombinasi rute</div>
  `;

    conclusion = `
      🏆 Greedy Nearest digunakan karena algoritma ini memilih node tujuan terdekat secara bertahap.
      Pada simulasi ini, Greedy cocok untuk proses pengantaran yang membutuhkan keputusan cepat.
    `;
  }

  if (selectedAlgorithm === "bruteforce") {
    evaluation = measureAlgorithmPerformance(function() {
      return bruteForce(startPoint, destinationPoints);
    });

    algorithmName = "Brute Force";
    badgeClass = "badge badge-bruteforce";

    const distance = getRouteDistanceByGraph(evaluation.result);
    const routeOrder = getRouteIds(evaluation.result);
    const route = getDetailedRouteIds(evaluation.result);
    const combinationCount = factorial(destinationPoints.length);

    explanation = `
    <div><b>Urutan tujuan:</b> ${routeOrder}</div>
    <div><b>Jalur dilewati:</b> ${route}</div>
    <div><b>Total jarak:</b> ${distance.toFixed(2)} km</div>
    <div><b>Waktu proses:</b> ${evaluation.time.toFixed(3)} ms</div>
    <div><b>Jumlah kombinasi:</b> ${combinationCount} kemungkinan rute</div>
    <div>✅ Membandingkan seluruh kemungkinan urutan tujuan</div>
    <div>✅ Hasil paling optimal untuk jumlah tujuan sedikit</div>
    <div>⚠️ Kurang efisien jika jumlah tujuan semakin banyak</div>
  `;

    conclusion = `
      🏆 Brute Force digunakan karena algoritma ini mengevaluasi seluruh kombinasi rute.
      Pada simulasi dengan tujuan terbatas, Brute Force dapat menjadi pembanding paling optimal.
    `;
  }

  if (!evaluation) return;

  selectedAlgorithmBadge.className = badgeClass;
  selectedAlgorithmBadge.textContent = algorithmName;
  selectedAlgorithmResult.innerHTML = explanation;
  algorithmConclusion.innerHTML = conclusion;

  algorithmResultBar.classList.remove("hidden");
}

function getDetailedRouteIds(routeNodes) {
  let finalIds = [];

  for (let i = 0; i < routeNodes.length - 1; i++) {
    const result = dijkstra(routeNodes[i].id, routeNodes[i + 1].id);

    if (!result.pathIds || result.pathIds.length === 0) continue;

    if (finalIds.length === 0) {
      finalIds = finalIds.concat(result.pathIds);
    } else {
      finalIds = finalIds.concat(result.pathIds.slice(1));
    }
  }

  return finalIds.join(" → ");
}

function calculateRoute() {
  hideAlgorithmResultBar();

  if (!startPoint) {
    statusText.textContent = "Titik awal belum dipilih";
    return;
  }

  if (destinationPoints.length < 1) {
    statusText.textContent = "Pilih minimal 1 tujuan pengantaran";
    return;
  }

  const algorithm = algorithmSelect.value;

  if (algorithm === "bruteforce") {
    currentRouteNodes = bruteForce(startPoint, destinationPoints);
  } else {
    currentRouteNodes = greedyNearest(startPoint, destinationPoints);
  }

  if (!currentRouteNodes || currentRouteNodes.length < 2) {
    statusText.textContent = "Rute tidak ditemukan pada graf";
    return;
  }

  currentDetailedPath = buildDetailedPath(currentRouteNodes);

  if (currentDetailedPath.length < 2) {
    statusText.textContent = "Rute detail tidak ditemukan";
    return;
  }

  vehiclePosition = {
  x: currentDetailedPath[0].x,
  y: currentDetailedPath[0].y
  };

  const nextPoint = currentDetailedPath[1];

  vehicleAngle = Math.atan2(
    nextPoint.y - vehiclePosition.y,
    nextPoint.x - vehiclePosition.x
  );

  targetVehicleAngle = vehicleAngle;
  traveledDistance = 0;
  isAnimating = false;

  const totalDistance = getRouteDistanceByGraph(currentRouteNodes).toFixed(2);

  const routeOrderName = currentRouteNodes.map(point => point.id).join(" → ");
  const detailedRouteName = getDetailedRouteIds(currentRouteNodes);

  routeText.textContent = detailedRouteName;
  distanceText.textContent = totalDistance + " km";
  statusText.textContent = "Rute tercepat berhasil dihitung";

  drawMap();
}

function toggleAnimation() {
  if (currentDetailedPath.length < 2) {
    calculateRoute();
  }

  if (currentDetailedPath.length < 2) return;

  isAnimating = !isAnimating;

  if (isAnimating) {
    statusText.textContent = "Kendaraan sedang berjalan";
    requestAnimationFrame(animateVehicle);
  } else {
    statusText.textContent = "Animasi dijeda";
  }
}

function animateVehicle() {
  if (!isAnimating || currentDetailedPath.length < 2) return;

  const totalPathDistance = getPathTotalPixelDistance(currentDetailedPath);

  if (traveledDistance >= totalPathDistance) {
  isAnimating = false;
  statusText.textContent = "Pengantaran selesai";
  drawMap();

  showSelectedAlgorithmEvaluation();

  return;
  }

  const currentPointData = getPointAtDistance(currentDetailedPath, traveledDistance);

  const currentTurnIntensity = getTurnIntensity(
    currentDetailedPath,
    currentPointData.segmentIndex
  );

  const upcomingTurnIntensity = getUpcomingTurnIntensity(
    currentDetailedPath,
    currentPointData.segmentIndex,
    5
  );

  let currentSpeed = baseVehicleSpeed;

  if (upcomingTurnIntensity > turnAngleThreshold) {
    currentSpeed = turnSlowdownSpeed;
  }

  if (currentTurnIntensity > turnAngleThreshold) {
    currentSpeed = turnSlowdownSpeed * 0.85;
  }

  traveledDistance += currentSpeed;

  const pointData = getPointAtDistance(currentDetailedPath, traveledDistance);

  vehiclePosition = pointData.position;

  targetVehicleAngle = Math.atan2(
    pointData.to.y - pointData.from.y,
    pointData.to.x - pointData.from.x
  );

  vehicleAngle = smoothAngle(vehicleAngle, targetVehicleAngle, 0.08);

  drawMap();
  requestAnimationFrame(animateVehicle);
}

function resetSelection() {
  hideAlgorithmResultBar();

  startPoint = null;
  destinationPoints = [];
  currentRouteNodes = [];
  currentDetailedPath = [];
  vehiclePosition = null;
  vehicleAngle = 0;
  targetVehicleAngle = 0;
  traveledDistance = 0;
  isAnimating = false;

  statusText.textContent = "Pilih titik awal terlebih dahulu";
  startText.textContent = "Belum dipilih";
  destinationText.textContent = "Belum dipilih";
  routeText.textContent = "Belum dihitung";
  distanceText.textContent = "0 km";

  drawMap();
}

function updatePanelText() {
  startText.textContent = startPoint
    ? startPoint.name + " (" + startPoint.id + ")"
    : "Belum dipilih";

  destinationText.textContent = destinationPoints.length > 0
    ? destinationPoints.map(point => point.name + " (" + point.id + ")").join(", ")
    : "Belum dipilih";

  routeText.textContent = "Belum dihitung";
  distanceText.textContent = "0 km";
}

function handleLocationClick(location) {
  hideAlgorithmResultBar();

  isAnimating = false;
  currentRouteNodes = [];
  currentDetailedPath = [];
  vehiclePosition = null;
  vehicleAngle = 0;
  targetVehicleAngle = 0;
  traveledDistance = 0;

  if (!startPoint) {
    startPoint = location;
    statusText.textContent = "Titik awal dipilih";
  } else {
    if (location.id === startPoint.id) {
      statusText.textContent = "Lokasi ini sudah menjadi titik awal";
      drawMap();
      return;
    }

    const existingIndex = destinationPoints.findIndex(point => point.id === location.id);

    if (existingIndex !== -1) {
      destinationPoints.splice(existingIndex, 1);
      statusText.textContent = "Tujuan dihapus";
    } else {
      if (destinationPoints.length >= 2) {
        statusText.textContent = "Maksimal hanya 2 tujuan pengantaran";
        drawMap();
        return;
      }

      destinationPoints.push(location);
      statusText.textContent = "Tujuan pengantaran ditambahkan";
    }
  }

  updatePanelText();
  drawMap();
}

function randomStart() {
  hideAlgorithmResultBar();
  resetSelection();

  const randomIndex = Math.floor(Math.random() * locations.length);
  startPoint = locations[randomIndex];

  statusText.textContent = "Titik awal berhasil diacak";
  updatePanelText();
  drawMap();
}

function zoomIn() {
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  const beforeZoom = screenToMap(centerX, centerY);

  scale = Math.min(maxScale, scale + 0.15);

  const afterZoom = screenToMap(centerX, centerY);

  offsetX += (afterZoom.x - beforeZoom.x) * scale;
  offsetY += (afterZoom.y - beforeZoom.y) * scale;

  clampOffset();
  drawMap();
}

function zoomOut() {
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  const beforeZoom = screenToMap(centerX, centerY);

  scale = Math.max(minScale, scale - 0.15);

  const afterZoom = screenToMap(centerX, centerY);

  offsetX += (afterZoom.x - beforeZoom.x) * scale;
  offsetY += (afterZoom.y - beforeZoom.y) * scale;

  clampOffset();
  drawMap();
}

canvas.addEventListener("wheel", function(event) {
  event.preventDefault();

  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const beforeZoom = screenToMap(mouseX, mouseY);

  if (event.deltaY < 0) {
    scale = Math.min(maxScale, scale + 0.1);
  } else {
    scale = Math.max(minScale, scale - 0.1);
  }

  const afterZoom = screenToMap(mouseX, mouseY);

  offsetX += (afterZoom.x - beforeZoom.x) * scale;
  offsetY += (afterZoom.y - beforeZoom.y) * scale;

  clampOffset();
  drawMap();
});

canvas.addEventListener("mousedown", function(event) {
  isDragging = true;
  dragStartX = event.clientX - offsetX;
  dragStartY = event.clientY - offsetY;
});

window.addEventListener("mousemove", function(event) {
  if (!isDragging) return;

  offsetX = event.clientX - dragStartX;
  offsetY = event.clientY - dragStartY;

  clampOffset();
  drawMap();
});

window.addEventListener("mouseup", function() {
  isDragging = false;
});

canvas.addEventListener("click", function(event) {
  const clickedMapPosition = screenToMap(event.clientX, event.clientY);

  for (const location of locations) {
    const d = pixelDistance(clickedMapPosition, location);

    if (d < 22) {
      handleLocationClick(location);
      break;
    }
  }
});

window.addEventListener("resize", function() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  initializeMapPosition();
  drawMap();
});

mapImage.onload = function() {
  initializeMapPosition();
  drawMap();
};

mapImage.onerror = function() {
  initializeMapPosition();
  drawMap();
};

initializeMapPosition();
drawMap();

function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}