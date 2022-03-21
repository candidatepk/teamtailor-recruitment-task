export default {
  baseURL: 'https://api.teamtailor.com/v1',
  headers: {
    Authorization: `Token token=${process.env.TEAMTAILOR_API_KEY || ''}`,
    'X-Api-Version': process.env.TEAMTAILOR_API_VERSION || '20210218',
  },
};
