"use client";
import { useEffect, useState } from "react";
import initSwc, { transformSync } from "@swc/wasm-web";

export default function App() {
  const [initialized, setInitialized] = useState(false);

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
    const result = transformSync(`const a = 1;console.log(a)`, {});

    console.log(result);
  }

  return (
    <div className="App">
      <button onClick={compile}>Compile</button>
    </div>
  );
}
