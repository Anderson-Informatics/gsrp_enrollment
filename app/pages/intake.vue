<script setup lang="ts">
import * as z from "zod";
import type { FormError, FormErrorEvent, FormSubmitEvent } from "@nuxt/ui";
import { ref, reactive } from "vue";
import { fillForm } from "~/utils/pdf";

const { user, clear, session } = useUserSession();
definePageMeta({
  middleware: ["auth"],
});

const surveyHeader = `<h2><strong>PreK GSRP Interest Form | 2025-26 School Year</strong></h2><p>Interest Form for the Detroit Public Schools Community District GSRP PreK program. This form should take about 5 minutes to complete.<br>Please note: Completion of this form does not guarantee admission. A school staff member will contact you for a follow up Enrollment Interview. If you have questions or want more Information, please call 313.347.8923 or email prekinfo@detroitk12.org.</p>`;

import { parsePhoneNumberFromString } from "libphonenumber-js";

const schema = z.object({
  child: z.object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    dob: z.string().min(1, "Date of birth is required"),
    gender: z.string().min(1, "Gender is required"),
    language: z.string().min(1, "Home language is required"),
    languageOther: z.string().optional(),
  }),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "Zip code is required"),
  }),
  household: z.object({
    responsibleCount: z.number().min(1),
    incomeAmount: z.number().min(0),
    incomeFrequency: z.string().min(1, "Income frequency is required"),
  }),
  pg1: z.object({
    firstName: z
      .string()
      .min(1, "Primary Parent/Guardian first name is required"),
    lastName: z
      .string()
      .min(1, "Primary Parent/Guardian last name is required"),
    phone: z.string().transform((v, ctx) => {
      const p = parsePhoneNumberFromString(v, {
        defaultCountry: "US",
        extract: false,
      });
      if (!p?.isValid()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid phone number",
        });
        return z.NEVER;
      }
      return p.number; // always returns E.164
    }),
    email: z.email("Invalid email address"),
  }),
  pg2: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
  }),
  school: z.object({
    firstChoice: z.string().min(1, "First choice school is required"),
    secondChoice: z
      .string()
      .min(
        1,
        "Second choice school is required, select 'None' if not applicable"
      ),
  }),
  siblings: z.object({
    atSelection: z.string().min(1, "Please indicate if sibling is enrolled"),
    nameAndSchool: z.string().optional(),
  }),
  referral: z.object({
    selected: z.array(z.string()).optional(),
    otherText: z.string().optional(),
  }),
});

type Schema = z.input<typeof schema>;

const state = reactive<Schema>({
  child: {
    firstName: "Justa",
    middleName: "Nother",
    lastName: "Test",
    dob: "12/01/2019",
    gender: "Male",
    language: "Other",
    languageOther: "Italian",
  },
  address: {
    street: "2882 Calle Giustinian",
    city: "Venezia",
    state: "VE",
    zip: "30124",
  },
  household: {
    responsibleCount: 2,
    incomeAmount: 3000,
    incomeFrequency: "Bi-Weekly",
  },
  pg1: {
    firstName: "Eric",
    lastName: "Anderson",
    phone: "+13343173025",
    email: "anderoy@gmail.com",
  },
  pg2: {
    firstName: "Alissa",
    lastName: "Shelton",
    phone: "+13343173012",
    email: "sheltonalissa@gmail.com",
  },
  school: {
    firstChoice: "Bates Academy",
    secondChoice: "Academy of the Americas",
  },
  siblings: { atSelection: "Yes", nameAndSchool: "Test Sibling - Bates" },
  referral: {
    selected: ["Other"] as string[],
    otherText: "DPSCD Website",
  },
});

const emptyState = reactive<Schema>({
  child: {
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    language: "",
    languageOther: "",
  },
  address: { street: "", city: "", state: "", zip: "" },
  household: {
    responsibleCount: 0,
    incomeAmount: 0,
    incomeFrequency: "",
  },
  pg1: { firstName: "", lastName: "", phone: "", email: "" },
  pg2: { firstName: "", lastName: "", phone: "", email: "" },
  school: { firstChoice: "", secondChoice: "" },
  siblings: { atSelection: "", nameAndSchool: "" },
  referral: {
    selected: [] as string[],
    otherText: "",
  },
});

const genderOptions = [
  { label: "Female", value: "Female" },
  { label: "Male", value: "Male" },
  { label: "Non-binary", value: "Non-binary" },
  { label: "Prefer not to say", value: "Prefer not to say" },
];

const incomeFrequencyOptions = [
  { label: "No Income", value: "No Income" },
  { label: "Weekly", value: "Weekly" },
  { label: "Bi-Weekly", value: "Bi-Weekly" },
  { label: "2 Times per Month", value: "2 Times per Month" },
  { label: "Monthly", value: "Monthly" },
  { label: "Annually", value: "Annually" },
];

const languageOptions = [
  { label: "English", value: "English" },
  { label: "Arabic", value: "Arabic" },
  { label: "Bengali", value: "Bengali" },
  { label: "French", value: "French" },
  { label: "Hmong", value: "Hmong" },
  { label: "Spanish", value: "Spanish" },
  { label: "Other", value: "Other" },
];

const referralOptions = [
  "The school",
  "Billboard",
  "Flyer",
  "TV/Radio ad",
  "Social Media",
  "Community partner or event (ex. Detroit Parent Network)",
  "Family friend",
  "Other",
];

const householdCountOptions = Array.from({ length: 12 }).map((_, i) => {
  const n = i + 1;
  return {
    label: n < 12 ? String(n) : "12 or more",
    value: n < 12 ? n : 12,
  };
});

const schoolNames = [
  "A.L. Holmes Academy of Blended Learning",
  "Academy of the Americas",
  "Bagley Elementary School of Journalism and Technology",
  "Barton Elementary School",
  "Bates Academy",
  "Bennett Elementary School",
  "Bow Elementary-Middle School",
  "Brenda Scott Academy",
  "Brewer Academy",
  "Bunche Preparatory Academy",
  "Burns Elementary-Middle School",
  "Burton International Academy",
  "Charles Wright Academy of Arts and Science",
  "Carleton Elementary School",
  "Carstens Academy of Aquatic Science at Remus",
  "Carver STEM Academy",
  "Coleman A. Young Elementary School",
  "Cooke STEM Academy",
  "Dixon Educational Learning Academy",
  "Dossin Elementary-Middle School",
  "Earhart Elementary-Middle School",
  "Edison Elementary School",
  "Edward 'Duke' Ellington Conservatory of Music & Art at Beckham Academy",
  "Emerson Elementary-Middle School",
  "Fisher Magnet Academy",
  "Foreign Language Immersion and Cultural Studies School (FLICS)",
  "Garvey Academy",
  "Golightly Education Center",
  "Gompers Elementary-Middle School",
  "Hamilton Elementary-Middle School",
  "Harms Elementary School",
  "Henderson Academy",
  "Hutchinson Elementary-Middle School at Howe",
  "John R. King Academic and Performing Arts Academy",
  "Mackenzie Elementary-Middle School",
  "Mann Learning Community",
  "Marion Law Academy",
  "Mark Twain School for Scholars",
  "Marquette Elementary-Middle School",
  "Mary McLeod Bethune Elementary-Middle School",
  "Mason Academy",
  "Maybury Elementary School",
  "Neinas Dual Language Learning Academy",
  "Noble Elementary-Middle School",
  "Nolan Elementary-Middle School",
  "Pasteur Elementary School",
  "Priest Elementary-Middle School",
  "Roberto Clemente Learning Academy",
  "Ronald Brown Academy",
  "Sampson-Webber Leadership Academy",
  "Schulze Academy for Technology and Arts",
  "Spain Elementary-Middle School",
  "Thirkell Elementary-Middle School",
  "Vernor Elementary-Middle School",
  "Wayne Elementary School",
];

const schoolNamesWithNone = ["None", ...schoolNames];

const schoolOptions = schoolNames.map((n) => ({ label: n, value: n }));
const schoolOptionsWithNone = [
  { label: "None", value: "None" },
  ...schoolOptions,
];

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: "Success",
    description: "The form has been submitted.",
    color: "success",
  });
  console.log(event.data);
  await fillForm(event.data);
}
</script>

<template>
  <UContainer class="pa-6">
    <UCard>
      <div v-html="surveyHeader" class="mb-4"></div>
      <UForm
        ref="form"
        :state="state"
        :schema="schema"
        class="w-full"
        @submit="onSubmit"
      >
        <!-- Child Information -->
        <UCard size="small" class="mb-4" title="Child's Information">
          <template #header> Child's Information </template>
          <UPageGrid cols="1" md-cols="2" gap="16px">
            <UFormField label="First Name" name="child.firstName" required>
              <UInput
                v-model="state.child.firstName"
                placeholder="First Name"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Middle Name" name="child.middleName">
              <UInput
                v-model="state.child.middleName"
                placeholder="Middle Name"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Last Name" name="child.lastName" required>
              <UInput
                v-model="state.child.lastName"
                placeholder="Last Name"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="Date of Birth mm/dd/yyyy"
              name="child.dob"
              required
            >
              <UInput
                v-model="state.child.dob"
                placeholder="Date of Birth mm/dd/yyyy"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Gender" name="child.gender" required>
              <USelect
                v-model="state.child.gender"
                :items="genderOptions"
                placeholder="Gender"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="Primary Lanuage Spoken at Home"
              name="child.language"
              required
            >
              <USelect
                v-model="state.child.language"
                :items="languageOptions"
                placeholder="Primary Lanuage Spoken at Home"
                clearable
                class="w-full"
              />
            </UFormField>
            <div v-if="state.child.language === 'Other'">
              <UFormField
                label="Please specify language"
                name="child.languageOther"
                required
              >
                <UInput
                  v-model="state.child.languageOther"
                  placeholder="Please specify language"
                  class="w-full mt-2"
                />
              </UFormField>
            </div>
          </UPageGrid>
        </UCard>
        <!-- Address -->
        <UCard size="small" class="mb-4" title="Child's Address">
          <template #header> Address </template>
          <UPageGrid cols="1" md-cols="2" gap="16px">
            <UFormField label="Street Address" name="address.street" required>
              <UInput
                v-model="state.address.street"
                placeholder="Street address"
                class="w-full"
              />
            </UFormField>
            <UFormField label="City" name="address.city" required>
              <UInput
                v-model="state.address.city"
                placeholder="City"
                class="w-full"
              />
            </UFormField>
            <UFormField label="State" name="address.state" required>
              <UInput
                v-model="state.address.state"
                placeholder="State"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Zip Code" name="address.zip" required>
              <UInput
                v-model="state.address.zip"
                placeholder="Zip code"
                class="w-full"
              />
            </UFormField>
          </UPageGrid>
        </UCard>
        <!-- Household -->
        <UCard size="small" class="mb-4" title="Household">
          <template #header> Household Income </template>
          <UPageGrid cols="1" md-cols="3" gap="16px">
            <UFormField
              label="Number of all household members for which you are financially responsible (include: self, children, and other adults)"
              name="household.responsibleCount"
              required
            >
              <USelect
                v-model="state.household.responsibleCount"
                :items="householdCountOptions"
                placeholder="Number of people"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="Total income for all household members before taxes"
              name="household.incomeAmount"
              required
            >
              <UInput
                v-model:value="state.household.incomeAmount"
                type="number"
                placeholder="e.g. 5010.00"
                icon="i-lucide-dollar-sign"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="Frequency of income"
              name="household.incomeFrequency"
              required
            >
              <USelect
                v-model="state.household.incomeFrequency"
                :items="incomeFrequencyOptions"
                placeholder="Frequency of income"
                class="w-full"
              />
            </UFormField>
          </UPageGrid>
        </UCard>
        <!-- Guardians -->
        <UCard
          size="small"
          class="mb-4"
          title="Parent / Guardian #1 (required)"
        >
          <template #header> Parent/Guardian #1 Information </template>
          <UPageGrid cols="1" md-cols="2" gap="16px">
            <UFormField label="First Name" name="pg1.firstName" required>
              <UInput
                v-model="state.pg1.firstName"
                placeholder="First Name"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Last Name" name="pg1.lastName" required>
              <UInput
                v-model="state.pg1.lastName"
                placeholder="Last Name"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Phone Number" name="pg1.phone" required>
              <UInput
                v-model="state.pg1.phone"
                placeholder="Phone #"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Email" name="pg1.email" required>
              <UInput
                v-model="state.pg1.email"
                type="email"
                placeholder="Email"
                class="w-full"
              />
            </UFormField>
          </UPageGrid>
        </UCard>
        <UCard
          size="small"
          class="mb-4"
          title="Parent / Guardian #2 (optional)"
        >
          <template #header> Parent/Guardian #2 Information </template>
          <UPageGrid cols="1" md-cols="2" gap="16px">
            <UFormField label="First Name" name="pg2.firstName">
              <UInput
                v-model="state.pg2.firstName"
                placeholder="First Name"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Last Name" name="pg2.lastName">
              <UInput
                v-model="state.pg2.lastName"
                placeholder="Last Name"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Phone Number" name="pg2.phone">
              <UInput
                v-model="state.pg2.phone"
                placeholder="Phone #"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Email" name="pg2.email">
              <UInput
                v-model="state.pg2.email"
                type="email"
                placeholder="Email"
                class="w-full"
              />
            </UFormField>
          </UPageGrid>
        </UCard>
        <!-- School choices -->
        <UCard size="small" class="mb-4" title="School Selection">
          <template #header> School Selection </template>
          <UPageGrid cols="1" md-cols="2" gap="16px">
            <UFormField
              label="First Choice School"
              name="school.firstChoice"
              required
            >
              <USelectMenu
                v-model="state.school.firstChoice"
                :items="schoolNames"
                placeholder="Select first-choice school"
                searchable
                :search-input="{
                  placeholder: 'Search for a school...',
                  icon: 'i-lucide-search',
                }"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="Second Choice School"
              name="school.secondChoice"
              required
            >
              <USelectMenu
                v-model="state.school.secondChoice"
                :items="schoolNamesWithNone"
                placeholder="Select second-choice school"
                searchable
                :search-input="{
                  placeholder: 'Search for a school...',
                  icon: 'i-lucide-search',
                }"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="Does your student have any siblings enrolled in your first or second choice school?"
              name="siblings.atSelection"
              required
            >
              <USelect
                v-model="state.siblings.atSelection"
                :items="['Yes', 'No']"
                class="w-full"
              />
            </UFormField>
            <div v-if="state.siblings.atSelection === 'Yes'">
              <UFormField
                label="Please list the sibling student(s) name and school"
                name="siblings.nameAndSchool"
              >
                <UInput
                  v-model="state.siblings.nameAndSchool"
                  placeholder="Sibling name - School"
                />
              </UFormField>
            </div>
          </UPageGrid>
        </UCard>
        <!-- Referral -->
        <UCard
          size="small"
          class="mb-4"
          title="How did you hear about our PreK program?"
        >
          <UFormField
            label="How did you hear about our PreK program?"
            name="referral.selected"
          >
            <UCheckboxGroup
              v-model="state.referral.selected"
              multiple
              :items="referralOptions"
              class="w-full"
            />
          </UFormField>
          <div v-if="(state.referral.selected || []).includes('Other')">
            <UFormField name="referral.otherText" required>
              <UInput
                v-model:value="state.referral.otherText"
                placeholder="Please specify"
                class="mt-2"
              />
            </UFormField>
          </div>
        </UCard>
        <!-- Submit buttons -->
        <div class="d-flex justify-end">
          <UButton variant="solid" type="submit">Submit Application</UButton>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>

<style scoped>
.pa-6 {
  padding: 24px;
}
.mb-4 {
  margin-bottom: 16px;
}
.mt-2 {
  margin-top: 8px;
}
.d-flex {
  display: flex;
}
.justify-end {
  justify-content: flex-end;
}
.mr-3 {
  margin-right: 12px;
}
</style>
