const svg = document.getElementById("heptagramViz");
const chakraToggle = document.getElementById("chakraToggle");
const angleToggle = document.getElementById("angleToggle");
const planetToggle = document.getElementById("planetToggle");
const noteToggle = document.getElementById("noteToggle");
const rotateToggle = document.getElementById("rotateToggle");
const downloadBtn = document.getElementById("downloadBtn");

const chakraData = [
  { name: "Root", color: "#a63d40", planet: "Saturn", note: "C", degree: 0 },
  { name: "Sacral", color: "#a65f3e", planet: "Venus", note: "D", degree: 51.43 },
  { name: "Solar Plexus", color: "#a68c3d", planet: "Mars", note: "E", degree: 102.86 },
  { name: "Heart", color: "#4d8c4d", planet: "Sun", note: "F♯", degree: 154.29 },
  { name: "Throat", color: "#3f708c", planet: "Mercury", note: "G♯", degree: 205.72 },
  { name: "Third Eye", color: "#5e4d8c", planet: "Moon", note: "A♯", degree: 257.15 },
  { name: "Crown", color: "#7e3e8c", planet: "Jupiter", note: "B", degree: 308.58 }
];

const planetGlyphs = {
  Saturn: "♄", Venus: "♀", Mars: "♂", Sun: "☉",
  Mercury: "☿", Moon: "☽", Jupiter: "♃"
};

let rotation = 0;
let isRotating = rotateToggle.checked;

function createSVGElement(tag) {
  return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

function drawHeptagram() {
  svg.innerHTML = "";
  const cx = 250, cy = 250, r = 180;
  const points = [];

  // Calculate 7 points
  for (let i = 0; i < 7; i++) {
    const angle = (2 * Math.PI * i) / 7 - Math.PI / 2 + rotation;
    points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }

  // Draw Heptagram (7/3 configuration)
  for (let i = 0; i < 7; i++) {
    const line = createSVGElement("line");
    const from = points[i];
    const to = points[(i + 3) % 7];
    line.setAttribute("x1", from[0]);
    line.setAttribute("y1", from[1]);
    line.setAttribute("x2", to[0]);
    line.setAttribute("y2", to[1]);
    line.setAttribute("stroke", chakraData[i].color);
    line.setAttribute("stroke-width", "3");
    line.classList.add("line");
    svg.appendChild(line);
  }

  // Draw Chakra Wedges
  if (chakraToggle.checked) {
    for (let i = 0; i < 7; i++) {
      const startAngle = (i * 360 / 7 - 90 + rotation) * Math.PI / 180;
      const endAngle = ((i + 1) * 360 / 7 - 90 + rotation) * Math.PI / 180;
      const path = createSVGElement("path");
      const d = `
        M ${cx} ${cy}
        L ${cx + r * Math.cos(startAngle)} ${cy + r * Math.sin(startAngle)}
        A ${r} ${r} 0 0 1 ${cx + r * Math.cos(endAngle)} ${cy + r * Math.sin(endAngle)}
        Z
      `;
      path.setAttribute("d", d);
      path.setAttribute("fill", chakraData[i].color);
      path.classList.add("chakra-wedge");
      path.addEventListener("mousemove", (e) => showTooltip(e, chakraData[i]));
      path.addEventListener("mouseout", hideTooltip);
      svg.appendChild(path);

      // Chakra Labels
      const labelAngle = (i * 360 / 7 - 90 + rotation + 360 / 14) * Math.PI / 180;
      const label = createSVGElement("text");
      label.setAttribute("x", cx + (r * 0.8) * Math.cos(labelAngle));
      label.setAttribute("y", cy + (r * 0.8) * Math.sin(labelAngle));
      label.textContent = chakraData[i].name;
      label.classList.add("chakra-label");
      svg.appendChild(label);
    }
  }

  // Draw Angle Markers
  if (angleToggle.checked) {
    for (let i = 0; i < 7; i++) {
      const angle = (i * 360 / 7 - 90 + rotation) * Math.PI / 180;
      const line = createSVGElement("line");
      line.setAttribute("x1", cx);
      line.setAttribute("y1", cy);
      line.setAttribute("x2", cx + r * Math.cos(angle));
      line.setAttribute("y2", cy + r * Math.sin(angle));
      line.setAttribute("stroke", "#666");
      line.setAttribute("stroke-width", "1");
      line.classList.add("angle-line");
      svg.appendChild(line);

      const label = createSVGElement("text");
      label.setAttribute("x", cx + (r * 1.1) * Math.cos(angle));
      label.setAttribute("y", cy + (r * 1.1) * Math.sin(angle));
      label.textContent = `${(i * 51.43).toFixed(1)}°`;
      label.classList.add("angle-label");
      svg.appendChild(label);
    }
  }

  // Draw Planet Glyphs
  if (planetToggle.checked) {
    for (let i = 0; i < 7; i++) {
      const angle = (i * 360 / 7 - 90 + rotation) * Math.PI / 180;
      const glyph = createSVGElement("text");
      glyph.setAttribute("x", cx + (r * 1.2) * Math.cos(angle));
      glyph.setAttribute("y", cy + (r * 1.2) * Math.sin(angle));
      glyph.textContent = planetGlyphs[chakraData[i].planet];
      glyph.classList.add("planet-glyph");
      svg.appendChild(glyph);
    }
  }

  // Draw Musical Notes
  if (noteToggle.checked) {
    for (let i = 0; i < 7; i++) {
      const angle = (i * 360 / 7 - 90 + rotation) * Math.PI / 180;
      const note = createSVGElement("text");
      note.setAttribute("x", cx + (r * 0.6) * Math.cos(angle));
      note.setAttribute("y", cy + (r * 0.6) * Math.sin(angle));
      note.textContent = chakraData[i].note;
      note.classList.add("note-label");
      svg.appendChild(note);
    }
  }
}

function showTooltip(e, data) {
  let tooltip = document.querySelector(".tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    document.body.appendChild(tooltip);
  }
  tooltip.innerHTML = `
    <strong>${data.name}</strong><br>
    Planet: ${data.planet}<br>
    Note: ${data.note}<br>
    Degree: ${data.degree.toFixed(2)}°
  `;
  tooltip.style.left = `${e.pageX + 10}px`;
  tooltip.style.top = `${e.pageY + 10}px`;
  tooltip.style.display = "block";
}

function hideTooltip() {
  const tooltip = document.querySelector(".tooltip");
  if (tooltip) tooltip.style.display = "none";
}

function animate() {
  if (isRotating) {
    rotation += 0.005;
    drawHeptagram();
  }
  requestAnimationFrame(animate);
}

chakraToggle.addEventListener("change", drawHeptagram);
angleToggle.addEventListener("change", drawHeptagram);
planetToggle.addEventListener("change", drawHeptagram);
noteToggle.addEventListener("change", drawHeptagram);
rotateToggle.addEventListener("change", () => {
  isRotating = rotateToggle.checked;
  if (isRotating) animate();
});

downloadBtn.addEventListener("click", () => {
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  const blob = new Blob([source], { type: "image/svg+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "heptavis.svg";
  a.click();
});

drawHeptagram();
animate();