/* Page behavior for the MATT prototype. Each block runs only on its own page. */
(function () {
  const STATUS_COLORS = { complete: "#2e8b57", "in-progress": "#2f6fca", unscored: "#8a96a3", failed: "#c0392b" };

  // Assessment: export sample data to CSV
  const exportBtn = document.getElementById("export-csv");
  if (exportBtn) {
    exportBtn.addEventListener("click", async () => {
      const teams = await (await fetch("/api/assessment")).json();
      const rows = [["team", "area", "green", "blue", "red", "amber", "unscored"]];
      teams.forEach(t => Object.entries(t.categories).forEach(([area, c]) => rows.push([t.name, area, ...c])));
      const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\r\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      a.download = "assessment.csv";
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }

  // Task Wheel: zoomable sunburst
  const wheelEl = document.getElementById("wheel");
  if (wheelEl) {
    if (typeof d3 === "undefined") {
      wheelEl.textContent = "Could not load D3 from the CDN. Check your internet connection.";
    } else {
      fetch("/api/tasks").then(r => r.json()).then(tasks => drawWheel(wheelEl, tasks));
    }
  }

  function drawWheel(el, tasks) {
    const width = 640, radius = width / 6;
    const info = document.getElementById("wheel-info");
    const root = d3.hierarchy({ name: "All tasks", children: tasks }).count();
    d3.partition().size([2 * Math.PI, root.height + 1])(root);
    root.each(d => (d.current = d));

    const arc = d3.arc()
      .startAngle(d => d.x0).endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005)).padRadius(radius * 1.5)
      .innerRadius(d => d.y0 * radius).outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

    const svg = d3.select(el).append("svg").attr("viewBox", [-width / 2, -width / 2, width, width]);
    const g = svg.append("g");
    const visible = d => d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;

    const path = g.selectAll("path").data(root.descendants().slice(1)).join("path")
      .attr("fill", d => STATUS_COLORS[d.data.status] || "#8a96a3")
      .attr("fill-opacity", d => (visible(d.current) ? (d.children ? 0.9 : 0.65) : 0))
      .attr("pointer-events", d => (visible(d.current) ? "auto" : "none"))
      .attr("stroke", "#fff").attr("d", d => arc(d.current))
      .style("cursor", d => (d.children ? "pointer" : "default"))
      .on("click", (e, p) => p.children && zoom(p))
      .on("mouseover", (e, d) => { info.innerHTML = `<strong>${d.data.id}</strong><br>${d.data.name}<br><small>Status: ${d.data.status}</small>`; });
    path.append("title").text(d => `${d.data.id} ${d.data.name}`);

    const label = g.append("g").attr("pointer-events", "none").attr("text-anchor", "middle").style("font-size", "10px")
      .selectAll("text").data(root.descendants().slice(1)).join("text").attr("dy", "0.35em")
      .attr("fill-opacity", d => +labelVisible(d.current)).attr("transform", d => labelTransform(d.current))
      .text(d => d.data.id);

    const center = svg.append("circle").attr("r", radius).attr("fill", "#fff").style("cursor", "pointer")
      .on("click", () => zoom(current.parent || root));
    const centerText = svg.append("text").attr("text-anchor", "middle").attr("dy", "0.35em").attr("pointer-events", "none")
      .style("font-weight", 600).text(root.data.name);
    let current = root;

    function zoom(p) {
      current = p;
      centerText.text(p.data.name);
      root.each(d => (d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth), y1: Math.max(0, d.y1 - p.depth)
      }));
      const t = svg.transition().duration(600);
      path.transition(t).tween("data", d => { const i = d3.interpolate(d.current, d.target); return t => (d.current = i(t)); })
        .filter(function (d) { return +this.getAttribute("fill-opacity") || visible(d.target); })
        .attr("fill-opacity", d => (visible(d.target) ? (d.children ? 0.9 : 0.65) : 0))
        .attr("pointer-events", d => (visible(d.target) ? "auto" : "none"))
        .attrTween("d", d => () => arc(d.current));
      label.filter(function (d) { return +this.getAttribute("fill-opacity") || labelVisible(d.target); }).transition(t)
        .attr("fill-opacity", d => +labelVisible(d.target)).attrTween("transform", d => () => labelTransform(d.current));
    }
    function labelVisible(d) { return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.06; }
    function labelTransform(d) {
      const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI, y = ((d.y0 + d.y1) / 2) * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }
  }

  // OPFOR dashboard: filters, refresh, three workflow columns
  const filters = document.getElementById("opfor-filters");
  if (filters) {
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    async function load() {
      const params = new URLSearchParams(new FormData(filters));
      const injects = await (await fetch(`/api/injects?${params}`)).json();
      document.querySelectorAll("[data-status]").forEach(col => {
        const items = injects.filter(i => i.status === col.dataset.status);
        col.innerHTML = items.length ? items.map(i => `
          <article class="inject ${esc(i.type)}">
            <h3>${esc(i.id)} · ${esc(i.title)}</h3>
            <small>${esc(i.team)} · Day ${esc(i.day)} · ${esc(i.type)} · ${esc(i.priority)}</small>
            <p>${esc(i.description)}</p>
          </article>`).join("") : '<p class="empty">No injects</p>';
      });
    }
    filters.addEventListener("change", e => { if (e.target.id !== "auto-refresh") load(); });
    document.getElementById("refresh").addEventListener("click", load);
    let timer = null;
    document.getElementById("auto-refresh").addEventListener("change", e => {
      clearInterval(timer);
      timer = e.target.checked ? setInterval(load, 30000) : null;
    });
    load();
  }
})();
