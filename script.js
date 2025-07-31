document.addEventListener("DOMContentLoaded", () => {
  const svg = document.getElementById("heptagramViz");
  const toggleRotate = document.getElementById("toggleRotate");

  function drawHeptagram() {
    svg.innerHTML = ""; // clear previous
    const center = 250;
    const radius = 200;
    const points = [];

    for (let i = 0; i < 7; i++) {
      const angle = (2 * Math.PI * i * 3) / 7;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      points.push([x, y]);
    }

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M${points.map(p => p.join(",")).join(" L")} Z`);
    path.setAttribute("stroke", "#333");
    path.setAttribute("fill", "none");
    svg.appendChild(path);
  }

  drawHeptagram();

  if (toggleRotate.checked) {
    let angle = 0;
    setInterval(() => {
      angle = (angle + 0.2) % 360;
      svg.style.transform = `rotate(${angle}deg)`;
    }, 50);
  }
});
