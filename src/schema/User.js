export default {
  fields: {
    email: "String", //ego email can't be edited
    institutionalEmail : "String", //can be edited

    acceptedTerms: "boolean",

    //about me fields
    roles: [
      {
        type: String,
        enum: ["research", "community", "health"]
      }
    ],
    title: "String",
    firstName: "String",
    lastName: "String",
    jobTitle: "String",
    institution: "String",
    addressLine1: "String",
    addressLine2: "String",
    city: "String",
    state: "String",
    zip: "String",
    country: "String",
    phone: "String",
    department: "String",
    eraCommonsID: "String",

    // a bit about yourself
    bio: "String",
    story: "String",

    // research interests
    website: "String",
    googleScholarId: "String",
    interests: ["String"],
    twitter: "String",
    facebook: "String",
    github: "String",
    linkedin: "String",
    orchid: "String",

    //subscription opt-ins
    acceptedKfOptIn: "boolean",
    acceptedNihOptIn: "boolean",

    sets: [
      {
        name: "String",
        size: "String",
        type: { type: "String" },
        setId: "String"
      }
    ]
  },
  collection: "users"
};
