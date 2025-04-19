module.exports = {
  configPath: "./src/auth/auth.ts",
  database: {
    provider: "postgres",
    url: process.env.DATABASE_URL,
  },
}; 