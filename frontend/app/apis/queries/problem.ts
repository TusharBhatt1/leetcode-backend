import { api } from "@/app/lib/axios";

interface GetProblemsParams {
  search: string;
  cursor?: string;
  direction: "next" | "prev";
}

export async function getProblems({
  search,
  cursor,
  direction,
}: GetProblemsParams) {
  const response = await api.get("/problem", {
    params: {
      search,
      cursor,
      direction,
    },
  });

  return {
    problems: response.data.data.data,
    pageInfo: response.data.data.pageInfo,
  };
}


export async function getProblem(id: string) {
  const response = await api.get(`/problem/${id}`);

  return response.data.data;
}