// /lib/fakeAuth.ts
export function login(username: string) {
  localStorage.setItem("user", username);
}

export function logout() {
  localStorage.removeItem("user");
}

export function getUser() {
  return localStorage.getItem("user");
}
