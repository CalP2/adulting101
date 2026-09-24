/**
 * Adulting 101: Life Event Crisis Simulator
 * Simulates real-world financial disruptions and evaluates student choices.
 */

const LifeScenarios = [
  {
    id: "car_repair",
    title: "🚗 Major Vehicle Breakdown",
    description: "Your car's alternator failed on the highway. Repair bill and towing total $1,250.",
    cost: 1250,
    options: [
      {
        label: "Pay cash from Emergency Savings",
        action: (cash, debt) => ({ cash: cash - 1250, debt: debt, scoreImpact: +5, note: "Handled seamlessly using your cash buffer! Zero debt incurred." })
      },
      {
        label: "Charge to High-Interest Credit Card (24.99% APR)",
        action: (cash, debt) => ({ cash: cash, debt: debt + 1250, scoreImpact: -15, note: "Carried over to debt. At 24.99% APR, this will cost extra if unpaid!" })
      }
    ]
  },
  {
    id: "medical_copay",
    title: "🏥 Unexpected ER Visit",
    description: "An urgent medical procedure leaves you with an out-of-pocket insurance copay of $850.",
    cost: 850,
    options: [
      {
        label: "Pay immediately from Emergency Savings",
        action: (cash, debt) => ({ cash: cash - 850, debt: debt, scoreImpact: +5, note: "Paid in full. Your savings absorption worked exactly as intended." })
      },
      {
        label: "Setup $75/mo payment plan with hospital",
        action: (cash, debt) => ({ cash: cash, debt: debt + 850, scoreImpact: 0, note: "Structured payment plan prevents credit damage without interest charges." })
      }
    ]
  },
  {
    id: "tax_refund",
    title: "💸 Unexpected Tax Refund Deposit",
    description: "You completed your tax return and received an unexpected federal tax refund of $1,100.",
    cost: -1100,
    options: [
      {
        label: "Deposit 100% into High-Yield Emergency Savings",
        action: (cash, debt) => ({ cash: cash + 1100, debt: debt, scoreImpact: +10, note: "Boosted your emergency runway by nearly an extra month!" })
      },
      {
        label: "Spend $600 on electronics and save $500",
        action: (cash, debt) => ({ cash: cash + 500, debt: debt, scoreImpact: +2, note: "Balanced lifestyle enjoying a reward while adding $500 to savings." })
      }
    ]
  }
];

class CrisisSimulatorEngine {
  constructor() {
    this.currentScenarioIndex = 0;
  }

  /**
   * Renders the scenario control box into a target container
   * @param {string} containerId 
   */
  mount(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div style="background-color: #060911; border: 1px solid #23314d; border-radius: 0.75rem; padding: 1.5rem; margin-top: 1.5rem;">
        <div style="display:flex; justify-between; align-items:center; margin-bottom: 1rem;">
          <h3 style="font-size: 1rem; font-weight: 800; color: #06b6d4;">⚡ REAL-WORLD LIFE EVENT SIMULATOR</h3>
          <button onclick="CrisisEngine.nextScenario()" style="background: #151d30; border: 1px solid #23314d; color: #f8fafc; padding: 0.35rem 0.75rem; border-radius: 0.375rem; font-size: 0.75rem; cursor: pointer;">Draw Random Event</button>
        </div>
        <div id="crisisCard"></div>
      </div>
    `;

    this.renderCurrentScenario();
  }

  renderCurrentScenario() {
    const card = document.getElementById('crisisCard');
    if (!card) return;

    const event = LifeScenarios[this.currentScenarioIndex];

    const optionsHtml = event.options.map((opt, i) => `
      <button onclick="CrisisEngine.handleChoice(${i})" style="width: 100%; text-align: left; background-color: #0d1322; border: 1px solid #23314d; color: #f8fafc; padding: 0.85rem 1rem; border-radius: 0.5rem; margin-top: 0.5rem; cursor: pointer; font-size: 0.825rem; transition: border-color 0.2s;" onmouseover="this.style.borderColor='#38bdf8'" onmouseout="this.style.borderColor='#23314d'">
        Option ${i + 1}: ${opt.label}
      </button>
    `).join('');

    card.innerHTML = `
      <h4 style="font-size: 0.95rem; font-weight: 800; color: #ffffff; margin-bottom: 0.4rem;">${event.title}</h4>
      <p style="font-size: 0.8rem; color: #94a3b8; line-height: 1.4; margin-bottom: 1rem;">${event.description}</p>
      <div style="display: flex; flex-direction: column; gap: 0.25rem;">${optionsHtml}</div>
      <div id="crisisResult" style="margin-top: 1rem; display: none;"></div>
    `;
  }

  nextScenario() {
    this.currentScenarioIndex = (this.currentScenarioIndex + 1) % LifeScenarios.length;
    this.renderCurrentScenario();
  }

  handleChoice(optionIndex) {
    const event = LifeScenarios[this.currentScenarioIndex];
    const option = event.options[optionIndex];
    
    // Fetch values directly from main application inputs
    const cashInput = document.getElementById('m1Cash');
    const debtInput = document.getElementById('m2Balance');

    let currentCash = parseFloat(cashInput ? cashInput.value : 10000) || 0;
    let currentDebt = parseFloat(debtInput ? debtInput.value : 0) || 0;

    const result = option.action(currentCash, currentDebt);

    // Write back updated balances to main inputs
    if (cashInput) { cashInput.value = Math.max(0, result.cash); }
    if (debtInput) { debtInput.value = Math.max(0, result.debt); }

    // Trigger full application re-calculation
    if (typeof updateM1 === 'function') updateM1();
    if (typeof updateM2 === 'function') updateM2();
    if (typeof updateM5 === 'function') updateM5();

    const resBox = document.getElementById('crisisResult');
    if (resBox) {
      resBox.style.display = 'block';
      resBox.className = 'insight-box';
      resBox.innerHTML = `
        <h4 style="color: #10b981;">Outcome Applied to Simulation</h4>
        <p>${result.note}</p>
      `;
    }
  }
}

const CrisisEngine = new CrisisSimulatorEngine();
