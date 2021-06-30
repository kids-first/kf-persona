import { Document } from 'mongoose';

enum UserRole {
    Research = 'research',
    Community = 'community',
    Health = 'health',
    Patient = 'patient',
}

type UserSet = {
    name: string;
    type: string;
    size: string;
    setId: string;
};

type UserVirtualStudy = {
    id: string;
    name: string;
};

export interface User extends Document {
    _id: string;
    egoId: string;
    email: string;
    hashedEmail: string;
    institutionalEmail: string;
    acceptedTerms: boolean;
    roles: UserRole[];
    title: string;
    firstName: string;
    lastName: string;
    jobTitle: string;
    institution: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    department: string;
    eraCommonsID: string;
    isPublic: boolean;
    isActive: boolean;
    bio: string;
    story: string;
    website: string;
    googleScholarId: string;
    interests: string[];
    twitter: string;
    facebook: string;
    github: string;
    linkedin: string;
    orchid: string;
    acceptedKfOptIn: boolean;
    acceptedNihOptIn: boolean;
    acceptedDatasetSubscriptionKfOptIn: boolean;
    sets: UserSet[];
    virtualStudies: UserVirtualStudy[];
}
