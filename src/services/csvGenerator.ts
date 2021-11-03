import { format } from '@fast-csv/format';

export const generateMemberList = (members, res) => {
    const csvStream = format({ headers: true });

    res.setHeader('Content-disposition', 'attachment; filename="members.csv"');
    res.setHeader('Content-Type', 'text/csv');

    csvStream.pipe(res);
    members.forEach((m) => {
        const doc = m._doc;
        csvStream.write({
            id: doc._id,
            isPublic: doc.isPublic,
            isActive: doc.isActive,
            title: doc.title,
            firstName: doc.firstName,
            lastName: doc.lastName,
            role: doc.roles[0],
            loginEmail: doc.email,
            institution: doc.institution,
            department: doc.department,
            jobTitle: doc.jobTitle,
            addressLine1: doc.addressLine1,
            addressLine2: doc.addressLine2,
            city: doc.city,
            state: doc.state,
            country: doc.country,
            phone: doc.phone,
            institutionalEmail: doc.institutionalEmail,
            eraCommonsID: doc.eraCommonsID,
            website: doc.website,
            twitter: doc.twitter,
            orchid: doc.orchid,
            linkedin: doc.linkedin,
            googleScholarId: doc.googleScholarId,
            github: doc.github,
            facebook: doc.facebook,
            acceptedTerms: doc.acceptedTerms,
            acceptedNihOptIn: doc.acceptedNihOptIn,
            acceptedKfOptIn: doc.acceptedKfOptIn,
            acceptedDatasetSub: doc.acceptedDatasetSubscriptionKfOptIn,
            interests: doc.interests,
            egoId: doc.egoId,
            story: doc.story,
            bio: doc.bio,
        });
    });
    csvStream.end();
};
