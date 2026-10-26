import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Lock, EyeOff, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';

export const StealthCloak = ({ isActive, onClose }) => {
  const [mode, setMode] = useState('calc'); // 'calc' | 'notes'
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrev, setCalcPrev] = useState('');
  const [calcOp, setCalcOp] = useState(null);
  const [noteContent, setNoteContent] = useState(
    "Weekly Grocery & Errands:\n- 2L Milk\n- Whole wheat bread\n- Green tea & honey\n- Clean desk & organize documents\n- Dentist appointment Thursday 4 PM"
  );
  const [unlockHint, setUnlockHint] = useState(false);

  // Keyboard shortcut listener to activate or exit
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape or Alt+S exits cloak if active
      if (isActive && (e.key === 'Escape' || (e.altKey && e.key.toLowerCase() === 's'))) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onClose]);

  if (!isActive) return null;

  // Calculator Logic
  const handleDigit = (d) => {
    setCalcDisplay((prev) => {
      if (prev === '0' || prev === 'Error') return d;
      return prev + d;
    });
  };

  const handleOp = (op) => {
    setCalcPrev(calcDisplay + ' ' + op);
    setCalcOp(op);
    setCalcDisplay('0');
  };

  const handleClear = () => {
    setCalcDisplay('0');
    setCalcPrev('');
    setCalcOp(null);
  };

  const handleEquals = () => {
    // Secret Unlock Code: 1234= or 9999=
    if (calcDisplay === '1234' || calcDisplay === '9999' || calcPrev.includes('1234')) {
      onClose();
      return;
    }

    try {
      if (!calcOp || !calcPrev) return;
      const num1 = parseFloat(calcPrev.split(' ')[0]);
      const num2 = parseFloat(calcDisplay);
      let res = 0;
      if (calcOp === '+') res = num1 + num2;
      else if (calcOp === '−' || calcOp === '-') res = num1 - num2;
      else if (calcOp === '×' || calcOp === '*') res = num1 * num2;
      else if (calcOp === '÷' || calcOp === '/') res = num2 !== 0 ? num1 / num2 : 'Error';

      setCalcDisplay(String(res));
      setCalcPrev('');
      setCalcOp(null);
    } catch (e) {
      setCalcDisplay('Error');
    }
  };

  const handleNoteChange = (e) => {
    const val = e.target.value;
    setNoteContent(val);
    // Secret trigger inside notes: typing 'safewo' or 'unlock'
    if (val.toLowerCase().includes('safewo') || val.toLowerCase().includes('exitcloak')) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 text-slate-100 flex flex-col select-none overflow-hidden font-sans">
      {/* Discreet stealth camouflage top header */}
      <div className="h-10 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-300">
            {mode === 'calc' ? 'Calculator — Scientific Standard' : 'QuickNotes v2.4'}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMode('calc')}
              className={`px-2 py-0.5 rounded text-[11px] ${
                mode === 'calc' ? 'bg-slate-800 text-white font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Calculator
            </button>
            <button
              onClick={() => setMode('notes')}
              className={`px-2 py-0.5 rounded text-[11px] ${
                mode === 'notes' ? 'bg-slate-800 text-white font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Notes Pad
            </button>
          </div>
        </div>

        {/* Secret unmask corner trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUnlockHint(!unlockHint)}
            className="text-[10px] text-slate-600 hover:text-slate-400 p-1"
            title="Unlock Hint"
          >
            ?
          </button>
          <button
            onClick={onClose}
            className="text-[11px] px-2.5 py-0.5 rounded bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 transition-colors font-medium"
          >
            Exit Disguise
          </button>
        </div>
      </div>

      {unlockHint && (
        <div className="bg-amber-950/80 border-b border-amber-800 px-4 py-1.5 text-xs text-amber-200 flex items-center justify-between">
          <span>
            💡 <strong>Secret PIN:</strong> Type <code className="bg-black/40 px-1 py-0.5 rounded">1234=</code> on the
            calculator, or press <kbd className="bg-black/40 px-1 py-0.5 rounded">Esc</kbd> to return to SafeWo.
          </span>
          <button onClick={() => setUnlockHint(false)} className="text-amber-400 font-bold ml-2">
            ×
          </button>
        </div>
      )}

      {/* DISGUISE 1: CALCULATOR */}
      {mode === 'calc' && (
        <div className="flex-1 flex items-center justify-center p-4 bg-slate-900">
          <div className="w-full max-w-xs bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            {/* Screen */}
            <div className="bg-slate-900/80 rounded-2xl p-4 text-right border border-slate-800/80">
              <div className="text-xs text-slate-500 font-mono h-4">{calcPrev}</div>
              <div className="text-3xl font-mono font-bold text-white tracking-wider truncate mt-1">
                {calcDisplay}
              </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-4 gap-2.5 font-mono text-base font-semibold">
              <button
                onClick={handleClear}
                className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-rose-400 active:scale-95 transition-all"
              >
                C
              </button>
              <button
                onClick={() => setCalcDisplay((p) => (parseFloat(p) * -1).toString())}
                className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95 transition-all"
              >
                ±
              </button>
              <button
                onClick={() => setCalcDisplay((p) => (parseFloat(p) / 100).toString())}
                className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95 transition-all"
              >
                %
              </button>
              <button
                onClick={() => handleOp('÷')}
                className="py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white active:scale-95 transition-all"
              >
                ÷
              </button>

              <button
                onClick={() => handleDigit('7')}
                className="py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all"
              >
                7
              </button>
              <button
                onClick={() => handleDigit('8')}
                className="py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all"
              >
                8
              </button>
              <button
                onClick={() => handleDigit('9')}
                className="py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all"
              >
                9
              </button>
              <button
                onClick={() => handleOp('×')}
                className="py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white active:scale-95 transition-all"
              >
                ×
              </button>

              <button
                onClick={() => handleDigit('4')}
                className="py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all"
              >
                4
              </button>
              <button
                onClick={() => handleDigit('5')}
                className="py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all"
              >
                5
              </button>
              <button
                onClick={() => handleDigit('6')}
                className="py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all"
              >
                6
              </button>
              <button
                onClick={() => handleOp('−')}
                className="py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white active:scale-95 transition-all"
              >
                −
              </button>

              <button
                onClick={() => handleDigit('1')}
                className="py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all"
              >
                1
              </button>
              <button
                onClick={() => handleDigit('2')}
                className="py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all"
              >
                2
              </button>
              <button
                onClick={() => handleDigit('3')}
                className="py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all"
              >
                3
              </button>
              <button
                onClick={() => handleOp('+')}
                className="py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white active:scale-95 transition-all"
              >
                +
              </button>

              <button
                onClick={() => handleDigit('0')}
                className="col-span-2 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all text-left px-5"
              >
                0
              </button>
              <button
                onClick={() => (!calcDisplay.includes('.') ? setCalcDisplay(calcDisplay + '.') : null)}
                className="py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white active:scale-95 transition-all"
              >
                .
              </button>
              <button
                onClick={handleEquals}
                className="py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white active:scale-95 transition-all shadow-lg shadow-rose-600/30"
              >
                =
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISGUISE 2: NOTES PAD */}
      {mode === 'notes' && (
        <div className="flex-1 flex flex-col p-6 max-w-3xl mx-auto w-full">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl flex-1 flex flex-col space-y-3">
            <input
              type="text"
              defaultValue="Weekly Checklist & Errand Schedule"
              className="bg-transparent text-xl font-bold text-white border-b border-slate-800 pb-2 outline-none focus:border-slate-600"
            />
            <textarea
              value={noteContent}
              onChange={handleNoteChange}
              className="flex-1 bg-transparent text-slate-300 text-sm leading-relaxed outline-none resize-none font-mono"
            />
            <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-800 flex justify-between">
              <span>Auto-saved to Local Storage</span>
              <span>Lines: 5 • Words: 24</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
