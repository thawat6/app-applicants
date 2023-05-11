import config from "@/config";

export default function ({ $axios, redirect, $toast, $auth, $store }, inject) {
  const loggedInApi = $axios.create({
    baseURL: config.apiUrl,
    credentials: true,
  });

  inject("loggedInApi", loggedInApi);
}
