import { baseApi } from '../api';

type GetPlatformResult = {
  id: string;
  displayName: string;
  credentials: Record<
    string,
    {
      description: string;
    }
  >;
};

export const platformsApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getPlatforms: builder.query<GetPlatformResult[], void>({
      query: () => '/platforms',
    }),
  }),
});

export const { useGetPlatformsQuery } = platformsApi;
