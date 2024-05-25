import ReactDOMServer from 'react-dom/server';

export async function render() {
  const html = ReactDOMServer.renderToString(<div>Hello world!</div>);
  return { html };
}
