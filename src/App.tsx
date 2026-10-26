import { useState, useMemo } from 'react';

interface CalculationResults {
  filamentCost: number;
  energyCost: number;
  maintenanceCost: number;
  failureCost: number;
  totalCost: number;
  costPerPiece: number;
  suggestedPrice: number;
  profitPerPiece: number;
}

function App() {
  // Inputs
  const [projectName, setProjectName] = useState('');
  const [printTimeHours, setPrintTimeHours] = useState('');
  const [printTimeMinutes, setPrintTimeMinutes] = useState('');
  const [filamentWeight, setFilamentWeight] = useState('');
  const [filamentPrice, setFilamentPrice] = useState('89.90');
  const [filamentSpoolWeight, setFilamentSpoolWeight] = useState('1000');
  const [powerConsumption, setPowerConsumption] = useState('350');
  const [energyCost, setEnergyCost] = useState('0.75');
  const [maintenanceCostPerHour, setMaintenanceCostPerHour] = useState('0.50');
  const [failureRate, setFailureRate] = useState('5');
  const [quantity, setQuantity] = useState('1');
  const [profitMargin, setProfitMargin] = useState('30');
  const [amsSlots, setAmsSlots] = useState('1');

  const results: CalculationResults = useMemo(() => {
    const hours = (parseFloat(printTimeHours) || 0) + (parseFloat(printTimeMinutes) || 0) / 60;
    const weight = parseFloat(filamentWeight) || 0;
    const spoolWeight = parseFloat(filamentSpoolWeight) || 1000;
    const pricePerKg = parseFloat(filamentPrice) || 0;
    const power = parseFloat(powerConsumption) || 0;
    const energyPricePerKwh = parseFloat(energyCost) || 0;
    const maintPerHour = parseFloat(maintenanceCostPerHour) || 0;
    const failRate = parseFloat(failureRate) || 0;
    const qty = parseInt(quantity) || 1;
    const margin = parseFloat(profitMargin) || 0;

    // Custo do filamento: (peso usado / peso do carretel) * preço do carretel
    const filamentCost = (weight / spoolWeight) * pricePerKg;

    // Custo de energia: (potência em kW * horas) * preço por kWh
    const calcEnergyCost = (power / 1000) * hours * energyPricePerKwh;

    // Custo de manutenção: custo por hora * horas de impressão
    const maintenanceCost = maintPerHour * hours;

    // Custo adicional por taxa de falha (refazendo a peça)
    const baseCost = filamentCost + calcEnergyCost + maintenanceCost;
    const failureCost = baseCost * (failRate / 100);

    // Custo total para todas as peças
    const totalCost = (baseCost + failureCost) * qty;

    // Custo por peça
    const costPerPiece = totalCost / qty;

    // Preço sugerido com margem de lucro
    const suggestedPrice = costPerPiece * (1 + margin / 100);
    const profitPerPiece = suggestedPrice - costPerPiece;

    return {
      filamentCost,
      energyCost: calcEnergyCost,
      maintenanceCost,
      failureCost,
      totalCost,
      costPerPiece,
      suggestedPrice,
      profitPerPiece,
    };
  }, [printTimeHours, printTimeMinutes, filamentWeight, filamentPrice, filamentSpoolWeight, powerConsumption, energyCost, maintenanceCostPerHour, failureRate, quantity, profitMargin]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const totalHours = (parseFloat(printTimeHours) || 0) + (parseFloat(printTimeMinutes) || 0) / 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Calculadora de Impressão 3D
            </h1>
            <p className="text-xs text-gray-400">Bambu Lab A1 + AMS</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Info */}
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </span>
                Informações do Projeto
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Nome do Projeto/Modelo</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Ex: Suporte para celular"
                    className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Quantidade de Peças</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Slots AMS Utilizados</label>
                  <input
                    type="number"
                    value={amsSlots}
                    onChange={(e) => setAmsSlots(e.target.value)}
                    min="1"
                    max="4"
                    className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Print Time */}
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Tempo de Impressão
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Horas</label>
                  <input
                    type="number"
                    value={printTimeHours}
                    onChange={(e) => setPrintTimeHours(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Minutos</label>
                  <input
                    type="number"
                    value={printTimeMinutes}
                    onChange={(e) => setPrintTimeMinutes(e.target.value)}
                    placeholder="0"
                    min="0"
                    max="59"
                    className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  />
                </div>
              </div>
              {totalHours > 0 && (
                <p className="mt-3 text-sm text-gray-400">
                  Total: <span className="text-purple-400 font-medium">{totalHours.toFixed(2)} horas</span>
                </p>
              )}
            </div>

            {/* Filament */}
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </span>
                Filamento
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Peso Usado (g)</label>
                  <input
                    type="number"
                    value={filamentWeight}
                    onChange={(e) => setFilamentWeight(e.target.value)}
                    placeholder="Ex: 45"
                    min="0"
                    className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Preço do Carretel (R$/kg)</label>
                  <input
                    type="number"
                    value={filamentPrice}
                    onChange={(e) => setFilamentPrice(e.target.value)}
                    placeholder="89.90"
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Peso do Carretel (g)</label>
                  <input
                    type="number"
                    value={filamentSpoolWeight}
                    onChange={(e) => setFilamentSpoolWeight(e.target.value)}
                    placeholder="1000"
                    min="0"
                    className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                  />
                </div>
              </div>
              {(parseFloat(filamentWeight) || 0) > 0 && (
                <p className="mt-3 text-sm text-gray-400">
                  Custo do filamento: <span className="text-green-400 font-medium">{formatCurrency(results.filamentCost)}</span>
                </p>
              )}
            </div>

            {/* Energy & Maintenance */}
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                Energia & Manutenção
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Consumo (W)</label>
                  <input
                    type="number"
                    value={powerConsumption}
                    onChange={(e) => setPowerConsumption(e.target.value)}
                    placeholder="350"
                    min="0"
                    className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                  />
                  <p className="mt-1 text-xs text-gray-500">Bambu Lab A1: ~150-350W</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Custo Energia (R$/kWh)</label>
                  <input
                    type="number"
                    value={energyCost}
                    onChange={(e) => setEnergyCost(e.target.value)}
                    placeholder="0.75"
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Manutenção (R$/hora)</label>
                  <input
                    type="number"
                    value={maintenanceCostPerHour}
                    onChange={(e) => setMaintenanceCostPerHour(e.target.value)}
                    placeholder="0.50"
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                  />
                  <p className="mt-1 text-xs text-gray-500">Desgaste bico, mesa, etc.</p>
                </div>
              </div>
            </div>

            {/* Failure Rate & Profit */}
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </span>
                Risco & Lucro
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Taxa de Falha (%)</label>
                  <input
                    type="number"
                    value={failureRate}
                    onChange={(e) => setFailureRate(e.target.value)}
                    placeholder="5"
                    min="0"
                    max="100"
                    className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                  />
                  <p className="mt-1 text-xs text-gray-500">Considera refação em caso de falha</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Margem de Lucro (%)</label>
                  <input
                    type="number"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(e.target.value)}
                    placeholder="30"
                    min="0"
                    max="500"
                    className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6 backdrop-blur-sm sticky top-24">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </span>
                Resultado
              </h2>

              {projectName && (
                <p className="text-sm text-gray-400 mb-4 truncate">
                  📦 {projectName}
                </p>
              )}

              {/* Cost Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
                  <span className="text-sm text-gray-400">🧵 Filamento</span>
                  <span className="text-sm font-medium text-green-400">{formatCurrency(results.filamentCost)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
                  <span className="text-sm text-gray-400">⚡ Energia</span>
                  <span className="text-sm font-medium text-yellow-400">{formatCurrency(results.energyCost)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
                  <span className="text-sm text-gray-400">🔧 Manutenção</span>
                  <span className="text-sm font-medium text-blue-400">{formatCurrency(results.maintenanceCost)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
                  <span className="text-sm text-gray-400">⚠️ Margem falha ({failureRate}%)</span>
                  <span className="text-sm font-medium text-red-400">{formatCurrency(results.failureCost)}</span>
                </div>
              </div>

              {/* Total per piece */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Custo por peça</span>
                  <span className="text-xl font-bold text-cyan-400">{formatCurrency(results.costPerPiece)}</span>
                </div>
                {parseInt(quantity) > 1 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Custo total ({quantity} un.)</span>
                    <span className="text-lg font-bold text-white">{formatCurrency(results.totalCost)}</span>
                  </div>
                )}
              </div>

              {/* Suggested Price */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">💰 Preço sugerido</span>
                  <span className="text-xl font-bold text-green-400">{formatCurrency(results.suggestedPrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Lucro por peça ({profitMargin}%)</span>
                  <span className="text-sm font-medium text-green-300">{formatCurrency(results.profitPerPiece)}</span>
                </div>
                {parseInt(quantity) > 1 && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-300">Lucro total</span>
                    <span className="text-sm font-medium text-green-300">{formatCurrency(results.profitPerPiece * parseInt(quantity))}</span>
                  </div>
                )}
              </div>

              {/* Summary Info */}
              <div className="bg-gray-900/50 rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-medium text-gray-300 mb-3">📊 Resumo</h3>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Tempo total</span>
                  <span className="text-gray-300">{totalHours.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Filamento usado</span>
                  <span className="text-gray-300">{filamentWeight || '0'}g</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Energia consumida</span>
                  <span className="text-gray-300">{((parseFloat(powerConsumption) || 0) / 1000 * totalHours).toFixed(3)} kWh</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Slots AMS</span>
                  <span className="text-gray-300">{amsSlots}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Custo/minuto</span>
                  <span className="text-gray-300">{totalHours > 0 ? formatCurrency(results.costPerPiece / (totalHours * 60)) : 'R$ 0,00'}/min</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 bg-gray-800/30 rounded-2xl border border-gray-700/30 p-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">ℹ️ Referências - Bambu Lab A1</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-400">
            <div>
              <p className="font-medium text-gray-300 mb-1">Consumo de Energia</p>
              <p>• Bico aquecendo: ~150W</p>
              <p>• Mesa aquecida: ~100W</p>
              <p>• Impressão normal: ~80-120W</p>
              <p>• Pico máximo: ~350W</p>
            </div>
            <div>
              <p className="font-medium text-gray-300 mb-1">AMS (Automatic Material System)</p>
              <p>• 4 slots de filamento</p>
              <p>• Troca automática de cor/material</p>
              <p>• Secagem integrada do filamento</p>
              <p>• Consumo adicional: ~20W</p>
            </div>
            <div>
              <p className="font-medium text-gray-300 mb-1">Dicas de Cálculo</p>
              <p>• Use o peso do fatiador (slicer)</p>
              <p>• Considere waste do AMS (~5g/troca)</p>
              <p>• Taxa de falha: 3-10% é comum</p>
              <p>• Margem mínima: 20-30%</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
