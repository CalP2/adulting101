/**
 * Adulting 101: Native Offline SVG Charting Engine
 * Generates responsive SVG graphics dynamically without external dependencies.
 */

const ChartEngine = {
  /**
   * Renders a responsive Donut / Ring Chart into a target container
   * @param {string} containerId - DOM element ID
   * @param {Array<{label: string, value: number, color: string}>} slices
   */
  renderDonut(containerId, slices) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const total = slices.reduce((acc, s) => acc + Math.max(0, s.value), 0);
    if (total === 0) {
      container.innerHTML = `<div style="text-align:center; color:#94a3b8; font-size:0.8rem; padding:1rem;">No data to display</div>`;
      return;
    }

    let cumulativePercent = 0;
    const radius = 40;
    const strokeWidth = 16;
    const circumference = 2 * Math.PI * radius;

    const paths = slices.map(slice => {
      const percent = slice.value / total;
      const strokeDasharray = `${percent * circumference} ${circumference}`;
      const strokeDashoffset = -cumulativePercent * circumference;
      cumulativePercent += percent;

      return `<circle
        cx="50" cy="50" r="${radius}"
        fill="transparent"
        stroke="${slice.color}"
        stroke-width="${strokeWidth}"
        stroke-dasharray="${strokeDasharray}"
        stroke-dashoffset="${strokeDashoffset}"
        transform="rotate(-90 50 50)"
      >
        <title>${slice.label}: $${Math.round(slice.value).toLocaleString()} (${Math.round(percent * 100)}%)</title>
      </circle>`;
    }).join('');

    container.innerHTML = `
      <svg viewBox="0 0 100 100" style="width: 100%; max-width: 220px; height: auto; display: block; margin: 0 auto;">
        <circle cx="50" cy="50" r="${radius}" fill="transparent" stroke="#0d1322" stroke-width="${strokeWidth}" />
        ${paths}
      </svg>
    `;
  },

  /**
   * Renders an Amortization / Payoff Line Chart
   * @param {string} containerId 
   * @param {Array<number>} balanceHistory - Array of balances per month
   * @param {string} color 
   */
  renderLineChart(containerId, balanceHistory, color = '#10b981') {
    const container = document.getElementById(containerId);
    if (!container || balanceHistory.length === 0) return;

    const maxVal = Math.max(...balanceHistory, 1);
    const pointsCount = balanceHistory.length;
    
    const points = balanceHistory.map((val, idx) => {
      const x = (idx / (pointsCount - 1 || 1)) * 300;
      const y = 150 - (val / maxVal) * 130 - 10;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const fillPoints = `0,150 ${points} 300,150`;

    container.innerHTML = `
      <svg viewBox="0 0 300 150" style="width: 100%; height: auto; background-color: #060911; border-radius: 0.5rem; border: 1px solid #23314d;">
        <!-- Gridlines -->
        <line x1="0" y1="37.5" x2="300" y2="37.5" stroke="#151d30" stroke-dasharray="4" />
        <line x1="0" y1="75" x2="300" y2="75" stroke="#151d30" stroke-dasharray="4" />
        <line x1="0" y1="112.5" x2="300" y2="112.5" stroke="#151d30" stroke-dasharray="4" />
        
        <!-- Fill Area -->
        <polygon points="${fillPoints}" fill="${color}" fill-opacity="0.15" />
        
        <!-- Trendline -->
        <polyline fill="none" stroke="${color}" stroke-width="3" points="${points}" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  }
};
