interface Role {
  value: number;
  label: string;
}

interface AccountFormValues {
  username: string;
  role: Role;
  contactedEmailField: boolean;
  subscriberField: boolean;
  firstNameField: string;
  lastNameField: string;
}

const roles = [
  {
    label: "Student",
    value: 0,
  },
  {
    label: "Teacher",
    value: 1,
  },
  {
    label: "Educational professional",
    value: 2,
  },
  {
    label: "Language learner",
    value: 3,
  },
  {
    label: "Parent",
    value: 4,
  },
  {
    label: "Other",
    value: 5,
  },
];

export { roles };
export { type AccountFormValues };
