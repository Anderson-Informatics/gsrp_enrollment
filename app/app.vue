<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
const { user, clear, session } = useUserSession();

const route = useRoute();

const itemsNotLoggedIn = computed<NavigationMenuItem[]>(() => [
  {
    label: "Signup",
    to: "/register",
    active: route.path.startsWith("/register"),
  },
  {
    label: "Login",
    to: "/login",
    active: route.path.startsWith("/login"),
  },
]);

const itemsLoggedIn = computed<NavigationMenuItem[]>(() => [
  {
    label: "Application",
    to: "/intake",
    active: route.path.startsWith("/intake"),
  },
  {
    label: "User Profile",
    to: "/user/protected",
    active: route.path.startsWith("/user/protected"),
  },
]);
</script>

<template>
  <UApp>
    <UHeader title="GSRP Enrollment">
      <template #title>
        <!-- 
        <Logo class="h-6 w-auto" />
        -->
      </template>

      <template v-if="user">
        <UNavigationMenu :items="itemsLoggedIn" />
      </template>

      <template v-else>
        <UNavigationMenu :items="itemsNotLoggedIn" />
      </template>

      <template #right>
        <UColorModeButton />
      </template>

      <template v-if="user" #body>
        <UNavigationMenu
          :items="itemsLoggedIn"
          orientation="vertical"
          class="-mx-2.5"
        />
      </template>
      <template v-else #body>
        <UNavigationMenu
          :items="itemsNotLoggedIn"
          orientation="vertical"
          class="-mx-2.5"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <UFooter />
  </UApp>
</template>
