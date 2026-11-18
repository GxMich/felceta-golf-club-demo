// Resolves once the opening brand sequence has lifted (immediately when reduced motion is requested).
let resolveIntro: () => void = () => {}
let finished = false
export const introDone = new Promise<void>(resolve => { resolveIntro = resolve })
export const finishIntro = () => { finished = true; resolveIntro() }
export const isIntroFinished = () => finished
