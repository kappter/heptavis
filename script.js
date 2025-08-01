document.addEventListener("DOMContentLoaded", () => {
  const svg = document.getElementById("heptagramViz");
  const chakraLayer = document.getElementById("chakraLayer");
  const dayLayer = document.getElementById("dayLayer");
  const angleLayer = document.getElementById("angleLayer");
  const planetLayer = document.getElementById("planetLayer");
  const noteLayer = document.getElementById("noteLayer");
  const foodLayer = document.getElementById("foodLayer");
  const elementLayer = document.getElementById("elementLayer");
  const crystalLayer = document.getElementById("crystalLayer");
  const prevDay = document.getElementById("prevDay");
  const daySelect = document.getElementById("daySelect");
  const nextDay = document.getElementById("nextDay");
  const cycleMapping = document.getElementById("cycleMapping");
  const rotation = document.getElementById("rotation");
  const playFrequencyBtn = document.getElementById("playFrequencyBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const infoPanel = document.getElementById("infoPanel");

  const chakraData = [
    { name: "Crown", day: "Sunday", color: "#a63d40", focus: "Spirituality", frequency: "493.88", note: "B", planet: "Sun", food: "Coconut", element: "Thought", crystal: "Clear Quartz" },
    { name: "Third Eye", day: "Monday", color: "#a65f3e", focus: "Intuition", frequency: "440.00", note: "A", planet: "Moon", food: "Grapes", element: "Light", crystal: "Amethyst" },
    { name: "Solar Plexus", day: "Tuesday", color: "#a68c3d", focus: "Confidence", frequency: "329.63", note: "E", planet: "Mars", food: "Bananas", element: "Fire", crystal: "Citrine" },
    { name: "Heart", day: "Wednesday", color: "#4d8c4d", focus: "Love", frequency: "369.99", note: "F♯", planet: "Mercury", food: "Spinach", element: "Air", crystal: "Rose Quartz" },
    { name: "Throat", day: "Thursday", color: "#3f708c", focus: "Communication", frequency: "415.30", note: "G♯", planet: "Jupiter", food: "Blueberries", element: "Sound", crystal: "Aquamarine" },
    { name: "Sacral", day: "Friday", color: "#5e4d8c", focus: "Creativity", frequency: "293.66", note: "D", planet: "Venus", food: "Oranges", element: "Water", crystal: "Carnelian" },
    { name: "Root", day: "Saturday", color: "#7e3e8c", focus: "Grounding", frequency: "261.63", note: "C", planet: "Saturn", food: "Potatoes", element: "Earth", crystal: "Red Jasper" }
  ];

  let customMapping = {
    chakra: [0, 1, 2, 3, 4, 5, 6],
    day: [0, 1, 2, 3, 4, 5, 6],
    angle: [0, 1, 2, 3, 4, 5, 6],
    planet: [0, 1, 2, 3, 4, 5, 6],
    note: [0, 1, 2, 3, 4, 5, 6],
    food: [0, 1, 2, 3, 4, 5, 6],
    element: [0, 1, 2, 3, 4, 5, 6],
    crystal: [0, 1, 2, 3, 4, 5, 6]
  };
  let selectedLayer = "chakra";
  let currentDayIndex = 5; // Friday, August 01, 2025

  const planetGlyphs = { Sun: "☉", Moon: "☽", Mars: "♂", Mercury: "☿", Jupiter: "♃", Venus: "♀", Saturn: "♄" };
  let rotationAngle = 0;
  let audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let currentOscillator = null;

  function createSVGElement(tag) { return document.createElementNS("http://www.w3.org/2000/svg", tag); }

  function updateCenterInfo() {
    const cx = 250, cy = 250;
    const gCenter = svg.querySelector(".center-info-group") || createSVGElement("g");
    if (!svg.querySelector(".center-info-group")) {
      gCenter.classList.add("center-info-group");
      svg.appendChild(gCenter);
    } else {
      gCenter.innerHTML = "";
    }
    const dataIndex = customMapping[selectedLayer][currentDayIndex];
    const data = chakraData[dataIndex];
    const lines = [
      `Day: ${data.day}`,
      `Chakra: ${data.name}`,
      `Note: ${data.note}`,
      `Focus: ${data.focus}`,
      `Freq: ${data.frequency} Hz`,
      `Planet: ${planetGlyphs[data.planet]}`,
      `Food: ${data.food}`,
      `Element: ${data.element}`,
      `Crystal: ${data.crystal}`
    ];
    lines.forEach((line, i) => {
      const text = createSVGElement("text");
      text.setAttribute("x", cx);
      text.setAttribute("y", cy - 80 + i * 20);
      text.textContent = line;
      text.classList.add("center-info");
      gCenter.appendChild(text);
    });
    updateInfoPanel();
  }

  function updateInfoPanel() {
    if (!infoPanel) {
      console.warn("infoPanel element not found in DOM");
      return;
    }
    const data = chakraData[customMapping[selectedLayer][currentDayIndex]];
    infoPanel.innerHTML = `
      <h2>Today: ${data.day}</h2>
      <p><strong>Chakra:</strong> ${data.name}</p>
      <p><strong>Focus:</strong> ${data.focus}</p>
      <p><strong>Frequency:</strong> ${data.frequency} Hz</p>
      <p><strong>Planet:</strong> ${planetGlyphs[data.planet]}</p>
      <p><strong>Food:</strong> ${data.food}</p>
      <p><strong>Element:</strong> ${data.element}</p>
      <p><strong>Crystal:</strong> ${data.crystal}</p>
    `;
  }

  function drawHeptagram() {
    svg.innerHTML = "";
    const cx = 250, cy = 250, r = 180;
    const basePoints = [];

    // Set Root at bottom (0°)
    const baseRotation = -90 * Math.PI / 180;
    for (let i = 0; i < 7; i++) {
      const angle = (2 * Math.PI * i) / 7 + baseRotation;
      basePoints.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }

    for (let i = 0; i < 7; i++) {
      const line = createSVGElement("line");
      const from = basePoints[i];
      const to = basePoints[(i + 3) % 7];
      line.setAttribute("x1", from[0]);
      line.setAttribute("y1", from[1]);
      line.setAttribute("x2", to[0]);
      line.setAttribute("y2", to[1]);
      line.setAttribute("stroke", chakraData[i].color);
      line.setAttribute("stroke-width", "3");
      line.classList.add("line");
      svg.appendChild(line);
    }

    const gWedges = createSVGElement("g");
    gWedges.setAttribute("transform", `rotate(${rotationAngle}, ${cx}, ${cy})`);
    for (let i = 0; i < 7; i++) {
      const startAngle = (i * 360 / 7 - 90) * Math.PI / 180 + baseRotation;
      const endAngle = ((i + 1) * 360 / 7 - 90) * Math.PI / 180 + baseRotation;
      const path = createSVGElement("path");
      const d = `M ${cx} ${cy} L ${cx + r * Math.cos(startAngle)} ${cy + r * Math.sin(startAngle)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(endAngle)} ${cy + r * Math.sin(endAngle)} Z`;
      path.setAttribute("d", d);
      path.setAttribute("fill", chakraData[customMapping[selectedLayer][i] % 7].color);
      path.classList.add("chakra-wedge");
      if (i === currentDayIndex) path.classList.add("highlight");
      gWedges.appendChild(path);
    }
    svg.appendChild(gWedges);

    updateCenterInfo();
  }

  function playFrequency(frequency) {
    if (currentOscillator) currentOscillator.stop();
    currentOscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    currentOscillator.type = "sine";
    currentOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    currentOscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    currentOscillator.start();
    setTimeout(() => { currentOscillator.stop(); currentOscillator = null; }, 2000);
  }

  function snapToAngle(value) {
    const snapAngle = 360 / 7; // 51.428571°
    return Math.round(value / snapAngle) * snapAngle;
  }

  chakraLayer.addEventListener("change", () => { selectedLayer = "chakra"; drawHeptagram(); });
  dayLayer.addEventListener("change", () => { selectedLayer = "day"; drawHeptagram(); });
  angleLayer.addEventListener("change", () => { selectedLayer = "angle"; drawHeptagram(); });
  planetLayer.addEventListener("change", () => { selectedLayer = "planet"; drawHeptagram(); });
  noteLayer.addEventListener("change", () => { selectedLayer = "note"; drawHeptagram(); });
  foodLayer.addEventListener("change", () => { selectedLayer = "food"; drawHeptagram(); });
  elementLayer.addEventListener("change", () => { selectedLayer = "element"; drawHeptagram(); });
  crystalLayer.addEventListener("change", () => { selectedLayer = "crystal"; drawHeptagram(); });

  prevDay.addEventListener("click", () => {
    currentDayIndex = (currentDayIndex - 1 + 7) % 7;
    daySelect.value = currentDayIndex;
    drawHeptagram();
  });

  daySelect.addEventListener("change", () => {
    currentDayIndex = parseInt(daySelect.value);
    drawHeptagram();
  });

  nextDay.addEventListener("click", () => {
    currentDayIndex = (currentDayIndex + 1) % 7;
    daySelect.value = currentDayIndex;
    drawHeptagram();
  });

  cycleMapping.addEventListener("click", () => {
    for (let layer in customMapping) {
      customMapping[layer] = customMapping[layer].map(i => (i + 1) % 7);
    }
    drawHeptagram();
  });

  rotation.addEventListener("input", () => {
    rotationAngle = snapToAngle(parseInt(rotation.value));
    drawHeptagram();
  });

  playFrequencyBtn.addEventListener("click", () => {
    const data = chakraData[customMapping[selectedLayer][currentDayIndex]];
    playFrequency(parseInt(data.frequency));
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
});