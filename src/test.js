class SupercellAuthService {
  constructor() {
    this.baseUrl = 'https://id.supercell.com/api';
    this.headers = null;
  }

  async login(email, game) {
    this.headers = {
      "User-Agent": `scid/4543 (Android; ${game}-prod)`,
      "Authorization": '',
    };

    const loginData = {
      lang: 'ru',
      email: email,
      remember: "true",
      game: game,
      env: "prod",
    };

    try {
      await fetch(`${this.baseUrl}/ingame/account/login`, {
        method: 'POST',
        headers: this.headers,
        body: new URLSearchParams(loginData),
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  async codeValidate(email, code) {
    const pinData = { email: email, pin: code };

    try {
      const response = await fetch(`${this.baseUrl}/ingame/account/login.confirm`, {
        method: 'POST',
        headers: this.headers,
        body: new URLSearchParams(pinData),
      });

      const content = await response.json();
      const ok = content.ok;
      const error = content.error;

      return [ok, error];
    } catch (error) {
      console.error('Code validation error:', error);
      return [false, 'Network error'];
    }
  }
}

// Usage example:
const authService = new SupercellAuthService();
await authService.login('shesterovmm@gmail.com', 'laser');