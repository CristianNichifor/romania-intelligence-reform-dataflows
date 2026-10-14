import { defineConfig } from 'vitest/config'
export default defineConfig({ test: { include: ['src/**/*.test.ts', 'functions/**/*.test.mjs', 'tests/unit/**/*.test.mjs'] } })
