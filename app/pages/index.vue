<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const { user, clear: clearSession } = useUserSession();

const isConfirmed = computed(() => (user.value as any)?.isConfirmed ?? false);

async function logout() {
  await clearSession();
  await navigateTo("/login");
}

async function routeToApplication() {
  await navigateTo("/intake");
}

async function sendConfirmationEmail() {
  try {
    await $fetch("/api/user/sendConfirmation", {
      method: "POST",
      body: {
        name: user.value?.name,
        email: user.value?.email,
        confirmationToken: (user.value as any)?.confirmationToken,
      },
    });
    alert("Confirmation email resent. Please check your inbox.");
  } catch (error) {
    console.error("Error resending confirmation email:", error);
    alert("Failed to resend confirmation email. Please try again later.");
  }
}
</script>

<template>
  <UPage>
    <UContainer class="py-12">
      <UPageFeature
        :title="`You are logged in as ${user?.name ?? 'Unknown'}`"
        description="Below you can find all active GSRP Applications."
      />
      <UAlert
        v-if="!isConfirmed"
        title="Please confirm your email address"
        description="If you have not received a confirmation email, please check your spam folder or click the button on the right to resend."
        icon="i-lucide-mail-question-mark"
        :ui="{ icon: 'size-11' }"
        variant="outline"
        color="neutral"
        orientation="horizontal"
        :actions="[
          {
            label: 'Resend Confirmation Email',
            color: 'neutral',
            variant: 'subtle',
            onClick: sendConfirmationEmail,
          },
        ]"
        class="my-4"
      />
      <UCard class="my-8">
        <template #header>
          <h2 class="text-lg font-semibold">Name of Application</h2>
        </template>

        Application details go here.

        <template #footer> <p class="text-sm">Footer Information</p> </template>
      </UCard>

      <UButton
        @click="routeToApplication"
        class="text-lg content-center clear-both"
        color="primary"
        >Submit a new application</UButton
      >

      <UButton @click="logout" color="neutral" class="float-right"
        >Logout</UButton
      >
    </UContainer>
  </UPage>
</template>
