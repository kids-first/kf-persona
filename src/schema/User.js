import { every, has, some } from "lodash";
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
        const allHaveIds = every(virtualStudies, v => has(v, "id.length"));
        const allHaveNames = every(virtualStudies, v => has(v, "name.length"));
        const hasDuplicate = some(
          Object.entries(
            virtualStudies.reduce((acc, { id }) => {
              acc[id] = (acc[id] || 0) + 1;
              return acc;
            }, {})
          ),
          ([id, count]) => count > 1
        );
        if (allHaveIds && allHaveNames && !hasDuplicate) {
          return virtualStudies;
        } else {
          if (!allHaveIds) {
            throw new Error("Virtual studies must have IDs");
          }
          if (!allHaveNames) {
            throw new Error("Virtual studies must have names");
          }
          if (hasDuplicate) {
            throw new Error("Virtual studies contain duplicate IDs");
          }
        }
      }
    }
  },
  collection: "users"
};
