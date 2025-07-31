const svg = document.getElementById("heptagramViz");
const chakraToggle = document.getElementById("chakraToggle");
const dayToggle = document.getElementById("dayToggle");
const angleToggle = document.getElementById("angleToggle");
const planetToggle = document.getElementById("planetToggle");
const noteToggle = document.getElementById("noteToggle");
const foodToggle = document.getElementById("foodToggle");
const focusToggle = document.getElementById("focusToggle");
const exerciseToggle = document.getElementById("exerciseToggle");
const bodyToggle = document.getElementById("bodyToggle");
const colorToggle = document.getElementById("colorToggle");
const maskToggle = document.getElementById("maskToggle");
const rotateToggle = document.getElementById("rotateToggle");
const downloadBtn = document.getElementById("downloadBtn");
const playFrequencyBtn = document.getElementById("playFrequencyBtn");
const chakraRot = document.getElementById("chakraRot");
const dayRot = document.getElementById("dayRot");
const angleRot = document.getElementById("angleRot");
const planetRot = document.getElementById("planetRot");
const noteRot = document.getElementById("noteRot");
const foodRot = document.getElementById("foodRot");
const focusRot = document.getElementById("focusRot");
const exerciseRot = document.getElementById("exerciseRot");
const bodyRot = document.getElementById("bodyRot");
const colorRot = document.getElementById("colorRot");

const chakraData = [
  { name: "Crown (Sahasrara)", day: "The Write Sunday", color: "#a63d40", body: "Whole Body Integration", exercise: "Yoga, Stretching, Breathing Exercises, Rest, Reflection", spiritual: "Spirituality, enlightenment, divine connection", focus: "Spirituality, Awareness, Unity", food: "Purple kale, figs, lavender tea, chia seeds, mushrooms, herbal infusions, and fasting-friendly foods", meaning: "Spiritual connection, enlightenment, mental clarity", note: "B", frequency: "963 Hz, 528 Hz", planet: "Sun", time: "11:00:00 PM" },
  { name: "Third Eye (Ajna)", day: "Music Monday", color: "#a65f3e", body: "Forehead, Eyes, and Brain", exercise: "Meditation, Yoga Focus Training, Eye Exercises", spiritual: "Intuition, insight, perception", focus: "Intuition, Insight, Perception", food: "Purple grapes, eggplant, purple cabbage, blackberries, dark chocolate, and walnuts", meaning: "Intuition, clarity, and insight", note: "A", frequency: "852 Hz, 528 Hz", planet: "Moon", time: "9:00:00 PM" },
  { name: "Solar Plexus (Manipura)", day: "Tech Tuesday", color: "#a68c3d", body: "Core and Abdominals", exercise: "Planks, Twisting, Leg Raises, Crunches", spiritual: "Confidence, power, motivation", focus: "Confidence, Power, Motivation", food: "Bananas, lemons, corn, yellow peppers, squash, ginger, turmeric, grains (rice, oats, quinoa)", meaning: "Willpower, personal strength, digestion", note: "E", frequency: "528 Hz, 528 Hz", planet: "Mars", time: "4:00:00 PM" },
  { name: "Heart (Anahata)", day: "Web Wednesday", color: "#4d8c4d", body: "Chest, Upper Back, and Arms", exercise: "Push-Ups, Bench Press, Pull-Ups, Rows, Dumbbell Flies", spiritual: "Love, compassion, emotional healing", focus: "Love, Compassion, Healing", food: "Leafy greens (spinach, broccoli, kale), avocados, cucumber, green apples, matcha, and almonds", meaning: "Emotional balance, love, and harmony", note: "F♯", frequency: "639 Hz, 528 Hz", planet: "Mercury", time: "5:00:00 PM" },
  { name: "Throat (Vishuddha)", day: "Theory Thursday", color: "#3f708c", body: "Shoulders, Shoulders, Neck, and Arms", exercise: "Shoulder Press, Lateral Raises, Upright Rows, Neck Stretches", spiritual: "Communication, truth, self-expression", focus: "Communication, Expression, Truth", food: "Blueberries, plums, blackberries, seaweed, herbal teas, coconut water, and honey", meaning: "Clear expression, fluidity, and speaking truth", note: "G♯", frequency: "741 Hz, 528 Hz", planet: "Jupiter", time: "7:00:00 PM" },
  { name: "Sacral (Svadhisthana)", day: "Fractal Friday", color: "#5e4d8c", body: "Hips, Pelvis, and Lower Abs", exercise: "Hip Thrusts, Bridges, Leg Raises, Abductor/Adductor Machines", spiritual: "Creativity, sensuality, emotions", focus: "Creativity, Sensuality, Emotions", food: "Oranges, mangoes, papayas, carrots, sweet potatoes, apricots, nuts, seeds, and fatty fish", meaning: "Passion, pleasure, emotional balance", note: "D", frequency: "417 Hz, 417 Hz", planet: "Venus", time: "2:00:00 PM" },
  { name: "Root (Muladhara)", day: "Sojourn (if you can't go, then create)", color: "#7e3e8c", body: "Legs, Feet, and Glutes", exercise: "Squats, Lunges, Deadlifts, Calf Raises", spiritual: "Grounding, stability, survival", focus: "Grounding, Survival, Stability", food: "Root vegetables (beets, carrots, potatoes), red apples, strawberries, tomatoes, red beans, protein", meaning: "Grounding, security, strength", note: "C", frequency: "396 Hz, 396 Hz", planet: "Saturn", time: "12:00:00 PM" }
];

const planetGlyphs = {
  Sun: "☉", Moon: "☽", Mars: "♂", Mercury: "☿", Jupiter: "♃", Venus: "♀", Saturn: "♄"
};

let rotations = {
  chakra: 0, day: 0, angle: 0, planet: 0, note: 0, food: 0, focus: 0, exercise: 0, body: 0, color: 0
};
let isRotating = rotateToggle.checked;
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let currentOscillator = null;

function createSVGElement(tag) {
  return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

function getCurrentDayChakra() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const now = new Date();
  const dayName = days[now.getUTCDay()]; // Using UTC to match MDT offset
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
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Volume at 10%
  currentOscillator.start();
  setTimeout(() => {
    currentOscillator.stop();
    currentOscillator = null;
  }, 2000); // Play for 2 seconds
}

function drawHeptagram() {
  svg.innerHTML = "";
  const cx = 250, cy = 250, r = 180;
  const basePoints = [];

  // Calculate base points
  for (let i = 0; i < 7; i++) {
    const angle = (2 * Math.PI * i) / 7 - Math.PI / 2;
    basePoints.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }

  // Draw Heptagram (7/3 configuration)
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

  // Draw Chakra Wedges with independent rotation and masking
  if (chakraToggle.checked) {
    const gChakras = createSVGElement("g");
    gChakras.setAttribute("transform", `rotate(${rotations.chakra}, ${cx}, ${cy})`);
    const currentDayChakra = getCurrentDayChakra();
    for (let i = 0; i < 7; i++) {
      const startAngle = (i * 360 / 7 - 90) * Math.PI / 180;
      const endAngle = ((i + 1) * 360 / 7 - 90) * Math.PI / 180;
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
      if (maskToggle.checked && chakraData[i] === currentDayChakra) {
        path.classList.add("current-day");
      }
      path.addEventListener("mousemove", (e) => showTooltip(e, chakraData[i]));
      path.addEventListener("mouseout", hideTooltip);
      path.addEventListener("touchend", hideTooltip);
      gChakras.appendChild(path);

      const labelAngle = (i * 360 / 7 - 90 + 360 / 14) * Math.PI / 180;
      const label = createSVGElement("text");
      label.setAttribute("x", cx + (r * 0.8) * Math.cos(labelAngle));
      label.setAttribute("y", cy + (r * 0.8) * Math.sin(labelAngle));
      label.textContent = chakraData[i].name.split(" ")[0];
      label.classList.add("chakra-label");
      gChakras.appendChild(label);
    }
    if (maskToggle.checked) {
      const mask = createSVGElement("path");
      mask.setAttribute("d", `M ${cx} ${cy} ${basePoints.map(p => `L ${p[0]} ${p[1]}`).join(" ")} Z`);
      mask.setAttribute("fill", "rgba(0, 0, 0, 0.7)");
      mask.classList.add("mask-overlay");
      gChakras.appendChild(mask);
    }
    svg.appendChild(gChakras);
  }

  // Draw Days with independent rotation
  if (dayToggle.checked) {
    const gDays = createSVGElement("g");
    gDays.setAttribute("transform", `rotate(${rotations.day}, ${cx}, ${cy})`);
    for (let i = 0; i < 7; i++) {
      const angle = (i * 360 / 7 - 90) * Math.PI / 180;
      const label = createSVGElement("text");
      label.setAttribute("x", cx + (r * 1.3) * Math.cos(angle));
      label.setAttribute("y", cy + (r * 1.3) * Math.sin(angle));
      label.textContent = chakraData[i].day.split(" ")[0];
      label.classList.add("day-label");
      gDays.appendChild(label);
    }
    svg.appendChild(gDays);
  }

  // Draw Angle Markers with independent rotation
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
      label.classList.add("angle-label");
      gAngles.appendChild(label);
    }
    svg.appendChild(gAngles);
  }

  // Draw Planet Glyphs with independent rotation
  if (planetToggle.checked) {
    const gPlanets = createSVGElement("g");
    gPlanets.setAttribute("transform", `rotate(${rotations.planet}, ${cx}, ${cy})`);
    for (let i = 0; i < 7; i++) {
      const angle = (i * 360 / 7 - 90) * Math.PI / 180;
      const glyph = createSVGElement("text");
      glyph.setAttribute("x", cx + (r * 1.2) * Math.cos(angle));
      glyph.setAttribute("y", cy + (r * 1.2) * Math.sin(angle));
      glyph.textContent = planetGlyphs[chakraData[i].planet];
      glyph.classList.add("planet-glyph");
      gPlanets.appendChild(glyph);
    }
    svg.appendChild(gPlanets);
  }

  // Draw Musical Notes with independent rotation
  if (noteToggle.checked) {
    const gNotes = createSVGElement("g");
    gNotes.setAttribute("transform", `rotate(${rotations.note}, ${cx}, ${cy})`);
    for (let i = 0; i < 7; i++) {
      const angle = (i * 360 / 7 - 90) * Math.PI / 180;
      const note = createSVGElement("text");
      note.setAttribute("x", cx + (r * 0.6) * Math.cos(angle));
      note.setAttribute("y", cy + (r * 0.6) * Math.sin(angle));
      note.textContent = chakraData[i].note;
      note.classList.add("note-label");
      gNotes.appendChild(note);
    }
    svg.appendChild(gNotes);
  }

  // Draw Food Suggestions with independent rotation
  if (foodToggle.checked) {
    const gFood = createSVGElement("g");
    gFood.setAttribute("transform", `rotate(${rotations.food}, ${cx}, ${cy})`);
    for (let i = 0; i < 7; i++) {
      const angle = (i * 360 / 7 - 90) * Math.PI / 180;
      const label = createSVGElement("text");
      label.setAttribute("x", cx + (r * 1.5) * Math.cos(angle));
      label.setAttribute("y", cy + (r * 1.5) * Math.sin(angle));
      label.textContent = chakraData[i].food.split(",")[0]; // First food item for brevity
      label.classList.add("food-label");
      gFood.appendChild(label);
    }
    svg.appendChild(gFood);
  }

  // Draw Focus Areas with independent rotation
  if (focusToggle.checked) {
    const gFocus = createSVGElement("g");
    gFocus.setAttribute("transform", `rotate(${rotations.focus}, ${cx}, ${cy})`);
    for (let i = 0; i < 7; i++) {
      const angle = (i * 360 / 7 - 90) * Math.PI / 180;
      const label = createSVGElement("text");
      label.setAttribute("x", cx + (r * 1.7) * Math.cos(angle));
      label.setAttribute("y", cy + (r * 1.7) * Math.sin(angle));
      label.textContent = chakraData[i].focus.split(",")[0]; // First focus item for brevity
      label.classList.add("focus-label");
      gFocus.appendChild(label);
    }
    svg.appendChild(gFocus);
  }

  // Draw Exercise with independent rotation
  if (exerciseToggle.checked) {
    const gExercise = createSVGElement("g");
    gExercise.setAttribute("transform", `rotate(${rotations.exercise}, ${cx}, ${cy})`);
    for (let i = 0; i < 7; i++) {
      const angle = (i * 360 / 7 - 90) * Math.PI / 180;
      const label = createSVGElement("text");
      label.setAttribute("x", cx + (r * 1.9) * Math.cos(angle));
      label.setAttribute("y", cy + (r * 1.9) * Math.sin(angle));
      label.textContent = chakraData[i].exercise.split(",")[0]; // First exercise for brevity
      label.classList.add("exercise-label");
      gExercise.appendChild(label);
    }
    svg.appendChild(gExercise);
  }

  // Draw Body Focus with independent rotation
  if (bodyToggle.checked) {
    const gBody = createSVGElement("g");
    gBody.setAttribute("transform", `rotate(${rotations.body}, ${cx}, ${cy})`);
    for (let i = 0; i < 7; i++) {
      const angle = (i * 360 / 7 - 90) * Math.PI / 180;
      const label = createSVGElement("text");
      label.setAttribute("x", cx + (r * 2.1) * Math.cos(angle));
      label.setAttribute("y", cy + (r * 2.1) * Math.sin(angle));
      label.textContent = chakraData[i].body;
      label.classList.add("body-label");
      gBody.appendChild(label);
    }
    svg.appendChild(gBody);
  }

  // Draw Color with independent rotation
  if (colorToggle.checked) {
    const gColor = createSVGElement("g");
    gColor.setAttribute("transform", `rotate(${rotations.color}, ${cx}, ${cy})`);
    for (let i = 0; i < 7; i++) {
      const angle = (i * 360 / 7 - 90) * Math.PI / 180;
      const label = createSVGElement("text");
      label.setAttribute("x", cx + (r * 2.3) * Math.cos(angle));
      label.setAttribute("y", cy + (r * 2.3) * Math.sin(angle));
      label.textContent = chakraData[i].color;
      label.classList.add("color-label");
      gColor.appendChild(label);
    }
    svg.appendChild(gColor);
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
    Day: ${data.day}<br>
    Color: ${data.color}<br>
    Body: ${data.body}<br>
    Exercise: ${data.exercise}<br>
    Spiritual: ${data.spiritual}<br>
    Focus: ${data.focus}<br>
    Food: ${data.food}<br>
    Meaning: ${data.meaning}<br>
    Note: ${data.note}<br>
    Frequency: ${data.frequency}<br>
    Planet: ${data.planet}<br>
    Time: ${data.time}
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
    for (let key in rotations) {
      rotations[key] += 0.5; // Slow auto-rotation
      if (rotations[key] >= 360) rotations[key] -= 360;
    }
    drawHeptagram();
  }
  requestAnimationFrame(animate);
}

// Event Listeners for Toggles
chakraToggle.addEventListener("change", drawHeptagram);
dayToggle.addEventListener("change", drawHeptagram);
angleToggle.addEventListener("change", drawHeptagram);
planetToggle.addEventListener("change", drawHeptagram);
noteToggle.addEventListener("change", drawHeptagram);
foodToggle.addEventListener("change", drawHeptagram);
focusToggle.addEventListener("change", drawHeptagram);
exerciseToggle.addEventListener("change", drawHeptagram);
bodyToggle.addEventListener("change", drawHeptagram);
colorToggle.addEventListener("change", drawHeptagram);
maskToggle.addEventListener("change", drawHeptagram);
rotateToggle.addEventListener("change", () => {
  isRotating = rotateToggle.checked;
  if (isRotating) animate();
});

// Event Listeners for Rotation Sliders
chakraRot.addEventListener("input", () => {
  rotations.chakra = parseInt(chakraRot.value);
  drawHeptagram();
});
dayRot.addEventListener("input", () => {
  rotations.day = parseInt(dayRot.value);
  drawHeptagram();
});
angleRot.addEventListener("input", () => {
  rotations.angle = parseInt(angleRot.value);
  drawHeptagram();
});
planetRot.addEventListener("input", () => {
  rotations.planet = parseInt(planetRot.value);
  drawHeptagram();
});
noteRot.addEventListener("input", () => {
  rotations.note = parseInt(noteRot.value);
  drawHeptagram();
});
foodRot.addEventListener("input", () => {
  rotations.food = parseInt(foodRot.value);
  drawHeptagram();
});
focusRot.addEventListener("input", () => {
  rotations.focus = parseInt(focusRot.value);
  drawHeptagram();
});
exerciseRot.addEventListener("input", () => {
  rotations.exercise = parseInt(exerciseRot.value);
  drawHeptagram();
});
bodyRot.addEventListener("input", () => {
  rotations.body = parseInt(bodyRot.value);
  drawHeptagram();
});
colorRot.addEventListener("input", () => {
  rotations.color = parseInt(colorRot.value);
  drawHeptagram();
});

playFrequencyBtn.addEventListener("click", () => {
  const currentDayChakra = getCurrentDayChakra();
  const frequency = parseInt(currentDayChakra.frequency.split(",")[0]); // Use first frequency
  playFrequency(frequency);
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