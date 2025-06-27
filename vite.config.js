module.exports = async () => {
  const { defineConfig } = await import("vite");
  const react = await import("@vitejs/plugin-react");

  return defineConfig({
    plugins: [react.default()],
    build: {
      outDir: "../build",
    },
  });
};
