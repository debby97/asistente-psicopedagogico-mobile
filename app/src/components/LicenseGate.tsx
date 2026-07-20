import React, { useState } from 'react';
import { KeyRound, ClipboardList, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { activarLicencia, mensajeErrorActivacion } from '../licensing/license';

interface LicenseGateProps {
  onActivated: () => void;
}

export default function LicenseGate({ onActivated }: LicenseGateProps) {
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey.trim() || loading) return;

    setLoading(true);
    setErrorMsg(null);

    const result = await activarLicencia(licenseKey);

    setLoading(false);

    if (result.success) {
      onActivated();
    } else {
      setErrorMsg(mensajeErrorActivacion(result.error));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FFF9F7] p-4">
      <div className="w-full max-w-md bg-white border-2 border-[#1A1A1A] rounded-2xl shadow-[4px_4px_0px_0px_#1A1A1A] p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 bg-[#F5D56E] rounded-xl flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2.5px_2.5px_0px_0px_#1A1A1A] mb-4">
            <ClipboardList className="w-7 h-7 text-[#1A1A1A]" strokeWidth={2.5} />
          </div>
          <h1 className="font-display font-black text-xl text-[#1A1A1A] leading-tight">
            Asistente Psicopedagógico
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-2">
            Ingresa tu código de licencia para activar esta instalación.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className="w-full pl-10 pr-4 py-3 bg-[#FFF9F7] border-2 border-[#1A1A1A] rounded-xl text-sm font-bold tracking-wide focus:outline-none placeholder-slate-400"
              disabled={loading}
            />
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2 bg-rose-50 border-2 border-rose-200 text-rose-700 text-xs font-semibold rounded-xl px-3.5 py-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !licenseKey.trim()}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-black bg-[#A9D89F] hover:bg-[#97c58e] border-2 border-[#1A1A1A] text-[#1A1A1A] rounded-xl shadow-[2.5px_2.5px_0px_0px_#1A1A1A] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Activar licencia
              </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-slate-400 font-medium text-center mt-6">
          ¿No tienes un código? Contacta al administrador para obtener tu licencia.
        </p>
      </div>
    </div>
  );
}
