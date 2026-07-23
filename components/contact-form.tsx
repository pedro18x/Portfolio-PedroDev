"use client";

import {
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useMorphingText } from "./use-morphing-text";

type FieldName = "name" | "email" | "message";
type Phase = "idle" | "sending" | "sent";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MESSAGES: Record<FieldName, string> = {
  name: "Please enter your name.",
  email: "Enter a valid email address.",
  message: "Please write a short message.",
};

function validate(field: FieldName, value: string): string | undefined {
  const v = value.trim();
  if (field === "email") return EMAIL_RE.test(v) ? undefined : MESSAGES.email;
  return v ? undefined : MESSAGES[field];
}

/** Check desenhado por traço (stroke-dashoffset), ver .check-draw em globals.css */
function CheckDraw() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="check-draw size-4"
      aria-hidden="true"
    >
      <path d="M4.5 12.5l5 5 10.5-11.5" pathLength={1} />
    </svg>
  );
}

const inputClasses =
  "field-input text-base focus-visible:ring-0 aria-invalid:ring-0 md:text-[0.9375rem]";

interface ContactFieldProps {
  id: string;
  name: FieldName;
  label: string;
  error?: string;
  children: ReactNode;
}

/**
 * Campo no padrão shadcn (Field + data-invalid/aria-invalid) mantendo a
 * linguagem do site: rótulo mono em caixa alta, hairline inferior e o
 * sublinhado de foco que cresce da esquerda (.focus-line).
 */
function ContactField({ id, name, label, error, children }: ContactFieldProps) {
  return (
    <Field
      className="field gap-1.5 data-[invalid=true]:text-foreground"
      data-invalid={error ? true : undefined}
    >
      {/* Vermelho só na borda do campo e no texto de ajuda; rótulo fica em ink */}
      <FieldLabel
        htmlFor={id}
        className="font-mono text-[0.6875rem] font-normal uppercase tracking-[0.08em] text-faint transition-colors duration-150 [.field:focus-within_&]:text-foreground"
      >
        {label}
      </FieldLabel>
      {children}
      <div className="min-h-[1.1rem]">
        {error && (
          <FieldError id={`${id}-error`} className="text-[0.8125rem] leading-tight">
            {error}
          </FieldError>
        )}
      </div>
    </Field>
  );
}

/**
 * Formulário de contato: validação inline (após blur, depois em tempo real),
 * envio via /api/contact (Resend), botão que morfa para spinner e depois
 * desenha um check no sucesso — sem toasts.
 */
export function ContactForm() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const { text: buttonText, morphing, morph } = useMorphingText("Send message");

  // Segurar para enviar: a tinta inunda o botão durante a pressão (700ms);
  // soltar cedo volta com a mola e ensina o gesto. Teclado (click detail 0)
  // e movimento reduzido enviam com clique simples.
  const formRef = useRef<HTMLFormElement>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdDone = useRef(false);
  const reducedRef = useRef(false);
  const [holding, setHolding] = useState(false);
  const [hint, setHint] = useState("");

  useEffect(() => {
    // a preferência pode mudar no meio da sessão: assinar, não amostrar
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    const onChange = () => {
      reducedRef.current = mq.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function startHold() {
    if (phase !== "idle" || reducedRef.current) return;
    holdDone.current = false;
    setHolding(true);
    holdTimer.current = setTimeout(() => {
      holdDone.current = true;
      setHolding(false);
      formRef.current?.requestSubmit();
    }, 700);
  }

  function endHold() {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    setHolding((was) => {
      if (was && !holdDone.current) setHint("Hold to send, or press again.");
      return false;
    });
  }

  // Cliques de ponteiro não submetem direto (o gesto é segurar), MAS uma
  // segunda ativação em 2s passa: VoiceOver/Voice Control/Switch Control
  // sintetizam toques curtos que jamais completariam os 700ms — sem esta
  // porta o formulário seria impossível para essas tecnologias. Teclado
  // (detail === 0) e movimento reduzido submetem normalmente.
  const lastBlockedAt = useRef(0);
  function guardClick(event: MouseEvent<HTMLButtonElement>) {
    if (reducedRef.current || event.detail === 0) return;
    const now = performance.now();
    if (now - lastBlockedAt.current < 2000) {
      lastBlockedAt.current = 0;
      return; // segunda ativação: deixa o clique submeter
    }
    lastBlockedAt.current = now;
    event.preventDefault();
  }

  // "Recompensa cedo, cobra tarde": sair de um campo VAZIO não gera erro
  // (obrigatoriedade só é cobrada no envio); sair com conteúdo inválido
  // (ex. email malformado) mostra o erro na hora.
  function handleBlur(field: FieldName, value: string) {
    if (!value.trim()) return;
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validate(field, value) }));
  }

  function handleChange(field: FieldName, value: string) {
    if (!touched[field]) return;
    setErrors((e) => ({ ...e, [field]: validate(field, value) }));
  }

  // Enter num campo de linha única avança para o próximo em vez de submeter
  // o formulário inteiro (evita o "tudo vermelho" acidental); enviar é ação
  // explícita do botão.
  function focusNextOnEnter(next: FieldName) {
    return (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      (event.currentTarget.form?.elements.namedItem(next) as HTMLElement | null)?.focus();
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase !== "idle") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    const nextErrors = {
      name: validate("name", values.name),
      email: validate("email", values.email),
      message: validate("message", values.message),
    };
    setTouched({ name: true, email: true, message: true });
    setErrors(nextErrors);

    const firstInvalid = (Object.keys(nextErrors) as FieldName[]).find((k) => nextErrors[k]);
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }

    setPhase("sending");
    setStatus("");
    setHint("");
    morph("Sending…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setPhase("sent");
      morph("");
      setStatus("Thanks, I'll get back to you soon.");
      form.reset();
      setTouched({});
      setErrors({});
      setTimeout(() => {
        morph("Send message");
        setStatus("");
        setPhase("idle");
      }, 2600);
    } catch {
      morph("Send message");
      setStatus("Something went wrong. Please email me instead.");
      setPhase("idle");
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FieldGroup className="gap-3">
        {/* Nome e email lado a lado quando a COLUNA comporta (variante de
            contêiner): com o rail ao lado, viewport largo ≠ coluna larga */}
        <div className="grid gap-3 @lg:grid-cols-2 @lg:gap-4">
          <ContactField
            id="contact-name"
            name="name"
            label="Name"
            error={touched.name ? errors.name : undefined}
          >
            <Input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              aria-invalid={touched.name && errors.name ? true : undefined}
              aria-describedby={touched.name && errors.name ? "contact-name-error" : undefined}
              className={inputClasses}
              onBlur={(e) => handleBlur("name", e.currentTarget.value)}
              onChange={(e) => handleChange("name", e.currentTarget.value)}
              onKeyDown={focusNextOnEnter("email")}
            />
          </ContactField>
          <ContactField
            id="contact-email"
            name="email"
            label="Email"
            error={touched.email ? errors.email : undefined}
          >
            <Input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={touched.email && errors.email ? true : undefined}
              aria-describedby={touched.email && errors.email ? "contact-email-error" : undefined}
              className={inputClasses}
              onBlur={(e) => handleBlur("email", e.currentTarget.value)}
              onChange={(e) => handleChange("email", e.currentTarget.value)}
              onKeyDown={focusNextOnEnter("message")}
            />
          </ContactField>
        </div>
        <ContactField
          id="contact-message"
          name="message"
          label="Message"
          error={touched.message ? errors.message : undefined}
        >
          <Textarea
            id="contact-message"
            name="message"
            required
            aria-invalid={touched.message && errors.message ? true : undefined}
            aria-describedby={
              touched.message && errors.message ? "contact-message-error" : undefined
            }
            className={cn(inputClasses, "min-h-[6.5rem] resize-y")}
            onBlur={(e) => handleBlur("message", e.currentTarget.value)}
            onChange={(e) => handleChange("message", e.currentTarget.value)}
          />
        </ContactField>
      </FieldGroup>

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={phase !== "idle"}
          data-holding={holding ? "true" : undefined}
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerCancel={endHold}
          onPointerLeave={endHold}
          onClick={guardClick}
          className="relative min-w-[9rem] rounded-md text-[0.9375rem] transition-transform duration-[272ms] [transition-timing-function:var(--spring)] active:scale-[0.98] active:duration-100 active:ease-out disabled:opacity-100"
        >
          <span
            className={cn(
              "morphable inline-flex items-center justify-center gap-2",
              morphing && "morphing",
            )}
          >
            {phase === "sending" && (
              <Spinner data-icon="inline-start" className="[animation-duration:600ms]" />
            )}
            {phase === "sent" ? <CheckDraw /> : buttonText}
          </span>
          {/* A tinta que inunda durante a pressão (ver .holdfill) */}
          {phase === "idle" && (
            <span className="holdfill" aria-hidden="true">
              Send message
            </span>
          )}
        </Button>
        <p role="status" className="min-h-[1.4em] text-sm text-muted-foreground">
          {status || hint}
        </p>
      </div>
    </form>
  );
}
