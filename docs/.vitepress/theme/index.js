import DefaultTheme from 'vitepress/theme'
import flipStyles from '../../public/flip.min.css?inline'

if (typeof window !== 'undefined') {
    customElements.define('flip-preview', class extends HTMLElement {
        connectedCallback() {
            const rawHtml = this.innerHTML
            this.innerHTML = ''

            const shadow = this.attachShadow({mode: 'open'})

            const processedStyles = flipStyles
                .replaceAll(':root', ':host')

            const styleElement = document.createElement('style')
            styleElement.textContent = processedStyles
            shadow.appendChild(styleElement)

            // Presentation wrapper layout
            const container = document.createElement('div')
            container.style.padding = '1.5rem'
            container.style.border = '1px solid rgba(128, 128, 128, 0.15)'
            container.style.borderRadius = '8px'
            container.style.display = 'flex'
            container.style.gap = '0.75rem'
            container.style.alignItems = 'center'
            container.style.flexWrap = 'wrap'
            container.style.background = 'var(--vp-c-bg-soft, #f6f6f7)'

            container.innerHTML = rawHtml
            shadow.appendChild(container)
        }
    })
}

export default {
    extends: DefaultTheme
}