const svg = document.getElementById("heptagramViz");
const chakraToggle = document.getElementById("chakraToggle");
const dayToggle = document.getElementById("dayToggle");
const angleToggle = document.getElementById("angleToggle");
const planetToggle = document.getElementById("planetToggle");
const noteToggle = document.getElementById("noteToggle");
const maskToggle = document.getElementById("maskToggle");
const rotateToggle = document.getElementById("rotateToggle");
const downloadBtn = document.getElementById("downloadBtn");
const playFrequencyBtn = document.getElementById("playFrequencyBtn");
const chakraRot = document.getElementById("chakraRot");
const dayRot = document.getElementById("dayRot");
const angleRot = document.getElementById("angleRot");
const planetRot = document.getElementById("planetRot");
const noteRot = document.getElementById("noteRot");
const showDay = document.getElementById("showDay");
const showFood = document.getElementById("showFood");
const showFocus = document.getElementById("showFocus");
const showExercise = document.getElementById("showExercise");
const showBody = document.getElementById("showBody");
const showColor = document.getElementById("showColor");

const chakraData = [
  { name: "Crown", day: "The Write Sunday", color: "#a63d40", body: "Whole Body", exercise: "Yoga", focus: "Spirituality", food: "Purple kale", note: "B", frequency: "963 Hz", planet: "Sun" },
  { name: "Third Eye", day: "Music Monday", color: "#a65f3e", body: "Forehead", exercise: "Meditation", focus: "Intuition", food: "Purple grapes", note: "A", frequency: "852 Hz", planet: "Moon" },
  { name: "Solar Plexus", day: "Tech Tuesday", color: "#a68c3d", body: "Core", exercise: "Planks", focus: "Confidence", food: "Bananas", note: "E", frequency: "528 Hz", planet: "Mars" },
  { name: "Heart", day: "Web Wednesday", color: "#4d8c4d", body: "Chest", exercise: "Push-Ups", focus: "Love", food: "Leafy greens", note: "F♯", frequency: "639 Hz", planet: "Mercury" },
  { name: "Throat", day: "Theory Thursday", color: "#3f708c", body: "Shoulders", exercise: "Shoulder Press", focus: "Communication", food: "Blueberries", note: "G♯", frequency: "741 Hz", planet: "Jupiter" },
  { name: "Sacral", day: "Fractal Friday", color: "#5e4d8c", body: "Hips", exercise: "Hip Thrusts", focus: "Creativity", food: "Oranges", note: "D", frequency: "417 Hz", planet: "Venus" },
  { name: "Root", day: "Sojourn", color: "#7e3e8c", body: "Legs", exercise: "Squats", focus: "Grounding", food: "Root veggies", note: "C", frequency: "396 Hz", planet: "Saturn" }
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
  return chakraData.find(chakra => chakra.day.includes(days[now.getUTCDay()]));
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

function drawHeptagram() {
  svg.innerHTML = "";
  const cx = 250, cy = 250, r = 180;
  const basePoints = [];

  for (let i = 0; i < 7; i++) {
    const angle = (2 * Math.PI * i) / 7 - Math.PI / 2;
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
      const startAngle = (i * 360 / 7 - 90) * Math.PI / 180;
      const endAngle = ((i + 1) * 360 / 7 - 90) * Math.PI / 180;
      const path = createSVGElement("path");
      const d = `M ${cx} ${cy} L ${cx + r * Math.cos(startAngle)} ${cy + r * Math.sin(startAngle)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(endAngle)} ${cy + r * Math.sin(endAngle)} Z`;
      path.setAttribute("d", d);
      path.setAttribute("fill", chakraData[i].color);
      path.classList.add("chakra-wedge");
      if (maskToggle.checked && chakraData[i] === currentDayChakra) path.classList.add("current-day");
      path.addEventListener("mousemove", (e) => showTooltip(e, chakraData[i]));
      path.addEventListener("mouseout", hideTooltip);
      path.addEventListener("touchend", hideTooltip);
      gChakras.appendChild(path);
    }
    if (maskToggle.checked) {
      const mask = createSVGElement("path");
      mask.setAttribute("d", `M ${cx} ${cy} ${basePoints.map(p => `L ${p[0]} ${p[1]}`).join(" ")} Z`);
      mask.setAttribute("fill", "rgba(0, 0, 0, 0.7)");
      mask.classList.add("mask-overlay");
      gChakras.appendChild(mask);
    }
    svg.appendChild(gChakras);

    if (maskToggle.checked && currentDayChakra) {
      const activeIndex = chakraData.indexOf(currentDayChakra);
      const activeAngle = (activeIndex * 360 / 7 - 90) * Math.PI / 180;
      const gText = createSVGElement("g");
      gText.setAttribute("transform", `rotate(${rotations.chakra + activeIndex * 360 / 7}, ${cx}, ${cy})`);
      let yOffset = -40;
      if (showDay.checked) {
        const dayText = createSVGElement("text");
        dayText.setAttribute("x", cx);
        dayText.setAttribute("y", cy + yOffset);
        dayText.textContent = currentDayChakra.day;
        dayText.classList.add("active-text", "day-label");
        dayText.setAttribute("transform", `rotate(${(activeAngle * 180 / Math.PI) * -1}, ${cx}, ${cy})`);
        gText.appendChild(dayText);
        yOffset += 15;
      }
      if (showFood.checked) {
        const foodText = createSVGElement("text");
        foodText.setAttribute("x", cx);
        foodText.setAttribute("y", cy + yOffset);
        foodText.textContent = currentDayChakra.food;
        foodText.classList.add("active-text", "food-label");
        foodText.setAttribute("transform", `rotate(${(activeAngle * 180 / Math.PI) * -1}, ${cx}, ${cy})`);
        gText.appendChild(foodText);
        yOffset += 15;
      }
      if (showFocus.checked) {
        const focusText = createSVGElement("text");
        focusText.setAttribute("x", cx);
        focusText.setAttribute("y", cy + yOffset);
        focusText.textContent = currentDayChakra.focus;
        focusText.classList.add("active-text", "focus-label");
        focusText.setAttribute("transform", `rotate(${(activeAngle * 180 / Math.PI) * -1}, ${cx}, ${cy})`);
        gText.appendChild(focusText);
        yOffset += 15;
      }
      if (showExercise.checked) {
        const exerciseText = createSVGElement("text");
        exerciseText.setAttribute("x", cx);
        exerciseText.setAttribute("y", cy + yOffset);
        exerciseText.textContent = currentDayChakra.exercise;
        exerciseText.classList.add("active-text", "exercise-label");
        exerciseText.setAttribute("transform", `rotate(${(activeAngle * 180 / Math.PI) * -1}, ${cx}, ${cy})`);
        gText.appendChild(exerciseText);
        yOffset += 15;
      }
      if (showBody.checked) {
        const bodyText = createSVGElement("text");
        bodyText.setAttribute("x", cx);
        bodyText.setAttribute("y", cy + yOffset);
        bodyText.textContent = currentDayChakra.body;
        bodyText.classList.add("active-text", "body-label");
        bodyText.setAttribute("transform", `rotate(${(activeAngle * 180 / Math.PI) * -1}, ${cx}, ${cy})`);
        gText.appendChild(bodyText);
        yOffset += 15;
      }
      if (showColor.checked) {
        const colorText = createSVGElement("text");
        colorText.setAttribute("x", cx);
        colorText.setAttribute("y", cy + yOffset);
        colorText.textContent = currentDayChakra.color;
        colorText.classList.add("active-text", "color-label");
        colorText.setAttribute("transform", `rotate(${(activeAngle * 180 / Math.PI) * -1}, ${cx}, ${cy})`);
        gText.appendChild(colorText);
      }
      svg.appendChild(gText);
    }
  }

  if (dayToggle.checked && !maskToggle.checked) {
    const gDays = createSVGElement("g");
    gDays.setAttribute("transform", `rotate(${rotations.day}, ${cx}, ${cy})`);
    for (let i = 0; i < 7; i++) {
      const angle = (i * 360 / 7 - 90) * Math.PI / 180;
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
      const angle = (i * 360 / 7 - 90) * Math.PI / 180;
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
      const angle = (i * 360 / 7 - 90) * Math.PI / 180;
      const glyph = createSVGElement("text");
      glyph.setAttribute("x", cx + (r * 1.2) * Math.cos(angle));
      glyph.setAttribute("y", cy + (r * 1.2) * Math.sin(angle));
      glyph.textContent = planetGlyphs[chakraData[i].planet];
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
      const angle = (i * 360 / 7 - 90) * Math.PI / 180;
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
  tooltip.innerHTML = `<strong>${data.name}</strong><br>Day: ${data.day}<br>Focus: ${data.focus}`;
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
      rotations[key] += 51.43 / 10; // Slow rotation
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
maskToggle.addEventListener("change", drawHeptagram);
rotateToggle.addEventListener("change", () => { isRotating = rotateToggle.checked; if (isRotating) animate(); });
showDay.addEventListener("change", drawHeptagram);
showFood.addEventListener("change", drawHeptagram);
showFocus.addEventListener("change", drawHeptagram);
showExercise.addEventListener("change", drawHeptagram);
showBody.addEventListener("change", drawHeptagram);
showColor.addEventListener("change", drawHeptagram);

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