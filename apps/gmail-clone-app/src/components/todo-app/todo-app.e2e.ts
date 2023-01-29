import { newE2EPage } from '@stencil/core/testing'

describe('example', () => {
  it('should render a foo-component', async () => {
    const page = await newE2EPage()
    await page.setContent(`<todo-app></todo-app>`)
    const el = await page.find('todo-app')

    expect(el.shadowRoot).toEqualHtml(getContent())
    expect(el).not.toBeNull()
  })
})
function getContent(): string {
  return `<div>
        <div class="nav-desktop">
          <slot></slot>
        </div>
      </div>`
}
