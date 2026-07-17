'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Troca de texto com crossfade mascarado por blur (técnica emil-design-eng):
 * o texto atual desfoca e esmaece por ~110ms, é substituído, e volta ao foco.
 * Use `className="morphable"` + o `morphing` retornado no elemento do texto.
 */
export function useMorphingText(initial: string) {
  const [text, setText] = useState(initial);
  const [morphing, setMorphing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const morph = useCallback((next: string) => {
    setMorphing(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setText(next);
      setMorphing(false);
    }, 110);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { text, morphing, morph };
}
