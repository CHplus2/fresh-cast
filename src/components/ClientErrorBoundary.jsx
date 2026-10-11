import { Component } from 'react';

export default class ClientErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <main className="client-message" role="alert">
      <h1>This page could not be displayed</h1>
      <p>Reload to try again. Planning comparisons do not change orders or stock.</p>
      <button onClick={() => window.location.reload()}>Reload page</button>
    </main>;
    return this.props.children;
  }
}
