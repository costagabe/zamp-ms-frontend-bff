<template>
  <div>
    <UAlert
      v-if="errorMessage"
      color="error"
      variant="soft"
      icon="i-lucide-circle-alert"
      :description="errorMessage"
      class="mb-5"
    />

    <form @submit.prevent="handleLogin" class="space-y-5">
      <FormFields
        v-model:email="email"
        v-model:password="password"
        :errors="{ email: errors.email, password: errors.password }"
        :show-password="showPassword"
        @toggle-password="showPassword = !showPassword"
      />
      <FormActions v-model:remember="remember" :loading="loading" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import FormFields from "./components/FormFields.vue";
import FormActions from "./components/FormActions.vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

const props = withDefaults(
  defineProps<{
    initialValues?: Partial<LoginFormValues> | null;
  }>(),
  {
    initialValues: null,
  },
);

const supabase = useSupabaseClient();
const router = useRouter();

const loading = ref(false);
const showPassword = ref(false);
const errorMessage = ref("");

const schema = toTypedSchema(
  z.object({
    email: z.string().trim().email("Informe um e-mail válido"),
    password: z.string().min(1, "Informe sua senha"),
    remember: z.boolean(),
  }),
);

const { handleSubmit, errors, defineField, resetForm } =
  useForm<LoginFormValues>({
    validationSchema: schema,
    initialValues: {
      email: props.initialValues?.email ?? "",
      password: props.initialValues?.password ?? "",
      remember: props.initialValues?.remember ?? false,
    },
  });

const [email] = defineField("email");
const [password] = defineField("password");
const [remember] = defineField("remember");

watch(
  () => props.initialValues,
  (values) => {
    resetForm({
      values: {
        email: values?.email ?? "",
        password: values?.password ?? "",
        remember: values?.remember ?? false,
      },
    });
  },
  { immediate: true },
);

const handleLogin = handleSubmit(async (values) => {
  errorMessage.value = "";
  loading.value = true;

  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  loading.value = false;

  if (error) {
    errorMessage.value = error.message.includes("Invalid login credentials")
      ? "E-mail ou senha inválidos. Verifique suas credenciais."
      : error.message;
    return;
  }

  router.push("/");
});
</script>
