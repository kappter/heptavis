const svgNS = "http://www.w3.org/2000/svg";
const svg = document.getElementById("heptagramViz");
const chakraColors = ["var(--root)", "var(--sacral)", "var(--solar)", "var(--heart)", "var(--throat)", "var(--third-eye)", "var(--crown)"];
const chakras = ["Root", "Sacral", "Solar Plexus", "Heart", "Throat", "Third Eye", "Crown"];
const planets = ["☉", "☽", "♂", "☿", "♃", "♀", "♄"];
const notes = ["C", "D", "E", "F♯", "G♯", "A♯", "B"];
let showChakras = false, showAngles = false, showPlanets = false, showNotes = false, isRotating = false;

function createElement(type, attributes) {
  const el = document.createElementNS(svgNS, type);
  for (const [key, value] of Object.entries(attributes)) {
    el.setAttribute(key, value);
  }
  return el;
}

function drawHeptagram() {
  svg.innerHTML = "";
  const cx = 250, cy = 250, r = 180;
  const points = Array.from({length: 7}, (_, i) => {
    const angle = (2 * Math.PI * i) / 7 - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });

  // Draw Heptagram (7/2)
  const gHeptagram = createElement("g", { class: "heptagram" });
  for (let i = 0; i < 7; i++) {
    const from = points[i];
    const to = points[(i + 2) % 7];
    gHeptagram.appendChild(createElement("line", {
      x1: from[0], y1: from[1], x2: to[0], y2: to[1],
      stroke: chakraColors[i], "stroke-width": 3
    }));
  }
  svg.appendChild(gHeptagram);

  // Draw Chakra Wedges
  if (showChakras) {
    const gChakras = createElement("g", { class: "chakras" });
    const wedgeAngle = (2 * Math.PI) / 7;
    for (let i = 0; i < 7; i++) {
      const startAngle = (i * wedgeAngle) - Math.PI / 2;
      const endAngle = startAngle + wedgeAngle;
      const x1 = cx + (r * 0.8) * Math.cos(startAngle);
      const y1 = cy + (r * 0.8) * Math.sin(startAngle);
      const x2 = cx + (r * 0.8) * Math.cos(endAngle);
      const y2 = cy + (r * 0.8) * Math.sin(endAngle);
      const path = `M${cx},${cy} L${x1},${y1} A${r * 0.8},${r * 0.8} 0 0 1 ${x2},${y2} Z`;
      gChakras.appendChild(createElement("path", {
        d: path, fill: chakraColors[i], opacity: 0.4,
        class: "chakra-wedge", "data-index": i
      }));
    }
    svg.appendChild(gChakras);
  }

  // Draw Points with Tooltips
  const gPoints = createElement("g", { class: "points" });
  points.forEach(([x, y], i) => {
    const circle = createElement("circle", {
      cx: x, cy: y, r: 6, fill: chakraColors[i],
      class: "chakra-point", "data-index": i
    });
    circle.addEventListener("mouseover", showTooltip);
    circle.addEventListener("mouseout", hideTooltip);
    circle.addEventListener("touchstart", showTooltip);
    gPoints.appendChild(circle);

    if (showPlanets) {
      gPoints.appendChild(createElement("text", {
        x, y: y - 20, "text-anchor": "middle", fill: "#fff",
        "font-size": 20, class: "planet-glyph"
      }).textContent = planets[i]);
    }

    if (showNotes) {
      gPoints.appendChild(createElement("text", {
        x, y: y + 30, "text-anchor": "middle", fill: "#fff",
        "font-size": 16, class: "musical-note"
      }).textContent = notes[i]);
    }
  });
  svg.appendChild(gPoints);

  // Draw Angle Markers
  if (showAngles) {
    const gAngles = createElement("g", { class: "angles" });
    for (let i = 0; i < 7; i++) {
      const angle = (2 * Math.PI * i) / 7 - Math.PI / 2;
      const x1 = cx + (r * 0.9) * Math.cos(angle);
      const y1 = cy + (r * 0.9) * Math.sin(angle);
      gAngles.appendChild(createElement("line", {
        x1: cx, y1: cy, x2: x1, y2: y1,
        stroke: "#666", "stroke-width": 1
      }));
      gAngles.appendChild(createElement("text", {
        x: cx + (r * 1.05) * Math.cos(angle),
        y: cy + (r * 1.05) * Math.sin(angle),
        "text-anchor": "middle", fill: "#ccc",
        "font-size": 12
      }).textContent = (51.43 * i).toFixed(1) + "°");
    }
    svg.appendChild(gAngles);
  }

  if (isRotating) {
    gHeptagram.classList.add("rotating");
    if (showChakras) gChakras.classList.add("rotating");
    if (showAngles) gAngles.classList.add("rotating");
  } else {
    gHeptagram.classList.remove("rotating");
    if (showChakras) gChakras.classList.remove("rotating");
    if (showAngles) gAngles.classList.remove("rotating");
  }
}

function showTooltip(e) {
  const index = e.target.dataset.index;
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.innerHTML = `
    <strong>${chakras[index]}</strong><br>
    Planet: ${planets[index]}<br>
    Note: ${notes[index]}<br>
    Degree: ${(51.43 * index).toFixed(1)}°
  `;
  document.body.appendChild(tooltip);
  const rect = e.target.getBoundingClientRect();
  tooltip.style.left = `${rect.left + window.scrollX + 10}px`;
  tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`;
}

function hideTooltip() {
  const tooltip = document.querySelector(".tooltip");
  if (tooltip) tooltip.remove();
}

function toggleButton(btn, state) {
  btn.classList.toggle("active", state);
}

// Event Listeners
document.getElementById("toggleChakras").addEventListener("click", () => {
  showChakras = !showChakras;
  toggleButton(document.getElementById("toggleChakras"), showChakras);
  drawHeptagram();
});

document.getElementById("toggleAngles").addEventListener("click", () => {
  showAngles = !showAngles;
  toggleButton(document.getElementById("toggleAngles"), showAngles);
  drawHeptagram();
});

document.getElementById("togglePlanets").addEventListener("click", () => {
  showPlanets = !showPlanets;
  toggleButton(document.getElementById("togglePlanets"), showPlanets);
  drawHeptagram();
});

document.getElementById("toggleNotes").addEventListener("click", () => {
  showNotes = !showNotes;
  toggleButton(document.getElementById("toggleNotes"), showNotes);
  drawHeptagram();
});

document.getElementById("toggleRotation").addEventListener("click", () => {
  isRotating = !isRotating;
  toggleButton(document.getElementById("toggleRotation"), isRotating);
  drawHeptagram();
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  const serializer = new XMLSerializer();
  const source = `<?xml version="1.0" encoding="UTF-8"?>\n` + serializer.serializeToString(svg);
  const blob = new Blob([source], { type: "image/svg+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "heptagram.svg";
  a.click();
});

drawHeptagram();