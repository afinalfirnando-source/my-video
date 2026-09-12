fetch("http://localhost:11434/api/health")
  .then((r) => r.text())
  .then((t) => console.log("Ollama API:", t))
  .catch((e) => console.log("Ollama not reachable:", e.message));
