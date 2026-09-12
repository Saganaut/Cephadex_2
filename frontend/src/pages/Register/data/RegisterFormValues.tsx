interface Role {
  value: number;
  label: string;
}

interface howDidYouHearAboutUsOptions {
  value: number;
  label: string;
}

interface RegisterFormValues {
  username: string;
  role: Role;
  agreeTandC: boolean;
  newsletter: boolean;
  age: number;
  gender: string;
  howDidYouHearAboutUs: howDidYouHearAboutUsOptions;
  whatDoYouWantToDo: string;
}

export default RegisterFormValues;
