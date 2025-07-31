document.addEventListener("DOMContentLoaded", () => {
  const svg = document.getElementById("heptagramViz");
  const chakraToggle = document.getElementById("chakraToggle");
  const dayToggle = document.getElementById("dayToggle");
  const angleToggle = document.getElementById("angleToggle");
  const planetToggle = document.getElementById("planetToggle");
  const noteToggle = document.getElementById("noteToggle");
  const rotateToggle = document.getElementById("rotateToggle");
  const downloadBtn = document.getElementById("downloadBtn");
  const playFrequencyBtn = document.getElementById("playFrequencyBtn");
  const chakraRot = document.getElementById("chakraRot");
  const dayRot = document.getElementById("dayRot");
  const angleRot = document.getElementById("angleRot");
  const planetRot = document.getElementById("planetRot");
  const noteRot = document.getElementById("noteRot");
  const infoPanel = document.getElementById("infoPanel");

  const chakraData = [
    { name: "Crown", day: "The Write Sunday", color: "#a63d40", focus: "Spirituality", frequency: "963 Hz", note: "B" },
    { name: "Third Eye", day: "Music Monday", color: "#a65f3e", focus: "Intuition", frequency: "852 Hz", note: "A" },
    { name: "Solar Plexus", day: "Tech Tuesday", color: "#a68c3d", focus: "Confidence", frequency: "528 Hz", note: "E" },
    { name: "Heart", day: "Web Wednesday", color: "#4d8c4d", focus: "Love", frequency: "639 Hz", note: "F♯" },
    { name: "Throat", day: "Theory Thursday", color: "#3f708c", focus: "Communication", frequency: "741 Hz", note: "G♯" },
    { name: "Sacral", day: "Fractal Friday", color: "#5e4d8c", focus: "Creativity", frequency: "417 Hz", note: "D" },
    { name: "Root", day: "Sojourn", color: "#7e3e8c", focus: "Grounding", frequency: "396 Hz", note: "C" }
  ];

  const planetGlyphs = { Sun: "☉", Moon: "☽", Mars: "♂", Mercury: "☿", Jupiter: "♃", Venus: "♀", Saturn: "♄" };
  let rotations = { chakra: 0, day: 0, angle: 0, planet: 0, note: 0 };
  let isRotating = rotateToggle.checked;
  let audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let currentOscillator = null;

  function createSVGElement(tag) { return document.createElementNS("http://www.w3.org/2000/svg", tag); }

  function getCurrentDayChakra() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const now = new Date();
    const dayName = days[now.getUTCDay()]; // Thursday, July 31, 2025
    return chakraData.find(chakra => chakra.day.includes(dayName));
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
    const snapped = Math.round(value / snapAngle) * snapAngle;
    updateInfoPanel(snapped);
    return snapped;
  }

  function updateInfoPanel(rotation) {
    const currentDayChakra = getCurrentDayChakra();
    const activeIndex = chakraData.indexOf(currentDayChakra);
    const offset = (rotation / (360 / 7)) % 7;
    const displayIndex = Math.round((activeIndex + offset) % 7);
    const displayChakra = chakraData[displayIndex];
    infoPanel.innerHTML = `
      <h2>Today: ${displayChakra.day.split(" ")[1]}</h2>
      <p><strong>Chakra:</strong> ${displayChakra.name}</p>
      <p><strong>Focus:</strong> ${displayChakra.focus}</p>
      <p><strong>Frequency:</strong> ${displayChakra.frequency}</p>
    `;
  }

  function drawHeptagram() {
    svg.innerHTML = "";
    const cx = 250, cy = 250, r = 180;
    const basePoints = [];

    // Rotate to set Root (index 6) at bottom (0°)
    const baseRotation = -90 * Math.PI / 180; // Adjust for 0° at bottom
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

    if (chakraToggle.checked) {
      const gChakras = createSVGElement("g");
      gChakras.setAttribute("transform", `rotate(${rotations.chakra}, ${cx}, ${cy})`);
      const currentDayChakra = getCurrentDayChakra();
      for (let i = 0; i < 7; i++) {
        const startAngle = (i * 360 / 7 - 90) * Math.PI / 180 + baseRotation;
        const endAngle = ((i + 1) * 360 / 7 - 90) * Math.PI / 180 + baseRotation;
        const path = createSVGElement("path");
        const d = `M ${cx} ${cy} L ${cx + r * Math.cos(startAngle)} ${cy + r * Math.sin(startAngle)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(endAngle)} ${cy + r * Math.sin(endAngle)} Z`;
        path.setAttribute("d", d);
        path.setAttribute("fill", chakraData[i].color);
        path.classList.add("chakra-wedge");
        if (chakraData[i] !== currentDayChakra) {
          const mask = createSVGElement("path");
          mask.setAttribute("d", d);
          mask.setAttribute("fill", "rgba(0, 0, 0, 0.8)");
          mask.classList.add("mask-overlay");
          gChakras.appendChild(mask);
        }
        // Text in wedge center
        const midAngle = (startAngle + endAngle) / 2;
        const textX = cx + (r * 0.5) * Math.cos(midAngle);
        const textY = cy + (r * 0.5) * Math.sin(midAngle);
        const dayText = createSVGElement("text");
        dayText.setAttribute("x", textX);
        dayText.setAttribute("y", textY - 20);
        dayText.textContent = chakraData[i].day.split(" ")[0];
        dayText.classList.add("day-label");
        gChakras.appendChild(dayText);

        const chakraText = createSVGElement("text");
        chakraText.setAttribute("x", textX);
        chakraText.setAttribute("y", textY - 10);
        chakraText.textContent = chakraData[i].name;
        chakraText.classList.add("chakra-label");
        gChakras.appendChild(chakraText);

        const noteText = createSVGElement("text");
        noteText.setAttribute("x", textX);
        noteText.setAttribute("y", textY);
        noteText.textContent = chakraData[i].note;
        noteText.classList.add("note-label");
        gChakras.appendChild(noteText);

        const focusText = createSVGElement("text");
        focusText.setAttribute("x", textX);
        focusText.setAttribute("y", textY + 10);
        focusText.textContent = chakraData[i].focus.split(" ")[0];
        focusText.classList.add("focus-label");
        gChakras.appendChild(focusText);

        const freqText = createSVGElement("text");
        freqText.setAttribute("x", textX);
        freqText.setAttribute("y", textY + 20);
        freqText.textContent = chakraData[i].frequency;
        freqText.classList.add("frequency-label");
        gChakras.appendChild(freqText);
        gChakras.appendChild(path);
      }
      svg.appendChild(gChakras);
    }

    if (dayToggle.checked) {
      const gDays = createSVGElement("g");
      gDays.setAttribute("transform", `rotate(${rotations.day}, ${cx}, ${cy})`);
      for (let i = 0; i < 7; i++) {
        const angle = (i * 360 / 7 - 90) * Math.PI / 180 + baseRotation;
        const label = createSVGElement("text");
        label.setAttribute("x", cx + (r * 1.3) * Math.cos(angle));
        label.setAttribute("y", cy + (r * 1.3) * Math.sin(angle));
        label.textContent = chakraData[i].day.split(" ")[0];
        label.setAttribute("transform", `rotate(${(angle * 180 / Math.PI) * -1}, ${cx + (r * 1.3) * Math.cos(angle)}, ${cy + (r * 1.3) * Math.sin(angle)})`);
        label.classList.add("day-label");
        gDays.appendChild(label);
      }
      svg.appendChild(gDays);
    }

    if (angleToggle.checked) {
      const gAngles = createSVGElement("g");
      gAngles.setAttribute("transform", `rotate(${rotations.angle}, ${cx}, ${cy})`);
      for (let i = 0; i < 7; i++) {
        const angle = (i * 360 / 7 - 90) * Math.PI / 180 + baseRotation;
        const line = createSVGElement("line");
        line.setAttribute("x1", cx);
        line.setAttribute("y1", cy);
        line.setAttribute("x2", cx + r * Math.cos(angle));
        line.setAttribute("y2", cy + r * Math.sin(angle));
        line.setAttribute("stroke", "#666");
        line.setAttribute("stroke-width", "1");
        line.classList.add("angle-line");
        gAngles.appendChild(line);

        const label = createSVGElement("text");
        label.setAttribute("x", cx + (r * 1.1) * Math.cos(angle));
        label.setAttribute("y", cy + (r * 1.1) * Math.sin(angle));
        label.textContent = `${(i * 51.43).toFixed(1)}°`;
        label.setAttribute("transform", `rotate(${(angle * 180 / Math.PI) * -1}, ${cx + (r * 1.1) * Math.cos(angle)}, ${cy + (r * 1.1) * Math.sin(angle)})`);
        label.classList.add("angle-label");
        gAngles.appendChild(label);
      }
      svg.appendChild(gAngles);
    }

    if (planetToggle.checked) {
      const gPlanets = createSVGElement("g");
      gPlanets.setAttribute("transform", `rotate(${rotations.planet}, ${cx}, ${cy})`);
      for (let i = 0; i < 7; i++) {
        const angle = (i * 360 / 7 - 90) * Math.PI / 180 + baseRotation;
        const glyph = createSVGElement("text");
        glyph.setAttribute("x", cx + (r * 1.2) * Math.cos(angle));
        glyph.setAttribute("y", cy + (r * 1.2) * Math.sin(angle));
        glyph.textContent = planetGlyphs[Object.keys(planetGlyphs)[i % 7]];
        glyph.setAttribute("transform", `rotate(${(angle * 180 / Math.PI) * -1}, ${cx + (r * 1.2) * Math.cos(angle)}, ${cy + (r * 1.2) * Math.sin(angle)})`);
        glyph.classList.add("planet-glyph");
        gPlanets.appendChild(glyph);
      }
      svg.appendChild(gPlanets);
    }

    if (noteToggle.checked) {
      const gNotes = createSVGElement("g");
      gNotes.setAttribute("transform", `rotate(${rotations.note}, ${cx}, ${cy})`);
      for (let i = 0; i < 7; i++) {
        const angle = (i * 360 / 7 - 90) * Math.PI / 180 + baseRotation;
        const note = createSVGElement("text");
        note.setAttribute("x", cx + (r * 0.6) * Math.cos(angle));
        note.setAttribute("y", cy + (r * 0.6) * Math.sin(angle));
        note.textContent = chakraData[i].note;
        note.setAttribute("transform", `rotate(${(angle * 180 / Math.PI) * -1}, ${cx + (r * 0.6) * Math.cos(angle)}, ${cy + (r * 0.6) * Math.sin(angle)})`);
        note.classList.add("note-label");
        gNotes.appendChild(note);
      }
      svg.appendChild(gNotes);
    }
  }

  function showTooltip(e, data) {
    let tooltip = document.querySelector(".tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      document.body.appendChild(tooltip);
    }
    tooltip.innerHTML = `<strong>${data.name}</strong><br>Focus: ${data.focus}`;
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
      for (let key in rotations) {
        rotations[key] += 51.43 / 10;
        if (rotations[key] >= 360) rotations[key] -= 360;
      }
      drawHeptagram();
    }
    requestAnimationFrame(animate);
  }

  chakraToggle.addEventListener("change", drawHeptagram);
  dayToggle.addEventListener("change", drawHeptagram);
  angleToggle.addEventListener("change", drawHeptagram);
  planetToggle.addEventListener("change", drawHeptagram);
  noteToggle.addEventListener("change", drawHeptagram);
  rotateToggle.addEventListener("change", () => { isRotating = rotateToggle.checked; if (isRotating) animate(); });

  chakraRot.addEventListener("input", () => { rotations.chakra = snapToAngle(parseInt(chakraRot.value)); drawHeptagram(); });
  dayRot.addEventListener("input", () => { rotations.day = snapToAngle(parseInt(dayRot.value)); drawHeptagram(); });
  angleRot.addEventListener("input", () => { rotations.angle = snapToAngle(parseInt(angleRot.value)); drawHeptagram(); });
  planetRot.addEventListener("input", () => { rotations.planet = snapToAngle(parseInt(planetRot.value)); drawHeptagram(); });
  noteRot.addEventListener("input", () => { rotations.note = snapToAngle(parseInt(noteRot.value)); drawHeptagram(); });

  playFrequencyBtn.addEventListener("click", () => {
    const currentDayChakra = getCurrentDayChakra();
    playFrequency(parseInt(currentDayChakra.frequency));
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
  if (isRotating) animate();
});