import {every, has, some} from "lodash";
import md5 from "crypto-js/md5";
import mongoose from 'mongoose';
import striptags from 'striptags'

export const getModel = (postSave) => {
    const schema = new mongoose.Schema(
        {
            egoId: {
                type: 'String',
                required: true,
                unique: true,
            },
            email: "String", //ego email can't be edited
            hashedEmail: {  //gravatar
                type: "String",
                default: "",
            },
            institutionalEmail: {
                type: "String",
                stripHtmlTags: true
            }, //can be edited

            acceptedTerms: "boolean",

            //about me fields
            roles: [
                {
                    type: String,
                    enum: ["research", "community", "health", "patient"]
                }
            ],
            title: {
                type: "String",
                stripHtmlTags: true
            },
            firstName: {
                type: "String",
                stripHtmlTags: true
            },
            lastName: {
                type: "String",
                stripHtmlTags: true
            },
            jobTitle: {
                type: "String",
                stripHtmlTags: true
            },
            institution: {
                type: "String",
                stripHtmlTags: true
            },
            addressLine1: {
                type: "String",
                stripHtmlTags: true
            },
            addressLine2: {
                type: "String",
                stripHtmlTags: true
            },
            city: {
                type: "String",
                stripHtmlTags: true
            },
            state: {
                type: "String",
                stripHtmlTags: true
            },
            zip: {
                type: "String",
                stripHtmlTags: true
            },
            country: {
                type: "String",
                stripHtmlTags: true
            },
            phone: {
                type: "String",
                stripHtmlTags: true
            },
            department: {
                type: "String",
                stripHtmlTags: true
            },
            eraCommonsID: {
                type: "String",
                stripHtmlTags: true
            },

            isPublic: {         //is the profile public?
                type: "boolean",
                default: false
            },

            // a bit about yourself
            bio: {
                type: "String",
                stripHtmlTags: true
            },
            story: {
                type: "String",
                stripHtmlTags: true
            },

            // research interests
            website: {
                type: "String",
                stripHtmlTags: true
            },
            googleScholarId: {
                type: "String",
                stripHtmlTags: true
            },
            interests: {
                type: ["String"],
                set: interests =>
                    interests
                        .map(interest => striptags(interest.toLowerCase()))
                        .filter((interest, i, arr) => interest && arr.indexOf(interest) === i)
            },
            twitter: {
                type: "String",
                stripHtmlTags: true
            },
            facebook: {
                type: "String",
                stripHtmlTags: true
            },
            github: {
                type: "String",
                stripHtmlTags: true
            },
            linkedin: {
                type: "String",
                stripHtmlTags: true
            },
            orchid: {
                type: "String",
                stripHtmlTags: true
            },

            //subscription opt-ins
            acceptedKfOptIn: "boolean",
            acceptedNihOptIn: "boolean",
            acceptedDatasetSubscriptionKfOptIn: "boolean",

            sets: [
                {
                    name: {
                        type: "String",
                        stripHtmlTags: true
                    },
                    type: {
                        type: "String",
                        stripHtmlTags: true
                    },
                    size: {
                        type: "String",
                        stripHtmlTags: true
                    },
                    setId: {
                        type: "String",
                        stripHtmlTags: true
                    }
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
                            virtualStudies.reduce((acc, {id}) => {
                                acc[id] = (acc[id] || 0) + 1;
                                return acc;
                            }, {})
                        ),
                        ([id, count]) => count > 1
                    );
                    switch (true) {
                        case !allHaveIds:
                            throw new Error("Virtual studies must have IDs");
                        case !allHaveNames:
                            throw new Error("Virtual studies must have names");
                        case hasDuplicate:
                            throw new Error("Virtual studies contain duplicate IDs");
                    }
                    return virtualStudies.map(
                        virtualStudy => ({
                            id: striptags(virtualStudy.id),
                            name: striptags(virtualStudy.name)
                        })
                    );
                }
            }
        },
        {collection: "users"}
    );

    schema.pre('save', function (next) {
        const email = this.email;
        if (email) {
            this.hashedEmail = md5((email).trim().toLowerCase());
        }
        next();
    });

    schema.post('save', function (doc) {
        postSave(doc).catch(err => {
            console.error(err);
        });
    });

    return mongoose.model('UserModel', schema);
};

