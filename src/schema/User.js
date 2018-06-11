export default {
  fields: {
    email: "String",

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
    city: "String",
    state: "String",
    country: "String",

    // a bit about yourself
    bio: "String",
    story: "String",

    // research interests
    website: "String",
    googleScholarId: "String",
    interests: ["String"],

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
