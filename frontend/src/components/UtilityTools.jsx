import React, { useState } from 'react';
import { Calculator, RefreshCw, Lock, Copy, Scale } from 'lucide-react';

const UtilityTools = () => {
  const [activeTool, setActiveTool] = useState('calculator');

  // --- Calculator State ---
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');

  // --- Unit Converter State ---
  const [unitValue, setUnitValue] = useState('');
  const [unitFrom, setUnitFrom] = useState('meters');
  const [unitTo, setUnitTo] = useState('feet');
  const [unitResult, setUnitResult] = useState('');

  // --- Password Gen State ---
  const [passLength, setPassLength] = useState(16);
  const [password, setPassword] = useState('');

  const calculate = () => {
    try {
      // Note: Using Function() for a simple calculator implementation
      // In a real production app, we'd use a math expression parser library
      const result = new Function(`return ${calcInput}`)();
      setCalcResult(result.toString());
    } catch (e) {
      setCalcResult('Error');
    }
  };

  const convertUnits = () => {
    const val = parseFloat(unitValue);
    if (isNaN(val)) return;

    const conversions = {
      meters_feet: v => v * 3.28084,
      feet_meters: v => v / 3.28084,
      kg_lbs: v => v * 2.20462,
      lbs_kg: v => v / 2.20462,
      celsius_fahrenheit: v => (v * 9/5) + 32,
      fahrenheit_celsius: v => (v - 32) * 5/9,
    };

    const key = `${unitFrom}_${unitTo}`;
    const result = conversions[key] ? conversions[key](val) : val;
    setUnitResult(result.toFixed(2));
  };

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let retVal = "";
    for (let i = 0; i < passLength; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(retVal);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'calculator', label: 'Calculator', icon: Calculator },
          { id: 'converter', label: 'Unit Converter', icon: Scale },
          { id: 'password', label: 'Password Gen', icon: Lock },
          { id: 'clipboard', label: 'Quick Paste', icon: Copy },
        ].map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-premium text-sm font-medium transition-all ${activeTool === tool.id ? 'bg-primary-500 text-white shadow-md' : 'bg-white dark:bg-dark-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-dark-700'}`}
          >
            <tool.icon size={16} /> {tool.label}
          </button>
        ))}
      </div>

      {activeTool === 'calculator' && (
        <div className="card-premium max-w-md mx-auto space-y-4">
          <div className="text-right text-3xl font-mono p-4 bg-slate-100 dark:bg-dark-900 rounded-premium min-h-[64px] mb-4 overflow-hidden">
            {calcInput || '0'}
          </div>
          <div className="text-center text-xl font-bold text-primary-600 mb-6">
            = {calcResult || '0'}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', 'C', '+'].map(btn => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === 'C') { setCalcInput(''); setCalcResult(''); }
                  else setCalcInput(prev => prev + btn);
                }}
                className="p-4 rounded-premium bg-slate-100 dark:bg-dark-700 hover:bg-slate-200 dark:hover:bg-dark-600 transition-all font-bold"
              >
                {btn}
              </button>
            ))}
          </div>
          <button onClick={calculate} className="w-full p-4 rounded-premium bg-primary-500 text-white font-bold hover:bg-primary-600 transition-all">
            Calculate
          </button>
        </div>
      )}

      {activeTool === 'converter' && (
        <div className="card-premium max-w-md mx-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500">From</label>
              <select
                className="w-full p-2 rounded-premium border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 outline-none"
                value={unitFrom} onChange={(e) => setUnitFrom(e.target.value)}
              >
                <option value="meters">Meters</option>
                <option value="feet">Feet</option>
                <option value="kg">Kilograms</option>
                <option value="lbs">Pounds</option>
                <option value="celsius">Celsius</option>
                <option value="fahrenheit">Fahrenheit</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500">To</label>
              <select
                className="w-full p-2 rounded-premium border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 outline-none"
                value={unitTo} onChange={(e) => setUnitTo(e.target.value)}
              >
                <option value="feet">Feet</option>
                <option value="meters">Meters</option>
                <option value="lbs">Pounds</option>
                <option value="kg">Kilograms</option>
                <option value="fahrenheit">Fahrenheit</option>
                <option value="celsius">Celsius</option>
              </select>
            </div>
          </div>
          <input
            type="number"
            className="w-full p-3 rounded-premium border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 outline-none"
            placeholder="Enter value..."
            value={unitValue}
            onChange={(e) => setUnitValue(e.target.value)}
          />
          <button onClick={convertUnits} className="w-full p-3 rounded-premium bg-primary-500 text-white font-bold hover:bg-primary-600 transition-all">
            Convert
          </button>
          <div className="text-center text-2xl font-bold text-primary-600">
            {unitResult} {unitTo}
          </div>
        </div>
      )}

      {activeTool === 'password' && (
        <div className="card-premium max-w-md mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Length: {passLength}</label>
            <input
              type="range" min="8" max="64"
              value={passLength}
              onChange={(e) => setPassLength(parseInt(e.target.value))}
              className="w-1/2"
            />
          </div>
          <div className="p-4 bg-slate-100 dark:bg-dark-900 rounded-premium text-center font-mono text-lg break-all">
            {password || 'Generate a password...'}
          </div>
          <div className="flex gap-2">
            <button onClick={generatePassword} className="flex-1 p-3 rounded-premium bg-primary-500 text-white font-bold hover:bg-primary-600 transition-all">
              Generate
            </button>
            {password && (
              <button onClick={() => copyToClipboard(password)} className="p-3 rounded-premium bg-slate-100 dark:bg-dark-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-dark-600 transition-all">
                <Copy size={20} />
              </button>
            )}
          </div>
        </div>
      )}

      {activeTool === 'clipboard' && (
        <div className="card-premium max-w-md mx-auto space-y-4">
          <div className="text-center text-slate-500 italic">
            Clipboard history requires system-level permissions. Use this area as a "Quick Scratchpad" for things you want to copy multiple times today.
          </div>
          <textarea
            className="w-full h-64 p-4 rounded-premium border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 outline-none"
            placeholder="Paste things here to keep them handy..."
          />
          <button onClick={() => {
            const text = document.querySelector('textarea')?.value;
            if(text) copyToClipboard(text);
          }} className="w-full p-3 rounded-premium bg-primary-500 text-white font-bold hover:bg-primary-600 transition-all flex items-center justify-center gap-2">
            <Copy size={20} /> Copy All
          </button>
        </div>
      )}
    </div>
  );
};

export default UtilityTools;
