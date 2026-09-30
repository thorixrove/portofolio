import { useState, useRef, useCallback } from 'react';

const ROWS = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
    [',', 'space', '.', 'enter'],
];

const LABELS = { backspace: '⌫', enter: '⏎', space: '' };
const ALL_KEYS = new Set(ROWS.flat());
const MAX_CHARS = 32;

const normalize = (key) => (key === ' ' ? 'space' : key.toLowerCase());

const Keyboard = () => {
    const [text, setText] = useState('')
    const [pressed, setPressed] = useState(() => new Set())
    const [focused, setFocused] = useState(false)
    const rootRef = useRef(null)

    const press = useCallback((id) => {
        setText((prev) => {
            if (id === 'backspace') return prev.slice(0, -1)
            if (id === 'enter') return ''
            const next = prev + (id === 'space' ? ' ' : id)
            return next.slice(-MAX_CHARS)
        })
    }, [])

    const light = (id, on) =>
        setPressed((prev) => {
            const next = new Set(prev)
            on ? next.add(id) : next.delete(id)
            return next
        })

    const handleKeyDown = (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return
        if (!ALL_KEYS.has(id)) return
        e.preventDefault()
        light(id, true)
        press(id)
    }

    const handleKeyUp = (e) => {
        const id = normalize(e.key)
        if (ALL_KEYS.has(id)) light(id, false)
    }


    return (
        <div
            ref={rootRef}
            className={`kb-root ${focused ? 'kb-root--focus' : ''}`}
            tabIndex={0}
            role="application"
            aria-label="Keyboard interaktif, ketik apa saja"
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onFocus={() => setFocused(true)}
            onBlur={() => {
                setFocused(false);
                setPressed(new Set());
            }}
        >
            <div className="kb-screen" aria-live="polite">
                {text || !focused ? (
                    <span className={text ? 'kb-text' : 'kb-placeholder'}>
                        {text || 'Click what do you want'}
                    </span>
                ) : null}
                {focused && <span className="kb-caret" />}
            </div>

            <div className="kb-board">
                {ROWS.map((row, i) => (
                    <div key={i} className={`kb-row kb-row--${i + 1}`}>
                        {row.map((id) => (
                            <button
                                key={id}
                                type="button"
                                tabIndex={-1}
                                aria-label={id}
                                className={`kb-key kb-key--${id === ',' ? 'comma' : id === '.' ? 'dot' : id} ${pressed.has(id) ? 'kb-key--down' : ''
                                    }`}
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    rootRef.current?.focus();
                                    light(id, true);
                                    press(id);
                                }}
                                onPointerUp={() => light(id, false)}
                                onPointerLeave={() => light(id, false)}
                                onPointerCancel={() => light(id, false)}
                            >
                                {LABELS[id] ?? id}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Keyboard
