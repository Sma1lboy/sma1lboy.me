# Why WebAssembly (WASM)

## Background

WebAssembly (abbreviated as Wasm) is a low-level, binary instruction format designed to run code at near-native speed in web browsers. It was created to address performance limitations and platform constraints of traditional web development, where JavaScript was the only supported language for running logic in the browser.

With the rise of complex applications like video editors, games, CAD software, and even full programming language interpreters running inside browsers, the limitations of JavaScript's performance and single-language ecosystem became more apparent. Developers needed a way to bring existing native code (written in C, C++, Rust, etc.) to the web while maintaining performance and safety.

Wasm provides a solution by acting as a portable compilation target for many programming languages. It runs in a safe, sandboxed environment within modern browsers, ensuring both speed and security.

## What Problem Does WebAssembly Solve?

### 1. Web Performance Bottlenecks

JavaScript, being dynamically typed and interpreted, isn't optimal for performance-intensive tasks such as graphics rendering, simulation, or large-scale data processing. Even with modern JIT compilers, it struggles to match the raw speed of compiled languages.

**Wasm Solution**: WebAssembly is a statically typed, binary format designed for efficient execution. It allows developers to compile high-performance languages like C/C++ and Rust into modules that execute close to native speed.

### 2. Single Language Limitation

Web applications traditionally required all logic to be written in JavaScript, making it hard to reuse existing native libraries or codebases.

**Wasm Solution**: Developers can now write programs in multiple languages and compile them to WebAssembly, allowing the reuse of robust and mature native code within the web ecosystem.

### 3. Security and Isolation

Browser plugins like Flash or Java Applets offered extended capabilities but posed significant security risks. There was a need for a safer, more controllable alternative.

**Wasm Solution**: WebAssembly runs in a secure sandboxed environment enforced by the browser, providing strong guarantees around memory and execution safety.

### 4. Cross-Platform Portability

Native applications often need to be rebuilt and adapted for each platform, increasing maintenance cost.

**Wasm Solution**: WebAssembly modules are platform-independent and can run in any environment that supports Wasm, including all modern browsers, Node.js, and edge computing platforms.

## How Does WebAssembly Work?

WebAssembly is not traditional assembly or machine code. Instead, it's a virtual machine-level instruction set that sits between source languages and the browser. Here's how it works:

- You write code in a source language (e.g., C, C++, Rust)
    
- You compile it to `.wasm` using a tool like Emscripten (for C/C++)
    
- The browser loads and executes the `.wasm` module inside its Wasm VM
    
- The VM compiles the WebAssembly bytecode to native machine code at runtime (JIT or AOT)
    

This model allows for both performance and portability.

## Real-World Use Cases of WebAssembly

- **Figma**: A collaborative UI design tool that compiles C++ rendering logic into Wasm
    
- **AutoCAD Web**: Ported native CAD logic to the web via Wasm
    
- **Adobe Photoshop Web**: Uses Wasm to handle image processing efficiently
    
- **FFmpeg.wasm**: Run video/audio processing directly in browser
    
- **Games/Emulators**: Run old console games or DOS apps inside browsers using Wasm
    
- **Pyodide**: A Python interpreter compiled to Wasm that runs Python code in-browser
    

## A Minimal C Example to Hello WebAssembly

```c
#include <stdio.h>

int main() {
  printf("Hello, WebAssembly!\n");
  return 0;
}
```

Using Emscripten, compile this code:

```bash
emcc hello.c -o hello.html
```

This generates:

- `hello.html` - A ready-to-run HTML page
    
- `hello.js` - JavaScript glue code
    
- `hello.wasm` - Compiled WebAssembly binary
    

Run it with:

```bash
python3 -m http.server 8080
```

Then visit: `http://localhost:8080/hello.html`

## Summary

WebAssembly was created to solve the performance, flexibility, and portability limitations of the web. By enabling high-performance, multi-language code execution in browsers, Wasm is reshaping the boundaries of what web applications can do.

Whether you're porting an existing native app to the web, improving performance in browser-based tools, or building entirely new kinds of applications, WebAssembly opens a new frontier for development.