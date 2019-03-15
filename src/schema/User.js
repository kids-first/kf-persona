import { every, has } from "lodash";
export default {
  fields: {
    email: "String", //ego email can't be edited
    institutionalEmail: "String", //can be edited

    acceptedTerms: "boolean",

    //about me fields
    roles: [
      {
        type: String,
        enum: ["research", "community", "health", "patient"]
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
    interests: {
      type: ["String"],
      set: interests =>
        interests
          .map(interest => interest.toLowerCase())
          .filter((interest, i, arr) => arr.indexOf(interest) === i)
    },
    twitter: "String",
    facebook: "String",
    github: "String",
    linkedin: "String",
    orchid: "String",

    //subscription opt-ins
    acceptedKfOptIn: "boolean",
    acceptedNihOptIn: "boolean",
    acceptedDatasetSubscriptionKfOptIn: "boolean",

    sets: [
      {
        name: "String",
        size: "String",
        type: { type: "String" },
        setId: "String"
      }
    ],

    virtualStudies: {
      type: [
        {
          id: "String",
          name: "String"
        }
      ],
      set: virtualStudies => {
        if (every(virtualStudies, v => has(v, "id.length"))) {
          return virtualStudies;
        } else {
          throw new Error("Virtual studies must have IDs");
        }
      }
    }
  },
  collection: "users"
};
