// stores/auth.ts
import { defineStore } from "pinia";
import axios from "axios";
import { useUrl } from "./url";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loggedIn: false,
    loginError: null,
    rBalance: 0,
    bBalance: 0,
    registerError: "",
  }),

  actions: {
    async checkSession() {
      const { url } = useUrl();

      try {
        const res = await axios.get(`${url}/api/check-session`, {
          withCredentials: true,
        });

        if (res.data.loggedIn) {
          this.user = res.data.user;
          this.loggedIn = true;
          this.bBalance = this.user.bBalance;
          this.rBalance = this.user.rBalance;
          return true;
        }

        this.user = null;
        this.loggedIn = false;
        return false;
      } catch {
        this.user = null;
        this.loggedIn = false;
        return false;
      }
    },

    async logout() {
      const { url } = useUrl();
      await axios.get(`${url}/api/logout`, { withCredentials: true });
      this.user = null;
      this.loggedIn = false;
    },

    async submitLogin(form) {
      const { url } = useUrl();
      this.loginError = null;

      try {
        const res = await axios.post(
          `${url}/api/login`,
          {
            phone: form.phone.trim(),
            password: form.password,
          },
          { withCredentials: true }
        );
        alert(JSON.stringify(res.data));
        if (!res.data.success) {
          this.loginError = res.data.message;
          return false;
        }

        const ok = await this.checkSession();
        return ok;
      } catch (e) {
        this.loginError = "Network error";
        return false;
      }
    },
    async register(form) {
      const { url } = useUrl();

      this.registerError = "";

      const res = await axios.post(
        `${url}/api/register`,
        {
          phone: form.phone,
          password: form.password,
          confirmPassword: form.confirmPassword,
        },
        {
          withCredentials: true,
        }
      );

      if (!res.data.success) {
        this.registerError = res.data.message;

        return;
      } else {
        const ok = await this.checkSession();
        return ok;
      }
    },
  },
});
