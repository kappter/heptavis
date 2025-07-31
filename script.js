const svg = document.getElementById("heptagramViz");
const chakraColors = [
  "#a63d40", "#a65f3e", "#a68c3d",
  "#4d8c4d", "#3f708c", "#5e4d8c", "#7e3e8c"
];

function drawHeptagram() {
  svg.innerHTML = "";
  const cx = 250, cy = 250, r = 180;
  const points = [];
  for (let i = 0; i < 7; i++) {
    const angle = (2 * Math.PI * i) / 7 - Math.PI / 2;
    points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }

  for (let i = 0; i < 7; i++) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const from = points[i];
    const to = points[(i + 3) % 7];
    line.setAttribute("x1", from[0]);
    line.setAttribute("y1", from[1]);
    line.setAttribute("x2", to[0]);
    line.setAttribute("y2", to[1]);
    line.setAttribute("stroke", chakraColors[i]);
    line.setAttribute("stroke-width", "3");
    svg.appendChild(line);
  }
}

document.getElementById("downloadBtn").addEventListener("click", () => {
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  const blob = new Blob([source], { type: "image/svg+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "heptagram.svg";
  a.click();
});

drawHeptagram();