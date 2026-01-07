import React, { useState, useEffect, useCallback } from 'react';
import { Settings, RefreshCw, X, ArrowDown, Move, Keyboard, FileText, Copy, ArrowRight, Lock, ShieldAlert, AlignLeft, Grip, Zap, RotateCcw, History, AlignJustify } from 'lucide-react';

// --- DATA HISTORIS ENIGMA (LENGKAP) ---
const ROTOR_DATA = {
  I:   { wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' },
  II:  { wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' },
  III: { wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' },
  IV:  { wiring: 'ESOVPZJAYQUIRHXLNFTGKDCMWB', notch: 'J' },
  V:   { wiring: 'VZBRGITYUPSDNHLXAWMJQOFECK', notch: 'Z' }
};

const REFLECTORS = {
  B: { wiring: 'YRUHQSLDPXNGOKMIEBFZCWVJAT' },
  C: { wiring: 'FVPJIAOYEDRZXWGCTKUQSBNMHL' }
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function EnigmaPro() {
  // --- STATE MESIN ---
  const [rotors, setRotors] = useState([
    { type: 'I', pos: 0, ring: 0 },   
    { type: 'II', pos: 0, ring: 0 },  
    { type: 'III', pos: 0, ring: 0 }  
  ]);
  
  const [reflectorType, setReflectorType] = useState('B');
  const [plugboard, setPlugboard] = useState({}); 
  
  // --- STATE UI & PROSES ---
  const [activeLamp, setActiveLamp] = useState(null); 
  const [pressedKey, setPressedKey] = useState(null); 
  const [showSettings, setShowSettings] = useState(false);
  const [tempPlug, setTempPlug] = useState(''); 
  const [mode, setMode] = useState('text'); 
  
  // NOVA MOD: Default false agar spasi asli user tidak hilang
  const [groupByFive, setGroupByFive] = useState(false); 
  
  // Input/Output Teks
  const [encryptInput, setEncryptInput] = useState('');
  const [encryptOutput, setEncryptOutput] = useState('');
  const [decryptInput, setDecryptInput] = useState('');
  const [decryptOutput, setDecryptOutput] = useState('');
  
  const [copyFeedback, setCopyFeedback] = useState(null);

  // --- LOGIKA INTI ENIGMA ---
  const toIndex = (char) => char.charCodeAt(0) - 65;
  const toChar = (index) => String.fromCharCode(((index % 26 + 26) % 26) + 65);

  const processRotorStep = (currentRotors) => {
    const newRotors = currentRotors.map(r => ({ ...r }));
    const rLeft = newRotors[0]; 
    const rMid = newRotors[1]; 
    const rRight = newRotors[2]; 

    const notchRight = toIndex(ROTOR_DATA[rRight.type].notch);
    const notchMid = toIndex(ROTOR_DATA[rMid.type].notch);

    let turnLeft = false;
    let turnMid = false;
    let turnRight = true; 

    if (rMid.pos === notchMid) {
      turnLeft = true;
      turnMid = true; 
    } else if (rRight.pos === notchRight) {
      turnMid = true;
    }

    if (turnLeft) rLeft.pos = (rLeft.pos + 1) % 26;
    if (turnMid) rMid.pos = (rMid.pos + 1) % 26;
    if (turnRight) rRight.pos = (rRight.pos + 1) % 26;

    return newRotors;
  };

  const processCharEncryption = (char, currentRotors, currentPlugboard, refType) => {
    let signal = toIndex(char);

    // 1. Plugboard In
    if (currentPlugboard[toChar(signal)]) signal = toIndex(currentPlugboard[toChar(signal)]);

    // 2. Rotors (R -> L)
    for (let i = 2; i >= 0; i--) {
      const { type, pos, ring } = currentRotors[i];
      const wiring = ROTOR_DATA[type].wiring;
      const offset = (pos - ring + 26) % 26;
      const entryIndex = (signal + offset) % 26;
      const wiredChar = wiring[entryIndex];
      const wiredIndex = toIndex(wiredChar);
      signal = (wiredIndex - offset + 26) % 26;
    }

    // 3. Reflector
    signal = toIndex(REFLECTORS[refType].wiring[signal]);

    // 4. Rotors (L -> R)
    for (let i = 0; i <= 2; i++) {
      const { type, pos, ring } = currentRotors[i];
      const wiring = ROTOR_DATA[type].wiring;
      const offset = (pos - ring + 26) % 26;
      const entryIndex = (signal + offset) % 26;
      const charToFind = toChar(entryIndex);
      const wiringIndex = wiring.indexOf(charToFind);
      signal = (wiringIndex - offset + 26) % 26;
    }

    // 5. Plugboard Out
    if (currentPlugboard[toChar(signal)]) signal = toIndex(currentPlugboard[toChar(signal)]);

    return toChar(signal);
  };

  // --- REAL-TIME PROCESSOR (BATCH) ---
  const processFullText = useCallback((text, type) => {
    let tempRotors = rotors.map(r => ({ ...r })); 
    let result = '';
    let counter = 0;

    // NOVA MOD: Gunakan raw input uppercase, jangan hapus spasi jika mode 'Grup 5 Huruf' mati
    const rawInput = text.toUpperCase();
    
    // Split per karakter
    const chars = rawInput.split('');

    chars.forEach(char => {
      if (ALPHABET.includes(char)) {
        // Jika Huruf A-Z: Enkripsi dan putar rotor
        tempRotors = processRotorStep(tempRotors);
        const enc = processCharEncryption(char, tempRotors, plugboard, reflectorType);
        result += enc;
        counter++;

        // Logika spasi militer (Grup 5)
        if (type === 'encrypt' && groupByFive && counter % 5 === 0) {
          result += ' ';
        }
      } else {
        // Jika Spasi/Angka/Simbol:
        if (groupByFive) {
            // Mode Militer: Hapus karakter non-huruf (skip)
        } else {
            // Mode Asli: Biarkan lewat apa adanya (Pass-through)
            result += char;
        }
      }
    });

    return result;
  }, [rotors, plugboard, reflectorType, groupByFive]);

  // Reactive Updates
  useEffect(() => {
    if (mode === 'text') {
      const result = processFullText(encryptInput, 'encrypt');
      setEncryptOutput(result);
    }
  }, [encryptInput, processFullText, mode]);

  useEffect(() => {
    if (mode === 'text') {
      const result = processFullText(decryptInput, 'decrypt');
      setDecryptOutput(result);
    }
  }, [decryptInput, processFullText, mode]);

  // --- HANDLERS ---
  const handleKeyPress = (char) => {
    if (pressedKey) return; 
    setPressedKey(char);
    const nextRotors = processRotorStep(rotors);
    setRotors(nextRotors); 
    setTimeout(() => {
      const encryptedChar = processCharEncryption(char, nextRotors, plugboard, reflectorType);
      setActiveLamp(encryptedChar);
      setTimeout(() => { setActiveLamp(null); setPressedKey(null); }, 300);
    }, 50);
  };

  const addPlug = () => {
    const input = tempPlug.toUpperCase().replace(/[^A-Z]/g, '');
    if (input.length !== 2) return;
    const a = input[0]; const b = input[1];
    if (a === b || plugboard[a] || plugboard[b]) { alert("Huruf sudah dipakai!"); return; }
    setPlugboard(prev => ({ ...prev, [a]: b, [b]: a }));
    setTempPlug('');
  };

  const copyToClipboard = (text, type) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus(); textArea.select();
    try {
      document.execCommand('copy');
      setCopyFeedback(type);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) { alert("Gagal menyalin."); }
    document.body.removeChild(textArea);
  };

  const resetMachine = () => {
    setRotors([ { type: 'I', pos: 0, ring: 0 }, { type: 'II', pos: 0, ring: 0 }, { type: 'III', pos: 0, ring: 0 } ]);
    setPlugboard({}); setReflectorType('B');
    setEncryptInput(''); setEncryptOutput('');
    setDecryptInput(''); setDecryptOutput('');
  };

  const resetRotorPositions = () => {
    setRotors(prev => prev.map(r => ({ ...r, pos: 0 })));
  };

  const changeRotorPos = (index, direction) => {
    setRotors(prev => {
      const next = [...prev];
      next[index].pos = (next[index].pos + direction + 26) % 26;
      return next;
    });
  };
  const changeRotorType = (index, newType) => setRotors(prev => { const n=[...prev]; n[index].type=newType; return n; });
  const changeRingSetting = (index, direction) => setRotors(prev => { const n=[...prev]; n[index].ring=(n[index].ring+direction+26)%26; return n; });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-mono p-2 md:p-4 flex flex-col items-center select-none">
      
      {/* HEADER */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-4 border-b border-slate-800 pb-4 pt-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-amber-600 tracking-tighter flex items-center gap-2">
            <ShieldAlert size={24} /> ENIGMA <span className="text-slate-600 text-sm hidden md:inline">M3 / HEER</span>
          </h1>
          <p className="text-[10px] text-slate-500">SIMULATOR KRIPTOGRAFI PRESISI</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowSettings(true)} className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded hover:border-amber-500 text-xs md:text-sm transition">
            <Settings size={14} /> <span className="hidden md:inline">Konfigurasi</span>
          </button>
          <button onClick={resetMachine} className="p-2 bg-slate-900 border border-slate-700 rounded hover:border-red-500 text-red-500 transition" title="Reset Pabrik">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* DASHBOARD KONTROL ROTOR */}
      <div className="w-full max-w-5xl bg-slate-900/80 p-3 md:p-6 rounded-2xl border border-slate-800 mb-4 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-900 via-amber-700 to-slate-900 opacity-50"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
             <div className="flex items-center justify-center md:justify-start gap-2 text-amber-500 font-bold text-xs md:text-base">
               <Lock size={14} /> <span>POSISI AWAL (KUNCI)</span>
             </div>
             <p className="text-[10px] text-slate-500 max-w-[250px] mx-auto md:mx-0 mt-1">
               Pastikan posisi ini <strong>SAMA PERSIS</strong> saat enkripsi & dekripsi!
             </p>
          </div>
          <div className="flex gap-2 md:gap-4 justify-center">
            {rotors.map((rotor, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold text-slate-600 uppercase">{idx === 0 ? 'Left' : idx === 1 ? 'Mid' : 'Right'}</span>
                <div className="relative bg-gradient-to-b from-slate-300 to-slate-400 text-slate-900 w-10 h-14 md:w-12 md:h-16 rounded shadow-inner flex flex-col items-center justify-center border-x-2 border-slate-500">
                  <button onClick={() => changeRotorPos(idx, 1)} className="absolute top-0 w-full h-1/2 z-10 opacity-0 hover:opacity-20 bg-black"></button>
                  <span className="text-xl md:text-2xl font-bold font-serif">{toChar(rotor.pos)}</span>
                  <button onClick={() => changeRotorPos(idx, -1)} className="absolute bottom-0 w-full h-1/2 z-10 opacity-0 hover:opacity-20 bg-black"></button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={resetRotorPositions} className="flex flex-col items-center justify-center gap-1 text-[10px] text-slate-500 hover:text-amber-500 transition group">
             <div className="p-2 rounded-full border border-slate-700 group-hover:border-amber-500 bg-slate-900">
               <RotateCcw size={16} />
             </div>
             <span>Reset A-A-A</span>
          </button>
        </div>
      </div>

      {/* MODE TABS */}
      <div className="w-full max-w-5xl flex gap-2 mb-4 bg-slate-900/50 p-1 rounded-lg">
        <button onClick={() => setMode('text')} className={`flex-1 py-2 rounded font-bold transition flex items-center justify-center gap-2 text-xs md:text-sm ${mode === 'text' ? 'bg-amber-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>
          <FileText size={16} /> Mode Teks (Otomatis)
        </button>
        <button onClick={() => setMode('keyboard')} className={`flex-1 py-2 rounded font-bold transition flex items-center justify-center gap-2 text-xs md:text-sm ${mode === 'keyboard' ? 'bg-amber-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>
          <Keyboard size={16} /> Mode Manual (Keyboard)
        </button>
      </div>

      {/* TOGGLE FORMAT (HANYA MUNCUL DI MODE TEKS) */}
      {mode === 'text' && (
        <div className="w-full max-w-5xl flex justify-end mb-2">
            <button 
                onClick={() => setGroupByFive(!groupByFive)}
                className={`text-[10px] flex items-center gap-2 px-3 py-1 rounded border transition ${groupByFive ? 'bg-slate-800 border-amber-500 text-amber-500' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
            >
                {groupByFive ? <AlignJustify size={12}/> : <AlignLeft size={12}/>}
                Format: {groupByFive ? 'Militer (Grup 5 Huruf)' : 'Asli (Pertahankan Spasi)'}
            </button>
        </div>
      )}

      <div className="w-full max-w-5xl">
        {mode === 'text' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ENKRIPSI */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-lg hover:border-green-900/30 transition">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-sm font-bold text-green-500 flex items-center gap-2"><Zap size={14} className="animate-pulse"/> ENKRIPSI</span>
                <button onClick={() => setEncryptInput('')} className="text-[10px] text-slate-500 hover:text-white transition">Clear</button>
              </div>
              <textarea 
                value={encryptInput} 
                onChange={(e) => setEncryptInput(e.target.value)} 
                placeholder="Ketik pesan asli di sini..." 
                className="w-full h-24 bg-slate-950/50 text-slate-300 p-3 rounded border border-slate-800 focus:border-green-600 outline-none text-sm resize-none"
                style={{ fontFamily: "'Courier New', Courier, monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              />
              <div className="relative group">
                <textarea 
                  readOnly 
                  value={encryptOutput} 
                  placeholder="Ciphertext..." 
                  className="w-full h-24 bg-black/40 text-green-400 font-bold p-3 rounded border border-slate-800 outline-none text-sm resize-none tracking-wider"
                  style={{ fontFamily: "'Courier New', Courier, monospace", whiteSpace: "pre-wrap", wordBreak: "break-all" }}
                />
                {encryptOutput && (
                  <button onClick={() => copyToClipboard(encryptOutput, 'enc')} className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition" title="Salin dengan Format">
                    <Copy size={14} /> {copyFeedback === 'enc' && <span className="ml-1 text-[10px] text-green-400">Tersalin!</span>}
                  </button>
                )}
              </div>
            </div>

            {/* DEKRIPSI */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-lg hover:border-cyan-900/30 transition">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-sm font-bold text-cyan-500 flex items-center gap-2"><Zap size={14} className="animate-pulse"/> DEKRIPSI</span>
                <button onClick={() => setDecryptInput('')} className="text-[10px] text-slate-500 hover:text-white transition">Clear</button>
              </div>
              <textarea 
                value={decryptInput} 
                onChange={(e) => setDecryptInput(e.target.value)} 
                placeholder="Tempel sandi (pastikan rotor sama!)..." 
                className="w-full h-24 bg-slate-950/50 text-slate-300 p-3 rounded border border-slate-800 focus:border-cyan-600 outline-none text-sm resize-none uppercase"
                style={{ fontFamily: "'Courier New', Courier, monospace", whiteSpace: "pre-wrap", wordBreak: "break-all" }}
              />
              <div className="relative group">
                <textarea 
                  readOnly 
                  value={decryptOutput} 
                  placeholder="Pesan terbaca..." 
                  className="w-full h-24 bg-black/40 text-cyan-400 font-bold p-3 rounded border border-slate-800 outline-none text-sm resize-none"
                  style={{ fontFamily: "'Courier New', Courier, monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                />
                {decryptOutput && (
                  <button onClick={() => copyToClipboard(decryptOutput, 'dec')} className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition">
                    <Copy size={14} /> {copyFeedback === 'dec' && <span className="ml-1 text-[10px] text-cyan-400">Tersalin!</span>}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-8 shadow-2xl relative">
            <div className="flex flex-col gap-2 md:gap-3 mb-6 md:mb-10 items-center">
              <div className="flex gap-1.5 md:gap-4">{'QWERTYUIOP'.split('').map(c => <Lamp key={c} char={c} on={activeLamp === c} />)}</div>
              <div className="flex gap-1.5 md:gap-4">{'ASDFGHJKL'.split('').map(c => <Lamp key={c} char={c} on={activeLamp === c} />)}</div>
              <div className="flex gap-1.5 md:gap-4">{'ZXCVBNM'.split('').map(c => <Lamp key={c} char={c} on={activeLamp === c} />)}</div>
            </div>
            <div className="bg-slate-950 p-4 md:p-6 rounded-xl border-t-4 border-slate-800 flex flex-col gap-2 md:gap-3 items-center shadow-inner">
               <div className="flex gap-1.5 md:gap-3">{'QWERTYUIOP'.split('').map(c => <Key key={c} char={c} pressed={pressedKey === c} onDown={() => handleKeyPress(c)} />)}</div>
               <div className="flex gap-1.5 md:gap-3">{'ASDFGHJKL'.split('').map(c => <Key key={c} char={c} pressed={pressedKey === c} onDown={() => handleKeyPress(c)} />)}</div>
               <div className="flex gap-1.5 md:gap-3">{'ZXCVBNM'.split('').map(c => <Key key={c} char={c} pressed={pressedKey === c} onDown={() => handleKeyPress(c)} />)}</div>
            </div>
          </div>
        )}
        
        {/* MODAL SETTINGS */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-amber-600/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-amber-500 flex items-center gap-2"><Settings size={20}/> KONFIGURASI</h2>
                <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-white"><X size={24}/></button>
              </div>
              <div className="p-4 md:p-6 overflow-y-auto space-y-6">
                <section>
                  <h3 className="text-sm text-slate-400 font-bold uppercase mb-4 border-b border-slate-800 pb-2">Rotor & Ring</h3>
                  <div className="grid grid-cols-3 gap-2 md:gap-4">
                    {rotors.map((rotor, idx) => (
                      <div key={idx} className="bg-slate-800/50 p-2 md:p-3 rounded border border-slate-700">
                        <div className="text-[10px] text-amber-500 font-bold mb-2 uppercase text-center">{idx===0?'Kiri':idx===1?'Tengah':'Kanan'}</div>
                        <select value={rotor.type} onChange={(e)=>changeRotorType(idx, e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-xs mb-2 text-center text-slate-300">
                          {Object.keys(ROTOR_DATA).map(t=><option key={t} value={t}>{t}</option>)}
                        </select>
                        <div className="flex justify-between bg-slate-900 rounded border border-slate-600 p-1 items-center">
                          <button onClick={()=>changeRingSetting(idx,-1)} className="px-1 text-xs hover:bg-slate-700">‹</button>
                          <span className="text-xs font-bold text-amber-400">{toChar(rotor.ring)}</span>
                          <button onClick={()=>changeRingSetting(idx,1)} className="px-1 text-xs hover:bg-slate-700">›</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                <section>
                   <h3 className="text-sm text-slate-400 font-bold uppercase mb-4 border-b border-slate-800 pb-2">Plugboard</h3>
                   <div className="bg-black/30 p-4 rounded border border-slate-800">
                      <div className="flex gap-2 mb-2">
                         <input type="text" value={tempPlug} onChange={(e)=>setTempPlug(e.target.value.toUpperCase())} maxLength={2} placeholder="AB" className="bg-slate-900 border border-slate-600 p-1 w-16 text-center rounded text-white font-bold"/>
                         <button onClick={addPlug} className="px-3 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold text-white">Sambung</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         {Object.keys(plugboard).length===0 && <span className="text-xs text-slate-600">Kosong</span>}
                         {Object.keys(plugboard).map(k=>plugboard[k]>k?(<div key={k} className="bg-amber-900/30 border border-amber-700/50 px-2 py-0.5 rounded-full text-[10px] text-amber-500 font-bold">{k}-{plugboard[k]}</div>):null)}
                      </div>
                      <button onClick={()=>setPlugboard({})} className="text-[10px] text-red-500 hover:underline mt-2 w-full text-right">Reset Kabel</button>
                   </div>
                </section>
              </div>
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
                <button onClick={() => setShowSettings(false)} className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-black font-bold rounded">Simpan</button>
              </div>
            </div>
          </div>
        )}

      </div>
      <div className="mt-6 text-[10px] text-slate-600 text-center max-w-lg">
        *Tips Nova: Jika hasil dekripsi aneh, klik tombol <RotateCcw size={10} className="inline"/> <strong>Reset A-A-A</strong> sebelum paste kode sandi!
      </div>
    </div>
  );
}

// --- SUB-KOMPONEN KECIL ---
function Lamp({ char, on }) { return <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base border transition-all duration-100 ${on ? 'bg-amber-400 text-amber-900 border-amber-300 shadow-[0_0_20px_5px_rgba(251,191,36,0.8)] scale-110 z-10' : 'bg-slate-800 text-slate-600 border-slate-700'}`}>{char}</div> }
function Key({ char, pressed, onDown }) { return <button onMouseDown={onDown} onTouchStart={(e)=>{e.preventDefault();onDown()}} className={`w-8 h-8 md:w-10 md:h-10 rounded-full font-bold text-xs md:text-sm border-b-4 transition-all duration-75 ${pressed ? 'bg-slate-400 text-slate-900 border-b-0 translate-y-1' : 'bg-slate-700 text-slate-300 border-slate-900 hover:bg-slate-600'}`}>{char}</button> }