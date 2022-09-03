import { Component, h } from '@stencil/core'

@Component({
  tag: 'app-features',
  styleUrl: 'app-features.scss',
  shadow: true
})
export class AppFeatures {
  render() {
    return (
      <div class="container">
        <section>
          <h1>About</h1>
          <p>
            This app is a mock of Gmail app created using{' '}
            <a href="https://stenciljs.com/">Stencil.js</a>
          </p>
          <p>
            Its using a mock local server - <a href="https://miragejs.com/">Mirage.js</a> and using{' '}
            <a href="https://fakerjs.dev/">Faker.js</a> for mock data
          </p>
        </section>

        <section>
          <h1>Features</h1>
          <h4>Starred Emails</h4>
          <ul>
            <li>Can star/unstar emails</li>
            <li>Sidebar having option to show starred emails only</li>
          </ul>

          <h4>Delete Email</h4>
          <ul>
            <li>Desktop only - hover on email to see Delete button</li>
            <li>
              Mobile only - click on Avatar to select email or tap and hold on email to select, then
              click delete button to delete emails
            </li>
          </ul>
        </section>
      </div>
    )
  }
}
