import {every, some} from "lodash";
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
                maxlength: 256
            },
            email: {
                "type": "String",
                maxlength: 100
            }, //ego email can't be edited
            hashedEmail: {  //gravatar
                type: "String",
                default: "",
                maxlength: 512
            },
            institutionalEmail: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 100
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
                stripHtmlTags: true,
                maxlength: 100
            },
            firstName: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 100
            },
            lastName: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 100
            },
            jobTitle: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 100
            },
            institution: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 100
            },
            addressLine1: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 100
            },
            addressLine2: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 100
            },
            city: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 100
            },
            state: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 100
            },
            zip: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 100
            },
            country: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 100
            },
            phone: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 100
            },
            department: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 100
            },
            eraCommonsID: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 100
            },

            isPublic: {         //is the profile public?
                type: "boolean",
                default: false
            },

            // a bit about yourself
            bio: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 2000
            },
            story: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 2000
            },
            website: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 1024
            },
            googleScholarId: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 1024
            },
            // research interests
            interests: {
                type: ["String"],
                set: interests =>
                    interests
                        .map(interest => striptags(interest.toLowerCase()))
                        .filter((interest, i, arr) => interest && arr.indexOf(interest) === i),
                validate: {
                    validator: interests => every(interests, i => i.length <= 60),
                    message: "Interests should be 60 chars max"
                }
            },
            twitter: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 1024
            },
            facebook: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 1024
            },
            github: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 1024
            },
            linkedin: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 1024
            },
            orchid: {
                type: "String",
                stripHtmlTags: true,
                maxlength: 1024
            },

            //subscription opt-ins
            acceptedKfOptIn: "boolean",
            acceptedNihOptIn: "boolean",
            acceptedDatasetSubscriptionKfOptIn: "boolean",

            sets: [
                {
                    name: {
                        type: "String",
                        stripHtmlTags: true,
                        maxlength: 100
                    },
                    type: {
                        type: "String",
                        stripHtmlTags: true,
                        maxlength: 100
                    },
                    size: {
                        type: "String",
                        stripHtmlTags: true,
                        maxlength: 100
                    },
                    setId: {
                        type: "String",
                        stripHtmlTags: true,
                        maxlength: 100
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

                validate: virtualStudies => {
                    const allHaveIds = every(virtualStudies, v => v.id && v.id.length && v.id.length <= 100);
                    const allHaveNames = every(virtualStudies, v => v.name && v.name.length && v.name.length <= 512);
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
                    return true
                },
                set: virtualStudies => {

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

