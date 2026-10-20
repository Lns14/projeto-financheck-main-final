export type LimitLevel = 'ok' | 'warning' | 'exceeded';

export interface LimitStatus {
  level: LimitLevel;
  label: string;
  color: string;
  gradient: string;
  glow: string;
}

/** Percentual a partir do qual o limite passa a ficar em "atenção". */
export const WARNING_THRESHOLD = 80;

export function getLimitStatus(percent: number, exceeded: boolean): LimitStatus {
  if (exceeded) {
    return {
      level: 'exceeded',
      label: 'Limite excedido',
      color: '#FF6B6B',
      gradient: 'linear-gradient(90deg, #FF9A9A, #FF6B6B)',
      glow: 'rgba(255,107,107,0.55)',
    };
  }

  if (percent >= WARNING_THRESHOLD) {
    return {
      level: 'warning',
      label: 'Atenção: perto do limite',
      color: '#F5A623',
      gradient: 'linear-gradient(90deg, #FFD08A, #F5A623)',
      glow: 'rgba(245,166,35,0.5)',
    };
  }

  return {
    level: 'ok',
    label: 'Dentro do limite',
    color: '#4A7BD8',
    gradient: 'linear-gradient(90deg, #7BA8F5, #6BA2EE, #5B8FE8)',
    glow: 'rgba(123,168,245,0.65)',
  };
}

export function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Converte "YYYY-MM-DD" em "DD/MM/AAAA" sem passar por Date (evita deslocamento de fuso). */
export function formatDateBR(isoDate: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate || '');
  return match ? `${match[3]}/${match[2]}/${match[1]}` : isoDate;
}
