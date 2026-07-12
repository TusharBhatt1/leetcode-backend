// src/lib/axios.ts

import axios from "axios";
console.log(process.env.NEXT_PUBLIC_PROBLEM_SERVICE)
export const api = axios.create({
  baseURL: "http://localhost:3000/api/v1" ,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});