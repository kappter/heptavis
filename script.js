const svg = document.getElementById("heptagramCanvas");
const tooltip = document.getElementById("tooltip");
const center = { x: 300, y: 300 };
const radius = 250;
const chakraColors = ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#8b00ff"];
const chakraNames = ["Root", "Sacral", "Solar Plexus", "Heart", "Throat", "Third Eye", "Crown"];
const notes = ["C", "D", "E", "F", "G", "A", "B"];
const planets = ["⏚", "☽", "☿", "♀", "☉", "♂", "♃"];
let rotating = true;

function drawChakraWheel() {
  svg.innerHTML = ""; // Clear previous content
  for (let i = 0; i < 7; i++) {
    const angle = (i * 360 / 7) - 90;
    const nextAngle = ((i + 1) * 360 / 7) - 90;
    const x1 = center.x + radius * Math.cos(angle * Math.PI / 180);
    const y1 = center.y + radius * Math.sin(angle * Math.PI / 180);
    const x2 = center.x + radius * Math.cos(nextAngle * Math.PI / 180);
    const y2 = center.y + radius * Math.sin(nextAngle * Math.PI / 180);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const largeArc = (360 / 7) > 180 ? 1 : 0;
    path.setAttribute("d", `M${center.x},${center.y} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`);
    path.setAttribute("fill", chakraColors[i]);
    path.addEventListener("mousemove", (e) => {
      tooltip.innerHTML = \`\${chakraNames[i]} Chakra<br>\${planets[i]} Planet<br>\${notes[i]} Note<br>\${(i * 360 / 7).toFixed(2)}°\`;
      tooltip.style.left = e.pageX + "px";
      tooltip.style.top = e.pageY - 40 + "px";
      tooltip.style.display = "block";
    });
    path.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });
    svg.appendChild(path);
  }
}

function drawAngleLines() {
  for (let i = 0; i < 7; i++) {
    const angle = (i * 360 / 7) - 90;
    const x = center.x + radius * Math.cos(angle * Math.PI / 180);
    const y = center.y + radius * Math.sin(angle * Math.PI / 180);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", center.x);
    line.setAttribute("y1", center.y);
    line.setAttribute("x2", x);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", "#aaa");
    line.setAttribute("stroke-width", "1");
    svg.appendChild(line);
  }
}

function downloadSVG() {
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  const blob = new Blob([source], { type: "image/svg+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "heptagram.svg";
  a.click();
}

function toggleRotation() {
  rotating = !rotating;
}

function animate() {
  if (rotating) {
    const rotate = svg.getAttribute("transform") || "rotate(0 300 300)";
    const current = parseFloat(rotate.match(/rotate\(([^\s]+)/)?.[1] || 0);
    svg.setAttribute("transform", \`rotate(\${current + 0.2} 300 300)\`);
  }
  requestAnimationFrame(animate);
}

drawChakraWheel();
drawAngleLines();
animate();
