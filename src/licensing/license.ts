import { supabase } from './supabaseClient';

const DEVICE_ID_KEY = 'psico_device_id';
const LICENSE_STATE_KEY = 'psico_license_state';

export interface LicenseState {
  activo: boolean;
  licenseKey?: string;
  customerName?: string | null;
  expiresAt?: string | null;
}

/**
 * Genera (o recupera) un identificador de dispositivo estable.
 * No es un "hardware ID" real como en la versión Electron, pero cumple
 * la misma función: amarrar la licencia a este navegador/instalación.
 */
export function getOrCreateDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId =
      (crypto as any).randomUUID?.() ??
      `dev_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId!);
  }
  return deviceId!;
}

export function getStoredLicenseState(): LicenseState | null {
  const raw = localStorage.getItem(LICENSE_STATE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function storeLicenseState(state: LicenseState) {
  localStorage.setItem(LICENSE_STATE_KEY, JSON.stringify(state));
}

export function clearLicenseState() {
  localStorage.removeItem(LICENSE_STATE_KEY);
}

export type ActivationError =
  | 'not_found'
  | 'revoked'
  | 'expired'
  | 'max_activations'
  | 'network'
  | 'unknown';

export interface ActivationResult {
  success: boolean;
  error?: ActivationError;
  customerName?: string | null;
  expiresAt?: string | null;
  already?: boolean;
}

export async function activarLicencia(licenseKey: string): Promise<ActivationResult> {
  const deviceId = getOrCreateDeviceId();
  const trimmedKey = licenseKey.trim();

  try {
    const { data, error } = await supabase.rpc('activate_license', {
      p_key: trimmedKey,
      p_device_id: deviceId,
    });

    if (error) {
      return { success: false, error: 'network' };
    }

    const result = data as {
      success: boolean;
      error?: string;
      customer_name?: string | null;
      expires_at?: string | null;
      already?: boolean;
    };

    if (!result.success) {
      return { success: false, error: (result.error as ActivationError) || 'unknown' };
    }

    const state: LicenseState = {
      activo: true,
      licenseKey: trimmedKey,
      customerName: result.customer_name ?? null,
      expiresAt: result.expires_at ?? null,
    };
    storeLicenseState(state);

    return {
      success: true,
      customerName: result.customer_name,
      expiresAt: result.expires_at,
      already: result.already,
    };
  } catch {
    return { success: false, error: 'network' };
  }
}

export function mensajeErrorActivacion(error?: ActivationError): string {
  switch (error) {
    case 'not_found':
      return 'El código ingresado no es válido.';
    case 'revoked':
      return 'Este código fue revocado.';
    case 'expired':
      return 'Esta licencia ha expirado.';
    case 'max_activations':
      return 'Este código ya alcanzó el máximo de dispositivos activados.';
    case 'network':
      return 'No se pudo conectar con el servidor de licencias. Revisa tu conexión a internet.';
    default:
      return 'Ocurrió un error inesperado al activar la licencia.';
  }
}
