import testOutput from './test-module'

try {
    document.querySelector('h1').innerHTML = String(testOutput)
} catch (err) {}

export const es6Module = testOutput
export function out(x) {return x}