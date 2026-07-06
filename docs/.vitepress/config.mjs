import {defineConfig} from 'vitepress'
import fs from 'fs'
import path from 'path'

function getSidebarComponents() {
    const componentsDir = path.resolve(process.cwd(), 'docs/components')
    if (!fs.existsSync(componentsDir)) return []

    return fs.readdirSync(componentsDir)
        .filter(file => file.endsWith('.md'))
        .map(file => {
            const name = file.replace('.md', '')
            const displayName = name
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')

            return {text: displayName, link: `/components/${name}`}
        })
}

export default defineConfig({
    title: "Flip",
    description: "CSS-only component library documentation",
    themeConfig: {
        nav: [
            {text: 'Home', link: '/'},
            {text: 'Components', link: '/components/buttons'}
        ],
        sidebar: [
            {
                text: 'Components',
                items: getSidebarComponents()
            }
        ]
    }
})