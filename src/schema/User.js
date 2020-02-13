import mongoose from 'mongoose';
import striptags from 'striptags';
import {
  MAX_LENGTH_REGULAR_USER_FIELD,
  MAX_LENGTH_EGO_ID,
  MAX_LENGTH_BIO_STORY,
  MAX_LENGTH_URL,
  MAX_LENGTH_INTEREST
} from '../constants';

export const userSchema = new mongoose.Schema(
  {
    egoId: {
      type: 'String',
      required: true,
      unique: true,
      maxlength: MAX_LENGTH_EGO_ID
    },
    email: {
      type: 'String',
      maxlength: MAX_LENGTH_REGULAR_USER_FIELD
    }, //ego email can't be edited
    hashedEmail: {
      //gravatar
      type: 'String',
      default: '',
      maxlength: 512
    },
    institutionalEmail: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_REGULAR_USER_FIELD
    }, //can be edited

    acceptedTerms: 'boolean',

    //about me fields
    roles: [
      {
        type: String,
        enum: ['research', 'community', 'health', 'patient']
      }
    ],
    title: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_REGULAR_USER_FIELD
    },
    firstName: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_REGULAR_USER_FIELD
    },
    lastName: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_REGULAR_USER_FIELD
    },
    jobTitle: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_REGULAR_USER_FIELD
    },
    institution: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_REGULAR_USER_FIELD
    },
    addressLine1: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_REGULAR_USER_FIELD
    },
    addressLine2: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_REGULAR_USER_FIELD
    },
    city: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_REGULAR_USER_FIELD
    },
    state: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_REGULAR_USER_FIELD
    },
    zip: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_REGULAR_USER_FIELD
    },
    country: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_REGULAR_USER_FIELD
    },
    phone: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_REGULAR_USER_FIELD
    },
    department: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_REGULAR_USER_FIELD
    },
    eraCommonsID: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_REGULAR_USER_FIELD
    },

    isPublic: {
      //is the profile public?
      type: 'boolean',
      default: false
    },

    // a bit about yourself
    bio: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_BIO_STORY
    },
    story: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_BIO_STORY
    },
    website: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_URL
    },
    googleScholarId: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_URL
    },
    // research interests
    interests: {
      type: ['String'],
      set: interests =>
        interests
          .map(interest => striptags(interest.toLowerCase()))
          .filter(
            (interest, i, arr) => interest && arr.indexOf(interest) === i
          ),
      validate: {
        validator: interests =>
          every(interests, i => i.length <= MAX_LENGTH_INTEREST),
        message: 'Interests should be 60 chars max'
      }
    },
    twitter: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_URL
    },
    facebook: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_URL
    },
    github: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_URL
    },
    linkedin: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_URL
    },
    orchid: {
      type: 'String',
      stripHtmlTags: true,
      maxlength: MAX_LENGTH_URL
    },

    //subscription opt-ins
    acceptedKfOptIn: 'boolean',
    acceptedNihOptIn: 'boolean',
    acceptedDatasetSubscriptionKfOptIn: 'boolean',

    sets: [
      {
        name: {
          type: 'String',
          stripHtmlTags: true,
          maxlength: MAX_LENGTH_REGULAR_USER_FIELD
        },
        type: {
          type: 'String',
          stripHtmlTags: true,
          maxlength: MAX_LENGTH_REGULAR_USER_FIELD
        },
        size: {
          type: 'String',
          stripHtmlTags: true,
          maxlength: MAX_LENGTH_REGULAR_USER_FIELD
        },
        setId: {
          type: 'String',
          stripHtmlTags: true,
          maxlength: MAX_LENGTH_REGULAR_USER_FIELD
        }
      }
    ],

    virtualStudies: {
      type: [
        {
          id: 'String',
          name: 'String'
        }
      ],

      validate: virtualStudies => {
        const allHaveIds = (virtualStudies || []).every(
          v => v.id && v.id.length && v.id.length <= 100
        );
        const allHaveNames = (virtualStudies || []).every(
          v => v.name && v.name.length && v.name.length <= 512
        );

        const virtualStudiesCount = virtualStudies.reduce((acc, { id }) => {
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {});

        const hasDuplicate = Object.entries(virtualStudiesCount).some(
          ([, count]) => count > 1
        );

        switch (true) {
          case !allHaveIds:
            throw new Error('Virtual studies must have IDs');
          case !allHaveNames:
            throw new Error('Virtual studies must have names');
          case hasDuplicate:
            throw new Error('Virtual studies contain duplicate IDs');
        }
        return true;
      },
      set: virtualStudies =>
        virtualStudies.map(virtualStudy => ({
          id: striptags(virtualStudy.id),
          name: striptags(virtualStudy.name)
        }))
    }
  },
  { collection: 'users' }
);
