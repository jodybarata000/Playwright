import type { BrowserContext, ConsoleMessage, Request, Response, TestInfo, WebError } from '@playwright/test';

// shortcut: logs stop at 200 events per test; raise the cap if noisy failures hide later errors.
const maxEntries = 200;

function safeUrl(value: string): string {
  try {
    const url = new URL(value);
    return url.origin === 'null' ? url.protocol : `${url.origin}${url.pathname}`;
  } catch {
    return '[invalid URL]';
  }
}

export function installBrowserDiagnostics(context: BrowserContext) {
  const entries: string[] = [];
  let omittedEntries = 0;
  const record = (entry: string): void => {
    if (entries.length >= maxEntries) {
      omittedEntries += 1;
      return;
    }
    entries.push(`${new Date().toISOString()} ${entry}`);
  };

  const onConsole = (message: ConsoleMessage): void => {
    if (message.type() !== 'error') return;
    const { url, lineNumber, columnNumber } = message.location();
    const location = url ? ` at ${safeUrl(url)}:${lineNumber}:${columnNumber}` : '';
    record(`[console.error] ${message.text()}${location}`);
  };
  const onWebError = (webError: WebError): void => {
    const { url, line, column } = webError.location();
    const location = url ? ` at ${safeUrl(url)}:${line}:${column}` : '';
    const error = webError.error();
    record(`[page.error] ${error.stack ?? error.message}${location}`);
  };
  const onRequestFailed = (request: Request): void => {
    const reason = request.failure()?.errorText ?? 'unknown failure';
    record(`[request.failed] ${request.method()} ${safeUrl(request.url())}: ${reason}`);
  };
  const onResponse = (response: Response): void => {
    if (response.status() < 400) return;
    record(`[http.${response.status()}] ${response.request().method()} ${safeUrl(response.url())}`);
  };

  context.on('console', onConsole);
  context.on('weberror', onWebError);
  context.on('requestfailed', onRequestFailed);
  context.on('response', onResponse);

  return async (testInfo: TestInfo): Promise<void> => {
    context.off('console', onConsole);
    context.off('weberror', onWebError);
    context.off('requestfailed', onRequestFailed);
    context.off('response', onResponse);

    if (!entries.length || testInfo.status === testInfo.expectedStatus) return;

    const omitted = omittedEntries ? `\n[${omittedEntries} additional diagnostics omitted]` : '';
    await testInfo.attach('browser-diagnostics.log', {
      body: Buffer.from(`${entries.join('\n')}${omitted}`, 'utf8'),
      contentType: 'text/plain',
    });
  };
}
