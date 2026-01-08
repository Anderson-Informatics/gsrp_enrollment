<template>
  <div class="confirm-page">
    <div v-if="status === 'loading'">Validating...</div>

    <div v-else-if="status === 'success'">
      Thank you for confirming your email, please
      <a href="/login">click here to login</a>
      or
      <a href="/">view your home page</a>.
    </div>

    <div v-else>We were unable to validate your email, please try again.</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const status = ref("loading"); // 'loading' | 'success' | 'error'

onMounted(async () => {
  const token =
    route.query.token ||
    new URLSearchParams(window.location.search).get("token");
  if (!token) {
    status.value = "error";
    return;
  }

  try {
    const url = `/api/user/confirm`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ confirmationToken: token }),
    });
    if (!res.ok) {
      status.value = "error";
      return;
    }

    // optional: check response body for success flag
    const body = await res.json().catch(() => null);
    if (body && "success" in body && !body.success) {
      status.value = "error";
      return;
    }

    status.value = "success";
  } catch (e) {
    status.value = "error";
  }
});
</script>

<style scoped>
.confirm-page {
  padding: 2rem;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
    Arial;
}
a {
  color: #1a73e8;
  text-decoration: underline;
}
</style>
