import { buildUserCollection, createProfile } from "../MockData/mockUser";
import { makeProfilePublicGate } from "./aclGates";

describe("aclGates", () => {
  const buildMockModels = jest
    .fn()
    .mockImplementation((...profilesToPersist) => ({
      User: {
        findOne: ({ _id }) =>
          Promise.resolve(
            buildUserCollection(...profilesToPersist).find(
              (user) => user._id === _id
            )
          ),
      },
    }));

  const resetMockModels = () => buildMockModels([])

  afterEach(resetMockModels);

  it("should not let a researcher make his/her profile public if missing required field(s)", async () => {
    const mockResearcherFaultyPersistedProfile = createProfile({
      _id: "a",
      roles: ["research"],
      jobTitle: " ",
      isPublic: false,
    });
    const mockModels = buildMockModels(mockResearcherFaultyPersistedProfile);

    const mockResearcherFaultyToUpdateProfile = createProfile({
      _id: "a",
      roles: ["research"],
      jobTitle: " ",
      isPublic: true,
    });
    //https://github.com/facebook/jest/issues/1700#issuecomment-386019524
    await expect(
      makeProfilePublicGate({
        models: mockModels,
      })({ args: mockResearcherFaultyToUpdateProfile })
    ).rejects.toThrow(
      'The field "job title" for a researcher is required to make the profile public'
    );
  });

  it("should let a researcher make his/her profile public if every required field(s) are present", async () => {
    const mockResearcherFaultyPersistedProfile = createProfile({
      _id: "a",
      roles: ["research"],
      jobTitle: "data scientist",
      isPublic: false,
    });
    const mockModels = buildMockModels(mockResearcherFaultyPersistedProfile);

    const mockResearcherFaultyToUpdateProfile = createProfile({
      _id: "a",
      isPublic: true,
    });

    await expect(
        makeProfilePublicGate({
          models: mockModels,
        })({ args: mockResearcherFaultyToUpdateProfile })
    ).resolves.not.toThrow();
  });

  it("should not affect legacy profiles (from public to private)", async () => {
    const mockResearcherFaultyPersistedProfile = createProfile({
      _id: "a",
      roles: ["research"],
      jobTitle: "",
      isPublic: true,
    });
    const mockModels = buildMockModels(mockResearcherFaultyPersistedProfile);

    const mockResearcherFaultyToUpdateProfile = createProfile({
      _id: "a",
      isPublic: false,
    });

    await expect(
        makeProfilePublicGate({
          models: mockModels,
        })({ args: mockResearcherFaultyToUpdateProfile })
    ).resolves.not.toThrow();
  });

  it("should not affect a user with no required field", async () => {
    const mockResearcherFaultyPersistedProfile = createProfile({
      _id: "a",
      roles: ["health"],
      jobTitle: "",
      isPublic: false,
    });
    const mockModels = buildMockModels(mockResearcherFaultyPersistedProfile);

    const mockResearcherFaultyToUpdateProfile = createProfile({
      _id: "a",
      isPublic: true,
    });

    await expect(
        makeProfilePublicGate({
          models: mockModels,
        })({ args: mockResearcherFaultyToUpdateProfile })
    ).resolves.not.toThrow();
  });
});
