import jsdom from 'jsdom'

const { JSDOM } = jsdom;

const { document } = (new JSDOM('')).window;
global.document = document;
global.window = document.defaultView;
global.navigator = { userAgent: 'node.js' };
