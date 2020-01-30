
export const generateMemberList = (members, res) => {
    const csv = require('fast-csv');
    const csvStream = csv.format({ headers: true });

    res.setHeader('Content-disposition', 'attachment; filename=data.csv');
    res.setHeader('Content-Type', 'text/csv');

    csvStream.pipe(res);
    members.map(m =>
        csvStream.write({
            id: m._doc._id,
            firstName: m._doc.firstName,
            lastName: m._doc.lastName,
            isPublic: m._doc.isPublic,
            interests: m._doc.interests,
            sets: m._doc.sets,
            website: m._doc.website,
            twitter: m._doc.twitter,
            title: m._doc.title,
            story: m._doc.story,
            state: m._doc.state,
            phone: m._doc.phone,
            orchid: m._doc.orchid,
            linkedin: m._doc.linkedin,
            jobTitle: m._doc.jobTitle,
            institutionalEmail: m._doc.institutionalEmail,
            institution: m._doc.institution,
            googleScholarId: m._doc.googleScholarId,
            github: m._doc.github,
            facebook: m._doc.facebook,
            eraCommonsID: m._doc.eraCommonsID,
            department: m._doc.department,
            country: m._doc.country,
            city: m._doc.city,
            bio: m._doc.bio,
            addressLine2: m._doc.addressLine2,
            acceptedTerms: m._doc.acceptedTerms,
            acceptedNihOptIn: m._doc.acceptedNihOptIn,
            acceptedKfOptIn: m._doc.acceptedKfOptIn,
            acceptedDatasetSubscriptionKfOptIn: m._doc.acceptedDatasetSubscriptionKfOptIn,
            email: m._doc.email,
            egoId: m._doc.egoId,
        })
    );
    csvStream.end();
};