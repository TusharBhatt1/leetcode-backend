import { UserModel } from "../models/user.model";
import { IAuthUserDetails } from "../controllers/login.controller";

export interface ISignUpRepository {
	signup(userDetails: IAuthUserDetails): Promise<IAuthUserDetails>;
}

export class SignUpRepository implements ISignUpRepository {
	async signup(userDetails: IAuthUserDetails): Promise<IAuthUserDetails> {
		const user = await UserModel.create(userDetails);
		return user;
	}
}
