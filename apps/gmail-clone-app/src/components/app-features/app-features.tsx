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
            This app is a mock of Gmail app created using <b>Stencil.js</b>
          </p>
          <p>
            Its using a mock local server - <b>Mirage.js</b> and using <b>Faker.js</b> for mock data
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
          </ul>
        </section>
      </div>
    )
  }
}
