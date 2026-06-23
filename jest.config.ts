import nextJest from "next/jest.js"
import type { Config } from "jest"

const createJestConfig = nextJest({
  dir: "./",
})

const config: Config = {
  clearMocks: true,
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "components/icons/**/*.{ts,tsx}",
    "components/layout/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "auth.ts",
    "proxy.ts",
    "!**/*.d.ts",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/tests/",
    "app/layout.tsx",
    "components/theme-provider.tsx",
    "components/ui/",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  testMatch: ["<rootDir>/tests/unit/**/*.test.{ts,tsx}"],
}

export default createJestConfig(config)
