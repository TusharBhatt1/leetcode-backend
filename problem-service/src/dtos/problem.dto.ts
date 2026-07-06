//payloads
import { IProblem } from "../models/problem.model";

export interface CreateProblemDTO extends Omit<
	IProblem,
	"createdAt" | "updatedAt"
> {}
export interface UpdateProblemDTO extends Partial<CreateProblemDTO> {}
