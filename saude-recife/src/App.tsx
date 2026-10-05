import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen =
  | "welcome" | "login" | "register" | "recovery"
  | "dashboard" | "triagem" | "agendamento" | "appointments"
  | "settings" | "privacy" | "admin" | "triagem-success" | "agendamento-success";

interface User {
  id: string;
  name: string;
  socialName: string;
  email: string;
  phone1: string; phone1Whatsapp: boolean;
  phone2: string; phone2Whatsapp: boolean;
  emergencyContact: string; emergencyPhone: string;
  createdAt: string; lastLogin: string;
  isAdmin?: boolean;
}

interface TriagemData {
  nome: string; nomeSocial: string;
  dataNascimento: string;
  telefone: string; telefoneWhatsapp: boolean;
  telefone2: string; telefone2Whatsapp: boolean;
  contatoEmergencia: string; telefoneEmergencia: string;
  motivoConsulta: string; sintomasAtuais: string;
  quandoComecaramSintomas: string; duracaoSintomas: string;
  intensidade: string; observacoesQueixa: string;
  doencasAnteriores: string; cirurgias: string;
  alergias: string; tratamentoAtual: string; observacoesHistorico: string;
  medicamentosRegulares: string; medicamentoContinuo: string;
  suplementos: string; outrosMedicamentos: string; observacoesMedicamentos: string;
}

interface Appointment {
  id: string;
  specialty: string; professional: string;
  date: string; time: string;
  patientName: string; phone: string;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

interface AgendamentoData {
  especialidade: string; profissional: string;
  dataDesejada: string; horarioDesejado: string;
  nome: string; telefone: string; email: string;
  motivoConsulta: string; observacao: string;
}

interface AuditEntry {
  id: string; usuario: string; acao: string;
  recurso: string; data: string; resultado: string;
}

// ─── Static / Mock Data ───────────────────────────────────────────────────────

const FOOTER_TEXT =
  "Copyright © 2026, Polyana Fontes; Thayná Batista da Silva; App Recife Saudável, Senac PE. Todos os direitos reservados.";

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: "c-001", specialty: "Clínica Geral", professional: "Dr. Roberto Silva",
    date: "05/09/2026", time: "09:30", patientName: "Maria das Graças",
    phone: "(81) 99123-4567", status: "confirmed", createdAt: "01/09/2026" },
  { id: "c-002", specialty: "Cardiologia", professional: "Dra. Lúcia Oliveira",
    date: "18/09/2026", time: "14:00", patientName: "Maria das Graças",
    phone: "(81) 99123-4567", status: "pending", createdAt: "02/09/2026" },
];

const MOCK_AUDIT: AuditEntry[] = [
  { id: "1", usuario: "maria@email.com",           acao: "LOGIN",                 recurso: "SESSAO",          data: "03/09/2026 09:14", resultado: "SUCESSO" },
  { id: "2", usuario: "maria@email.com",           acao: "VISUALIZOU_PRE_TRIAGEM",recurso: "PRE_TRIAGEM_041", data: "03/09/2026 10:02", resultado: "SUCESSO" },
  { id: "3", usuario: "carlos@recifesaudavel.com", acao: "CRIOU_CONSULTA",        recurso: "CONSULTA_829",    data: "03/09/2026 11:30", resultado: "SUCESSO" },
  { id: "4", usuario: "anon",                      acao: "LOGIN",                 recurso: "SESSAO",          data: "03/09/2026 12:05", resultado: "FALHA"   },
];

const SPECIALTIES = [
  "Clínica Geral","Cardiologia","Ortopedia","Neurologia",
  "Ginecologia","Pediatria","Dermatologia","Oftalmologia",
  "Urologia","Psiquiatria","Endocrinologia",
];

const PROFESSIONALS: Record<string, string[]> = {
  "Clínica Geral": ["Dr. Roberto Silva","Dra. Maria Santos","Dr. Paulo Costa"],
  Cardiologia: ["Dr. Antônio Ferreira","Dra. Lúcia Oliveira"],
  Ortopedia: ["Dr. Fernando Gomes","Dra. Patrícia Alves"],
  Neurologia: ["Dra. Cláudia Martins","Dr. José Pereira"],
  Ginecologia: ["Dra. Sandra Lima","Dra. Fernanda Ramos"],
  Pediatria: ["Dr. Marcos Souza","Dra. Juliana Castro"],
  Dermatologia: ["Dra. Renata Barbosa","Dr. Eduardo Nascimento"],
  Oftalmologia: ["Dr. Rogério Araújo","Dra. Cristina Cunha"],
  Urologia: ["Dr. Henrique Melo","Dr. Leonardo Dias"],
  Psiquiatria: ["Dra. Beatriz Rocha","Dr. Alexandre Nunes"],
  Endocrinologia: ["Dra. Isabela Cardoso","Dr. Thiago Vieira"],
};

const HOURS = [
  "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
  "14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30",
];

// ─── Icons ────────────────────────────────────────────────────────────────────

const IcoBack = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>;
const IcoChevronR = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>;
const IcoCheck = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoCalendar = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcoClipboard = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
const IcoSettings = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const IcoShield = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcoHome = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IcoX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoMenu = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IcoLogout = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcoLock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcoAlert = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IcoList = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const IcoTrash = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IcoEye = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcoEyeOff = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <div className="px-4 py-3 border-t border-[#C8DFF0] bg-white"
         style={{ paddingBottom: "calc(0.75rem + var(--sab))" }}>
      <p className="text-[10px] text-[#8AAEC8] text-center leading-relaxed">{FOOTER_TEXT}</p>
    </div>
  );
}

// ─── Clinical disclaimer ──────────────────────────────────────────────────────

function ClinicalDisclaimer() {
  return (
    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
      <span className="text-amber-500 flex-shrink-0 mt-0.5"><IcoAlert /></span>
      <p className="text-amber-700 text-xs font-500 leading-relaxed">
        O Recife Saudável <strong>não realiza diagnóstico médico</strong> e não substitui atendimento profissional.
        Em emergência, ligue <strong>192</strong> (SAMU).
      </p>
    </div>
  );
}

// ─── Floating Menu ────────────────────────────────────────────────────────────

function FloatingMenu({ user, screen, onNavigate, onLogout }: {
  user: User | null; screen: Screen;
  onNavigate: (s: Screen) => void; onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  if (["welcome","login","register","recovery"].includes(screen)) return null;

  function go(s: Screen) { setOpen(false); onNavigate(s); }

  return (
    <div ref={ref} className="fixed z-50"
         style={{ top: "calc(1rem + var(--sat))", left: "calc(1rem + var(--sal))" }}>
      {open && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] -z-10"
             onClick={() => setOpen(false)}/>
      )}

      <div className={`absolute top-12 left-0 w-64 bg-white rounded-2xl shadow-2xl border border-[#C8DFF0] overflow-hidden
          transition-all duration-200 origin-top-left
          ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
           style={{ boxShadow: "0 8px 40px rgba(45,125,210,0.18)" }}>
        {user && (
          <div className="px-4 py-3 bg-gradient-to-r from-[#2D7DD2] to-[#2468B2]">
            <p className="text-white/70 text-xs">Olá,</p>
            <p className="text-white font-700 text-sm truncate">{user.socialName || user.name}</p>
          </div>
        )}
        <div className="py-2">
          <MenuLabel>Navegação</MenuLabel>
          <MItem icon={<IcoHome/>}      label="Início"           active={screen==="dashboard"}    onClick={() => go("dashboard")}/>
          <MItem icon={<IcoClipboard/>} label="Pré-triagem"      active={screen==="triagem"}      onClick={() => go("triagem")}/>
          <MItem icon={<IcoCalendar/>}  label="Agendar consulta" active={screen==="agendamento"}  onClick={() => go("agendamento")}/>
          <MItem icon={<IcoList/>}      label="Minhas consultas"  active={screen==="appointments"} onClick={() => go("appointments")}/>
          {user && <>
            <div className="h-px bg-[#EEF4FA] mx-3 my-1"/>
            <MenuLabel>Conta</MenuLabel>
            <MItem icon={<IcoSettings/>} label="Configurações" active={screen==="settings"} onClick={() => go("settings")}/>
            <MItem icon={<IcoLock/>}     label="Privacidade"   active={screen==="privacy"}  onClick={() => go("privacy")}/>
            <div className="h-px bg-[#EEF4FA] mx-3 my-1"/>
            <MItem icon={<IcoLogout/>}   label="Sair" danger onClick={() => { setOpen(false); onLogout(); }}/>
          </>}
        </div>
      </div>

      <button onClick={() => setOpen(!open)}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200
                active:scale-90 focus:outline-none focus:ring-2 focus:ring-[#2D7DD2]/40
                ${open ? "bg-[#1C2B3A] text-white" : "bg-white text-[#2D7DD2] border border-[#C8DFF0] hover:border-[#2D7DD2]"}`}
              aria-label="Menu" aria-expanded={open}>
        {open ? <IcoX/> : <IcoMenu/>}
      </button>
    </div>
  );
}

function MenuLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-700 uppercase tracking-widest text-[#5A7A94] px-4 pt-2 pb-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}>{children}</p>;
}
function MItem({ icon, label, active, danger, onClick }: {
  icon: React.ReactNode; label: string; active?: boolean; danger?: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-600 transition-all active:scale-[0.98]
        ${active ? "bg-[#EEF4FA] text-[#2D7DD2]" : danger ? "text-red-500 hover:bg-red-50" : "text-[#1C2B3A] hover:bg-[#EEF4FA]"}`}>
      <span className={active ? "text-[#2D7DD2]" : danger ? "text-red-400" : "text-[#5A7A94]"}>{icon}</span>
      {label}
      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2D7DD2]"/>}
    </button>
  );
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function Required() {
  return <span className="text-red-500 ml-0.5" aria-label="campo obrigatório">*</span>;
}

function Field({ label, required, children, hint, error }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string; error?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-600 text-[#1C2B3A]">{label}{required && <Required/>}</label>
      {children}
      {hint  && !error && <p className="text-xs text-[#5A7A94]">{hint}</p>}
      {error && <p className="text-red-500 text-xs font-500">{error}</p>}
    </div>
  );
}

function Input({ hasError, className="", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return (
    <input {...props}
           className={`w-full rounded-xl border-2 px-4 py-3 text-[15px] font-500 text-[#1C2B3A] outline-none transition-all
             focus:border-[#2D7DD2] focus:ring-2 focus:ring-[#2D7DD2]/20
             ${hasError ? "border-red-400 bg-red-50" : "border-[#C8DFF0] bg-white"} ${className}`}/>
  );
}

function Select({ className="", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props}
            className={`w-full rounded-xl border-2 border-[#C8DFF0] bg-white px-4 py-3 text-[15px] font-500 text-[#1C2B3A]
              outline-none transition-all focus:border-[#2D7DD2] focus:ring-2 focus:ring-[#2D7DD2]/20 ${className}`}>
      {children}
    </select>
  );
}

function TextArea({ className="", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props}
              className={`w-full rounded-xl border-2 border-[#C8DFF0] bg-white px-4 py-3 text-[15px] font-500 text-[#1C2B3A]
                outline-none transition-all focus:border-[#2D7DD2] focus:ring-2 focus:ring-[#2D7DD2]/20 resize-none ${className}`}/>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-1 mt-1">
      <div className="h-px flex-1 bg-[#C8DFF0]"/>
      <span className="text-[11px] font-700 uppercase tracking-widest text-[#5A7A94]"
            style={{ fontFamily: "'Poppins', sans-serif" }}>{children}</span>
      <div className="h-px flex-1 bg-[#C8DFF0]"/>
    </div>
  );
}

type BtnV = "primary"|"secondary"|"ghost"|"danger";
function Btn({ children, variant="primary", size="md", className="", ...props }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnV; size?: "sm"|"md"|"lg" }) {
  const base = "rounded-xl font-700 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  const s = { sm:"px-4 py-2 text-sm", md:"px-5 py-3 text-[15px]", lg:"px-6 py-3.5 text-[15px] w-full" };
  const v: Record<BtnV,string> = {
    primary:   "bg-[#2D7DD2] text-white hover:bg-[#2468B2] focus:ring-[#2D7DD2]/40 shadow-sm",
    secondary: "bg-[#EEF4FA] text-[#2D7DD2] hover:bg-[#DCE9F7] border-2 border-[#C8DFF0] focus:ring-[#2D7DD2]/20",
    ghost:     "text-[#5A7A94] hover:bg-[#EEF4FA] focus:ring-[#2D7DD2]/20",
    danger:    "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400/40",
  };
  return <button {...props} className={`${base} ${s[size]} ${v[variant]} ${className}`}>{children}</button>;
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#EEF4FA] text-[#2D7DD2]
              hover:bg-[#DCE9F7] transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#2D7DD2]/30 flex-shrink-0"
            aria-label="Voltar">
      <IcoBack/>
    </button>
  );
}

function SimpleHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="bg-white border-b border-[#C8DFF0]">
      <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 pb-3.5"
           style={{ paddingTop: "calc(0.875rem + var(--sat))" }}>
        <BackBtn onClick={onBack}/>
        <h1 className="flex-1 text-[16px] font-700 text-[#1C2B3A]"
            style={{ fontFamily: "'Poppins', sans-serif" }}>{title}</h1>
      </div>
    </div>
  );
}

function Header({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <div className="bg-white border-b border-[#C8DFF0] sticky top-0 z-10">
      <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 pb-3.5"
           style={{ paddingTop: "calc(0.875rem + var(--sat))" }}>
        <div className="w-10 flex-shrink-0">{onBack && <BackBtn onClick={onBack}/>}</div>
        <h1 className="flex-1 text-[16px] font-700 text-[#1C2B3A] truncate"
            style={{ fontFamily: "'Poppins', sans-serif" }}>{title}</h1>
        <div className="w-9 flex-shrink-0"/>
      </div>
    </div>
  );
}

function StepIndicator({ current, total, labels }: { current: number; total: number; labels?: string[] }) {
  const completed = current;            // etapas concluídas (índices 0..current-1)
  const remaining = total - current - 1;
  const isLast    = remaining === 0;
  const stepLabel = labels?.[current] ?? `Etapa ${current + 1}`;

  // Texto lido por leitores de tela — descreve o estado completo sem depender da visual
  const ariaStatus = isLast
    ? `Etapa ${current + 1} de ${total}: ${stepLabel}. Última etapa. ${completed} ${completed === 1 ? "etapa concluída" : "etapas concluídas"}.`
    : `Etapa ${current + 1} de ${total}: ${stepLabel}. ${completed} ${completed === 1 ? "etapa concluída" : "etapas concluídas"}. Faltam ${remaining} ${remaining === 1 ? "etapa" : "etapas"}.`;

  return (
    <div className="bg-white border-b border-[#C8DFF0]">
    <nav aria-label="Progresso do formulário"
         className="max-w-3xl mx-auto px-4 pt-3 pb-3">

      {/* Anúncio acessível — invisível visualmente, lido por leitores de tela */}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {ariaStatus}
      </p>

      {/* Linha 1 — contador (esquerda) + etapas restantes (direita) */}
      <div className="flex items-center justify-between mb-1.5" aria-hidden="true">
        <span className="text-xs font-700 text-[#2D7DD2] leading-none"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
          Etapa {current + 1} de {total}
        </span>
        <span className={`text-[11px] font-700 px-2 py-0.5 rounded-full leading-none
          ${isLast
            ? "bg-green-100 text-green-800 border border-green-300"
            : "bg-[#EEF4FA] text-[#3D5C72] border border-[#C8DFF0]"}`}>
          {isLast ? "✓ Última etapa" : `Faltam ${remaining} ${remaining === 1 ? "etapa" : "etapas"}`}
        </span>
      </div>

      {/* Linha 2 — nome da etapa atual */}
      <p className="text-[15px] font-700 text-[#1C2B3A] mb-2.5 leading-tight"
         aria-hidden="true"
         style={{ fontFamily: "'Poppins', sans-serif" }}>
        {stepLabel}
      </p>

      {/* Linha 3 — barras segmentadas com número visível na atual */}
      <div className="flex items-end gap-1.5" role="img" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => {
          const done    = i < current;
          const active  = i === current;
          const pending = i > current;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              {/* número da etapa — visível apenas na etapa atual e concluídas */}
              <span className={`text-[10px] font-700 leading-none transition-opacity duration-300
                ${active  ? "text-[#2D7DD2] opacity-100"
                : done    ? "text-[#2D7DD2] opacity-70"
                : "opacity-0"}`}>
                {i + 1}
              </span>
              <div className={`w-full rounded-full transition-all duration-300
                ${done    ? "h-2   bg-[#2D7DD2]"
                : active  ? "h-3   bg-[#2D7DD2]"
                : "h-2   bg-[#C8DFF0]"}`}/>
            </div>
          );
        })}
      </div>

      {/* Linha 4 — confirmação textual das etapas concluídas (visível, não só cor) */}
      <p className="text-[11px] text-[#5A7A94] mt-1.5 leading-none" aria-hidden="true">
        {completed === 0
          ? "Nenhuma etapa concluída ainda"
          : `${completed} ${completed === 1 ? "etapa concluída" : "etapas concluídas"}`}
        {isLast ? " · Complete esta para finalizar" : ""}
      </p>
    </nav>
    </div>
  );
}

function PhoneField({ label, required, value, onChange, isWhatsapp, onWhatsappChange }: {
  label: string; required?: boolean;
  value: string; onChange: (v: string) => void;
  isWhatsapp: boolean; onWhatsappChange: (v: boolean) => void;
}) {
  return (
    <Field label={label} required={required}>
      <Input type="tel" placeholder="(81) 99999-9999" value={value} onChange={e => onChange(e.target.value)}/>
      <label className="flex items-center gap-2 mt-1 cursor-pointer select-none">
        <input type="checkbox" checked={isWhatsapp} onChange={e => onWhatsappChange(e.target.checked)}
               className="w-4 h-4 accent-[#2D7DD2]"/>
        <span className="text-sm text-[#5A7A94]"><span className="text-[#25D366] font-700">WhatsApp</span> disponível</span>
      </label>
    </Field>
  );
}

function Alert({ type, children }: { type: "info"|"success"|"error"|"warn"; children: React.ReactNode }) {
  const s = {
    info:    "bg-[#E8F5F2] border-[#A8D5C8] text-[#1E6B5E]",
    success: "bg-green-50 border-green-200 text-green-700",
    error:   "bg-red-50 border-red-200 text-red-600",
    warn:    "bg-amber-50 border-amber-200 text-amber-700",
  };
  return (
    <div className={`flex items-start gap-2 rounded-xl px-3 py-2.5 border text-sm font-500 ${s[type]}`}>
      {children}
    </div>
  );
}

// ─── WELCOME ──────────────────────────────────────────────────────────────────

function WelcomeScreen({ onStart, onLogin }: { onStart: () => void; onLogin: () => void }) {
  return (
    <div className="app-scroll flex flex-col min-h-full overflow-y-auto bg-gradient-to-b from-[#2D7DD2] to-[#1B5EA8]">
      <div className="flex-1 flex flex-col items-center justify-center"
           style={{ paddingTop: "calc(3rem + var(--sat))" }}>
      <div className="max-w-md mx-auto w-full px-8 pb-6">
        <div className="w-24 h-24 rounded-3xl bg-white/15 border border-white/25 flex items-center justify-center mb-6 shadow-xl mx-auto">
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <h1 className="text-4xl font-700 text-white text-center mb-2 leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}>Recife Saudável</h1>
        <p className="text-[#B8D8F5] text-center text-base font-500 mb-1">Sua saúde na palma da mão.</p>
        <p className="text-[#8ABFE6] text-center text-sm mb-8">2º Polo Médico do Brasil · Senac PE</p>

        <div className="w-full mb-8" role="list" aria-label="Funcionalidades do aplicativo">
          {([
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
              ),
              label: "Pré-triagem informativa",
              sub: "Registre sintomas com segurança",
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              ),
              label: "Agendamento simplificado",
              sub: "Consultas em clínicas parceiras",
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
              ),
              label: "Jornada acessível",
              sub: "Menos cliques, mais clareza",
            },
          ] as { icon: React.ReactNode; label: string; sub: string }[]).map((f, i) => (
            <div key={f.label} role="listitem"
                 className={`flex items-start gap-4 px-1${i < 2 ? " mb-6" : ""}`}>
              <span className="flex-shrink-0 text-white mt-0.5" aria-hidden="true">{f.icon}</span>
              <div>
                <p className="text-white font-700 text-base leading-snug"
                   style={{ fontFamily: "'Poppins', sans-serif" }}>{f.label}</p>
                <p className="text-[#B8D8F5] text-sm mt-0.5 leading-snug">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      <div className="max-w-md mx-auto w-full px-6 space-y-3" style={{ paddingBottom: "calc(1rem + var(--sab))" }}>
        <button onClick={onStart}
                className="w-full bg-white text-[#2D7DD2] font-700 text-[15px] py-4 rounded-2xl shadow-lg
                  hover:bg-[#F0F8FF] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-white/50">
          Começar
        </button>
        <button onClick={onLogin}
                className="w-full bg-white/10 text-white font-600 text-[15px] py-4 rounded-2xl border border-white/20
                  hover:bg-white/20 active:scale-[0.98] transition-all focus:outline-none">
          Acessar minha conta
        </button>
        <p className="text-[#8ABFE6] text-xs text-center py-1">Acesso seguro · LGPD · Dados protegidos</p>
        <div className="pb-2">
          <p className="text-[#6AACD5] text-[10px] text-center leading-relaxed">{FOOTER_TEXT}</p>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin, onRegister, onRecovery, onBack }: {
  onLogin: (u: User) => void; onRegister: () => void;
  onRecovery: () => void; onBack: () => void;
}) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("Preencha todos os campos obrigatórios."); return; }
    if (email === "carlos@recifesaudavel.com" && password.length >= 6) {
      onLogin({ id: "adm-001", name: "Carlos Medeiros", socialName: "Carlos",
        email, phone1: "(81) 99999-0001", phone1Whatsapp: true,
        phone2: "", phone2Whatsapp: false,
        emergencyContact: "", emergencyPhone: "",
        createdAt: "2024-01-15", lastLogin: "2026-09-03", isAdmin: true });
      return;
    }
    if (email.includes("@") && password.length >= 6) {
      onLogin({ id: `usr-${Date.now()}`, name: "Maria das Graças Silva", socialName: "Graça",
        email, phone1: "(81) 99123-4567", phone1Whatsapp: true,
        phone2: "", phone2Whatsapp: false,
        emergencyContact: "Ana Silva", emergencyPhone: "(81) 99888-0011",
        createdAt: "2026-09-03", lastLogin: "2026-09-03" });
      return;
    }
    setError("E-mail ou senha incorretos. Tente novamente.");
  }

  return (
    <div className="flex flex-col min-h-full bg-[#EEF4FA]">
      <SimpleHeader title="Entrar" onBack={onBack}/>
      <form onSubmit={handleSubmit} className="app-scroll flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full flex flex-col px-4 pt-5 gap-4"
             style={{ paddingBottom: "calc(2rem + var(--sab))" }}>
        <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5 space-y-4">
          <Field label="E-mail" required>
            <Input type="email" placeholder="seu@email.com" value={email}
                   onChange={e => { setEmail(e.target.value); setError(""); }}
                   autoComplete="email" hasError={!!error}/>
          </Field>
          <Field label="Senha" required hint="Mínimo 6 caracteres">
            <div className="relative">
              <Input type={showPass ? "text" : "password"} placeholder="••••••••" value={password}
                     onChange={e => { setPassword(e.target.value); setError(""); }}
                     autoComplete="current-password" hasError={!!error} className="pr-12"/>
              <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A7A94] hover:text-[#2D7DD2] p-1">
                {showPass ? <IcoEyeOff/> : <IcoEye/>}
              </button>
            </div>
          </Field>
          {error && <Alert type="error"><IcoAlert/>{error}</Alert>}
          <button type="button" onClick={onRecovery}
                  className="text-[#2D7DD2] text-sm font-600 hover:underline text-left">
            Esqueci minha senha
          </button>
        </div>

        <Alert type="info">
          <span className="text-base flex-shrink-0">💡</span>
          <span className="text-xs"><strong>Demo:</strong> Qualquer e-mail válido + senha ≥ 6 caracteres. ADM: carlos@recifesaudavel.com</span>
        </Alert>

        <div className="mt-auto space-y-3">
          <Btn type="submit" size="lg">Entrar</Btn>
          <button type="button" onClick={onRegister}
                  className="w-full text-center text-[#2D7DD2] font-600 text-sm py-2 hover:underline">
            Ainda não tenho conta — Criar cadastro
          </button>
        </div>
        </div>
      </form>
      <Footer/>
    </div>
  );
}

// ─── RECOVERY ─────────────────────────────────────────────────────────────────

function RecoveryScreen({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [sent,  setSent]  = useState(false);

  return (
    <div className="flex flex-col min-h-full bg-[#EEF4FA]">
      <SimpleHeader title="Recuperar acesso" onBack={onBack}/>
      <div className="app-scroll flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full px-4 pt-5 space-y-4" style={{ paddingBottom: "calc(2rem + var(--sab))" }}>
        {!sent ? (
          <>
            <p className="text-[#5A7A94] text-sm leading-relaxed">
              Informe o e-mail cadastrado. Enviaremos instruções de recuperação, se este e-mail estiver registrado.
            </p>
            <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5">
              <Field label="E-mail" required>
                <Input type="email" placeholder="seu@email.com" value={email}
                       onChange={e => setEmail(e.target.value)}/>
              </Field>
            </div>
            <Alert type="warn">
              <span className="text-base flex-shrink-0">🔒</span>
              <span className="text-xs">Por segurança, não informamos se um e-mail está cadastrado ou não.</span>
            </Alert>
            <Btn size="lg" onClick={() => { if (email.includes("@")) setSent(true); }}>
              Enviar instruções
            </Btn>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
            <div className="w-16 h-16 rounded-3xl bg-green-100 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h2 className="text-xl font-700 text-[#1C2B3A]" style={{ fontFamily: "'Poppins', sans-serif" }}>Verifique seu e-mail</h2>
            <p className="text-[#5A7A94] text-sm leading-relaxed max-w-xs">
              Se <strong>{email}</strong> estiver cadastrado, você receberá as instruções em breve.
            </p>
            <Btn variant="secondary" onClick={onBack}>Voltar ao login</Btn>
          </div>
        )}
      </div>
      </div>
      <Footer/>
    </div>
  );
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────

function RegisterScreen({ onRegister, onBack }: {
  onRegister: (u: User) => void; onBack: () => void;
}) {
  const [form, setForm] = useState({
    name: "", socialName: "", email: "", password: "",
    phone1: "", phone1Whatsapp: false, phone2: "", phone2Whatsapp: false,
    emergencyContact: "", emergencyPhone: "",
  });
  const [consent, setConsent] = useState({ privacy: false, treatment: false, notifications: false });
  const [errors,  setErrors]  = useState<Record<string,string>>({});
  const [busy,    setBusy]    = useState(false);

  function upd(k: keyof typeof form, v: string | boolean) {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string,string> = {};
    if (!form.name.trim())          errs.name      = "Nome completo é obrigatório.";
    if (!form.email.includes("@"))  errs.email     = "Informe um e-mail válido.";
    if (form.password.length < 6)   errs.password  = "Mínimo 6 caracteres.";
    if (!form.phone1.trim())        errs.phone1    = "Telefone principal é obrigatório.";
    if (!consent.privacy)           errs.privacy   = "Leitura da Política de Privacidade é obrigatória.";
    if (!consent.treatment)         errs.treatment = "Consentimento de tratamento de dados é necessário.";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setBusy(true);
    setTimeout(() => {
      onRegister({ id: `usr-${Date.now()}`, name: form.name,
        socialName: form.socialName || form.name, email: form.email,
        phone1: form.phone1, phone1Whatsapp: form.phone1Whatsapp,
        phone2: form.phone2, phone2Whatsapp: form.phone2Whatsapp,
        emergencyContact: form.emergencyContact, emergencyPhone: form.emergencyPhone,
        createdAt: "2026-09-03", lastLogin: "2026-09-03" });
    }, 600);
  }

  return (
    <div className="flex flex-col min-h-full bg-[#EEF4FA]">
      <SimpleHeader title="Criar cadastro" onBack={onBack}/>
      <form onSubmit={submit} className="app-scroll flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 pt-4 space-y-4" style={{ paddingBottom: "calc(2rem + var(--sab))" }}>

        <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5 space-y-4">
          <SectionTitle>Identificação</SectionTitle>
          <Field label="Nome completo" required error={errors.name}>
            <Input type="text" placeholder="Ex: Maria das Graças Silva" value={form.name}
                   onChange={e => upd("name", e.target.value)} hasError={!!errors.name}/>
          </Field>
          <Field label="Nome Social" hint="Como prefere ser chamado(a). Editável nas configurações.">
            <Input type="text" placeholder="Ex: Graça" value={form.socialName}
                   onChange={e => upd("socialName", e.target.value)}/>
          </Field>
          <Field label="E-mail" required error={errors.email}>
            <Input type="email" placeholder="seu@email.com" value={form.email}
                   onChange={e => upd("email", e.target.value)} hasError={!!errors.email}/>
          </Field>
          <Field label="Senha" required error={errors.password} hint="Mínimo 6 caracteres">
            <Input type="password" placeholder="••••••••" value={form.password}
                   onChange={e => upd("password", e.target.value)} hasError={!!errors.password}/>
          </Field>
        </div>

        <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5 space-y-4">
          <SectionTitle>Contato</SectionTitle>
          <PhoneField label="Telefone principal" required value={form.phone1}
                      onChange={v => upd("phone1", v)} isWhatsapp={form.phone1Whatsapp}
                      onWhatsappChange={v => upd("phone1Whatsapp", v)}/>
          {errors.phone1 && <p className="text-red-500 text-xs -mt-2">{errors.phone1}</p>}
          <PhoneField label="Telefone alternativo" value={form.phone2}
                      onChange={v => upd("phone2", v)} isWhatsapp={form.phone2Whatsapp}
                      onWhatsappChange={v => upd("phone2Whatsapp", v)}/>
        </div>

        <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5 space-y-4">
          <SectionTitle>Contato de emergência</SectionTitle>
          <Field label="Nome do contato">
            <Input type="text" placeholder="Ex: Ana Silva (filha)" value={form.emergencyContact}
                   onChange={e => upd("emergencyContact", e.target.value)}/>
          </Field>
          <Field label="Telefone do contato">
            <Input type="tel" placeholder="(81) 99888-7766" value={form.emergencyPhone}
                   onChange={e => upd("emergencyPhone", e.target.value)}/>
          </Field>
        </div>

        <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5 space-y-4">
          <SectionTitle>Consentimentos</SectionTitle>
          <p className="text-xs text-[#5A7A94]">Escolhas independentes. Leia cada item antes de marcar.</p>
          {[
            { key: "privacy"   as const, text: "Li e estou ciente da Política de Privacidade e do tratamento de dados pelo Recife Saudável.", required: true  },
            { key: "treatment" as const, text: "Concordo com o tratamento dos dados necessário para agendamento de consultas.",               required: true  },
            { key: "notifications" as const, text: "Desejo receber comunicações e lembretes de consulta (opcional).",                         required: false },
          ].map(item => (
            <div key={item.key}>
              <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-xl border-2 transition-all
                  ${consent[item.key] ? "border-[#2D7DD2] bg-[#EEF4FA]" : "border-[#C8DFF0] bg-white"}
                  ${errors[item.key] ? "border-red-400 bg-red-50" : ""}`}>
                <input type="checkbox" checked={consent[item.key]}
                       onChange={e => { setConsent(c => ({...c,[item.key]:e.target.checked})); setErrors(r=>({...r,[item.key]:""})); }}
                       className="w-4 h-4 accent-[#2D7DD2] mt-0.5 flex-shrink-0"/>
                <span className="text-sm text-[#1C2B3A] leading-relaxed">
                  {item.text}{item.required && <span className="text-red-500 ml-1">*</span>}
                </span>
              </label>
              {errors[item.key] && <p className="text-red-500 text-xs mt-1 px-1">{errors[item.key]}</p>}
            </div>
          ))}
        </div>

        <p className="text-xs text-[#5A7A94] px-1"><span className="text-red-500 font-700">*</span> Campos e consentimentos obrigatórios</p>
        <Btn type="submit" size="lg" disabled={busy}>{busy ? "Criando conta..." : "Criar conta"}</Btn>
        </div>
      </form>
      <Footer/>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

function Dashboard({ user, onTriagem, onAgendamento, onAppointments, onSettings }: {
  user: User; onTriagem: () => void; onAgendamento: () => void;
  onAppointments: () => void; onSettings: () => void;
}) {
  const hr = new Date().getHours();
  const greeting = hr < 12 ? "Bom dia" : hr < 18 ? "Boa tarde" : "Boa noite";
  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

  return (
    <div className="flex flex-col min-h-full bg-[#EEF4FA]">
      <div className="bg-gradient-to-b from-[#2D7DD2] to-[#2468B2]"
           style={{ paddingTop: "calc(1rem + var(--sat))" }}>
        <div className="max-w-3xl mx-auto px-4 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12"/>
            <button onClick={onSettings}
                    className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors active:scale-95"
                    aria-label="Configurações">
              <IcoSettings/>
            </button>
          </div>
          <p className="text-[#A8CEED] text-sm font-500">{greeting},</p>
          <h2 className="text-white text-[22px] font-700 mt-0.5 leading-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}>{user.socialName || user.name}</h2>
          <p className="text-[#8ABFE6] text-xs mt-1">{user.email}</p>
        </div>
      </div>

      <div className="app-scroll flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 pt-4 space-y-4"
             style={{ paddingBottom: "calc(1.5rem + var(--sab))" }}>
        <ClinicalDisclaimer/>

        <div className="bg-white rounded-2xl border border-[#C8DFF0] shadow-sm p-4">
          <p className="text-[11px] font-700 uppercase tracking-widest text-[#5A7A94] mb-3"
             style={{ fontFamily: "'Poppins', sans-serif" }}>Ações rápidas</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon:<IcoClipboard/>, label:"Pré-triagem",     sub:"Informe sintomas",    color:"#2D7DD2", bg:"#EEF4FA", border:"#C8DFF0", action:onTriagem   },
              { icon:<IcoCalendar/>,  label:"Agendar",         sub:"Escolha data e hora", color:"#1E6B5E", bg:"#E8F5F2", border:"#A8D5C8", action:onAgendamento},
            ].map(c => (
              <button key={c.label} onClick={c.action}
                      className="flex flex-col gap-3 p-4 rounded-xl border-2 transition-all active:scale-95 text-left hover:shadow-md focus:outline-none"
                      style={{ backgroundColor: c.bg, borderColor: c.border }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                     style={{ backgroundColor: `${c.color}1a`, color: c.color }}>{c.icon}</div>
                <div>
                  <p className="font-700 text-[#1C2B3A] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{c.label}</p>
                  <p className="text-[#5A7A94] text-xs mt-0.5">{c.sub}</p>
                </div>
              </button>
            ))}
            <button onClick={onAppointments}
                    className="col-span-2 flex items-center gap-3 p-4 rounded-xl border-2 border-[#C4B8E0] bg-[#F0EBF8]
                      transition-all active:scale-[0.98] hover:shadow-md focus:outline-none text-left">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#7B5EA7]/10 text-[#7B5EA7] flex-shrink-0"><IcoList/></div>
              <div className="flex-1">
                <p className="font-700 text-[#1C2B3A] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Minhas consultas</p>
                <p className="text-[#5A7A94] text-xs">Ver e gerenciar agendamentos</p>
              </div>
              <IcoChevronR/>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#C8DFF0] p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-700 uppercase tracking-widest text-[#5A7A94]"
               style={{ fontFamily: "'Poppins', sans-serif" }}>Próximas consultas</p>
            <button onClick={onAppointments} className="text-[#2D7DD2] text-xs font-600 hover:underline">Ver todas</button>
          </div>
          <div className="space-y-2">
            {MOCK_APPOINTMENTS.filter(a => a.status !== "cancelled").slice(0,2).map((a,i) => {
              const parts = a.date.split("/");
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#EEF4FA]">
                  <div className="w-11 h-11 rounded-xl bg-[#2D7DD2]/10 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-700 text-[#2D7DD2]">{parts[0]}</span>
                    <span className="text-[10px] text-[#5A7A94]">{months[parseInt(parts[1])-1]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-600 text-[#1C2B3A] text-sm truncate">{a.professional}</p>
                    <p className="text-[#5A7A94] text-xs">{a.specialty} · {a.time}</p>
                  </div>
                  <span className={`text-xs font-600 px-2 py-0.5 rounded-full whitespace-nowrap
                    ${a.status==="confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {a.status==="confirmed" ? "Confirmada" : "Aguardando"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

// ─── APPOINTMENTS LIST ────────────────────────────────────────────────────────

function AppointmentsScreen({ onBack, initialAppts }: {
  onBack: () => void; initialAppts: Appointment[];
}) {
  const [appts, setAppts] = useState(initialAppts);

  function cancel(id: string) {
    if (!window.confirm("Deseja cancelar esta consulta?")) return;
    setAppts(a => a.map(ap => ap.id===id ? {...ap, status:"cancelled" as const} : ap));
  }

  const statusLabel: Record<Appointment["status"],string>  = { confirmed:"Confirmada", pending:"Aguardando", cancelled:"Cancelada" };
  const statusColor: Record<Appointment["status"],string>  = { confirmed:"bg-green-100 text-green-700", pending:"bg-yellow-100 text-yellow-700", cancelled:"bg-red-100 text-red-500" };

  return (
    <div className="flex flex-col min-h-full bg-[#EEF4FA]">
      <Header title="Minhas Consultas" onBack={onBack}/>
      <div className="app-scroll flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 pt-4 space-y-3"
             style={{ paddingBottom: "calc(2rem + var(--sab))" }}>
        {appts.length === 0 && (
          <div className="text-center py-16 text-[#5A7A94]">
            <div className="text-4xl mb-3">📅</div>
            <p className="font-600">Nenhuma consulta encontrada</p>
          </div>
        )}
        {appts.map(a => (
          <div key={a.id} className={`bg-white rounded-2xl border border-[#C8DFF0] p-4 ${a.status==="cancelled" ? "opacity-60" : ""}`}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <p className="font-700 text-[#1C2B3A] text-sm">{a.specialty}</p>
                <p className="text-[#5A7A94] text-xs">{a.professional}</p>
              </div>
              <span className={`text-xs font-600 px-2.5 py-1 rounded-full whitespace-nowrap ${statusColor[a.status]}`}>
                {statusLabel[a.status]}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#5A7A94] mb-3">
              <span>📅 {a.date}</span><span>🕐 {a.time}</span>
            </div>
            {a.status !== "cancelled" && (
              <button onClick={() => cancel(a.id)}
                      className="flex items-center gap-1.5 text-red-500 text-xs font-600 hover:text-red-700 transition-colors">
                <IcoTrash/> Cancelar consulta
              </button>
            )}
          </div>
        ))}
        <Alert type="warn">
          <span className="text-base flex-shrink-0">⚠️</span>
          <span className="text-xs">Cancelamento sujeito à política de cada clínica. O histórico é mantido para fins de auditoria.</span>
        </Alert>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

// ─── PRÉ-TRIAGEM (4 etapas) ───────────────────────────────────────────────────

const TRIAGEM_LABELS = ["Dados pessoais","Queixa principal","Histórico médico","Medicamentos"];

function TriagemScreen({ onBack, onSuccess }: {
  onBack: () => void; onSuccess: (d: TriagemData) => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<TriagemData>({
    nome:"", nomeSocial:"", dataNascimento:"",
    telefone:"", telefoneWhatsapp:false, telefone2:"", telefone2Whatsapp:false,
    contatoEmergencia:"", telefoneEmergencia:"",
    motivoConsulta:"", sintomasAtuais:"", quandoComecaramSintomas:"",
    duracaoSintomas:"", intensidade:"", observacoesQueixa:"",
    doencasAnteriores:"", cirurgias:"", alergias:"", tratamentoAtual:"", observacoesHistorico:"",
    medicamentosRegulares:"", medicamentoContinuo:"", suplementos:"", outrosMedicamentos:"", observacoesMedicamentos:"",
  });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bodyRef.current?.scrollTo({ top:0, behavior:"smooth" }); }, [step]);

  function upd(k: keyof TriagemData, v: string | boolean) {
    setForm(f => ({...f,[k]:v}));
    setErrors(e => ({...e,[k]:""}));
  }

  function validate(): boolean {
    const e: Record<string,string> = {};
    if (step===0) {
      if (!form.nome.trim())      e.nome        = "Nome completo é obrigatório.";
      if (!form.dataNascimento)   e.dataNascimento = "Informe sua data de nascimento.";
      if (!form.telefone.trim())  e.telefone    = "Telefone principal é obrigatório.";
    }
    if (step===1 && !form.motivoConsulta.trim()) e.motivoConsulta = "Descreva o motivo da consulta.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validate()) return;
    if (step < 3) setStep(step+1); else onSuccess(form);
  }

  return (
    <div className="flex flex-col min-h-full bg-[#EEF4FA]">
      <Header title="Pré-triagem" onBack={onBack}/>
      <StepIndicator current={step} total={4} labels={TRIAGEM_LABELS}/>

      <div ref={bodyRef} className="app-scroll flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 pt-4 space-y-4"
             style={{ paddingBottom: "calc(2rem + var(--sab))" }}>

        {step===0 && (
          <>
            <ClinicalDisclaimer/>
            <Alert type="warn">
              <span className="text-base flex-shrink-0">🚨</span>
              <span className="text-xs">Emergência? Não aguarde o agendamento. Ligue <strong>192 (SAMU)</strong> ou vá ao pronto-socorro.</span>
            </Alert>
            <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5 space-y-4">
              <SectionTitle>Dados Pessoais</SectionTitle>
              <Field label="Nome completo" required error={errors.nome}>
                <Input type="text" placeholder="Ex: José Carlos da Silva" value={form.nome}
                       onChange={e => upd("nome",e.target.value)} hasError={!!errors.nome}/>
              </Field>
              <Field label="Nome Social" hint="Como prefere ser chamado(a)">
                <Input type="text" placeholder="Ex: José" value={form.nomeSocial}
                       onChange={e => upd("nomeSocial",e.target.value)}/>
              </Field>
              <Field label="Data de nascimento" required error={errors.dataNascimento}>
                <Input type="date" value={form.dataNascimento}
                       onChange={e => upd("dataNascimento",e.target.value)} hasError={!!errors.dataNascimento}/>
              </Field>
              <PhoneField label="Telefone principal" required value={form.telefone}
                          onChange={v => upd("telefone",v)} isWhatsapp={form.telefoneWhatsapp}
                          onWhatsappChange={v => upd("telefoneWhatsapp",v)}/>
              {errors.telefone && <p className="text-red-500 text-xs -mt-2">{errors.telefone}</p>}
              <PhoneField label="Telefone secundário" value={form.telefone2}
                          onChange={v => upd("telefone2",v)} isWhatsapp={form.telefone2Whatsapp}
                          onWhatsappChange={v => upd("telefone2Whatsapp",v)}/>
              <Field label="Nome do contato de emergência">
                <Input type="text" placeholder="Ex: Ana Silva (filha)" value={form.contatoEmergencia}
                       onChange={e => upd("contatoEmergencia",e.target.value)}/>
              </Field>
              <Field label="Telefone do contato de emergência">
                <Input type="tel" placeholder="(81) 99888-7766" value={form.telefoneEmergencia}
                       onChange={e => upd("telefoneEmergencia",e.target.value)}/>
              </Field>
            </div>
          </>
        )}

        {step===1 && (
          <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5 space-y-4">
            <SectionTitle>Queixa Principal</SectionTitle>
            <p className="text-xs text-[#5A7A94] leading-relaxed">Descreva com suas palavras. O aplicativo não realiza diagnóstico.</p>
            <Field label="Motivo da consulta" required error={errors.motivoConsulta}>
              <TextArea rows={3} placeholder="Ex: Dor no peito ao respirar, tontura frequente..."
                        value={form.motivoConsulta} onChange={e => upd("motivoConsulta",e.target.value)}
                        className={errors.motivoConsulta ? "border-red-400 bg-red-50" : ""}/>
            </Field>
            <Field label="Sintomas atuais">
              <TextArea rows={3} placeholder="Liste os sintomas que está sentindo agora..."
                        value={form.sintomasAtuais} onChange={e => upd("sintomasAtuais",e.target.value)}/>
            </Field>
            <Field label="Quando começaram os sintomas?">
              <Select value={form.quandoComecaramSintomas} onChange={e => upd("quandoComecaramSintomas",e.target.value)}>
                <option value="">Selecione...</option>
                {["Hoje","Há 2 a 3 dias","Há uma semana","Há 2 semanas","Há 1 mês","Há mais de 1 mês","Há mais de 6 meses","Crônico (mais de 1 ano)"].map(o => <option key={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Duração / padrão dos sintomas" hint="Contínuo, intermitente, piora ao...">
              <Input type="text" placeholder="Ex: Dor constante, tontura ao levantar" value={form.duracaoSintomas}
                     onChange={e => upd("duracaoSintomas",e.target.value)}/>
            </Field>
            <Field label="Intensidade (opcional)" hint="1 = leve, 10 = insuportável">
              <Select value={form.intensidade} onChange={e => upd("intensidade",e.target.value)}>
                <option value="">Prefiro não informar</option>
                {Array.from({length:10},(_,i)=>String(i+1)).map(n => <option key={n} value={n}>{n}{n==="1"?" — muito leve":n==="5"?" — moderado":n==="10"?" — insuportável":""}</option>)}
              </Select>
            </Field>
            <Field label="Observações adicionais">
              <TextArea rows={2} placeholder="Algo mais que queira informar..." value={form.observacoesQueixa}
                        onChange={e => upd("observacoesQueixa",e.target.value)}/>
            </Field>
          </div>
        )}

        {step===2 && (
          <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5 space-y-4">
            <SectionTitle>Histórico Médico</SectionTitle>
            <p className="text-xs text-[#5A7A94]">Dados de saúde são informações sensíveis protegidas pela LGPD.</p>
            <Field label="Doenças anteriores ou crônicas" hint="Ex: hipertensão, diabetes, asma">
              <TextArea rows={3} placeholder="Ex: Hipertensão há 10 anos, diabetes tipo 2"
                        value={form.doencasAnteriores} onChange={e => upd("doencasAnteriores",e.target.value)}/>
            </Field>
            <Field label="Cirurgias realizadas">
              <TextArea rows={2} placeholder="Nenhuma, ou descreva com ano aproximado..."
                        value={form.cirurgias} onChange={e => upd("cirurgias",e.target.value)}/>
            </Field>
            <Field label="Alergias conhecidas" hint="Medicamentos, alimentos, látex, outros">
              <Input type="text" placeholder="Ex: Dipirona, penicilina, amendoim"
                     value={form.alergias} onChange={e => upd("alergias",e.target.value)}/>
            </Field>
            <Field label="Tratamento atual">
              <TextArea rows={2} placeholder="Acompanhamento médico, fisioterapia, etc."
                        value={form.tratamentoAtual} onChange={e => upd("tratamentoAtual",e.target.value)}/>
            </Field>
            <Field label="Observações relevantes">
              <TextArea rows={2} placeholder="Outras informações importantes..."
                        value={form.observacoesHistorico} onChange={e => upd("observacoesHistorico",e.target.value)}/>
            </Field>
          </div>
        )}

        {step===3 && (
          <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5 space-y-4">
            <SectionTitle>Medicamentos e Suplementos</SectionTitle>
            <p className="text-xs text-[#5A7A94]">O aplicativo não recomenda alterações de tratamento.</p>
            <Field label="Medicamentos de uso regular" hint="Nome e dose, se souber">
              <TextArea rows={3} placeholder="Ex: Losartana 50mg, Metformina 850mg"
                        value={form.medicamentosRegulares} onChange={e => upd("medicamentosRegulares",e.target.value)}/>
            </Field>
            <Field label="Medicamentos de uso contínuo (todo dia)">
              <TextArea rows={2} placeholder="Ex: AAS 100mg — coração; Sinvastatina — colesterol"
                        value={form.medicamentoContinuo} onChange={e => upd("medicamentoContinuo",e.target.value)}/>
            </Field>
            <Field label="Suplementos vitamínicos ou naturais">
              <TextArea rows={2} placeholder="Ex: Vitamina D 2000UI, Ômega 3, Complexo B"
                        value={form.suplementos} onChange={e => upd("suplementos",e.target.value)}/>
            </Field>
            <Field label="Outros medicamentos em uso">
              <TextArea rows={2} placeholder="Medicamentos pontuais, antibióticos, etc."
                        value={form.outrosMedicamentos} onChange={e => upd("outrosMedicamentos",e.target.value)}/>
            </Field>
            <Field label="Observações sobre medicamentos">
              <TextArea rows={2} placeholder="Dificuldade de engolir, horários especiais..."
                        value={form.observacoesMedicamentos} onChange={e => upd("observacoesMedicamentos",e.target.value)}/>
            </Field>
          </div>
        )}

        <div className="flex gap-3">
          {step>0 && <Btn variant="secondary" onClick={() => setStep(step-1)} className="flex-1">← Voltar</Btn>}
          <Btn onClick={next} className="flex-1">{step<3 ? "Próximo →" : "Enviar triagem ✓"}</Btn>
        </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

function TriagemSuccess({ onDashboard, onAgendamento }: { onDashboard: () => void; onAgendamento: () => void }) {
  return (
    <div className="app-scroll flex flex-col min-h-full bg-[#EEF4FA] overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center">
      <div className="max-w-lg mx-auto w-full px-6"
           style={{ paddingTop:"var(--sat)", paddingBottom:"calc(2rem + var(--sab))" }}>
        <div className="w-20 h-20 rounded-3xl bg-green-100 flex items-center justify-center mb-5">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h2 className="text-2xl font-700 text-[#1C2B3A] text-center mb-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}>Informações registradas!</h2>
        <p className="text-[#5A7A94] text-center text-sm leading-relaxed mb-4">
          Suas respostas foram salvas e serão consideradas na preparação do atendimento.
        </p>
        <Alert type="warn">
          <span className="text-base flex-shrink-0">⚠️</span>
          <span className="text-xs">O Recife Saudável <strong>não realiza diagnóstico</strong>. Aguarde o contato da clínica ou agende uma consulta.</span>
        </Alert>
        <div className="w-full space-y-3 mt-6">
          <Btn size="lg" onClick={onAgendamento}>Agendar consulta agora</Btn>
          <Btn size="lg" variant="secondary" onClick={onDashboard}>Voltar ao início</Btn>
        </div>
      </div>
      </div>
      <Footer/>
    </div>
  );
}

// ─── AGENDAMENTO (3 etapas) ───────────────────────────────────────────────────

const AGD_LABELS = ["Especialidade","Data e horário","Confirmação"];

function AgendamentoScreen({ user, triagemData, onBack, onSuccess }: {
  user: User; triagemData: TriagemData | null;
  onBack: () => void; onSuccess: (d: AgendamentoData) => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<AgendamentoData>({
    especialidade: "", profissional: "",
    dataDesejada: "", horarioDesejado: "",
    nome: triagemData?.nome || user.name,
    telefone: triagemData?.telefone || user.phone1,
    email: user.email,
    motivoConsulta: triagemData?.motivoConsulta || "",
    observacao: "",
  });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const profList = form.especialidade ? (PROFESSIONALS[form.especialidade] || []) : [];
  const bodyRef  = useRef<HTMLDivElement>(null);
  useEffect(() => { bodyRef.current?.scrollTo({ top:0, behavior:"smooth" }); }, [step]);

  function upd(k: keyof AgendamentoData, v: string) {
    setForm(f => ({...f,[k]:v}));
    setErrors(e => ({...e,[k]:""}));
  }

  function validate(): boolean {
    const e: Record<string,string> = {};
    if (step===0 && !form.especialidade)   e.especialidade   = "Selecione a especialidade.";
    if (step===1 && !form.dataDesejada)    e.dataDesejada    = "Selecione uma data.";
    if (step===1 && !form.horarioDesejado) e.horarioDesejado = "Selecione um horário.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validate()) return;
    if (step < 2) setStep(step+1); else onSuccess(form);
  }

  return (
    <div className="flex flex-col min-h-full bg-[#EEF4FA]">
      <Header title="Agendar Consulta" onBack={onBack}/>
      <StepIndicator current={step} total={3} labels={AGD_LABELS}/>

      <div ref={bodyRef} className="app-scroll flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 pt-4 space-y-4"
             style={{ paddingBottom: "calc(2rem + var(--sab))" }}>

        {step===0 && (
          <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5 space-y-4">
            <SectionTitle>Especialidade e Profissional</SectionTitle>
            <Field label="Especialidade médica" required error={errors.especialidade}>
              <Select value={form.especialidade}
                      onChange={e => { upd("especialidade",e.target.value); upd("profissional",""); }}>
                <option value="">Selecione a especialidade...</option>
                {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
              </Select>
            </Field>
            {profList.length > 0 && (
              <Field label="Profissional de preferência" hint="Opcional">
                <Select value={form.profissional} onChange={e => upd("profissional",e.target.value)}>
                  <option value="">Qualquer profissional disponível</option>
                  {profList.map(p => <option key={p}>{p}</option>)}
                </Select>
              </Field>
            )}
            <Field label="Motivo breve" hint="Pré-preenchido da triagem, se disponível">
              <TextArea rows={3} placeholder="Descreva o motivo..." value={form.motivoConsulta}
                        onChange={e => upd("motivoConsulta",e.target.value)}/>
            </Field>
            {triagemData && (
              <Alert type="info">
                <IcoCheck/>
                <span className="text-xs">Dados pré-preenchidos a partir da pré-triagem.</span>
              </Alert>
            )}
          </div>
        )}

        {step===1 && (
          <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5 space-y-4">
            <SectionTitle>Data e Horário</SectionTitle>
            <Alert type="info">
              <span className="text-base flex-shrink-0">ℹ️</span>
              <span className="text-xs">Horários disponíveis são validados pelo servidor no momento da confirmação.</span>
            </Alert>
            <Field label="Data desejada" required error={errors.dataDesejada}>
              <Input type="date" value={form.dataDesejada}
                     min={new Date().toISOString().split("T")[0]}
                     onChange={e => upd("dataDesejada",e.target.value)} hasError={!!errors.dataDesejada}/>
            </Field>
            <Field label="Horário desejado" required error={errors.horarioDesejado}>
              <div className="grid grid-cols-4 gap-2">
                {HOURS.map(h => (
                  <button key={h} type="button" onClick={() => upd("horarioDesejado",h)}
                          className={`py-2.5 rounded-xl border-2 text-sm font-600 transition-all active:scale-95
                            ${form.horarioDesejado===h ? "bg-[#2D7DD2] border-[#2D7DD2] text-white" : "bg-white border-[#C8DFF0] text-[#1C2B3A] hover:border-[#2D7DD2]"}`}>
                    {h}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {step===2 && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5">
              <SectionTitle>Resumo do Agendamento</SectionTitle>
              <div className="space-y-2 mt-2">
                {[
                  { l:"Especialidade",  v: form.especialidade },
                  { l:"Profissional",   v: form.profissional || "Qualquer disponível" },
                  { l:"Data",           v: form.dataDesejada ? new Date(form.dataDesejada+"T12:00").toLocaleDateString("pt-BR") : "—" },
                  { l:"Horário",        v: form.horarioDesejado },
                  { l:"Paciente",       v: form.nome },
                  { l:"Telefone",       v: form.telefone },
                ].map((r,i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-[#EEF4FA] last:border-0">
                    <span className="text-[#5A7A94] text-sm">{r.l}</span>
                    <span className="text-[#1C2B3A] font-600 text-sm text-right max-w-[55%]">{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <Field label="Observação adicional">
              <TextArea rows={2} placeholder="Informações complementares para a clínica..."
                        value={form.observacao} onChange={e => upd("observacao",e.target.value)}/>
            </Field>
            <Alert type="info">
              <span className="text-base flex-shrink-0">📱</span>
              <span className="text-xs">Confirmação enviada para <strong>{form.telefone}</strong>. Informações médicas não serão expostas em notificações.</span>
            </Alert>
            <Alert type="warn">
              <span className="text-base flex-shrink-0">⚠️</span>
              <span className="text-xs">Conflito de horário é impedido pelo servidor. O horário definitivo será confirmado pela clínica.</span>
            </Alert>
          </div>
        )}

        <div className="flex gap-3">
          {step>0 && <Btn variant="secondary" onClick={() => setStep(step-1)} className="flex-1">← Voltar</Btn>}
          <Btn onClick={next} className="flex-1">{step<2 ? "Próximo →" : "Confirmar agendamento ✓"}</Btn>
        </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

function AgendamentoSuccess({ data, onDashboard, onAppointments }: {
  data: AgendamentoData; onDashboard: () => void; onAppointments: () => void;
}) {
  const dateStr = data.dataDesejada ? new Date(data.dataDesejada+"T12:00").toLocaleDateString("pt-BR") : "—";
  return (
    <div className="app-scroll flex flex-col min-h-full bg-[#EEF4FA] overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center">
      <div className="max-w-lg mx-auto w-full px-5"
           style={{ paddingTop:"calc(2rem + var(--sat))", paddingBottom:"calc(2rem + var(--sab))" }}>
        <div className="w-20 h-20 rounded-3xl bg-[#2D7DD2]/10 flex items-center justify-center mb-5 text-[#2D7DD2]">
          <IcoCalendar/>
        </div>
        <h2 className="text-2xl font-700 text-[#1C2B3A] text-center mb-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}>Consulta agendada!</h2>
        <p className="text-[#5A7A94] text-center text-sm mb-5">Agendamento registrado com sucesso.</p>
        <div className="w-full bg-white rounded-2xl border border-[#C8DFF0] p-5 space-y-3 mb-4">
          {[
            { l:"Paciente",      v: data.nome },
            { l:"Especialidade", v: data.especialidade },
            { l:"Profissional",  v: data.profissional || "A definir" },
            { l:"Data e hora",   v: `${dateStr} às ${data.horarioDesejado}` },
          ].map((r,i) => (
            <div key={i} className="flex justify-between items-center py-1 border-b border-[#EEF4FA] last:border-0">
              <span className="text-[#5A7A94] text-sm">{r.l}</span>
              <span className="text-[#1C2B3A] font-600 text-sm text-right max-w-[60%]">{r.v}</span>
            </div>
          ))}
        </div>
        <Alert type="info">
          <span className="text-base flex-shrink-0">📱</span>
          <span className="text-xs">Confirmação para <strong>{data.telefone}</strong>. Informações médicas não serão expostas em notificações externas.</span>
        </Alert>
        <div className="w-full space-y-3 mt-5">
          <Btn size="lg" onClick={onAppointments}>Ver minhas consultas</Btn>
          <Btn size="lg" variant="secondary" onClick={onDashboard}>Voltar ao início</Btn>
        </div>
      </div>
      </div>
      <Footer/>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────

function SettingsScreen({ user, onBack, onSave, onPrivacy, onLogout }: {
  user: User; onBack: () => void; onSave: (u: User) => void;
  onPrivacy: () => void; onLogout: () => void;
}) {
  const [form, setForm] = useState({ ...user });
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"account"|"security"|"privacy">("account");
  const [passForm, setPassForm] = useState({ current:"", next:"", confirm:"" });

  function upd(k: keyof User, v: string | boolean) { setForm(f => ({...f,[k]:v})); setSaved(false); }

  return (
    <div className="flex flex-col min-h-full bg-[#EEF4FA]">
      <Header title="Configurações" onBack={onBack}/>
      <div className="bg-white border-b border-[#C8DFF0]">
        <div className="max-w-3xl mx-auto flex gap-1 px-4 py-3">
          {(["account","security","privacy"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-2 rounded-xl text-xs font-600 transition-all
                      ${tab===t ? "bg-[#2D7DD2] text-white" : "text-[#5A7A94] hover:bg-[#EEF4FA]"}`}>
              {t==="account"?"Conta":t==="security"?"Segurança":"Privacidade"}
            </button>
          ))}
        </div>
      </div>

      <div className="app-scroll flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 pt-4 space-y-4"
             style={{ paddingBottom: "calc(2rem + var(--sab))" }}>

        {tab==="account" && (
          <>
            <div className="bg-white rounded-2xl border border-[#C8DFF0] p-4 space-y-2">
              <SectionTitle>Registro da Plataforma</SectionTitle>
              {[
                { l:"Data de criação", v: user.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "—" },
                { l:"Último login",    v: user.lastLogin  ? new Date(user.lastLogin).toLocaleDateString("pt-BR")  : "—" },
              ].map((row,i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-[#EEF4FA] last:border-0">
                  <span className="text-[#5A7A94] text-sm">{row.l}</span>
                  <span className="text-[#1C2B3A] font-600 text-sm">{row.v}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5 space-y-4">
              <SectionTitle>Identidade</SectionTitle>
              <Field label="Nome completo" required>
                <Input type="text" value={form.name} onChange={e => upd("name",e.target.value)}/>
              </Field>
              <Field label="Nome Social" hint="Como prefere ser chamado(a) na plataforma">
                <Input type="text" value={form.socialName} onChange={e => upd("socialName",e.target.value)}/>
              </Field>
              <Field label="E-mail">
                <Input type="email" value={form.email} onChange={e => upd("email",e.target.value)}/>
              </Field>
            </div>
            <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5 space-y-4">
              <SectionTitle>Telefones</SectionTitle>
              <PhoneField label="Telefone principal" required value={form.phone1}
                          onChange={v => upd("phone1",v)} isWhatsapp={form.phone1Whatsapp}
                          onWhatsappChange={v => upd("phone1Whatsapp",v)}/>
              <PhoneField label="Telefone alternativo" value={form.phone2}
                          onChange={v => upd("phone2",v)} isWhatsapp={form.phone2Whatsapp}
                          onWhatsappChange={v => upd("phone2Whatsapp",v)}/>
            </div>
            <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5 space-y-4">
              <SectionTitle>Contato de emergência</SectionTitle>
              <Field label="Nome do contato">
                <Input type="text" placeholder="Ex: Ana Silva (filha)" value={form.emergencyContact || ""}
                       onChange={e => upd("emergencyContact",e.target.value)}/>
              </Field>
              <Field label="Telefone do contato">
                <Input type="tel" placeholder="(81) 99888-7766" value={form.emergencyPhone || ""}
                       onChange={e => upd("emergencyPhone",e.target.value)}/>
              </Field>
            </div>
            {saved && <Alert type="success"><IcoCheck/>Configurações salvas com sucesso!</Alert>}
            <Btn size="lg" onClick={() => { setSaved(true); onSave(form); }}>Salvar alterações</Btn>
          </>
        )}

        {tab==="security" && (
          <>
            <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5 space-y-4">
              <SectionTitle>Alterar Senha</SectionTitle>
              <Field label="Senha atual" required>
                <Input type="password" placeholder="••••••••" value={passForm.current}
                       onChange={e => setPassForm(f => ({...f,current:e.target.value}))}/>
              </Field>
              <Field label="Nova senha" required hint="Mínimo 6 caracteres">
                <Input type="password" placeholder="••••••••" value={passForm.next}
                       onChange={e => setPassForm(f => ({...f,next:e.target.value}))}/>
              </Field>
              <Field label="Confirmar nova senha" required>
                <Input type="password" placeholder="••••••••" value={passForm.confirm}
                       onChange={e => setPassForm(f => ({...f,confirm:e.target.value}))}/>
              </Field>
              <Btn size="lg" variant="secondary" onClick={() => setPassForm({current:"",next:"",confirm:""})}>
                Alterar senha
              </Btn>
            </div>
            <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5 space-y-3">
              <SectionTitle>Sessão</SectionTitle>
              <button onClick={onLogout}
                      className="w-full flex items-center gap-3 text-red-500 hover:bg-red-50 rounded-xl px-3 py-3 transition-colors active:scale-[0.98]">
                <IcoLogout/><span className="font-600 text-sm">Encerrar sessão</span>
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5 space-y-3">
              <SectionTitle>Conta</SectionTitle>
              <button className="w-full flex items-center gap-3 text-red-600 hover:bg-red-50 rounded-xl px-3 py-3 transition-colors">
                <IcoTrash/><span className="font-600 text-sm">Solicitar exclusão da conta</span>
              </button>
              <p className="text-xs text-[#5A7A94] px-3 leading-relaxed">
                A exclusão é verificada conforme prazo legal de retenção de dados (LGPD). Você receberá orientações por e-mail.
              </p>
            </div>
          </>
        )}

        {tab==="privacy" && (
          <>
            <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5 space-y-3">
              <SectionTitle>Meus consentimentos</SectionTitle>
              {[
                { label:"Política de Privacidade",     desc:"Li e estou ciente do tratamento de dados.",         on:true,  required:true  },
                { label:"Tratamento para agendamento", desc:"Uso dos dados para agendamento de consultas.",       on:true,  required:true  },
                { label:"Comunicações e lembretes",    desc:"Receber lembretes de consulta por WhatsApp/e-mail.",on:false, required:false },
              ].map((c,i) => (
                <div key={i} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-[#EEF4FA] border border-[#C8DFF0]">
                  <div className="flex-1">
                    <p className="font-600 text-[#1C2B3A] text-sm">{c.label}{c.required && <span className="text-red-500 ml-1 text-xs">(obrigatório)</span>}</p>
                    <p className="text-[#5A7A94] text-xs mt-0.5">{c.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${c.on?"bg-[#2D7DD2]":"bg-[#C8DFF0]"}`}>
                    {c.on && <span className="text-white"><IcoCheck/></span>}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={onPrivacy}
                    className="w-full flex items-center justify-between bg-white border border-[#C8DFF0] rounded-2xl px-4 py-4 hover:border-[#2D7DD2] transition-all active:scale-[0.98]">
              <div className="flex items-center gap-3">
                <span className="text-[#2D7DD2]"><IcoLock/></span>
                <div className="text-left">
                  <p className="font-700 text-[#1C2B3A] text-sm">Política de Privacidade e Direitos</p>
                  <p className="text-[#5A7A94] text-xs">Ver como seus dados são tratados</p>
                </div>
              </div>
              <IcoChevronR/>
            </button>
            <div className="bg-white rounded-2xl border border-[#C8DFF0] p-4">
              <p className="font-600 text-[#1C2B3A] text-sm mb-2">Exercer direitos (LGPD)</p>
              <p className="text-[#5A7A94] text-xs leading-relaxed mb-3">
                Você pode solicitar acesso, correção, portabilidade ou eliminação dos seus dados. Entre em contato via e-mail.
              </p>
              <a href="mailto:recifesaudavel@senac.br"
                 className="text-[#2D7DD2] text-sm font-600 hover:underline">
                recifesaudavel@senac.br →
              </a>
            </div>
          </>
        )}

        </div>
      </div>
      <Footer/>
    </div>
  );
}

// ─── PRIVACY SCREEN ───────────────────────────────────────────────────────────

function PrivacyScreen({ onBack }: { onBack: () => void }) {
  const items = [
    { t:"Controlador", b:"Projeto Recife Saudável — Polyana Fontes e Thayná Batista da Silva, Faculdade Senac PE, Recife." },
    { t:"Quais dados coletamos", b:"Nome, nome social, data de nascimento, e-mail, telefones, informações de saúde da pré-triagem (dados sensíveis conforme LGPD)." },
    { t:"Finalidade", b:"Viabilizar o agendamento de consultas e organizar o atendimento médico. Não usamos para diagnóstico automático nem para fins diferentes sem novo consentimento." },
    { t:"Compartilhamento", b:"Somente com a clínica parceira responsável pelo atendimento, limitado ao necessário." },
    { t:"Retenção", b:"Pelo tempo necessário ao atendimento e conforme exigências legais aplicáveis." },
    { t:"Proteção técnica", b:"HTTPS, autenticação, RBAC, auditoria de operações e princípio da necessidade de saber." },
    { t:"Seus direitos (LGPD)", b:"Acesso, correção, portabilidade, eliminação (quando juridicamente possível), revogação de consentimento e informação sobre compartilhamentos. Solicite em: recifesaudavel@senac.br" },
    { t:"RIPD", b:"O projeto considera a elaboração de Relatório de Impacto à Proteção de Dados (RIPD) para o tratamento de dados sensíveis previsto." },
    { t:"Dados fictícios no MVP", b:"O ambiente acadêmico opera exclusivamente com dados fictícios. Nenhum dado real de saúde é processado neste protótipo." },
  ];
  return (
    <div className="flex flex-col min-h-full bg-[#EEF4FA]">
      <Header title="Privacidade e Dados" onBack={onBack}/>
      <div className="app-scroll flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 pt-4 space-y-3"
             style={{ paddingBottom: "calc(2rem + var(--sab))" }}>
        <div className="bg-[#2D7DD2] rounded-2xl p-4 text-white">
          <p className="font-700 text-sm mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Política de Privacidade e Proteção de Dados</p>
          <p className="text-white/80 text-xs leading-relaxed">
            Dados de saúde são classificados como dados pessoais sensíveis pela LGPD (Lei nº 13.709/2018) e recebem proteção especial.
          </p>
        </div>
        {items.map((it,i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#C8DFF0] p-4">
            <p className="font-700 text-[#1C2B3A] text-sm mb-1.5"
               style={{ fontFamily: "'Poppins', sans-serif" }}>{it.t}</p>
            <p className="text-[#5A7A94] text-sm leading-relaxed">{it.b}</p>
          </div>
        ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
}

// ─── ADMIN PANEL (apenas para usuários isAdmin) ───────────────────────────────

function AdminPanel({ onBack }: { onBack: () => void }) {
  const [admins, setAdmins] = useState([
    { id:"adm-001", name:"Dr. Carlos Medeiros", email:"carlos@recifesaudavel.com", lastLogin:"03/09/2026" },
    { id:"adm-002", name:"Ana Beatriz Lima",     email:"ana@recifesaudavel.com",    lastLogin:"02/09/2026" },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [tab, setTab] = useState<"admins"|"audit">("admins");

  function removeAdmin(id: string) {
    if (admins.length <= 2) { alert("Mínimo de 2 administradores. Adicione outro antes de remover."); return; }
    setAdmins(a => a.filter(u => u.id !== id));
  }
  function addAdmin() {
    if (!newName || !newEmail) return;
    setAdmins(a => [...a, { id:`adm-${Date.now()}`, name:newName, email:newEmail, lastLogin:"—" }]);
    setNewName(""); setNewEmail(""); setShowAdd(false);
  }

  return (
    <div className="flex flex-col min-h-full bg-[#EEF4FA]">
      <Header title="Painel Administrativo" onBack={onBack}/>
      <div className="bg-white border-b border-[#C8DFF0]">
        <div className="max-w-3xl mx-auto flex gap-1 px-4 py-3">
          {(["admins","audit"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-2 rounded-xl text-xs font-600 transition-all
                      ${tab===t ? "bg-[#2D7DD2] text-white" : "text-[#5A7A94] hover:bg-[#EEF4FA]"}`}>
              {t==="admins"?"Administradores":"Auditoria"}
            </button>
          ))}
        </div>
      </div>
      <div className="app-scroll flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 pt-4 space-y-4"
             style={{ paddingBottom: "calc(2rem + var(--sab))" }}>

        {tab==="admins" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-700 text-[#1C2B3A] text-sm">Administradores ativos</p>
                <p className="text-[#5A7A94] text-xs">Mínimo obrigatório: 2 ADMs</p>
              </div>
              <span className={`text-sm font-700 px-3 py-1 rounded-full ${admins.length>=2?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>
                {admins.length} ADMs
              </span>
            </div>
            {admins.length<2 && <Alert type="error"><IcoAlert/>Menos de 2 ADMs ativos! Adicione urgentemente.</Alert>}
            <div className="space-y-2">
              {admins.map(adm => (
                <div key={adm.id} className="bg-white rounded-2xl border border-[#C8DFF0] p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF0E8] flex items-center justify-center flex-shrink-0 text-[#B5470A]"><IcoShield/></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-700 text-[#1C2B3A] text-sm truncate">{adm.name}</p>
                    <p className="text-[#5A7A94] text-xs truncate">{adm.email}</p>
                    <p className="text-[#5A7A94] text-xs">Último login: {adm.lastLogin}</p>
                  </div>
                  <button onClick={() => removeAdmin(adm.id)}
                          className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors">
                    <IcoTrash/>
                  </button>
                </div>
              ))}
            </div>
            {showAdd ? (
              <div className="bg-white rounded-2xl border-2 border-[#2D7DD2]/30 p-4 space-y-3">
                <p className="font-700 text-[#1C2B3A] text-sm">Novo Administrador</p>
                <Field label="Nome" required><Input type="text" value={newName} onChange={e => setNewName(e.target.value)}/></Field>
                <Field label="E-mail" required><Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}/></Field>
                <div className="flex gap-2">
                  <Btn variant="secondary" size="sm" onClick={() => setShowAdd(false)} className="flex-1">Cancelar</Btn>
                  <Btn size="sm" onClick={addAdmin} className="flex-1">Adicionar</Btn>
                </div>
              </div>
            ) : (
              <Btn variant="secondary" onClick={() => setShowAdd(true)} className="w-full">+ Adicionar administrador</Btn>
            )}
            <Alert type="warn">
              <IcoLock/>
              <span className="text-xs">Código de recuperação administrativa <strong>não é exibido no frontend</strong> conforme RN-015. Contate o suporte em caso de perda de acesso.</span>
            </Alert>
          </>
        )}

        {tab==="audit" && (
          <>
            <p className="text-xs text-[#5A7A94]">Registro somente leitura. Operações críticas auditadas automaticamente pelo servidor.</p>
            <div className="space-y-2">
              {MOCK_AUDIT.map(entry => (
                <div key={entry.id} className="bg-white rounded-2xl border border-[#C8DFF0] p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className={`text-xs font-700 px-2 py-0.5 rounded-full
                      ${entry.resultado==="SUCESSO"?"bg-green-100 text-green-700":"bg-red-100 text-red-600"}`}>
                      {entry.resultado}
                    </span>
                    <span className="text-xs text-[#5A7A94]">{entry.data}</span>
                  </div>
                  <p className="font-700 text-[#1C2B3A] text-sm">{entry.acao.replace(/_/g," ")}</p>
                  <p className="text-[#5A7A94] text-xs">Recurso: {entry.recurso}</p>
                  <p className="text-[#5A7A94] text-xs">Usuário: {entry.usuario}</p>
                </div>
              ))}
            </div>
          </>
        )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen]                   = useState<Screen>("welcome");
  const [user, setUser]                       = useState<User | null>(null);
  const [triagemData, setTriagemData]         = useState<TriagemData | null>(null);
  const [agendamentoData, setAgendamentoData] = useState<AgendamentoData | null>(null);
  const [appointments, setAppointments]       = useState<Appointment[]>(MOCK_APPOINTMENTS);

  function handleLogin(u: User)  { setUser(u); setScreen("dashboard"); }
  function handleLogout()        { setUser(null); setTriagemData(null); setScreen("welcome"); }

  function handleNavigate(s: Screen) {
    const needsAuth: Screen[] = ["dashboard","triagem","agendamento","appointments","settings","privacy","triagem-success","agendamento-success"];
    if (!user && needsAuth.includes(s)) { setScreen("login"); return; }
    setScreen(s);
  }

  function handleAgendamentoSuccess(d: AgendamentoData) {
    const newAppt: Appointment = {
      id: `c-${Date.now()}`, specialty: d.especialidade,
      professional: d.profissional || "A definir",
      date: d.dataDesejada ? new Date(d.dataDesejada+"T12:00").toLocaleDateString("pt-BR") : "—",
      time: d.horarioDesejado, patientName: d.nome, phone: d.telefone,
      status: "pending", createdAt: new Date().toLocaleDateString("pt-BR"),
    };
    setAgendamentoData(d);
    setAppointments(a => [newAppt, ...a]);
    setScreen("agendamento-success");
  }

  return (
    <div className="h-screen flex flex-col bg-[#EEF4FA] overflow-hidden"
         style={{ fontFamily: "'Nunito', sans-serif" }}>

      <FloatingMenu user={user} screen={screen} onNavigate={handleNavigate} onLogout={handleLogout}/>

      <div className="flex-1 flex flex-col overflow-hidden">
          {screen==="welcome"     && <WelcomeScreen onStart={() => setScreen("register")} onLogin={() => setScreen("login")}/>}
          {screen==="login"       && <LoginScreen onLogin={handleLogin} onRegister={() => setScreen("register")} onRecovery={() => setScreen("recovery")} onBack={() => setScreen("welcome")}/>}
          {screen==="recovery"    && <RecoveryScreen onBack={() => setScreen("login")}/>}
          {screen==="register"    && <RegisterScreen onRegister={handleLogin} onBack={() => setScreen("login")}/>}
          {screen==="dashboard" && user && <Dashboard user={user} onTriagem={() => setScreen("triagem")} onAgendamento={() => setScreen("agendamento")} onAppointments={() => setScreen("appointments")} onSettings={() => setScreen("settings")}/>}
          {screen==="triagem"     && <TriagemScreen onBack={() => setScreen("dashboard")} onSuccess={d => { setTriagemData(d); setScreen("triagem-success"); }}/>}
          {screen==="triagem-success" && <TriagemSuccess onDashboard={() => setScreen("dashboard")} onAgendamento={() => setScreen("agendamento")}/>}
          {screen==="agendamento" && user && <AgendamentoScreen user={user} triagemData={triagemData} onBack={() => setScreen("dashboard")} onSuccess={handleAgendamentoSuccess}/>}
          {screen==="agendamento-success" && agendamentoData && <AgendamentoSuccess data={agendamentoData} onDashboard={() => setScreen("dashboard")} onAppointments={() => setScreen("appointments")}/>}
          {screen==="appointments"  && <AppointmentsScreen onBack={() => setScreen("dashboard")} initialAppts={appointments}/>}
          {screen==="settings"  && user && <SettingsScreen user={user} onBack={() => setScreen("dashboard")} onSave={u => setUser(u)} onPrivacy={() => setScreen("privacy")} onLogout={handleLogout}/>}
          {screen==="privacy"     && <PrivacyScreen onBack={() => setScreen(user ? "settings" : "welcome")}/>}
          {user?.isAdmin && screen==="admin" && <AdminPanel onBack={() => setScreen("dashboard")}/>}
        </div>
    </div>
  );
}
