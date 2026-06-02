const { betterAuth } = require("better-auth");
const { emailOTP } = require("better-auth/plugins");
const auth = betterAuth({
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },
  plugins: [emailOTP({ async sendVerificationOTP() {} })]
});
console.log("Registered endpoints:", Object.keys(auth.api).filter(k => auth.api[k].path));
