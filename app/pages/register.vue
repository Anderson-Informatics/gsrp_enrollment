<script setup lang="ts">
const toast = useToast();

const { fetch } = useUserSession();

const handleRegister = async (form: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const confirmationToken =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
    await $fetch("/api/auth/register", {
      method: "POST",
      body: { ...form, confirmationToken: confirmationToken },
    });
    await fetch();
    // Send confirmation email
    await $fetch("/api/user/sendConfirmation", {
      method: "POST",
      body: {
        name: form.name,
        email: form.email,
        confirmationToken: confirmationToken,
      },
    });
    await fetch();
    navigateTo("/");
  } catch (error) {
    if (error && typeof error === "object" && "statusMessage" in error) {
      toast.add({
        color: "error",
        title: "Register failed",
        description: error.statusMessage as string,
      });
    } else {
      console.error(error);
    }
  }
};
</script>

<template>
  <RegisterForm @register="handleRegister" />
</template>
