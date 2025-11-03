export const findHunts = async (queryParams: URLSearchParams) => {
  return fetch(
    `https://new-api.dev.bookthewild.com/api/hunts-view?${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
