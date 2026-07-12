import { IAuthUserDetails } from "../controllers/login.controller";
import { UserModel } from "../models/user.model";
import { ISignUpRepository } from "../repositories/signup.repository";
import bcrypt from "bcrypt";

export interface IAuthResponse {
	message?: string;
	user?: IAuthUserDetails;
	success: boolean;
}

interface ISignUpService {
	createUser(userDetails: IAuthUserDetails): Promise<IAuthResponse>;
}

export class SignUpService implements ISignUpService {
	private signUpRepository: ISignUpRepository;

	constructor(signUpRepository: ISignUpRepository) {
		this.signUpRepository = signUpRepository;
	}

	async createUser(userDetails: IAuthUserDetails): Promise<IAuthResponse> {
		const { name, role, email, password } = userDetails;

		if (!email || !password || !role || !name) {
			return {
				message: "Email, password, role and name are required.",
				success: false,
			};
		}
		const [userExists] = await UserModel.find({
			email,
		});

		const hashedPassword = await bcrypt.hash(password, 10);

		if (userExists) {
			return {
				message: `User already exists with ${email}`,
				success: false,
			};
		}

		const newUser = await this.signUpRepository.signup({
			...userDetails,
			password: hashedPassword,
		});

		return {
			user: newUser,
			success: true,
		};
	}
}
