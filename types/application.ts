// /home/anderoy/gsrp-enrollment/types/application.ts
// If application.model.ts exports a TypeScript interface/type, import that instead.

export type Child = {
    firstName: string;
    middleName?: string;
    lastName: string;
    dob: string;
    gender: string;
    language: string;
    languageOther?: string;
};

export type Address = {
    street: string;
    city: string;
    state: string;
    zip: string;
};

export type Household = {
    responsibleCount: number;
    incomeAmount: number;
    incomeFrequency: string;
};

export type SecondaryGuardian = {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
};

export type PrimaryGuardian = {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
};

export type School = {
    firstChoice: string;
    secondChoice: string;
};

export type Siblings = {
    atSelection: string;
    nameAndSchool?: string;
};

export type Referral = {
    selected?: string[];
    otherText?: string;
};

export type Application = {
    _id?: string;
    child: Child;
    address: Address;
    household: Household;
    pg1: PrimaryGuardian; // required in schema (firstName, lastName, phone, email)
    pg2?: SecondaryGuardian;
    school: School;
    siblings: Siblings;
    referral?: Referral;
    createdAt?: string;
    updatedAt?: string;
};