"use client";
import React, { useEffect, useState } from "react";
import initSwc, { transformSync } from "@swc/wasm-web";
export function compose<T>(...functions: ((...args: T[]) => T)[]) {
  return functions.reduce(
    (acc, currentFn) =>
      (...args: T[]) =>
        acc(currentFn(...args))
  );
}
const wrapReturn = (code: string) => `return (${code})`;
const trimCode = (code: string) => code.trim().replace(/;$/, "");

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [fnStr, setFnStr] = useState<string>()

  useEffect(() => {
    async function importAndRunSwcOnMount() {
      await initSwc();
      setInitialized(true);
    }
    importAndRunSwcOnMount();
  }, []);

  function compile() {
    if (!initialized) {
      return;
    }
    const result = transformSync(`() => <div>hello world</div>`, {
      "jsc": {
        "parser": {
          "syntax": "typescript",
          "tsx": true,
          "decorators": false,
          "dynamicImport": false
        }
      }
    });
    const code = result.code
    const transformed = compose<string>(trimCode, wrapReturn, trimCode)(code)
    console.log(transformed)
    setFnStr(transformed)
  }

  const Com = fnStr ? (new Function('React', fnStr))(React) : null
  const preview = (Com: unknown) => {
    if (React.isValidElement(Com)) return Com
    else if (typeof Com === 'function' && React.isValidElement(Com())) return Com()
    else return null

  }

  console.log(typeof Com)

  return (
    <div className="App">
      <button onClick={compile}>Compile</button>
      {preview(Com)}
    </div>
  );
}
