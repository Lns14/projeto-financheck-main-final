import { useState, useEffect, useRef } from "react";

const AccessibilityButton = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSpoken = useRef<string>("");

  const speak = (text: string) => {
    if (!text.trim() || text === lastSpoken.current) return;
    lastSpoken.current = text;
    (window as any).responsiveVoice?.cancel();
    (window as any).responsiveVoice?.speak(text.trim(), "Brazilian Portuguese Female");
  };

  const handleStop = () => {
    (window as any).responsiveVoice?.cancel();
    lastSpoken.current = "";
  };

  useEffect(() => {
    if (!active) {
      handleStop();
      return;
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Ignora o próprio botão de acessibilidade
      if (target.closest("#accessibility-widget")) return;

      // Pega o texto mais relevante do elemento
      const getText = (el: HTMLElement): string => {
        const label = el.getAttribute("aria-label");
        if (label) return label;
        const alt = (el as HTMLImageElement).alt;
        if (alt) return alt;
        const placeholder = (el as HTMLInputElement).placeholder;
        if (placeholder) return placeholder;
        // Pega só o texto direto do elemento (sem filhos profundos)
        const direct = Array.from(el.childNodes)
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent?.trim())
          .filter(Boolean)
          .join(" ");
        if (direct) return direct;
        return el.innerText?.trim().slice(0, 200) ?? "";
      };

      const text = getText(target);
      if (!text || text === lastSpoken.current) return;

      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      hoverTimeout.current = setTimeout(() => {
        speak(text);
      }, 400); // pequeno delay para não disparar em passagens rápidas
    };

    const onMouseOut = () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    return () => {
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, [active]);

  // Limpa ao desmontar
  useEffect(() => () => { handleStop(); }, []);

  return (
    <div
      id="accessibility-widget"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "8px",
        fontFamily: "sans-serif",
      }}
    >
      {/* Painel expandido */}
      {open && (
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #7BA8F5",
            borderRadius: "16px",
            padding: "16px",
            boxShadow: "0 4px 24px rgba(74,123,216,0.15)",
            minWidth: "200px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <p style={{ margin: 0, fontSize: "13px", color: "#2E4A7C", fontWeight: 600 }}>
            ♿ Acessibilidade
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "#717182" }}>
            {active
              ? "Passe o mouse sobre qualquer elemento para ouvir."
              : "Ative para ouvir elementos ao passar o mouse."}
          </p>

          <button
            onClick={() => { setActive((v) => !v); }}
            style={{
              background: active ? "#4A7BD8" : "#f3f3f5",
              color: active ? "#fff" : "#2E4A7C",
              border: "none",
              borderRadius: "10px",
              padding: "8px 14px",
              fontSize: "13px",
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "background 0.2s",
            }}
          >
            {active ? "🔊 Leitura ativa" : "🔇 Leitura desativada"}
          </button>

          {active && (
            <button
              onClick={handleStop}
              style={{
                background: "#fff0f0",
                color: "#d4183d",
                border: "1px solid #f5c2c7",
                borderRadius: "10px",
                padding: "7px 14px",
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              ⏹ Parar leitura
            </button>
          )}
        </div>
      )}

      {/* Botão flutuante principal */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Opções de acessibilidade"
        title="Acessibilidade"
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: active ? "#4A7BD8" : "#2E4A7C",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: "22px",
          boxShadow: "0 4px 16px rgba(46,74,124,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s, transform 0.15s",
          transform: open ? "rotate(20deg)" : "rotate(0deg)",
        }}
      >
        ♿
      </button>
    </div>
  );
};

export default AccessibilityButton;
