import { defineStore } from "pinia";
import type { Application } from "~~/types/application";

export const useApplicationStore = defineStore("application-store", {
  state: () => ({
    // list all results
    applications: [] as Application[],
    application: {} as Application,
  }),
  actions: {
    // Get all results from DB
    async getAll() {
      try {
        let data = await $fetch<Application[]>("/api/applications");
        this.applications = data;
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async getOne(_id: string) {
      try {
        // Maybe I can figure out how to fix this full URL in the long term?
        let data = await $fetch<Application>(`/api/applications/${_id}`);
        this.application = data;
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async addApplication(application: Application) {
      try {
        let data = await $fetch<{ message: string }>("/api/applications/add", {
          method: "POST",
          body: application,
        });
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
  },
});
