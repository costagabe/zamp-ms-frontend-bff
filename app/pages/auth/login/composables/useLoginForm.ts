export function useLoginForm() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const form = reactive({ email: "", password: "", remember: false });
  const loading = ref(false);
  const showPassword = ref(false);
  const errorMessage = ref("");

  async function handleLogin() {
    errorMessage.value = "";
    loading.value = true;

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    loading.value = false;

    if (error) {
      errorMessage.value = error.message.includes("Invalid login credentials")
        ? "E-mail ou senha inválidos. Verifique suas credenciais."
        : error.message;
      return;
    }

    router.push("/");
  }

  return { form, loading, showPassword, errorMessage, handleLogin };
}
